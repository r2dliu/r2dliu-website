"""Helpers for converting and comparing pinyin.

CC-CEDICT stores pinyin with tone numbers ("ni3 hao3"); we display tone marks
("nǐ hǎo") and accept either form when the learner types an answer.
"""

import re
import unicodedata

_TONE_MARKS = {
    "a": "āáǎà",
    "e": "ēéěè",
    "i": "īíǐì",
    "o": "ōóǒò",
    "u": "ūúǔù",
    "ü": "ǖǘǚǜ",
}

_MARK_TO_BASE = {
    mark: (base, tone + 1)
    for base, marks in _TONE_MARKS.items()
    for tone, mark in enumerate(marks)
}

_SYLLABLE = re.compile(r"([a-zü]+)([1-5])", re.IGNORECASE)


def _mark_syllable(syllable: str, tone: int) -> str:
    if tone == 5:
        return syllable
    lower = syllable.lower()
    # Standard placement rules: a/e take the mark, "ou" marks the o,
    # otherwise the last vowel gets it.
    if "a" in lower:
        idx = lower.index("a")
    elif "e" in lower:
        idx = lower.index("e")
    elif "ou" in lower:
        idx = lower.index("o")
    else:
        idx = max((i for i, c in enumerate(lower) if c in _TONE_MARKS), default=-1)
    if idx < 0:
        return syllable
    base = lower[idx]
    mark = _TONE_MARKS[base][tone - 1]
    if syllable[idx].isupper():
        mark = mark.upper()
    return syllable[:idx] + mark + syllable[idx + 1 :]


def numbered_to_marked(pinyin: str) -> str:
    """'ni3 hao3' -> 'nǐ hǎo'. CEDICT writes ü as 'u:'."""
    pinyin = pinyin.replace("u:", "ü").replace("U:", "Ü").replace("v", "ü")
    return _SYLLABLE.sub(lambda m: _mark_syllable(m.group(1), int(m.group(2))), pinyin)


def normalize(pinyin: str) -> str:
    """Canonical comparison form: toneless letters plus the tone sequence.

    'Nǐ hǎo', 'ni3 hao3', 'ni3hao3' and 'nǐhǎo' all become 'nihao|33'.
    Neutral tones may be written with 5, 0 or nothing.
    """
    text = unicodedata.normalize("NFC", pinyin.strip().lower())
    text = text.replace("u:", "ü").replace("v", "ü")
    letters = []
    tones = []
    for ch in text:
        if ch in _MARK_TO_BASE:
            base, tone = _MARK_TO_BASE[ch]
            letters.append(base)
            tones.append(str(tone))
        elif ch.isalpha():
            letters.append(ch)
        elif ch in "1234":
            tones.append(ch)
    return "".join(letters) + "|" + "".join(tones)


def matches(answer: str, numbered_readings: list[str]) -> bool:
    """True when the typed answer matches any accepted reading."""
    target = normalize(answer)
    return target != "|" and any(normalize(r) == target for r in numbered_readings)
