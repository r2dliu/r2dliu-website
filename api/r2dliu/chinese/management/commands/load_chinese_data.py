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

from r2dliu.chinese.models import Character, Stroke, Word, WordCharacter
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

        words = self._build_words(
            cedict, subtlex_words, hsk_words, pinyin_freq, max_words
        )
        chars = self._build_characters(
            strokes, cedict, subtlex_chars, junda, hsk_words, pinyin_freq, words
        )
        with transaction.atomic():
            char_objs = self._save_characters(chars)
            self._save_strokes(char_objs, strokes)
            self._save_words(words, char_objs)
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
