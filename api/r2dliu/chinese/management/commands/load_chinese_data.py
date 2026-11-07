"""Load characters, strokes and vocab into the database.

Run `scripts/fetch-chinese-data.sh` first. Safe to re-run: rows are matched
by hanzi and updated in place, so learners' cards are kept.
"""

import json
import re
from collections import defaultdict
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from r2dliu.chinese.models import (
    Character,
    Example,
    Sentence,
    Stroke,
    Word,
    WordCharacter,
)
from r2dliu.chinese.pinyin import numbered_to_marked

BATCH = 2000
CJK = re.compile(r"^[㐀-䶿一-鿿豈-﫿\U00020000-\U0002ffff]+$")
# Definitions that aren't worth showing when a reading has better ones
_LOW_VALUE_DEF = re.compile(
    r"^(surname |(old |archaic |ancient |unofficial |Japanese )?variant of|"
    r"see [^ ]+$|used in )",
    re.IGNORECASE,
)


def _js_template(path: Path) -> str:
    """Contents of the first `...` template literal in a JS data file."""
    text = path.read_text(encoding="utf-8")
    start = text.index("`") + 1
    return text[start : text.index("`", start)]


def _tsv_ranks(path: Path) -> dict[str, int]:
    ranks = {}
    for i, line in enumerate(_js_template(path).splitlines(), start=1):
        token = line.split("\t", 1)[0]
        ranks.setdefault(token, i)
    return ranks


# Xinhua numbers senses ⒈ ⒉ ... ⒛
_SENSE = re.compile(r"^([⒈-⒛])(.*)$")
_PINYIN = re.compile(r"^[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜńňǹḿ·]+$")
# Sentences worth showing: no Latin text, a sensible length
_CROSS_REF = re.compile(r"^见\S{1,12}。?$")
_SUB_SENSES = tuple("①②③④⑤⑥⑦⑧⑨⑩")
_SENTENCE_OK = re.compile(r"^[^A-Za-z０-９Ａ-Ｚａ-ｚ]{4,24}$")
EXAMPLES_PER_ITEM = 3


def _xinhua_modern(hanzi: str, explanation: str) -> dict[str, list[str]]:
    """The modern 新华字典 senses inside a Xinhua entry, by reading.

    Entries start with classical (汉典) material; the modern part is a line
    with the character and its pinyin (e.g. "行xíng") followed by numbered
    senses. Senses with no text (sub-entries the source dropped) are skipped.
    """
    readings: dict[str, list[str]] = {}
    current = None
    last = None
    for line in (ln.strip() for ln in explanation.splitlines()):
        if not line:
            continue
        head = re.match(rf"^{re.escape(hanzi)}(?:（.*?）)?\s*(\S+)$", line)
        if head and _PINYIN.match(head[1]):
            current = readings.setdefault(head[1].lstrip("·"), [])
            last = None
            continue
        # Some entries put the senses on the reading's line: "的 ·de放在…②助词…"
        inline = re.match(
            rf"^{re.escape(hanzi)}\s*·?([a-zāáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ]+)([一-鿿〈（].*)$",
            line,
        )
        if inline and hanzi not in readings.get(inline[1], ""):
            senses = [
                t.strip().replace("〈表〉", "表示")
                for t in re.split(r"[①-⑩]", inline[2])
                if t.strip()
            ]
            if senses:
                readings.setdefault(inline[1], []).extend(senses)
            current = last = None
            continue
        sense = _SENSE.match(line)
        if sense and current is not None:
            text = sense[2].strip().replace("〈表〉", "表示")
            # Skip empty senses and cross-references such as "见xíng。"
            if text and not _CROSS_REF.match(text):
                current.append(text)
                last = len(current) - 1
            else:
                last = None
        elif line.startswith(_SUB_SENSES) and current is not None:
            # Sub-senses ① ② belong to the sense before them, if it had text
            if last is not None:
                current[last] += line.replace("〈表〉", "表示")
        else:
            current = last = None
    return {r: senses for r, senses in readings.items() if senses}


