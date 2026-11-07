"""Browsing and editing a deck's cards outside the study queue."""

import re
from dataclasses import dataclass

from django.db.models import F, Q, TextField
from django.db.models.functions import Cast
from django.utils import timezone

from r2dliu.chinese.models import Card, Character, Deck, Remediation, Word

State = Card.State

# Filters: card states, plus UPCOMING for what isn't in the deck yet
FILTERS = {
    "ALL": None,
    "NEW": [State.NEW],
    "LEARNING": [State.LEARNING, State.RELEARNING],
    "REVIEW": [State.REVIEW],
    "KNOWN": [State.KNOWN],
    "UPCOMING": None,
}

ACTIONS = ("STUDY_NOW", "KNOWN", "RESET")


class BrowseError(Exception):
    pass


@dataclass
class Page:
    total: int
    items: list  # Cards, or Characters/Words for UPCOMING


def _pinyin_regex(query: str) -> str:
    """'meiyou' matches 'mei2 you3': letters may be split by tones/spaces."""
    letters = [re.escape(c) for c in query.lower().replace("ü", "v") if c.isalpha()]
    return "[0-5 ]*".join(letters)


def _search(query: str, prefix: str, is_word: bool) -> Q:
    """Match hanzi, pinyin (with or without tones) or either definition."""
    query = query.strip()
    hanzi = f"{prefix}simplified" if is_word else f"{prefix}hanzi"
    if not query:
        return Q()
    if query.isascii():
        q = Q(**{f"{prefix}definition__icontains": query})
        if query.replace(" ", "").isalpha():
            q |= Q(_pinyin__iregex=_pinyin_regex(query))
        return q
    return Q(**{f"{hanzi}__contains": query}) | Q(
        **{f"{prefix}definition_zh__contains": query}
    )


def browse(
    deck: Deck, filter: str, query: str = "", offset: int = 0, limit: int = 50
) -> Page:
    if filter not in FILTERS:
        raise BrowseError(f"Unknown filter {filter}")
    is_word = deck.card_kind == Deck.CardKind.WORD
    limit = max(1, min(limit, 200))

    if filter == "UPCOMING":
        model = Word if is_word else Character
        qs = model.objects.filter(frequency_rank__isnull=False).exclude(card__deck=deck)
        if not is_word:
            qs = qs.filter(stroke_count__gt=0)
        qs = qs.annotate(_pinyin=Cast("pinyin_numbered", TextField())).filter(
            _search(query, "", is_word)
        )
        qs = qs.order_by("frequency_rank")
    else:
        subject = "word" if is_word else "character"
        qs = (
            deck.cards.select_related("character", "word")
            .annotate(_pinyin=Cast(f"{subject}__pinyin_numbered", TextField()))
            .filter(_search(query, f"{subject}__", is_word))
        )
        if FILTERS[filter]:
            qs = qs.filter(state__in=FILTERS[filter])
        qs = qs.order_by(
            F(f"{subject}__frequency_rank").asc(nulls_last=True), "datetime_created"
        )
    return Page(total=qs.count(), items=list(qs[offset : offset + limit]))


def apply_action(card: Card, action: str, now=None) -> Card:
    """STUDY_NOW: due now. KNOWN: never shown again. RESET: back to new."""
    now = now or timezone.now()
    if action not in ACTIONS:
        raise BrowseError(f"Unknown action {action}")
    if Remediation.objects.filter(
        card=card, status=Remediation.Status.ACTIVE
    ).exists():
        raise BrowseError("Finish this card's failure tasks first")
    if action == "STUDY_NOW":
        if card.state == State.NEW:
            # Straight into learning, so it's shown now whatever today's
            # new-card limit says
            card.state = State.LEARNING
            card.step = 0
        elif card.state == State.KNOWN:
            card.state = State.REVIEW
        card.due = now
    elif action == "KNOWN":
        card.state = State.KNOWN
        card.step = 0
    elif action == "RESET":
        card.state = State.NEW
        card.due = now
        card.interval_days = 0
        card.ease = 2.5
        card.step = 0
    card.save()
    return card
