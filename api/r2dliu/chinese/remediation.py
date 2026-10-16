"""Configurable tasks a learner must complete after failing a card.

A deck's `failure_steps` is an ordered list of step configs. When a card is
rated AGAIN a Remediation is created with a snapshot of those steps, and the
learner can't get another card until every step is satisfied. The server
checks each step's requirements; the client only reports what happened.

Adding a new step type means adding it to STEP_DEFAULTS, `_initial_progress`
and `_is_satisfied`, plus an action function the GraphQL schema exposes.
"""

from django.db import transaction
from django.utils import timezone

from r2dliu.chinese import pinyin
from r2dliu.chinese.models import Card, Character, Remediation, Review, Word

DRAW_STROKES = "DRAW_STROKES"
EXPLORE_RELATED = "EXPLORE_RELATED"
TYPE_PINYIN = "TYPE_PINYIN"

STEP_DEFAULTS = {
    # Draw each character stroke by stroke (Hanzi Writer quiz)
    DRAW_STROKES: {
        # ALL characters of a word, or just the FIRST
        "characters": "ALL",
        # Clean drawings required per character
        "repetitions": 1,
        # A drawing with more mistakes than this doesn't count
        "maxMistakes": 3,
        # Show the faint character outline while drawing
        "showOutline": True,
    },
    # Browse related vocab that shares characters with the failed card
    EXPLORE_RELATED: {
        "minOpened": 3,
        "maxItems": 12,
    },
    # Type the pinyin (with tones) correctly
    TYPE_PINYIN: {
        "repetitions": 1,
    },
}

_LIMITS = {
    "repetitions": (1, 10),
    "maxMistakes": (0, 50),
    "minOpened": (0, 50),
    "maxItems": (1, 50),
}


class RemediationError(Exception):
    pass


def validate_steps(steps: list[dict]) -> list[dict]:
    """Merge defaults into each step and clamp values. Raises on bad input."""
    if not isinstance(steps, list):
        raise RemediationError("failureSteps must be a list")
    clean = []
    for raw in steps:
        if not isinstance(raw, dict) or raw.get("type") not in STEP_DEFAULTS:
            raise RemediationError(
                f"Unknown step {raw!r}; expected one of {sorted(STEP_DEFAULTS)}"
            )
        defaults = STEP_DEFAULTS[raw["type"]]
        step = {"type": raw["type"]}
        for key, default in defaults.items():
            value = raw.get(key, default)
            if isinstance(default, bool):
                value = bool(value)
            elif isinstance(default, int):
                lo, hi = _LIMITS[key]
                value = max(lo, min(hi, int(value)))
            elif key == "characters" and value not in ("ALL", "FIRST"):
                raise RemediationError("characters must be ALL or FIRST")
            step[key] = value
        if step["type"] == EXPLORE_RELATED:
            step["maxItems"] = max(step["maxItems"], step["minOpened"])
        clean.append(step)
    return clean


# ---------------------------------------------------------------------------
# Related items
# ---------------------------------------------------------------------------


def item_key(obj: Character | Word) -> str:
    return f"{'C' if isinstance(obj, Character) else 'W'}:{obj.pk}"


def related_items(card: Card, limit: int) -> list[Character | Word]:
    """Vocab sharing characters with the card, most common first.

    For a character card: words containing it. For a word card: its component
    characters, then other words sharing any of them.
    """
    chars = card.subject_characters()
    items: list[Character | Word] = []
    if card.word:
        # Single characters that are part of the word
        items.extend(dict.fromkeys(chars))
    words = (
        Word.objects.filter(characters__in=chars, frequency_rank__isnull=False)
        .exclude(simplified=card.hanzi)
        .distinct()
        .order_by("frequency_rank")[: limit * 2]
    )
    items.extend(words)
    return items[:limit]


def load_items(keys: list[str]) -> list[Character | Word]:
    char_ids = [k[2:] for k in keys if k.startswith("C:")]
    word_ids = [k[2:] for k in keys if k.startswith("W:")]
    by_key = {item_key(c): c for c in Character.objects.filter(pk__in=char_ids)}
    by_key |= {item_key(w): w for w in Word.objects.filter(pk__in=word_ids)}
    return [by_key[k] for k in keys if k in by_key]


# ---------------------------------------------------------------------------
# Lifecycle
# ---------------------------------------------------------------------------


def _draw_targets(card: Card, step: dict) -> list[str]:
    chars = [c.hanzi for c in card.subject_characters() if c.stroke_count]
    chars = list(dict.fromkeys(chars))
    return chars[:1] if step["characters"] == "FIRST" else chars


