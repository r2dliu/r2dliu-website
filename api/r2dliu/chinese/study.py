"""The study queue: which card comes next, and answering cards.

New cards aren't created up front. When the learner has room for a new card
today, the next most frequent character/word not yet in the deck becomes a
card, so decks always follow frequency order.
"""

from dataclasses import dataclass
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from django.db import transaction
from django.utils import timezone

from r2dliu.chinese import remediation, scheduler
from r2dliu.chinese.models import Card, Character, Deck, Remediation, Review, Word

# The daily new-card limit resets at midnight Eastern time
DAY_TIMEZONE = ZoneInfo("America/New_York")

# Like Anki: if nothing else is due, show learning cards due within this window
LEARN_AHEAD = timedelta(minutes=20)

State = Card.State


class StudyError(Exception):
    pass


@dataclass
class QueueCounts:
    new: int
    learning: int
    review: int


@dataclass
class StudyState:
    deck: Deck
    card: Card | None
    remediation: Remediation | None
    counts: QueueCounts
    next_due_at: datetime | None


def _start_of_day(now: datetime) -> datetime:
    local = now.astimezone(DAY_TIMEZONE)
    return local.replace(hour=0, minute=0, second=0, microsecond=0)


def new_introduced_today(deck: Deck, now: datetime) -> int:
    return Review.objects.filter(
        card__deck=deck,
        state_before=State.NEW,
        datetime_created__gte=_start_of_day(now),
    ).count()


def _next_unseen_subject(deck: Deck) -> Character | Word | None:
    if deck.card_kind == Deck.CardKind.CHARACTER:
        return (
            Character.objects.filter(frequency_rank__isnull=False, stroke_count__gt=0)
            .exclude(card__deck=deck)
            .order_by("frequency_rank")
            .first()
        )
    return (
        Word.objects.filter(frequency_rank__isnull=False)
        .exclude(card__deck=deck)
        .order_by("frequency_rank")
        .first()
    )


def add_card(deck: Deck, subject: Character | Word, now: datetime) -> Card:
    field = "character" if isinstance(subject, Character) else "word"
    card, _ = Card.objects.get_or_create(
        deck=deck, **{field: subject}, defaults={"due": now}
    )
    return card


def _new_card(deck: Deck, now: datetime) -> Card | None:
    # Cards explicitly added (e.g. from a related list) go first
    card = deck.cards.filter(state=State.NEW).order_by("datetime_created").first()
    if card:
        return card
    subject = _next_unseen_subject(deck)
    return add_card(deck, subject, now) if subject else None


def _cards(deck: Deck):
    return deck.cards.select_related("character", "word")


def get_state(deck: Deck, now: datetime | None = None) -> StudyState:
    now = now or timezone.now()
    learning_states = [State.LEARNING, State.RELEARNING]
    due_learning = _cards(deck).filter(state__in=learning_states, due__lte=now)
    due_review = _cards(deck).filter(state=State.REVIEW, due__lte=now)
    new_left = max(0, deck.new_cards_per_day - new_introduced_today(deck, now))
    counts = QueueCounts(
        new=new_left, learning=due_learning.count(), review=due_review.count()
    )

    active = remediation.active_for_deck(deck.pk)
    if active:
        return StudyState(deck, active.card, active, counts, None)

    card = (
        due_learning.order_by("due").first()
        or due_review.order_by("due").first()
        or (_new_card(deck, now) if new_left else None)
        or _cards(deck)
        .filter(state__in=learning_states, due__lte=now + LEARN_AHEAD)
        .order_by("due")
        .first()
    )
    next_due = None
    if not card:
        upcoming = deck.cards.exclude(state=State.NEW).order_by("due").first()
        next_due = upcoming.due if upcoming else None
    return StudyState(deck, card, None, counts, next_due)


@transaction.atomic
def answer(card: Card, rating: str, duration_ms: int | None, now=None) -> Review:
    now = now or timezone.now()
    if rating not in Review.Rating.values:
        raise StudyError(f"Unknown rating {rating}")
    if remediation.active_for_deck(card.deck_id):
        raise StudyError("Finish the failure tasks before answering another card")

    before = scheduler.from_card(card)
    after = scheduler.schedule(before, rating, card.deck, now)
    review = Review.objects.create(
        card=card,
        rating=rating,
        state_before=before.state,
        interval_before=before.interval_days,
        interval_after=after.interval_days,
        due_after=after.due,
        duration_ms=duration_ms,
    )
    card.state = after.state
    card.due = after.due
    card.interval_days = after.interval_days
    card.ease = after.ease
    card.step = after.step
    card.reps += 1
    if rating == Review.Rating.AGAIN and before.state == State.REVIEW:
        card.lapses += 1
    card.save()

    if rating == Review.Rating.AGAIN:
        remediation.start(card, review)
    return review
