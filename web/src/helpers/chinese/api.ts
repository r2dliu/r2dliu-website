// GraphQL client for the Chinese flashcards feature (api/r2dliu/chinese)

declare global {
  interface Window {
    API_URL?: string
  }
}

/** The GraphQL endpoint. API_URL may be the API root or already end in /graphql. */
function graphqlUrl() {
  const base = (window.API_URL || import.meta.env.VITE_API_URL || '')
    .replace(/\/+$/, '')
    .replace(/\/graphql$/, '')
  return `${base}/graphql`
}

export async function gql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  let resp: Response
  try {
    resp = await fetch(graphqlUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    })
  } catch {
    throw new Error(
      "Couldn't reach the flashcards server. Check your connection and try again.",
    )
  }
  // GraphQL errors still come back as JSON; anything else (an HTML error page
  // from a proxy or a crash) would make resp.json() throw a cryptic error
  let body: { data?: T; errors?: Array<{ message: string }> }
  try {
    body = await resp.json()
  } catch {
    throw new Error(
      `The flashcards server returned an unexpected response (HTTP ${resp.status}). Try again in a moment.`,
    )
  }
  if (body.errors?.length) {
    throw new Error(body.errors[0].message)
  }
  return body.data as T
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Rating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY' | 'KNOWN'
export type CardKind = 'CHARACTER' | 'WORD'
export type FailureStepType = 'DRAW_STROKES' | 'EXPLORE_RELATED' | 'TYPE_PINYIN'

export interface StrokeData {
  strokes: Array<string>
  medians: Array<Array<[number, number]>>
  radStrokes: Array<number>
}

export interface Character {
  hanzi: string
  traditional: string | null
  pinyin: Array<string>
  definition: string
  /** Chinese definition; empty when the dictionaries have none */
  definitionZh: string
  frequencyRank: number | null
  hskLevel: number | null
  strokeCount: number
}

export interface Word {
  simplified: string
  traditional: string | null
  pinyin: string
  definition: string
  /** Chinese definition; empty when the dictionaries have none */
  definitionZh: string
  frequencyRank: number | null
  hskLevel: number | null
  characters: Array<Character>
}

export type CardState =
  | 'NEW'
  | 'LEARNING'
  | 'REVIEW'
  | 'RELEARNING'
  | 'KNOWN'
  | 'UPCOMING'

export type DeckFilter =
  | 'ALL'
  | 'NEW'
  | 'LEARNING'
  | 'REVIEW'
  | 'KNOWN'
  | 'UPCOMING'

export type CardAction = 'STUDY_NOW' | 'KNOWN' | 'RESET'

/** A row in the deck browser */
export interface DeckItem {
  key: string
  hanzi: string
  pinyin: string
  definition: string
  definitionZh: string
  frequencyRank: number | null
  hskLevel: number | null
  state: CardState
  due: string | null
  reps: number
  lapses: number
  /** Null for UPCOMING items */
  cardId: string | null
}

export interface Card {
  id: string
  /** UPCOMING: a preview of something not in the deck yet */
  state: CardState
  hanzi: string
  lapses: number
  character: Character | null
  word: Word | null
  intervalPreview: Array<{ rating: Rating; label: string }>
  examples: Array<Sentence>
}

export interface Sentence {
  id: string
  chinese: string
  english: string
  /** Segmented words with their pinyin (empty for punctuation) */
  tokens: Array<{ text: string; pinyin: string }>
}

export interface RelatedItem {
  key: string
  kind: CardKind
  hanzi: string
  pinyin: string
  definition: string
  /** Chinese definition; empty when the dictionaries have none */
  definitionZh: string
  frequencyRank: number | null
  hskLevel: number | null
}

/** Related vocab for one character of a card (a tab) */
export interface RelatedGroup {
  hanzi: string
  items: Array<RelatedItem>
  /** Items to open in this group during a remediation (0 otherwise) */
  required: number
  done: number
}

export interface FailureStep {
  type: FailureStepType
  [option: string]: unknown
}

export interface RemediationStep {
  index: number
  type: FailureStepType
  config: FailureStep
  required: number
  done: number
  satisfied: boolean
  drawTargets: Array<string> | null
  drawProgress: Record<string, number> | null
  relatedItems: Array<RelatedItem> | null
  relatedGroups: Array<RelatedGroup> | null
  openedKeys: Array<string> | null
  attempts: number | null
}

export interface Remediation {
  id: string
  status: 'ACTIVE' | 'COMPLETED'
  currentStep: number
  steps: Array<RemediationStep>
}

/** A drawn stroke: points in Make Me a Hanzi's 1024 box (y up) */
export type DrawnStroke = Array<[number, number]>

export interface DrawingResult {
  accuracy: number
  shape: number
  drawnStrokes: number
  expectedStrokes: number
  inOrder: number
  correctDirection: number
  matches: Array<{
    drawnIndex: number
    refIndex: number
    score: number
    correctDirection: boolean
  }>
  recognized: Array<{ hanzi: string; accuracy: number }>
}

