import uuid

import graphene
from django.utils import timezone
from graphene.types.generic import GenericScalar
from graphql import GraphQLError

from r2dliu.chinese import remediation, scheduler, study
from r2dliu.chinese.models import Card, Character, Deck, Learner, Word

LEARNER_HEADER = "X-Learner-Id"


def get_learner(info) -> Learner:
    request = info.context
    if hasattr(request, "learner"):
        return request.learner
    raw = request.headers.get(LEARNER_HEADER)
    try:
        learner_id = uuid.UUID(raw)
    except (TypeError, ValueError):
        raise GraphQLError(f"Missing or invalid {LEARNER_HEADER} header")
    request.learner, _ = Learner.objects.get_or_create(pk=learner_id)
    return request.learner


def get_deck(info, deck_id) -> Deck:
    try:
        return Deck.objects.get(pk=deck_id, learner=get_learner(info))
    except (Deck.DoesNotExist, ValueError):
        raise GraphQLError("Deck not found")


def get_card(info, card_id) -> Card:
    try:
        return Card.objects.select_related("deck", "character", "word").get(
            pk=card_id, deck__learner=get_learner(info)
        )
    except (Card.DoesNotExist, ValueError):
        raise GraphQLError("Card not found")


def _humanize(delta) -> str:
    """Anki-style button label: '<1m', '10m', '1h', '3.5d', '2.1mo'."""
    seconds = delta.total_seconds()
    if seconds < 60:
        return "<1m"
    if seconds < 3600:
        return f"{round(seconds / 60)}m"
    if seconds < 86400:
        return f"{round(seconds / 3600)}h"
    if seconds < 30 * 86400:
        return f"{seconds / 86400:.1f}".removesuffix(".0") + "d"
    return f"{seconds / (30 * 86400):.1f}".removesuffix(".0") + "mo"


# ---------------------------------------------------------------------------
# Reference data types
# ---------------------------------------------------------------------------


class CharacterType(graphene.ObjectType):
    id = graphene.ID(required=True)
    hanzi = graphene.String(required=True)
    traditional = graphene.String()
    pinyin = graphene.List(graphene.NonNull(graphene.String), required=True)
    definition = graphene.String(required=True)
    frequency_rank = graphene.Int()
    written_frequency_rank = graphene.Int()
    hsk_level = graphene.Int()
    stroke_count = graphene.Int(required=True)
    stroke_data = GenericScalar(
        description="Hanzi Writer character data: {strokes, medians, radStrokes}"
    )
    words = graphene.List(
        graphene.NonNull(lambda: WordType),
        required=True,
        limit=graphene.Int(default_value=10),
        description="Most common words containing this character",
    )

    def resolve_stroke_data(char: Character, info):
        strokes = list(char.strokes.all())
        return {
            "strokes": [s.path for s in strokes],
            "medians": [s.median for s in strokes],
            "radStrokes": [s.order for s in strokes if s.is_radical],
        }

    def resolve_words(char: Character, info, limit):
        return (
            char.words.filter(frequency_rank__isnull=False)
            .exclude(simplified=char.hanzi)
            .order_by("frequency_rank")[: min(limit, 50)]
        )


class WordType(graphene.ObjectType):
    id = graphene.ID(required=True)
    simplified = graphene.String(required=True)
    traditional = graphene.String()
    pinyin = graphene.String(required=True)
    definition = graphene.String(required=True)
    frequency_rank = graphene.Int()
    hsk_level = graphene.Int()
    characters = graphene.List(graphene.NonNull(CharacterType), required=True)

    def resolve_characters(word: Word, info):
        return word.characters.order_by("wordcharacter__position")


class RelatedItemType(graphene.ObjectType):
    key = graphene.String(required=True)
    kind = graphene.String(required=True, description="CHARACTER or WORD")
    hanzi = graphene.String(required=True)
    pinyin = graphene.String(required=True)
    definition = graphene.String(required=True)
    frequency_rank = graphene.Int()
    hsk_level = graphene.Int()
    character = graphene.Field(CharacterType)
    word = graphene.Field(WordType)

    @staticmethod
    def build(item: Character | Word):
        is_char = isinstance(item, Character)
        return RelatedItemType(
            key=remediation.item_key(item),
            kind="CHARACTER" if is_char else "WORD",
            hanzi=item.hanzi if is_char else item.simplified,
            pinyin=" / ".join(item.pinyin) if is_char else item.pinyin,
            definition=item.definition,
            frequency_rank=item.frequency_rank,
            hsk_level=item.hsk_level,
            character=item if is_char else None,
            word=None if is_char else item,
        )


