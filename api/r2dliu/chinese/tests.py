import json
import uuid
from datetime import datetime, timedelta
from datetime import timezone as dt_timezone

from django.test import TestCase
from django.utils import timezone

from r2dliu.chinese import drawing, pinyin, remediation, scheduler, study
from r2dliu.chinese.models import (
    Card,
    Character,
    Deck,
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

    def test_known_retires_card(self):
        for state in ("NEW", "LEARNING", "REVIEW", "RELEARNING"):
            s = scheduler.schedule(self.s(state, 10), "KNOWN", self.deck, self.now)
            self.assertEqual(s.state, "KNOWN")

    def test_review_intervals_grow(self):
        good = scheduler.schedule(self.s("REVIEW", 10), GOOD, self.deck, self.now)
        hard = scheduler.schedule(self.s("REVIEW", 10), HARD, self.deck, self.now)
        easy = scheduler.schedule(self.s("REVIEW", 10), EASY, self.deck, self.now)
        self.assertEqual(good.interval_days, 25)
        self.assertLess(hard.interval_days, good.interval_days)
        self.assertGreater(easy.interval_days, good.interval_days)


class DayBoundaryTests(TestCase):
    def test_day_starts_at_midnight_eastern(self):
        # 03:30 UTC on Jan 15 is still Jan 14 in New York (EST, UTC-5)
        now = datetime(2026, 1, 15, 3, 30, tzinfo=dt_timezone.utc)
        start = study._start_of_day(now)
        self.assertEqual(start, datetime(2026, 1, 14, 5, 0, tzinfo=dt_timezone.utc))
        # Daylight saving time (EDT, UTC-4)
        now = datetime(2026, 7, 15, 12, 0, tzinfo=dt_timezone.utc)
        start = study._start_of_day(now)
        self.assertEqual(start, datetime(2026, 7, 15, 4, 0, tzinfo=dt_timezone.utc))


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

    def gql(self, query, **variables):
        resp = self.client.post(
            "/graphql",
            json.dumps({"query": query, "variables": variables}),
            content_type="application/json",
        )
        body = resp.json()
        return body.get("data"), body.get("errors")

    STUDY = """
        card { id hanzi state intervalPreview { rating label } }
        remediation { id status currentStep steps {
            type required done satisfied drawTargets openedKeys
            relatedItems { key hanzi }
            relatedGroups { hanzi required done items { key hanzi } } } }
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
        # One group (tab) per character, each starting with the character
        groups = {
            g["hanzi"]: [i["hanzi"] for i in g["items"]]
            for g in explore["relatedGroups"]
        }
        self.assertEqual(groups, {"你": ["你", "你们"], "好": ["好", "好人"]})
        self.assertEqual([g["required"] for g in explore["relatedGroups"]], [2, 2])
        self.assertEqual(explore["required"], 4)

        # The queue is blocked while the remediation is active
        _, errors = self.answer(card["id"], "GOOD")
        self.assertIn("Finish the failure tasks", errors[0]["message"])

        # Steps count in order: a later one done early is just practice
        data, errors = self.gql(
            """mutation($r: ID!) { submitPinyin(remediationId: $r, answer: "ni3hao3") {
                correct remediation { currentStep steps { done } } } }""",
            r=rem["id"],
        )
        self.assertIsNone(errors)
        self.assertTrue(data["submitPinyin"]["correct"])
        self.assertEqual(data["submitPinyin"]["remediation"]["currentStep"], 0)
        self.assertEqual(data["submitPinyin"]["remediation"]["steps"][2]["done"], 0)

        draw_q = """mutation($r: ID!, $h: String!, $m: Int!) {
            completeStrokeQuiz(remediationId: $r, hanzi: $h, mistakes: $m) {
                counted remediation { currentStep } } }"""
        data, _ = self.gql(draw_q, r=rem["id"], h="你", m=5)
        self.assertFalse(data["completeStrokeQuiz"]["counted"])
        self.gql(draw_q, r=rem["id"], h="你", m=0)
        data, _ = self.gql(draw_q, r=rem["id"], h="好", m=2)
        self.assertEqual(data["completeStrokeQuiz"]["remediation"]["currentStep"], 1)

        # Drawing again after moving on is fine, and not counted
        data, errors = self.gql(draw_q, r=rem["id"], h="你", m=0)
        self.assertIsNone(errors)
        self.assertFalse(data["completeStrokeQuiz"]["counted"])
        self.assertEqual(data["completeStrokeQuiz"]["remediation"]["currentStep"], 1)

        open_q = """mutation($r: ID!, $k: String!) {
            openRelatedItem(remediationId: $r, key: $k) { remediation { currentStep } } }"""
        ni, hao = [[i["key"] for i in g["items"]] for g in explore["relatedGroups"]]
        _, errors = self.gql(open_q, r=rem["id"], k="W:" + str(uuid.uuid4()))
        self.assertIsNotNone(errors)
        self.gql(open_q, r=rem["id"], k=ni[0])
        data, _ = self.gql(open_q, r=rem["id"], k=ni[0])  # repeat doesn't count
        self.assertEqual(data["openRelatedItem"]["remediation"]["currentStep"], 1)
        # Finishing one tab isn't enough: every character's tab needs its share
        data, _ = self.gql(open_q, r=rem["id"], k=ni[1])
        self.assertEqual(data["openRelatedItem"]["remediation"]["currentStep"], 1)
        self.gql(open_q, r=rem["id"], k=hao[0])
        data, _ = self.gql(open_q, r=rem["id"], k=hao[1])
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

    def test_unknown_deck(self):
        _, errors = self.gql(
            "query($d: ID!) { study(deckId: $d) { counts { new } } }", d="nope"
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

    def test_known_card_never_comes_back(self):
        deck_id = self.create_deck("CHARACTER", [])
        card = self.study(deck_id)["card"]
        self.assertEqual(card["hanzi"], "好")
        labels = {p["rating"]: p["label"] for p in card["intervalPreview"]}
        self.assertEqual(labels["KNOWN"], "never")
        data, errors = self.answer(card["id"], "KNOWN")
        self.assertIsNone(errors)
        self.assertIsNone(data["answerCard"]["study"]["remediation"])
        self.assertEqual(data["answerCard"]["study"]["card"]["hanzi"], "你")
        self.assertEqual(Card.objects.get(pk=card["id"]).state, "KNOWN")
        # Nothing about it is due later either
        Deck.objects.filter(pk=deck_id).update(new_cards_per_day=1)
        state = self.study(deck_id)
        self.assertIsNone(state["card"])

    def test_keep_going_allows_more_new_cards(self):
        deck_id = self.create_deck("CHARACTER", [])
        Deck.objects.filter(pk=deck_id).update(new_cards_per_day=1)
        self.answer(self.study(deck_id)["card"]["id"], "EASY")
        self.assertIsNone(self.study(deck_id)["card"])

        data, errors = self.gql(
            """mutation($d: ID!) { studyMore(deckId: $d, count: 2) {
                study { card { hanzi } counts { new } } } }""",
            d=deck_id,
        )
        self.assertIsNone(errors)
        state = data["studyMore"]["study"]
        self.assertEqual(state["counts"]["new"], 2)
        self.assertEqual(state["card"]["hanzi"], "你")

    def test_related_items_for_any_card(self):
        deck_id = self.create_deck("WORD", [])
        card = self.study(deck_id)["card"]
        data, errors = self.gql(
            "query($c: ID!) { relatedItems(cardId: $c) { hanzi kind } }",
            c=card["id"],
        )
        self.assertIsNone(errors)
        hanzi = [i["hanzi"] for i in data["relatedItems"]]
        self.assertEqual(hanzi, ["你", "你们", "好", "好人"])
        data, errors = self.gql(
            "query($c: ID!) { relatedGroups(cardId: $c) { hanzi items { hanzi } } }",
            c=card["id"],
        )
        self.assertIsNone(errors)
        self.assertEqual(
            [(g["hanzi"], len(g["items"])) for g in data["relatedGroups"]],
            [("你", 2), ("好", 2)],
        )

    def test_shared_words_listed_under_one_character(self):
        # 你们好 contains both of 你好's characters: it goes in one tab only
        make_word("你们好", 4, [self.ni, self.men, self.hao], "ni3 men5 hao3")
        deck_id = self.create_deck("WORD", [])
        card = self.study(deck_id)["card"]
        data, _ = self.gql(
            "query($c: ID!) { relatedGroups(cardId: $c) { hanzi items { hanzi } } }",
            c=card["id"],
        )
        groups = {g["hanzi"]: [i["hanzi"] for i in g["items"]] for g in data["relatedGroups"]}
        listed = groups["你"] + groups["好"]
        self.assertEqual(listed.count("你们好"), 1)
        self.assertEqual(groups["你"][0], "你")
        self.assertEqual(groups["好"][0], "好")

    def test_new_card_daily_limit(self):
        deck_id = self.create_deck("CHARACTER", [])
        Deck.objects.filter(pk=deck_id).update(new_cards_per_day=1)
        card = self.study(deck_id)["card"]
        self.answer(card["id"], "EASY")
        state = self.study(deck_id)
        self.assertIsNone(state["card"])
        self.assertEqual(state["counts"]["new"], 0)
        self.assertEqual(Card.objects.filter(deck_id=deck_id).count(), 1)


SHI = [[(100, 500), (900, 500)], [(500, 850), (500, 50)]]  # 十
ER = [[(250, 650), (750, 650)], [(100, 250), (900, 250)]]  # 二
REN = [[(500, 850), (450, 500), (150, 100)], [(480, 450), (850, 100)]]  # 人


def make_drawn_char(hanzi, strokes, rank):
    char = Character.objects.create(
        hanzi=hanzi,
        pinyin=["x"],
        pinyin_numbered=["x1"],
        frequency_rank=rank,
        stroke_count=len(strokes),
    )
    for i, s in enumerate(strokes):
        Stroke.objects.create(
            character=char, order=i, path="M 0 0 Z", median=[list(p) for p in s]
        )
    return char


def shifted(strokes, dx=40, dy=-30, scale=0.6):
    return [[(x * scale + dx, y * scale + dy) for x, y in s] for s in strokes]


class DrawingTests(TestCase):
    def setUp(self):
        drawing._groups = None  # recognition cache is per database
        self.shi = make_drawn_char("十", SHI, 1)
        make_drawn_char("二", ER, 2)
        make_drawn_char("人", REN, 3)

    def tearDown(self):
        drawing._groups = None

    def test_position_and_size_dont_matter(self):
        score = drawing.score_drawing(self.shi, shifted(SHI))
        self.assertGreater(score.accuracy, 99)
        self.assertEqual((score.in_order, score.correct_direction), (2, 2))

    def test_order_and_direction_reported_not_penalised(self):
        backwards = [s[::-1] for s in SHI[::-1]]
        score = drawing.score_drawing(self.shi, backwards)
        self.assertGreater(score.accuracy, 99)
        self.assertEqual(score.in_order, 1)
        self.assertEqual(score.correct_direction, 0)

    def test_missing_and_wrong_strokes_lower_accuracy(self):
        self.assertLess(drawing.score_drawing(self.shi, SHI[:1]).accuracy, 55)
        self.assertLess(drawing.score_drawing(self.shi, ER).accuracy, 60)

    def test_recognise(self):
        self.assertEqual(drawing.recognise(shifted(ER))[0][0], "二")
        self.assertEqual(drawing.recognise(shifted(REN[::-1]))[0][0], "人")

    def test_clean_input_rejects_garbage(self):
        for bad in ["x", [[]], [["a"]], [[[1, 2]]] * 65]:
            with self.assertRaises((ValueError, TypeError, IndexError)):
                drawing.clean_input(bad)

    def test_assign_rectangular(self):
        pairs = drawing._assign([[1, 9, 9], [9, 9, 1]])
        self.assertEqual(sorted(pairs), [(0, 0), (1, 2)])
        pairs = drawing._assign([[1, 9], [9, 9], [9, 1]])
        self.assertEqual(sorted(pairs), [(0, 0), (2, 1)])


class FreeDrawingFlowTests(TestCase):
    def setUp(self):
        drawing._groups = None
        make_drawn_char("十", SHI, 1)
        make_drawn_char("二", ER, 2)

    def gql(self, query, **variables):
        resp = self.client.post(
            "/graphql",
            json.dumps({"query": query, "variables": variables}),
            content_type="application/json",
        )
        body = resp.json()
        return body.get("data"), body.get("errors")

    def test_score_drawing_query(self):
        data, errors = self.gql(
            """query($s: GenericScalar!) { scoreDrawing(hanzi: "十", strokes: $s) {
                accuracy drawnStrokes expectedStrokes inOrder
                matches { refIndex score } recognized { hanzi } } }""",
            s=shifted(SHI),
        )
        self.assertIsNone(errors)
        result = data["scoreDrawing"]
        self.assertGreater(result["accuracy"], 99)
        self.assertEqual(result["recognized"][0]["hanzi"], "十")

    def test_free_drawing_must_reach_min_accuracy(self):
        data, _ = self.gql(
            """mutation($i: DeckInput!) { createDeck(input: $i) { deck { id } } }""",
            i={
                "name": "t",
                "cardKind": "CHARACTER",
                "failureSteps": [{"type": "DRAW_STROKES", "minAccuracy": 80}],
            },
        )
        deck_id = data["createDeck"]["deck"]["id"]
        data, _ = self.gql(
            "query($d: ID!) { study(deckId: $d) { card { id hanzi } } }", d=deck_id
        )
        card = data["study"]["card"]
        self.assertEqual(card["hanzi"], "十")
        data, _ = self.gql(
            """mutation($c: ID!) { answerCard(cardId: $c, rating: "AGAIN") {
                study { remediation { id steps { config } } } } }""",
            c=card["id"],
        )
        rem = data["answerCard"]["study"]["remediation"]
        self.assertEqual(rem["steps"][0]["config"]["mode"], "FREE")

        submit = """mutation($r: ID!, $s: GenericScalar!) {
            submitFreeDrawing(remediationId: $r, hanzi: "十", strokes: $s) {
                counted result { accuracy } study { remediation { id } } } }"""
        data, errors = self.gql(submit, r=rem["id"], s=ER)
        self.assertIsNone(errors)
        self.assertFalse(data["submitFreeDrawing"]["counted"])
        data, _ = self.gql(submit, r=rem["id"], s=shifted(SHI))
        self.assertTrue(data["submitFreeDrawing"]["counted"])
        self.assertIsNone(data["submitFreeDrawing"]["study"]["remediation"])


class DictionaryParsingTests(TestCase):
    def test_xinhua_modern_senses(self):
        from r2dliu.chinese.management.commands.load_chinese_data import (
            _format_zh_senses,
            _xinhua_modern,
        )

        text = (
            "行 \n\n (象形。本义:道路)\n\n 行háng\n\n ⒈排，队列～列。\n\n ⒉\n\n"
            " ⒊见xíng。\n\n 行xíng\n\n ⒈走～路。\n\n ⒉做～事。\n\n"
            " 行hàng 1.刚强貌。"
        )
        senses = _xinhua_modern("行", text)
        self.assertEqual(senses, {"háng": ["排，队列～列。"], "xíng": ["走～路。", "做～事。"]})
        formatted = _format_zh_senses(senses, ["xíng", "háng"])
        self.assertTrue(formatted.startswith("xíng\n⒈ 走～路。\n⒉ 做～事。\nháng"))

    def test_inline_senses(self):
        from r2dliu.chinese.management.commands.load_chinese_data import (
            _xinhua_modern,
        )

        senses = _xinhua_modern("的", " 的 ·de放在定语的后面。②助词。")
        self.assertEqual(senses, {"de": ["放在定语的后面。", "助词。"]})

    def test_segment_prefers_longest_word(self):
        from r2dliu.chinese.management.commands.load_chinese_data import _segment

        self.assertEqual(
            _segment("我们试试看！", {"我们", "试试", "试试看"}),
            ["我们", "试试看", "！"],
        )


class ExampleTests(TestCase):
    def test_card_examples(self):
        from r2dliu.chinese.models import Example, Sentence
        from r2dliu.schema import schema

        char = Character.objects.create(
            hanzi="好", pinyin=["hǎo"], definition="good", definition_zh="优点多的",
            frequency_rank=1,
        )
        s = Sentence.objects.create(
            id=1, chinese="很好。", english="Very good.",
            tokens=[["很", "hěn"], ["好", "hǎo"], ["。", ""]],
        )
        Example.objects.create(sentence=s, character=char, position=0)
        deck = Deck.objects.create(name="d", card_kind=Deck.CardKind.CHARACTER)
        card = study.add_card(deck, char, timezone.now())
        result = schema.execute(
            """query($d: ID!) { study(deckId: $d) { card { id
                examples { chinese english tokens { text pinyin } }
                character { definitionZh } } } }""",
            variables={"d": str(deck.id)},
        )
        self.assertIsNone(result.errors)
        got = result.data["study"]["card"]
        self.assertEqual(got["id"], str(card.id))
        self.assertEqual(got["character"]["definitionZh"], "优点多的")
        self.assertEqual(got["examples"][0]["tokens"][1], {"text": "好", "pinyin": "hǎo"})


class BrowseTests(TestCase):
    """The deck browser: filters, search, previews and card actions."""

    setUp = StudyFlowTests.setUp
    gql = StudyFlowTests.gql
    create_deck = StudyFlowTests.create_deck
    study = StudyFlowTests.study
    answer = StudyFlowTests.answer
    STUDY = StudyFlowTests.STUDY

    ITEMS = """query($d: ID!, $f: String, $q: String) {
        deckItems(deckId: $d, filter: $f, query: $q) {
            total items { hanzi state cardId } } }"""

    def items(self, deck_id, f="ALL", q=""):
        data, errors = self.gql(self.ITEMS, d=deck_id, f=f, q=q)
        self.assertIsNone(errors)
        return data["deckItems"]

    def test_filters_search_and_actions(self):
        deck_id = self.create_deck("WORD", [])
        card = self.study(deck_id)["card"]  # 你好 becomes a card
        self.answer(card["id"], "GOOD")

        # Answering introduced the next new card (你们) too
        all_items = self.items(deck_id)["items"]
        self.assertEqual([i["hanzi"] for i in all_items], ["你好", "你们"])
        self.assertEqual([i["state"] for i in all_items], ["LEARNING", "NEW"])
        upcoming = self.items(deck_id, "UPCOMING")
        self.assertEqual([i["hanzi"] for i in upcoming["items"]], ["好人"])
        self.assertEqual(upcoming["items"][0]["state"], "UPCOMING")
        # Pinyin without tones or spaces, English, and hanzi all match
        self.assertEqual(self.items(deck_id, "UPCOMING", "haoren")["total"], 1)
        self.assertEqual(self.items(deck_id, "ALL", "nihao")["total"], 1)
        self.assertEqual(self.items(deck_id, "ALL", "def of 你们")["total"], 0)
        self.assertEqual(self.items(deck_id, "ALL", "们")["total"], 1)
        self.assertEqual(self.items(deck_id, "REVIEW")["total"], 0)

        # Preview a word that isn't in the deck, with its related items
        data, errors = self.gql(
            """query($d: ID!) { card(deckId: $d, hanzi: "好人") { id state } }""",
            d=deck_id,
        )
        self.assertIsNone(errors)
        preview = data["card"]
        self.assertEqual(preview["state"], "UPCOMING")
        data, errors = self.gql(
            "query($c: ID!) { relatedItems(cardId: $c) { hanzi } }", c=preview["id"]
        )
        self.assertIsNone(errors)
        self.assertIn("好", [i["hanzi"] for i in data["relatedItems"]])
        # ...but it can't be answered
        _, errors = self.answer(preview["id"], "GOOD")
        self.assertIsNotNone(errors)

        edit = """mutation($c: ID!, $a: String!) {
            editCard(cardId: $c, action: $a) { card { state } } }"""
        data, _ = self.gql(edit, c=card["id"], a="KNOWN")
        self.assertEqual(data["editCard"]["card"]["state"], "KNOWN")
        self.assertEqual(self.items(deck_id, "KNOWN")["total"], 1)
        data, _ = self.gql(edit, c=card["id"], a="STUDY_NOW")
        self.assertEqual(data["editCard"]["card"]["state"], "REVIEW")
        self.assertEqual(self.study(deck_id)["card"]["hanzi"], "你好")
        # A new card asked for now goes straight into learning
        new_id = all_items[1]["cardId"]
        data, _ = self.gql(edit, c=new_id, a="STUDY_NOW")
        self.assertEqual(data["editCard"]["card"]["state"], "LEARNING")
        data, _ = self.gql(edit, c=card["id"], a="RESET")
        self.assertEqual(data["editCard"]["card"]["state"], "NEW")
        _, errors = self.gql(edit, c=card["id"], a="NOPE")
        self.assertIsNotNone(errors)
