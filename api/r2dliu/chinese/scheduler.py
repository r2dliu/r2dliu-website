"""Anki-style (SM-2) spaced repetition scheduling.

`schedule()` is pure: it takes a card's current scheduling fields and returns
the new ones, so it can also be used to preview what each button would do.
"""

from dataclasses import dataclass, replace
from datetime import datetime, timedelta

from r2dliu.chinese.models import Card, Deck, Review

MIN_EASE = 1.3
DEFAULT_LEARNING_STEPS = [1, 10]
HARD_INTERVAL_FACTOR = 1.2
EASY_BONUS = 1.3
# A lapsed card's interval is multiplied by this once it is relearned
LAPSE_INTERVAL_FACTOR = 0.5

State = Card.State
Rating = Review.Rating


@dataclass(frozen=True)
class Schedule:
    state: str
    due: datetime
    interval_days: float
    ease: float
    step: int


def from_card(card: Card) -> Schedule:
    return Schedule(card.state, card.due, card.interval_days, card.ease, card.step)


def _steps(deck: Deck) -> list[float]:
    return deck.learning_steps or DEFAULT_LEARNING_STEPS


def schedule(s: Schedule, rating: str, deck: Deck, now: datetime) -> Schedule:
    if s.state in (State.NEW, State.LEARNING):
        return _learning(s, rating, deck, now)
    if s.state == State.RELEARNING:
        return _relearning(s, rating, deck, now)
    return _review(s, rating, deck, now)


def _graduate(s: Schedule, interval: float, now: datetime) -> Schedule:
    return replace(
        s,
        state=State.REVIEW,
        interval_days=interval,
        due=now + timedelta(days=interval),
        step=0,
    )


def _learning(s: Schedule, rating: str, deck: Deck, now: datetime) -> Schedule:
    steps = _steps(deck)
    step = min(s.step, len(steps) - 1)
    if rating == Rating.AGAIN:
        return replace(
            s, state=State.LEARNING, step=0, due=now + timedelta(minutes=steps[0])
        )
    if rating == Rating.HARD:
        # Repeat the current step; on the first step use the average of the
        # first two, like Anki.
        delay = steps[step]
        if step == 0 and len(steps) > 1:
            delay = (steps[0] + steps[1]) / 2
        return replace(s, state=State.LEARNING, due=now + timedelta(minutes=delay))
    if rating == Rating.EASY:
        return _graduate(s, deck.easy_interval_days, now)
    # GOOD
    if step + 1 < len(steps):
        return replace(
            s,
            state=State.LEARNING,
            step=step + 1,
            due=now + timedelta(minutes=steps[step + 1]),
        )
    return _graduate(s, deck.graduating_interval_days, now)


def _relearning(s: Schedule, rating: str, deck: Deck, now: datetime) -> Schedule:
    if rating == Rating.AGAIN:
        return replace(s, due=now + timedelta(minutes=deck.relearn_delay_minutes))
    return _graduate(s, max(1.0, s.interval_days), now)


def _review(s: Schedule, rating: str, deck: Deck, now: datetime) -> Schedule:
    interval = max(s.interval_days, 1.0)
    if rating == Rating.AGAIN:
        return replace(
            s,
            state=State.RELEARNING,
            ease=max(MIN_EASE, s.ease - 0.2),
            interval_days=max(1.0, interval * LAPSE_INTERVAL_FACTOR),
            due=now + timedelta(minutes=deck.relearn_delay_minutes),
            step=0,
        )
    if rating == Rating.HARD:
        ease = max(MIN_EASE, s.ease - 0.15)
        new_interval = interval * HARD_INTERVAL_FACTOR
    elif rating == Rating.GOOD:
        ease = s.ease
        new_interval = max(interval * s.ease, interval + 1)
    else:
        ease = s.ease + 0.15
        new_interval = max(interval * s.ease * EASY_BONUS, interval + 2)
    return replace(
        s,
        ease=ease,
        interval_days=round(new_interval, 2),
        due=now + timedelta(days=new_interval),
    )


def preview(card: Card, deck: Deck, now: datetime) -> dict[str, timedelta]:
    """How long until the card is due again for each possible rating."""
    current = from_card(card)
    return {r: schedule(current, r, deck, now).due - now for r in Rating.values}
