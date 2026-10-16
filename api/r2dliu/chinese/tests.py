import json
import uuid
from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from r2dliu.chinese import pinyin, remediation, scheduler
from r2dliu.chinese.models import (
    Card,
    Character,
    Deck,
    Learner,
    Remediation,
    Stroke,
    Word,
    WordCharacter,
)

AGAIN, HARD, GOOD, EASY = "AGAIN", "HARD", "GOOD", "EASY"


class PinyinTests(TestCase):
    def test_numbered_to_marked(self):
        self.assertEqual(pinyin.numbered_to_marked("ni3 hao3"), "nǐ hǎo")
        self.assertEqual(pinyin.numbered_to_marked("lu:4"), "lǜ")
        self.assertEqual(pinyin.numbered_to_marked("gou3"), "gǒu")
        self.assertEqual(pinyin.numbered_to_marked("le5"), "le")

    def test_matches_accepts_marks_numbers_and_spacing(self):
        for answer in ["ni3hao3", "Nǐ hǎo", "nǐhǎo", "ni3 hao3"]:
            self.assertTrue(pinyin.matches(answer, ["ni3 hao3"]), answer)

    def test_matches_requires_tones(self):
        self.assertFalse(pinyin.matches("ni hao", ["ni3 hao3"]))
        self.assertFalse(pinyin.matches("ni2hao3", ["ni3 hao3"]))
        self.assertFalse(pinyin.matches("", ["le5"]))
        self.assertTrue(pinyin.matches("le", ["le5"]))


class SchedulerTests(TestCase):
    def setUp(self):
        self.deck = Deck(
            learning_steps=[1, 10],
            graduating_interval_days=1,
            easy_interval_days=4,
            relearn_delay_minutes=60,
        )
        self.now = timezone.now()

    def s(self, state, interval=0.0, step=0, ease=2.5):
        return scheduler.Schedule(state, self.now, interval, ease, step)

    def test_new_card_steps_then_graduates(self):
        s = scheduler.schedule(self.s("NEW"), GOOD, self.deck, self.now)
        self.assertEqual((s.state, s.step), ("LEARNING", 1))
        self.assertEqual(s.due - self.now, timedelta(minutes=10))
        s = scheduler.schedule(s, GOOD, self.deck, self.now)
        self.assertEqual(s.state, "REVIEW")
        self.assertEqual(s.interval_days, 1)

    def test_easy_graduates_immediately(self):
        s = scheduler.schedule(self.s("NEW"), EASY, self.deck, self.now)
        self.assertEqual((s.state, s.interval_days), ("REVIEW", 4))

    def test_review_lapse_uses_relearn_delay(self):
        s = scheduler.schedule(
            self.s("REVIEW", interval=10), AGAIN, self.deck, self.now
        )
        self.assertEqual(s.state, "RELEARNING")
        self.assertEqual(s.due - self.now, timedelta(minutes=60))
        self.assertEqual(s.interval_days, 5)
        self.assertAlmostEqual(s.ease, 2.3)
        s = scheduler.schedule(s, GOOD, self.deck, self.now)
        self.assertEqual((s.state, s.interval_days), ("REVIEW", 5))

    def test_review_intervals_grow(self):
        good = scheduler.schedule(self.s("REVIEW", 10), GOOD, self.deck, self.now)
        hard = scheduler.schedule(self.s("REVIEW", 10), HARD, self.deck, self.now)
        easy = scheduler.schedule(self.s("REVIEW", 10), EASY, self.deck, self.now)
        self.assertEqual(good.interval_days, 25)
        self.assertLess(hard.interval_days, good.interval_days)
        self.assertGreater(easy.interval_days, good.interval_days)


class ValidateStepsTests(TestCase):
    def test_fills_defaults_and_clamps(self):
        steps = remediation.validate_steps(
            [{"type": "EXPLORE_RELATED", "minOpened": 99}, {"type": "DRAW_STROKES"}]
        )
        self.assertEqual(steps[0]["minOpened"], 50)
        self.assertEqual(steps[0]["maxItems"], 50)
        self.assertEqual(steps[1]["repetitions"], 1)

    def test_rejects_unknown_type(self):
        with self.assertRaises(remediation.RemediationError):
            remediation.validate_steps([{"type": "DANCE"}])