export interface Deck {
  id: string
  name: string
  cardKind: CardKind
  newCardsPerDay: number
  learningSteps: Array<number>
  relearnDelayMinutes: number
  graduatingIntervalDays: number
  easyIntervalDays: number
  failureSteps: Array<FailureStep>
  cardCount: number
}

export interface StudyState {
  deck: Deck
  card: Card | null
  remediation: Remediation | null
  counts: { new: number; learning: number; review: number }
  nextDueAt: string | null
}

export type DeckInput = Partial<Omit<Deck, 'id' | 'cardCount'>>

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const CHARACTER_FIELDS = `
  hanzi traditional pinyin definition definitionZh frequencyRank hskLevel strokeCount
`

const DECK_FIELDS = `
  id name cardKind newCardsPerDay learningSteps relearnDelayMinutes
  graduatingIntervalDays easyIntervalDays failureSteps cardCount
`

const CARD_FIELDS = `
  id state hanzi lapses
  intervalPreview { rating label }
  examples { id chinese english tokens { text pinyin } }
  character { ${CHARACTER_FIELDS} }
  word {
    simplified traditional pinyin definition definitionZh frequencyRank hskLevel
    characters { ${CHARACTER_FIELDS} }
  }
`

const STUDY_FIELDS = `
  deck { ${DECK_FIELDS} }
  counts { new learning review }
  nextDueAt
  card { ${CARD_FIELDS} }
  remediation {
    id status currentStep
    steps {
      index type config required done satisfied
      drawTargets drawProgress openedKeys attempts
      relatedItems { key kind hanzi pinyin definition definitionZh frequencyRank hskLevel }
      relatedGroups { hanzi required done items { key kind hanzi pinyin definition definitionZh frequencyRank hskLevel } }
    }
  }
`

const DRAWING_FIELDS = `
  accuracy shape drawnStrokes expectedStrokes inOrder correctDirection
  matches { drawnIndex refIndex score correctDirection }
  recognized { hanzi accuracy }
`

