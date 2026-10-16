from django.db import models

from r2dliu.utils.models import AbstractBaseModel

# ---------------------------------------------------------------------------
# Reference data (loaded by `manage.py load_chinese_data`)
# ---------------------------------------------------------------------------


class Character(AbstractBaseModel):
    hanzi = models.CharField(max_length=4, unique=True)
    traditional = models.CharField(max_length=4, blank=True)
    # Tone-marked readings, most common first, e.g. ["xíng", "háng"]
    pinyin = models.JSONField(default=list)
    # Same readings with tone numbers; used to check typed answers
    pinyin_numbered = models.JSONField(default=list)
    definition = models.TextField(blank=True)
    # Rank in SUBTLEX-CH (film subtitles, i.e. spoken usage). 1 = most common.
    frequency_rank = models.PositiveIntegerField(null=True, db_index=True)
    # Rank in Jun Da's Modern Chinese character list (written usage).
    written_frequency_rank = models.PositiveIntegerField(null=True, db_index=True)
    hsk_level = models.PositiveSmallIntegerField(null=True)
    stroke_count = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["frequency_rank"]

    def __str__(self):
        return self.hanzi


class Stroke(AbstractBaseModel):
    """One stroke of a character, from Make Me a Hanzi.

    `path` is an SVG outline in a 1024x1024 box; `median` is the centre line
    the learner's drawing is matched against.
    """

    character = models.ForeignKey(
        Character, on_delete=models.CASCADE, related_name="strokes"
    )
    order = models.PositiveSmallIntegerField()
    path = models.TextField()
    median = models.JSONField()
    is_radical = models.BooleanField(default=False)

    class Meta:
        ordering = ["character", "order"]
        constraints = [
            models.UniqueConstraint(
                fields=["character", "order"], name="unique_stroke_order"
            )
        ]


class Word(AbstractBaseModel):
    simplified = models.CharField(max_length=32, unique=True)
    traditional = models.CharField(max_length=32, blank=True)
    pinyin = models.CharField(max_length=128)
    pinyin_numbered = models.JSONField(default=list)
    definition = models.TextField()
    frequency_rank = models.PositiveIntegerField(null=True, db_index=True)
    hsk_level = models.PositiveSmallIntegerField(null=True)
    characters = models.ManyToManyField(
        Character, through="WordCharacter", related_name="words"
    )

    class Meta:
        ordering = ["frequency_rank"]

    def __str__(self):
        return self.simplified


class WordCharacter(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    character = models.ForeignKey(Character, on_delete=models.CASCADE)
    position = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ["word", "position"]
        constraints = [
            models.UniqueConstraint(
                fields=["word", "position"], name="unique_word_position"
            )
        ]


# ---------------------------------------------------------------------------
# Study data
# ---------------------------------------------------------------------------


class Deck(AbstractBaseModel):
    class CardKind(models.TextChoices):
        CHARACTER = "CHARACTER"
        WORD = "WORD"

    name = models.CharField(max_length=200)
    card_kind = models.CharField(max_length=16, choices=CardKind.choices)
    new_cards_per_day = models.PositiveIntegerField(default=20)
    # Learning steps for new cards, in minutes (Anki's "1m 10m")
    learning_steps = models.JSONField(default=list)
    graduating_interval_days = models.FloatField(default=1)
    easy_interval_days = models.FloatField(default=4)
    # How long a failed review card waits before it is shown again
    relearn_delay_minutes = models.PositiveIntegerField(default=60)
    # Ordered list of tasks required after pressing "Again", e.g.
    # [{"type": "DRAW_STROKES", "repetitions": 1, ...},
    #  {"type": "EXPLORE_RELATED", "minOpened": 3, ...}]
    # See remediation.STEP_DEFAULTS for the supported types and options.
    failure_steps = models.JSONField(default=list)

    def __str__(self):
        return self.name


class Card(AbstractBaseModel):
    class State(models.TextChoices):
        NEW = "NEW"
        LEARNING = "LEARNING"
        REVIEW = "REVIEW"
        RELEARNING = "RELEARNING"

    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name="cards")
    character = models.ForeignKey(
        Character, null=True, blank=True, on_delete=models.CASCADE
    )
    word = models.ForeignKey(Word, null=True, blank=True, on_delete=models.CASCADE)
    state = models.CharField(max_length=16, choices=State.choices, default=State.NEW)
    due = models.DateTimeField(db_index=True)
    interval_days = models.FloatField(default=0)
    ease = models.FloatField(default=2.5)
    step = models.PositiveSmallIntegerField(default=0)
    reps = models.PositiveIntegerField(default=0)
    lapses = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["deck", "character"], name="unique_deck_character"
            ),
            models.UniqueConstraint(fields=["deck", "word"], name="unique_deck_word"),
            models.CheckConstraint(
                check=models.Q(character__isnull=False, word__isnull=True)
                | models.Q(character__isnull=True, word__isnull=False),
                name="card_has_one_subject",
            ),
        ]

    @property
    def subject(self) -> Character | Word:
        return self.character or self.word

    @property
    def hanzi(self) -> str:
        return self.character.hanzi if self.character else self.word.simplified

    def subject_characters(self) -> list[Character]:
        if self.character:
            return [self.character]
        return list(
            self.word.characters.order_by("wordcharacter__position").prefetch_related(
                "strokes"
            )
        )


class Review(AbstractBaseModel):
    class Rating(models.TextChoices):
        AGAIN = "AGAIN"
        HARD = "HARD"
        GOOD = "GOOD"
        EASY = "EASY"

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="reviews")
    rating = models.CharField(max_length=8, choices=Rating.choices)
    state_before = models.CharField(max_length=16, choices=Card.State.choices)
    interval_before = models.FloatField()
    interval_after = models.FloatField()
    due_after = models.DateTimeField()
    duration_ms = models.PositiveIntegerField(null=True)

    class Meta:
        ordering = ["-datetime_created"]


class Remediation(AbstractBaseModel):
    """The tasks a learner must finish after failing a card.

    `steps` is a snapshot of the deck's failure config at the time of the
    failure, so editing the deck doesn't change an in-progress remediation.
    `progress` holds one dict per step (see remediation.py).
    """

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE"
        COMPLETED = "COMPLETED"

    card = models.ForeignKey(
        Card, on_delete=models.CASCADE, related_name="remediations"
    )
    review = models.OneToOneField(Review, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.ACTIVE
    )
    steps = models.JSONField()
    progress = models.JSONField()
    current_step = models.PositiveSmallIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            # Only one open remediation per card at a time
            models.UniqueConstraint(
                fields=["card"],
                condition=models.Q(status="ACTIVE"),
                name="one_active_remediation_per_card",
            )
        ]