def _mapull_char_senses(entry: dict) -> dict[str, list[str]]:
    """Fallback character senses from mapull's char_detail (no etymology)."""
    out = {}
    for p in entry.get("pronunciations", []):
        senses = [
            e["content"].strip("，, ")
            for e in p.get("explanations", [])
            if e.get("content")
            and not e["content"].startswith(("(", "（"))
            and e["content"] != "同本义。"
        ]
        if senses:
            out[p["pinyin"]] = senses[:6]
    return out


def _format_zh_senses(readings: dict[str, list[str]], order: list[str]) -> str:
    def key(r):
        return order.index(r) if r in order else len(order)

    parts = []
    numbers = "⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛"
    for reading in sorted(readings, key=key):
        senses = readings[reading]
        body = (
            senses[0]
            if len(senses) == 1
            else "\n".join(f"{numbers[i]} {t}" for i, t in enumerate(senses[:20]))
        )
        parts.append(f"{reading}\n{body}" if len(readings) > 1 else body)
    return "\n".join(parts)


def _segment(text: str, vocab: set[str], max_len: int = 6) -> list[str]:
    """Forward maximum matching against the dictionary's words."""
    tokens, i = [], 0
    while i < len(text):
        for n in range(min(max_len, len(text) - i), 0, -1):
            if n == 1 or text[i : i + n] in vocab:
                tokens.append(text[i : i + n])
                i += n
                break
    return tokens


def _clean_defs(defs: list[str]) -> list[str]:
    good = [d for d in defs if not _LOW_VALUE_DEF.match(d)]
    return good or defs


class Dataset:
    def __init__(self, root: Path):
        self.root = root

    def strokes(self) -> dict[str, dict]:
        data = {}
        for f in (self.root / "hanzi-writer-data").glob("*.json"):
            if len(f.stem) != 1:  # skip package.json etc.
                continue
            data[f.stem] = json.loads(f.read_text(encoding="utf-8"))
        return data

    def cedict(self) -> dict[str, list[dict]]:
        by_simplified = defaultdict(list)
        entries = json.loads((self.root / "cedict-json/cedict.json").read_text())
        for e in entries:
            by_simplified[e["simplified"]].append(e)
        return by_simplified

    def subtlex_chars(self) -> dict[str, int]:
        return _tsv_ranks(
            self.root / "chinese-lexicon/statistics/movieCharFrequency.js"
        )

    def subtlex_words(self) -> dict[str, int]:
        return _tsv_ranks(
            self.root / "chinese-lexicon/statistics/movieWordFrequency.js"
        )

    def junda_chars(self) -> dict[str, int]:
        ranks = {}
        path = self.root / "hanzi/lib/data/frequencyjunda.txt.js"
        for line in _js_template(path).splitlines():
            parts = line.split("\t")
            if len(parts) > 1:
                ranks.setdefault(parts[1], int(parts[0]))
        return ranks

    def hsk_words(self) -> dict[str, int]:
        text = (self.root / "chinese-lexicon/statistics/hsk.js").read_text()
        levels = json.loads(re.search(r"let hsk = (\[.*?\]);\s*\n", text, re.S)[1])
        out = {}
        for level, words in enumerate(levels, start=1):
            for w in words:
                out.setdefault(w, level)
        return out

    def xinhua_chars(self) -> dict[str, str]:
        path = self.root / "chinese-xinhua/word.json"
        return {e["word"]: e["explanation"] for e in json.loads(path.read_text())}

    def mapull_chars(self) -> dict[str, dict]:
        """char_detail.json is one JSON object per line."""
        out = {}
        for line in (self.root / "mapull/char_detail.json").open(encoding="utf-8"):
            line = line.strip().rstrip(",")
            if line.startswith("{"):
                e = json.loads(line)
                out[e["char"]] = e
        return out

    def zh_words(self) -> dict[str, str]:
        """Chinese definitions of words: mapull (modern) then Xinhua's 词典."""
        out = {}
        for e in json.loads((self.root / "mapull/word.json").read_text()):
            if e.get("explanation"):
                out.setdefault(e["word"], e["explanation"].strip())
        for e in json.loads((self.root / "chinese-xinhua/ci.json").read_text()):
            if e.get("explanation"):
                out.setdefault(e["ci"], e["explanation"].strip())
        return out

    def sentences(self) -> dict[int, tuple[str, str]]:
        """Tatoeba Chinese sentences -> (chinese, first English translation)."""
        path = self.root / "tatoeba-cmn-eng/sentences.json"
        out = {}
        for cid, chinese, _eid, english in json.loads(path.read_text()):
            out.setdefault(int(cid), (chinese.strip(), english.strip()))
        return out

    def pinyin_frequency(self) -> dict[str, int]:
        """'行xíng' -> 2943, from Unihan kHanyuPinlu."""
        text = (self.root / "chinese-lexicon/statistics/pinyinFrequency.js").read_text()
        return {k: int(v) for k, v in re.findall(r'"([^"]+)":\s*"(\d+)"', text)}