export const api = {
  decks: () =>
    gql<{ decks: Array<Deck> }>(`{ decks { ${DECK_FIELDS} } }`).then(
      (d) => d.decks,
    ),

  failureStepTypes: () =>
    gql<{
      failureStepTypes: Array<{
        type: FailureStepType
        defaults: Record<string, unknown>
      }>
    }>(`{ failureStepTypes { type defaults } }`).then(
      (d) => d.failureStepTypes,
    ),

  createDeck: (input: DeckInput) =>
    gql<{ createDeck: { deck: Deck } }>(
      `mutation($input: DeckInput!) { createDeck(input: $input) { deck { ${DECK_FIELDS} } } }`,
      { input },
    ).then((d) => d.createDeck.deck),

  updateDeck: (id: string, input: DeckInput) =>
    gql<{ updateDeck: { deck: Deck } }>(
      `mutation($id: ID!, $input: DeckInput!) { updateDeck(id: $id, input: $input) { deck { ${DECK_FIELDS} } } }`,
      { id, input },
    ).then((d) => d.updateDeck.deck),

  deleteDeck: (id: string) =>
    gql(`mutation($id: ID!) { deleteDeck(id: $id) { ok } }`, { id }),

  study: (deckId: string) =>
    gql<{ study: StudyState }>(
      `query($deckId: ID!) { study(deckId: $deckId) { ${STUDY_FIELDS} } }`,
      { deckId },
    ).then((d) => d.study),

  answerCard: (cardId: string, rating: Rating, durationMs: number) =>
    gql<{ answerCard: { study: StudyState } }>(
      `mutation($cardId: ID!, $rating: String!, $durationMs: Int) {
        answerCard(cardId: $cardId, rating: $rating, durationMs: $durationMs) { study { ${STUDY_FIELDS} } }
      }`,
      { cardId, rating, durationMs },
    ).then((d) => d.answerCard.study),

  completeStrokeQuiz: (
    remediationId: string,
    hanzi: string,
    mistakes: number,
  ) =>
    gql<{ completeStrokeQuiz: { counted: boolean; study: StudyState } }>(
      `mutation($remediationId: ID!, $hanzi: String!, $mistakes: Int!) {
        completeStrokeQuiz(remediationId: $remediationId, hanzi: $hanzi, mistakes: $mistakes) {
          counted study { ${STUDY_FIELDS} }
        }
      }`,
      { remediationId, hanzi, mistakes },
    ).then((d) => d.completeStrokeQuiz),

  openRelatedItem: (remediationId: string, key: string) =>
    gql<{ openRelatedItem: { study: StudyState } }>(
      `mutation($remediationId: ID!, $key: String!) {
        openRelatedItem(remediationId: $remediationId, key: $key) { study { ${STUDY_FIELDS} } }
      }`,
      { remediationId, key },
    ).then((d) => d.openRelatedItem.study),

  submitPinyin: (remediationId: string, answer: string) =>
    gql<{
      submitPinyin: { correct: boolean; expected: string; study: StudyState }
    }>(
      `mutation($remediationId: ID!, $answer: String!) {
        submitPinyin(remediationId: $remediationId, answer: $answer) {
          correct expected study { ${STUDY_FIELDS} }
        }
      }`,
      { remediationId, answer },
    ).then((d) => d.submitPinyin),

  studyMore: (deckId: string, count = 10) =>
    gql<{ studyMore: { study: StudyState } }>(
      `mutation($deckId: ID!, $count: Int) { studyMore(deckId: $deckId, count: $count) { study { ${STUDY_FIELDS} } } }`,
      { deckId, count },
    ).then((d) => d.studyMore.study),

  relatedGroups: (cardId: string) =>
    gql<{ relatedGroups: Array<RelatedGroup> }>(
      `query($cardId: ID!) { relatedGroups(cardId: $cardId) {
        hanzi required done
        items { key kind hanzi pinyin definition definitionZh frequencyRank hskLevel }
      } }`,
      { cardId },
    ).then((d) => d.relatedGroups),

  relatedItems: (cardId: string) =>
    gql<{ relatedItems: Array<RelatedItem> }>(
      `query($cardId: ID!) { relatedItems(cardId: $cardId) { key kind hanzi pinyin definition definitionZh frequencyRank hskLevel } }`,
      { cardId },
    ).then((d) => d.relatedItems),

  scoreDrawing: (hanzi: string, strokes: Array<DrawnStroke>) =>
    gql<{ scoreDrawing: DrawingResult }>(
      `query($hanzi: String!, $strokes: GenericScalar!) { scoreDrawing(hanzi: $hanzi, strokes: $strokes) { ${DRAWING_FIELDS} } }`,
      { hanzi, strokes },
    ).then((d) => d.scoreDrawing),

  submitFreeDrawing: (
    remediationId: string,
    hanzi: string,
    strokes: Array<DrawnStroke>,
  ) =>
    gql<{
      submitFreeDrawing: {
        counted: boolean
        result: DrawingResult
        study: StudyState
      }
    }>(
      `mutation($remediationId: ID!, $hanzi: String!, $strokes: GenericScalar!) {
        submitFreeDrawing(remediationId: $remediationId, hanzi: $hanzi, strokes: $strokes) {
          counted result { ${DRAWING_FIELDS} } study { ${STUDY_FIELDS} }
        }
      }`,
      { remediationId, hanzi, strokes },
    ).then((d) => d.submitFreeDrawing),

  addToDeck: (deckId: string, hanzi: string) =>
    gql<{ addToDeck: { card: Card } }>(
      `mutation($deckId: ID!, $hanzi: String!) { addToDeck(deckId: $deckId, hanzi: $hanzi) { card { ${CARD_FIELDS} } } }`,
      { deckId, hanzi },
    ).then((d) => d.addToDeck.card),

  strokeData: (hanzi: string) =>
    gql<{ character: { strokeData: StrokeData } | null }>(
      `query($hanzi: String!) { character(hanzi: $hanzi) { strokeData } }`,
      { hanzi },
    ).then((d) => d.character?.strokeData ?? null),

  character: (hanzi: string) =>
    gql<{ character: (Character & { words: Array<Word> }) | null }>(
      `query($hanzi: String!) { character(hanzi: $hanzi) {
        ${CHARACTER_FIELDS}
        words(limit: 8) { simplified pinyin definition definitionZh frequencyRank hskLevel characters { hanzi } }
      } }`,
      { hanzi },
    ).then((d) => d.character),

  word: (simplified: string) =>
    gql<{ word: Word | null }>(
      `query($simplified: String!) { word(simplified: $simplified) {
        simplified traditional pinyin definition definitionZh frequencyRank hskLevel
        characters { ${CHARACTER_FIELDS} }
      } }`,
      { simplified },
    ).then((d) => d.word),

  deckItems: (
    deckId: string,
    filter: DeckFilter,
    query: string,
    offset: number,
    limit = 50,
  ) =>
    gql<{ deckItems: { total: number; items: Array<DeckItem> } }>(
      `query($deckId: ID!, $filter: String, $query: String, $offset: Int, $limit: Int) {
        deckItems(deckId: $deckId, filter: $filter, query: $query, offset: $offset, limit: $limit) {
          total
          items { key hanzi pinyin definition definitionZh frequencyRank hskLevel state due reps lapses cardId }
        }
      }`,
      { deckId, filter, query, offset, limit },
    ).then((d) => d.deckItems),

  /** A card by id, or a preview of hanzi if it isn't in the deck */
  card: (deckId: string, item: { cardId: string | null; hanzi: string }) =>
    gql<{ card: Card | null }>(
      `query($id: ID, $deckId: ID, $hanzi: String) {
        card(id: $id, deckId: $deckId, hanzi: $hanzi) { ${CARD_FIELDS} }
      }`,
      item.cardId ? { id: item.cardId } : { deckId, hanzi: item.hanzi },
    ).then((d) => d.card),

  editCard: (cardId: string, action: CardAction) =>
    gql<{ editCard: { card: Card } }>(
      `mutation($cardId: ID!, $action: String!) {
        editCard(cardId: $cardId, action: $action) { card { ${CARD_FIELDS} } }
      }`,
      { cardId, action },
    ).then((d) => d.editCard.card),
}