# ---------------------------------------------------------------------------
# Study types
# ---------------------------------------------------------------------------


class IntervalPreviewType(graphene.ObjectType):
    rating = graphene.String(required=True)
    seconds = graphene.Float(required=True)
    label = graphene.String(required=True)


class CardType(graphene.ObjectType):
    id = graphene.ID(required=True)
    state = graphene.String(required=True)
    due = graphene.DateTime(required=True)
    interval_days = graphene.Float(required=True)
    ease = graphene.Float(required=True)
    reps = graphene.Int(required=True)
    lapses = graphene.Int(required=True)
    hanzi = graphene.String(required=True)
    character = graphene.Field(CharacterType)
    word = graphene.Field(WordType)
    interval_preview = graphene.List(
        graphene.NonNull(IntervalPreviewType), required=True
    )

    def resolve_interval_preview(card: Card, info):
        preview = scheduler.preview(card, card.deck, timezone.now())
        return [
            IntervalPreviewType(rating=r, seconds=d.total_seconds(), label=_humanize(d))
            for r, d in preview.items()
        ]


class RemediationStepType(graphene.ObjectType):
    index = graphene.Int(required=True)
    type = graphene.String(required=True)
    config = GenericScalar(required=True)
    required = graphene.Int(required=True)
    done = graphene.Int(required=True)
    satisfied = graphene.Boolean(required=True)
    # DRAW_STROKES
    draw_targets = graphene.List(graphene.NonNull(graphene.String))
    draw_progress = GenericScalar(description="{hanzi: clean drawings so far}")
    # EXPLORE_RELATED
    related_items = graphene.List(graphene.NonNull(RelatedItemType))
    opened_keys = graphene.List(graphene.NonNull(graphene.String))
    # TYPE_PINYIN
    attempts = graphene.Int()


class RemediationType(graphene.ObjectType):
    id = graphene.ID(required=True)
    status = graphene.String(required=True)
    current_step = graphene.Int(required=True)
    card = graphene.Field(CardType, required=True)
    steps = graphene.List(graphene.NonNull(RemediationStepType), required=True)

    def resolve_steps(rem, info):
        out = []
        for i, (step, progress) in enumerate(zip(rem.steps, rem.progress)):
            required = remediation.required_count(step, progress)
            done = remediation.done_count(step, progress)
            node = RemediationStepType(
                index=i,
                type=step["type"],
                config=step,
                required=required,
                done=min(done, required),
                satisfied=done >= required,
            )
            if step["type"] == remediation.DRAW_STROKES:
                node.draw_targets = list(progress["completed"])
                node.draw_progress = progress["completed"]
            elif step["type"] == remediation.EXPLORE_RELATED:
                node.related_items = [
                    RelatedItemType.build(item)
                    for item in remediation.load_items(progress["items"])
                ]
                node.opened_keys = progress["opened"]
            elif step["type"] == remediation.TYPE_PINYIN:
                node.attempts = progress["attempts"]
            out.append(node)
        return out


class DeckType(graphene.ObjectType):
    id = graphene.ID(required=True)
    name = graphene.String(required=True)
    card_kind = graphene.String(required=True)
    new_cards_per_day = graphene.Int(required=True)
    learning_steps = graphene.List(graphene.NonNull(graphene.Float), required=True)
    graduating_interval_days = graphene.Float(required=True)
    easy_interval_days = graphene.Float(required=True)
    relearn_delay_minutes = graphene.Int(required=True)
    failure_steps = GenericScalar(required=True)
    card_count = graphene.Int(required=True)

    def resolve_learning_steps(deck, info):
        return deck.learning_steps or scheduler.DEFAULT_LEARNING_STEPS

    def resolve_card_count(deck, info):
        return deck.cards.exclude(state=Card.State.NEW).count()