def make_char(hanzi, rank, readings=("ni3",)):
    char = Character.objects.create(
        hanzi=hanzi,
        pinyin=[pinyin.numbered_to_marked(r) for r in readings],
        pinyin_numbered=list(readings),
        definition=f"def of {hanzi}",
        frequency_rank=rank,
        stroke_count=2,
    )
    for i in range(2):
        Stroke.objects.create(character=char, order=i, path="M 0 0 Z", median=[[0, 0]])
    return char


def make_word(simplified, rank, chars, reading):
    word = Word.objects.create(
        simplified=simplified,
        pinyin=pinyin.numbered_to_marked(reading),
        pinyin_numbered=[reading],
        definition=f"def of {simplified}",
        frequency_rank=rank,
    )
    for i, c in enumerate(chars):
        WordCharacter.objects.create(word=word, character=c, position=i)
    return word


class StudyFlowTests(TestCase):
    """End-to-end through GraphQL: fail a card, do the tasks, get unblocked."""

    def setUp(self):
        self.ni = make_char("你", 2, ("ni3",))
        self.hao = make_char("好", 1, ("hao3", "hao4"))
        self.men = make_char("们", 3, ("men5",))
        make_word("你好", 1, [self.ni, self.hao], "ni3 hao3")
        make_word("你们", 2, [self.ni, self.men], "ni3 men5")
        make_word("好人", 3, [self.hao], "hao3 ren2")
        self.learner_id = str(uuid.uuid4())

    def gql(self, query, **variables):
        resp = self.client.post(
            "/graphql",
            json.dumps({"query": query, "variables": variables}),
            content_type="application/json",
            headers={"X-Learner-Id": self.learner_id},
        )
        body = resp.json()
        return body.get("data"), body.get("errors")

    STUDY = """
        card { id hanzi state intervalPreview { rating label } }
        remediation { id status currentStep steps {
            type required done satisfied drawTargets openedKeys
            relatedItems { key hanzi } } }
        counts { new learning review }
    """

    def create_deck(self, kind, failure_steps):
        data, errors = self.gql(
            """mutation($input: DeckInput!) {
                createDeck(input: $input) { deck { id failureSteps } } }""",
            input={"name": "t", "cardKind": kind, "failureSteps": failure_steps},
        )
        self.assertIsNone(errors)
        return data["createDeck"]["deck"]["id"]

    def study(self, deck_id):
        data, errors = self.gql(
            f"query($d: ID!) {{ study(deckId: $d) {{ {self.STUDY} }} }}", d=deck_id
        )
        self.assertIsNone(errors)
        return data["study"]

    def answer(self, card_id, rating):
        return self.gql(
            f"""mutation($c: ID!, $r: String!) {{
                answerCard(cardId: $c, rating: $r) {{ study {{ {self.STUDY} }} }} }}""",
            c=card_id,
            r=rating,
        )

    def test_requires_learner_header(self):
        self.learner_id = "nope"
        _, errors = self.gql("{ decks { id } }")
        self.assertIn("X-Learner-Id", errors[0]["message"])

    def test_new_cards_follow_frequency_order(self):
        deck_id = self.create_deck("CHARACTER", [])
        state = self.study(deck_id)
        self.assertEqual(state["card"]["hanzi"], "好")
        _, errors = self.answer(state["card"]["id"], "EASY")
        self.assertIsNone(errors)
        self.assertEqual(self.study(deck_id)["card"]["hanzi"], "你")

    def test_failure_blocks_until_all_steps_done(self):
        deck_id = self.create_deck(
            "WORD",
            [
                {"type": "DRAW_STROKES", "maxMistakes": 2},
                {"type": "EXPLORE_RELATED", "minOpened": 2},
                {"type": "TYPE_PINYIN"},
            ],
        )
        card = self.study(deck_id)["card"]
        self.assertEqual(card["hanzi"], "你好")

        data, errors = self.answer(card["id"], "AGAIN")
        self.assertIsNone(errors)
        rem = data["answerCard"]["study"]["remediation"]
        self.assertEqual(rem["status"], "ACTIVE")
        draw, explore, typing = rem["steps"]
        self.assertEqual(draw["drawTargets"], ["你", "好"])
        related = [i["hanzi"] for i in explore["relatedItems"]]
        self.assertEqual(related[:2], ["你", "好"])  # component characters first
        self.assertIn("你们", related)
        self.assertNotIn("你好", related)

        # The queue is blocked while the remediation is active
        _, errors = self.answer(card["id"], "GOOD")
        self.assertIn("Finish the failure tasks", errors[0]["message"])

        # Steps must be done in order
        _, errors = self.gql(
            'mutation($r: ID!) { submitPinyin(remediationId: $r, answer: "x") { correct } }',
            r=rem["id"],
        )
        self.assertIn("Current step is DRAW_STROKES", errors[0]["message"])

        draw_q = """mutation($r: ID!, $h: String!, $m: Int!) {
            completeStrokeQuiz(remediationId: $r, hanzi: $h, mistakes: $m) {
                counted remediation { currentStep } } }"""
        data, _ = self.gql(draw_q, r=rem["id"], h="你", m=5)
        self.assertFalse(data["completeStrokeQuiz"]["counted"])
        self.gql(draw_q, r=rem["id"], h="你", m=0)
        data, _ = self.gql(draw_q, r=rem["id"], h="好", m=2)
        self.assertEqual(data["completeStrokeQuiz"]["remediation"]["currentStep"], 1)

        open_q = """mutation($r: ID!, $k: String!) {
            openRelatedItem(remediationId: $r, key: $k) { remediation { currentStep } } }"""
        keys = [i["key"] for i in explore["relatedItems"]]
        _, errors = self.gql(open_q, r=rem["id"], k="W:" + str(uuid.uuid4()))
        self.assertIsNotNone(errors)
        self.gql(open_q, r=rem["id"], k=keys[0])
        data, _ = self.gql(open_q, r=rem["id"], k=keys[0])  # repeat doesn't count
        self.assertEqual(data["openRelatedItem"]["remediation"]["currentStep"], 1)
        data, _ = self.gql(open_q, r=rem["id"], k=keys[1])
        self.assertEqual(data["openRelatedItem"]["remediation"]["currentStep"], 2)

        pinyin_q = """mutation($r: ID!, $a: String!) {
            submitPinyin(remediationId: $r, answer: $a) {
                correct expected study { remediation { id } card { hanzi } } } }"""
        data, _ = self.gql(pinyin_q, r=rem["id"], a="ni hao")
        self.assertFalse(data["submitPinyin"]["correct"])
        self.assertEqual(data["submitPinyin"]["expected"], "nǐ hǎo")
        data, _ = self.gql(pinyin_q, r=rem["id"], a="nǐhǎo")
        result = data["submitPinyin"]
        self.assertTrue(result["correct"])
        self.assertIsNone(result["study"]["remediation"])
        self.assertEqual(
            Remediation.objects.get(pk=rem["id"]).status, Remediation.Status.COMPLETED
        )
        # Next card is a new one; the failed card waits for its learning step
        self.assertEqual(result["study"]["card"]["hanzi"], "你们")

    def test_no_failure_steps_means_plain_anki(self):
        deck_id = self.create_deck("CHARACTER", [])
        card = self.study(deck_id)["card"]
        data, _ = self.answer(card["id"], "AGAIN")
        self.assertIsNone(data["answerCard"]["study"]["remediation"])

    def test_learners_are_isolated(self):
        deck_id = self.create_deck("CHARACTER", [])
        self.learner_id = str(uuid.uuid4())
        _, errors = self.gql(
            "query($d: ID!) { study(deckId: $d) { counts { new } } }", d=deck_id
        )
        self.assertEqual(errors[0]["message"], "Deck not found")

    def test_add_to_deck_comes_before_frequency_order(self):
        deck_id = self.create_deck("CHARACTER", [])
        data, errors = self.gql(
            'mutation($d: ID!) { addToDeck(deckId: $d, hanzi: "们") { card { hanzi } } }',
            d=deck_id,
        )
        self.assertIsNone(errors)
        self.assertEqual(self.study(deck_id)["card"]["hanzi"], "们")

    def test_new_card_daily_limit(self):
        deck_id = self.create_deck("CHARACTER", [])
        Deck.objects.filter(pk=deck_id).update(new_cards_per_day=1)
        card = self.study(deck_id)["card"]
        self.answer(card["id"], "EASY")
        state = self.study(deck_id)
        self.assertIsNone(state["card"])
        self.assertEqual(state["counts"]["new"], 0)
        self.assertEqual(Card.objects.filter(deck_id=deck_id).count(), 1)
        self.assertTrue(Learner.objects.filter(pk=self.learner_id).exists())