def _initial_progress(card: Card, step: dict) -> dict:
    if step["type"] == DRAW_STROKES:
        return {"completed": {c: 0 for c in _draw_targets(card, step)}}
    if step["type"] == EXPLORE_RELATED:
        items = related_items(card, step["maxItems"])
        return {"items": [item_key(i) for i in items], "opened": []}
    if step["type"] == TYPE_PINYIN:
        return {"correct": 0, "attempts": 0}
    raise RemediationError(step["type"])


def required_count(step: dict, progress: dict) -> int:
    """How many actions the step needs, capped by what's actually available."""
    if step["type"] == DRAW_STROKES:
        return step["repetitions"] * len(progress["completed"])
    if step["type"] == EXPLORE_RELATED:
        return min(step["minOpened"], len(progress["items"]))
    return step["repetitions"]


def done_count(step: dict, progress: dict) -> int:
    if step["type"] == DRAW_STROKES:
        return sum(min(n, step["repetitions"]) for n in progress["completed"].values())
    if step["type"] == EXPLORE_RELATED:
        return len(progress["opened"])
    return progress["correct"]


def _is_satisfied(step: dict, progress: dict) -> bool:
    return done_count(step, progress) >= required_count(step, progress)


def start(card: Card, review: Review) -> Remediation | None:
    steps = validate_steps(card.deck.failure_steps)
    if not steps:
        return None
    remediation = Remediation(
        card=card,
        review=review,
        steps=steps,
        progress=[_initial_progress(card, s) for s in steps],
    )
    _advance(remediation)
    remediation.save()
    return remediation


def _advance(remediation: Remediation) -> None:
    """Skip past satisfied steps; mark completed when none remain."""
    while remediation.current_step < len(remediation.steps):
        i = remediation.current_step
        if not _is_satisfied(remediation.steps[i], remediation.progress[i]):
            return
        remediation.current_step += 1
    remediation.status = Remediation.Status.COMPLETED
    remediation.completed_at = timezone.now()


def active_for_deck(deck_id) -> Remediation | None:
    return (
        Remediation.objects.filter(
            card__deck_id=deck_id, status=Remediation.Status.ACTIVE
        )
        .select_related("card__character", "card__word", "card__deck")
        .order_by("datetime_created")
        .first()
    )


def _current(remediation: Remediation, step_type: str) -> tuple[dict, dict]:
    if remediation.status != Remediation.Status.ACTIVE:
        raise RemediationError("Remediation is already complete")
    step = remediation.steps[remediation.current_step]
    if step["type"] != step_type:
        raise RemediationError(f"Current step is {step['type']}, not {step_type}")
    return step, remediation.progress[remediation.current_step]


def _locked(remediation_id, learner) -> Remediation:
    return (
        # Character/word are outer joins, which can't be locked
        Remediation.objects.select_for_update(of=("self",))
        .select_related("card__character", "card__word", "card__deck")
        .get(pk=remediation_id, card__deck__learner=learner)
    )


@transaction.atomic
def complete_stroke_quiz(remediation_id, learner, hanzi: str, mistakes: int):
    """Record one drawing. Returns (remediation, counted)."""
    remediation = _locked(remediation_id, learner)
    step, progress = _current(remediation, DRAW_STROKES)
    if hanzi not in progress["completed"]:
        raise RemediationError(f"{hanzi} is not part of this card")
    counted = mistakes <= step["maxMistakes"]
    if counted:
        progress["completed"][hanzi] += 1
        _advance(remediation)
        remediation.save()
    return remediation, counted


@transaction.atomic
def open_related(remediation_id, learner, key: str) -> Remediation:
    remediation = _locked(remediation_id, learner)
    _step, progress = _current(remediation, EXPLORE_RELATED)
    if key not in progress["items"]:
        raise RemediationError("That item isn't in the related list")
    if key not in progress["opened"]:
        progress["opened"].append(key)
        _advance(remediation)
        remediation.save()
    return remediation


@transaction.atomic
def submit_pinyin(remediation_id, learner, answer: str):
    """Check a typed answer. Returns (remediation, correct, expected)."""
    remediation = _locked(remediation_id, learner)
    _step, progress = _current(remediation, TYPE_PINYIN)
    subject = remediation.card.subject
    correct = pinyin.matches(answer, subject.pinyin_numbered)
    progress["attempts"] += 1
    if correct:
        progress["correct"] += 1
        _advance(remediation)
    remediation.save()
    expected = (
        subject.pinyin if isinstance(subject, Word) else " / ".join(subject.pinyin)
    )
    return remediation, correct, expected