class QueueCountsType(graphene.ObjectType):
    new = graphene.Int(required=True)
    learning = graphene.Int(required=True)
    review = graphene.Int(required=True)


class StudyStateType(graphene.ObjectType):
    deck = graphene.Field(DeckType, required=True)
    card = graphene.Field(CardType, description="Card to show, if any")
    remediation = graphene.Field(
        RemediationType, description="Failure tasks blocking the queue, if any"
    )
    counts = graphene.Field(QueueCountsType, required=True)
    next_due_at = graphene.DateTime()


class FailureStepTypeInfo(graphene.ObjectType):
    type = graphene.String(required=True)
    defaults = GenericScalar(required=True)


# ---------------------------------------------------------------------------
# Query
# ---------------------------------------------------------------------------


class Query(graphene.ObjectType):
    character = graphene.Field(CharacterType, hanzi=graphene.String(required=True))
    word = graphene.Field(WordType, simplified=graphene.String(required=True))
    decks = graphene.List(graphene.NonNull(DeckType), required=True)
    deck = graphene.Field(DeckType, id=graphene.ID(required=True))
    study = graphene.Field(StudyStateType, deck_id=graphene.ID(required=True))
    failure_step_types = graphene.List(
        graphene.NonNull(FailureStepTypeInfo), required=True
    )

    def resolve_character(root, info, hanzi):
        return Character.objects.filter(hanzi=hanzi).first()

    def resolve_word(root, info, simplified):
        return Word.objects.filter(simplified=simplified).first()

    def resolve_decks(root, info):
        return get_learner(info).decks.order_by("datetime_created")

    def resolve_deck(root, info, id):
        return get_deck(info, id)

    def resolve_study(root, info, deck_id):
        return study.get_state(get_deck(info, deck_id))

    def resolve_failure_step_types(root, info):
        return [
            FailureStepTypeInfo(type=t, defaults=d)
            for t, d in remediation.STEP_DEFAULTS.items()
        ]


# ---------------------------------------------------------------------------
# Mutations
# ---------------------------------------------------------------------------


class DeckInput(graphene.InputObjectType):
    name = graphene.String()
    card_kind = graphene.String(description="CHARACTER or WORD (create only)")
    new_cards_per_day = graphene.Int()
    learning_steps = graphene.List(graphene.NonNull(graphene.Float))
    graduating_interval_days = graphene.Float()
    easy_interval_days = graphene.Float()
    relearn_delay_minutes = graphene.Int()
    failure_steps = GenericScalar()


def _apply_deck_input(deck: Deck, data: DeckInput):
    for field in (
        "name",
        "new_cards_per_day",
        "graduating_interval_days",
        "easy_interval_days",
        "relearn_delay_minutes",
    ):
        if data.get(field) is not None:
            setattr(deck, field, data[field])
    if data.get("learning_steps") is not None:
        if not data.learning_steps or any(s <= 0 for s in data.learning_steps):
            raise GraphQLError("learningSteps must be positive minutes")
        deck.learning_steps = data.learning_steps
    if data.get("failure_steps") is not None:
        try:
            deck.failure_steps = remediation.validate_steps(data.failure_steps)
        except remediation.RemediationError as e:
            raise GraphQLError(str(e))


class CreateDeck(graphene.Mutation):
    class Arguments:
        input = DeckInput(required=True)

    deck = graphene.Field(DeckType, required=True)

    def mutate(root, info, input):
        if input.get("card_kind") not in Deck.CardKind.values:
            raise GraphQLError("cardKind must be CHARACTER or WORD")
        deck = Deck(
            learner=get_learner(info),
            name=input.get("name") or "My deck",
            card_kind=input.card_kind,
            learning_steps=scheduler.DEFAULT_LEARNING_STEPS,
            failure_steps=remediation.validate_steps(
                [{"type": remediation.DRAW_STROKES}]
            ),
        )
        _apply_deck_input(deck, input)
        deck.save()
        return CreateDeck(deck=deck)