def _readings(hanzi: str, entries: list[dict], pinyin_freq: dict[str, int]):
    """Group CEDICT entries by reading, most common reading first.

    Lowercase readings come before capitalised ones (proper nouns/surnames).
    """
    grouped: dict[str, list[str]] = {}
    traditional = ""
    for e in entries:
        grouped.setdefault(e["pinyin"], []).extend(e["english"])
        traditional = traditional or e["traditional"]

    def sort_key(numbered: str):
        marked = numbered_to_marked(numbered)
        return (numbered[:1].isupper(), -pinyin_freq.get(hanzi + marked, 0))

    order = sorted(grouped, key=sort_key)
    return order, {r: _clean_defs(grouped[r]) for r in order}, traditional


class Command(BaseCommand):
    help = "Load Chinese characters, strokes and vocabulary (see module docstring)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--data-dir",
            default=str(Path(settings.BASE_DIR) / "data" / "chinese"),
        )
        parser.add_argument(
            "--max-words",
            type=int,
            default=50000,
            help="Load at most this many words, by frequency",
        )

    def handle(self, *args, data_dir, max_words, **options):
        root = Path(data_dir)
        if not (root / "cedict-json").exists():
            raise CommandError(
                f"No data in {root}. Run scripts/fetch-chinese-data.sh first."
            )
        ds = Dataset(root)
        self.stdout.write("Reading datasets...")
        strokes = ds.strokes()
        cedict = ds.cedict()
        subtlex_chars = ds.subtlex_chars()
        subtlex_words = ds.subtlex_words()
        junda = ds.junda_chars()
        hsk_words = ds.hsk_words()
        pinyin_freq = ds.pinyin_frequency()
        zh_words = ds.zh_words()
        xinhua_chars = ds.xinhua_chars()
        mapull_chars = ds.mapull_chars()

        words = self._build_words(
            cedict, subtlex_words, hsk_words, pinyin_freq, max_words
        )
        chars = self._build_characters(
            strokes, cedict, subtlex_chars, junda, hsk_words, pinyin_freq, words
        )
        self._add_chinese_definitions(words, chars, zh_words, xinhua_chars, mapull_chars)
        sentences, examples = self._build_examples(ds.sentences(), cedict, words, chars)
        with transaction.atomic():
            char_objs = self._save_characters(chars)
            self._save_strokes(char_objs, strokes)
            word_objs = self._save_words(words, char_objs)
            self._save_examples(sentences, examples, word_objs, char_objs)
        self.stdout.write(
            self.style.SUCCESS(f"Loaded {len(chars)} characters and {len(words)} words")
        )

    # -- building ------------------------------------------------------------

    def _build_words(self, cedict, subtlex_words, hsk_words, pinyin_freq, max_words):
        words = []
        for simplified, rank in sorted(subtlex_words.items(), key=lambda kv: kv[1]):
            if len(words) >= max_words:
                break
            if not CJK.match(simplified) or simplified not in cedict:
                continue
            order, defs, traditional = _readings(
                simplified, cedict[simplified], pinyin_freq
            )
            primary = order[0]
            words.append(
                {
                    "simplified": simplified,
                    "traditional": traditional,
                    "pinyin": numbered_to_marked(primary),
                    "pinyin_numbered": order,
                    "definition": "; ".join(defs[primary]),
                    "frequency_rank": rank,
                    "hsk_level": hsk_words.get(simplified),
                }
            )
        return words

    def _build_characters(
        self, strokes, cedict, subtlex, junda, hsk_words, pinyin_freq, words
    ):
        hsk_chars: dict[str, int] = {}
        for w, level in hsk_words.items():
            for c in w:
                hsk_chars[c] = min(level, hsk_chars.get(c, level))

        # Spoken (SUBTLEX-CH) order first; characters it doesn't cover follow
        # in written (Jun Da) order.
        ordering = sorted(subtlex, key=subtlex.get)
        seen = set(ordering)
        ordering += [c for c in sorted(junda, key=junda.get) if c not in seen]
        rank = {c: i for i, c in enumerate(ordering, start=1)}

        hanzi_set = set(strokes) | {c for w in words for c in w["simplified"]}
        chars = []
        for hanzi in hanzi_set:
            if not CJK.match(hanzi):
                continue
            order, defs, traditional = _readings(
                hanzi, cedict.get(hanzi, []), pinyin_freq
            )
            if len(order) > 1:
                definition = "\n".join(
                    f"{numbered_to_marked(r)}: {'; '.join(defs[r])}" for r in order
                )
            else:
                definition = "; ".join(defs[order[0]]) if order else ""
            chars.append(
                {
                    "hanzi": hanzi,
                    "traditional": traditional if traditional != hanzi else "",
                    "pinyin": [numbered_to_marked(r) for r in order],
                    "pinyin_numbered": order,
                    "definition": definition,
                    # Only rank characters we have something to teach for
                    "frequency_rank": rank.get(hanzi) if order else None,
                    "written_frequency_rank": junda.get(hanzi),
                    "hsk_level": hsk_chars.get(hanzi),
                    "stroke_count": len(strokes.get(hanzi, {}).get("strokes", [])),
                }
            )
        return chars

    def _add_chinese_definitions(self, words, chars, zh_words, xinhua, mapull):
        for c in chars:
            order = c["pinyin"]
            senses = _xinhua_modern(c["hanzi"], xinhua.get(c["hanzi"], ""))
            if not senses and c["hanzi"] in mapull:
                senses = _mapull_char_senses(mapull[c["hanzi"]])
            c["definition_zh"] = _format_zh_senses(senses, order) if senses else ""
        # Single-character words use their character's definition
        char_zh = {c["hanzi"]: c["definition_zh"] for c in chars}
        for w in words:
            w["definition_zh"] = zh_words.get(w["simplified"]) or char_zh.get(
                w["simplified"], ""
            )
        self.stdout.write(
            f"Chinese definitions: {sum(bool(w['definition_zh']) for w in words)}"
            f"/{len(words)} words, {sum(bool(c['definition_zh']) for c in chars)}"
            f"/{len(chars)} characters"
        )

    def _build_examples(self, raw, cedict, words, chars):
        """Pick the easiest short sentences for every word and character.

        Traditional sentences are converted character by character where the
        simplified form is unambiguous. Sentences are segmented against the
        dictionary; a sentence's difficulty is the frequency rank of its
        rarest word, so examples use vocabulary the learner likely knows.
        """
        t2s: dict[str, set[str]] = defaultdict(set)
        simplified = set()
        for entries in cedict.values():
            for e in entries:
                if len(e["simplified"]) == 1:
                    simplified.add(e["simplified"])
                    if e["traditional"] != e["simplified"]:
                        t2s[e["traditional"]].add(e["simplified"])
        convert = {t: next(iter(s)) for t, s in t2s.items() if t not in simplified}
        ambiguous = {t for t in convert if len(t2s[t]) > 1}

        vocab = set(cedict)
        word_rank = {w["simplified"]: w["frequency_rank"] for w in words}
        word_pinyin = {w["simplified"]: w["pinyin"] for w in words}
        char_pinyin = {c["hanzi"]: c["pinyin"][0] for c in chars if c["pinyin"]}
        char_ids = set(char_pinyin)

        def token_pinyin(t):
            if t in word_pinyin:
                return word_pinyin[t]
            if len(t) == 1:
                return char_pinyin.get(t, "")
            entries = cedict.get(t)
            if entries:
                return numbered_to_marked(entries[0]["pinyin"])
            return " ".join(char_pinyin.get(c, "") for c in t)

        candidates: dict[tuple[str, str], list[tuple[float, int]]] = defaultdict(list)
        sentences = {}
        for sid, (chinese, english) in raw.items():
            if any(ch in ambiguous for ch in chinese):
                continue
            chinese = "".join(convert.get(ch, ch) for ch in chinese)
            if not _SENTENCE_OK.match(chinese):
                continue
            tokens = _segment(chinese, vocab)
            hanzi_tokens = [t for t in tokens if CJK.match(t)]
            if not hanzi_tokens:
                continue
            difficulty = max(word_rank.get(t, 60000) for t in hanzi_tokens)
            length = len(chinese)
            score = difficulty + 400 * max(0, length - 14) + 400 * max(0, 6 - length)
            sentences[sid] = (chinese, english, tokens)
            for t in set(hanzi_tokens):
                if t in word_rank:
                    candidates[("word", t)].append((score, sid))
            for ch in set(chinese) & char_ids:
                candidates[("char", ch)].append((score, sid))

        examples = {
            key: [sid for _, sid in sorted(cands)[:EXAMPLES_PER_ITEM]]
            for key, cands in candidates.items()
        }
        used = {sid for sids in examples.values() for sid in sids}
        rows = {
            sid: {
                "chinese": chinese,
                "english": english,
                "tokens": [
                    [t, token_pinyin(t) if CJK.match(t) else ""] for t in tokens
                ],
            }
            for sid, (chinese, english, tokens) in sentences.items()
            if sid in used
        }
        self.stdout.write(
            f"Examples: {len(rows)} sentences for {len(examples)} words/characters"
        )
        return rows, examples

    # -- saving --------------------------------------------------------------

    def _upsert(self, model, key: str, rows: list[dict]) -> dict:
        existing = {getattr(o, key): o for o in model.objects.all()}
        fields = [f for f in rows[0] if f != key]
        to_create, to_update = [], []
        for row in rows:
            obj = existing.get(row[key])
            if obj:
                for f in fields:
                    setattr(obj, f, row[f])
                to_update.append(obj)
            else:
                obj = model(**row)
                existing[row[key]] = obj
                to_create.append(obj)
        model.objects.bulk_create(to_create, batch_size=BATCH)
        model.objects.bulk_update(to_update, fields, batch_size=BATCH)
        self.stdout.write(
            f"{model.__name__}: {len(to_create)} created, {len(to_update)} updated"
        )
        return existing

    def _save_characters(self, chars):
        return self._upsert(Character, "hanzi", chars)

    def _save_strokes(self, char_objs, strokes):
        Stroke.objects.all().delete()
        rows = []
        for hanzi, data in strokes.items():
            char = char_objs.get(hanzi)
            if not char:
                continue
            radicals = set(data.get("radStrokes") or [])
            for i, (path, median) in enumerate(zip(data["strokes"], data["medians"])):
                rows.append(
                    Stroke(
                        character=char,
                        order=i,
                        path=path,
                        median=median,
                        is_radical=i in radicals,
                    )
                )
        Stroke.objects.bulk_create(rows, batch_size=BATCH)
        self.stdout.write(f"Stroke: {len(rows)} created")

    def _save_words(self, words, char_objs):
        word_objs = self._upsert(Word, "simplified", words)
        WordCharacter.objects.all().delete()
        links = [
            WordCharacter(
                word=word_objs[w["simplified"]], character=char_objs[c], position=i
            )
            for w in words
            for i, c in enumerate(w["simplified"])
            if c in char_objs
        ]
        WordCharacter.objects.bulk_create(links, batch_size=BATCH)
        self.stdout.write(f"WordCharacter: {len(links)} created")
        return word_objs

    def _save_examples(self, sentences, examples, word_objs, char_objs):
        Example.objects.all().delete()
        Sentence.objects.all().delete()
        Sentence.objects.bulk_create(
            [Sentence(id=sid, **row) for sid, row in sentences.items()],
            batch_size=BATCH,
        )
        links = []
        for (kind, hanzi), sids in examples.items():
            target = (
                {"word": word_objs.get(hanzi)}
                if kind == "word"
                else {"character": char_objs.get(hanzi)}
            )
            if next(iter(target.values())) is None:
                continue
            links += [
                Example(sentence_id=sid, position=i, **target)
                for i, sid in enumerate(sids)
            ]
        Example.objects.bulk_create(links, batch_size=BATCH)
        self.stdout.write(f"Sentence: {len(sentences)}, Example: {len(links)}")