class UpdateDeck(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        input = DeckInput(required=True)

    deck = graphene.Field(DeckType, required=True)

    def mutate(root, info, id, input):
        deck = get_deck(info, id)
        _apply_deck_input(deck, input)
        deck.save()
        return UpdateDeck(deck=deck)


class DeleteDeck(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean(required=True)

    def mutate(root, info, id):
        get_deck(info, id).delete()
        return DeleteDeck(ok=True)


class AnswerCard(graphene.Mutation):
    class Arguments:
        card_id = graphene.ID(required=True)
        rating = graphene.String(required=True, description="AGAIN/HARD/GOOD/EASY")
        duration_ms = graphene.Int()

    study = graphene.Field(StudyStateType, required=True)

    def mutate(root, info, card_id, rating, duration_ms=None):
        card = get_card(info, card_id)
        try:
            study.answer(card, rating, duration_ms)
        except study.StudyError as e:
            raise GraphQLError(str(e))
        return AnswerCard(study=study.get_state(card.deck))


class AddToDeck(graphene.Mutation):
    """Add a character/word (e.g. from a related list) as a new card."""

    class Arguments:
        deck_id = graphene.ID(required=True)
        hanzi = graphene.String(required=True)

    card = graphene.Field(CardType, required=True)

    def mutate(root, info, deck_id, hanzi):
        deck = get_deck(info, deck_id)
        subject = (
            Character.objects.filter(hanzi=hanzi).first()
            if deck.card_kind == Deck.CardKind.CHARACTER
            else Word.objects.filter(simplified=hanzi).first()
        )
        if not subject:
            raise GraphQLError(f"{hanzi} isn't a {deck.card_kind.lower()}")
        return AddToDeck(card=study.add_card(deck, subject, timezone.now()))


def _remediation_call(fn, *args):
    try:
        return fn(*args)
    except remediation.RemediationError as e:
        raise GraphQLError(str(e))
    except remediation.Remediation.DoesNotExist:
        raise GraphQLError("Remediation not found")


class CompleteStrokeQuiz(graphene.Mutation):
    class Arguments:
        remediation_id = graphene.ID(required=True)
        hanzi = graphene.String(required=True)
        mistakes = graphene.Int(required=True)

    remediation = graphene.Field(RemediationType, required=True)
    counted = graphene.Boolean(
        required=True, description="False when the drawing had too many mistakes"
    )
    study = graphene.Field(StudyStateType, required=True)

    def mutate(root, info, remediation_id, hanzi, mistakes):
        rem, counted = _remediation_call(
            remediation.complete_stroke_quiz,
            remediation_id,
            get_learner(info),
            hanzi,
            mistakes,
        )
        return CompleteStrokeQuiz(
            remediation=rem, counted=counted, study=study.get_state(rem.card.deck)
        )


class OpenRelatedItem(graphene.Mutation):
    class Arguments:
        remediation_id = graphene.ID(required=True)
        key = graphene.String(required=True)

    remediation = graphene.Field(RemediationType, required=True)
    study = graphene.Field(StudyStateType, required=True)

    def mutate(root, info, remediation_id, key):
        rem = _remediation_call(
            remediation.open_related, remediation_id, get_learner(info), key
        )
        return OpenRelatedItem(remediation=rem, study=study.get_state(rem.card.deck))


class SubmitPinyin(graphene.Mutation):
    class Arguments:
        remediation_id = graphene.ID(required=True)
        answer = graphene.String(required=True)

    remediation = graphene.Field(RemediationType, required=True)
    correct = graphene.Boolean(required=True)
    expected = graphene.String(required=True)
    study = graphene.Field(StudyStateType, required=True)

    def mutate(root, info, remediation_id, answer):
        rem, correct, expected = _remediation_call(
            remediation.submit_pinyin, remediation_id, get_learner(info), answer
        )
        return SubmitPinyin(
            remediation=rem,
            correct=correct,
            expected=expected,
            study=study.get_state(rem.card.deck),
        )


class Mutation(graphene.ObjectType):
    create_deck = CreateDeck.Field()
    update_deck = UpdateDeck.Field()
    delete_deck = DeleteDeck.Field()
    answer_card = AnswerCard.Field()
    add_to_deck = AddToDeck.Field()
    complete_stroke_quiz = CompleteStrokeQuiz.Field()
    open_related_item = OpenRelatedItem.Field()
    submit_pinyin = SubmitPinyin.Field()
