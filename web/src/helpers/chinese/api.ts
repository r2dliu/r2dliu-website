// GraphQL client for the Chinese flashcards feature (api/r2dliu/chinese)

declare global {
  interface Window {
    API_URL?: string
  }
}

function apiUrl() {
  return (window.API_URL || import.meta.env.VITE_API_URL || '').replace(
    /\/$/,
    '',
  )
}

export async function gql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const resp = await fetch(`${apiUrl()}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
  const body = await resp.json()
  if (body.errors?.length) {
    throw new Error(body.errors[0].message)
  }
  return body.data as T
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Rating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'
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
  frequencyRank: number | null
  hskLevel: number | null
  strokeCount: number
}

export interface Word {
  simplified: string
  traditional: string | null
  pinyin: string
  definition: string
  frequencyRank: number | null
  hskLevel: number | null
  characters: Array<Character>
}

export interface Card {
  id: string
  state: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING'
  hanzi: string
  lapses: number
  character: Character | null
  word: Word | null
  intervalPreview: Array<{ rating: Rating; label: string }>
}

export interface RelatedItem {
  key: string
  kind: CardKind
  hanzi: string
  pinyin: string
  definition: string
  frequencyRank: number | null
  hskLevel: number | null
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
  openedKeys: Array<string> | null
  attempts: number | null
}

export interface Remediation {
  id: string
  status: 'ACTIVE' | 'COMPLETED'
  currentStep: number
  steps: Array<RemediationStep>
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
  hanzi traditional pinyin definition frequencyRank hskLevel strokeCount
`

const DECK_FIELDS = `
  id name cardKind newCardsPerDay learningSteps relearnDelayMinutes
  graduatingIntervalDays easyIntervalDays failureSteps cardCount
`

const STUDY_FIELDS = `
  deck { ${DECK_FIELDS} }
  counts { new learning review }
  nextDueAt
  card {
    id state hanzi lapses
    intervalPreview { rating label }
    character { ${CHARACTER_FIELDS} }
    word {
      simplified traditional pinyin definition frequencyRank hskLevel
      characters { ${CHARACTER_FIELDS} }
    }
  }
  remediation {
    id status currentStep
    steps {
      index type config required done satisfied
      drawTargets drawProgress openedKeys attempts
      relatedItems { key kind hanzi pinyin definition frequencyRank hskLevel }
    }
  }
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

  addToDeck: (deckId: string, hanzi: string) =>
    gql(
      `mutation($deckId: ID!, $hanzi: String!) { addToDeck(deckId: $deckId, hanzi: $hanzi) { card { id } } }`,
      { deckId, hanzi },
    ),

  strokeData: (hanzi: string) =>
    gql<{ character: { strokeData: StrokeData } | null }>(
      `query($hanzi: String!) { character(hanzi: $hanzi) { strokeData } }`,
      { hanzi },
    ).then((d) => d.character?.strokeData ?? null),

  character: (hanzi: string) =>
    gql<{ character: (Character & { words: Array<Word> }) | null }>(
      `query($hanzi: String!) { character(hanzi: $hanzi) {
        ${CHARACTER_FIELDS}
        words(limit: 8) { simplified pinyin definition frequencyRank hskLevel characters { hanzi } }
      } }`,
      { hanzi },
    ).then((d) => d.character),

  word: (simplified: string) =>
    gql<{ word: Word | null }>(
      `query($simplified: String!) { word(simplified: $simplified) {
        simplified traditional pinyin definition frequencyRank hskLevel
        characters { ${CHARACTER_FIELDS} }
      } }`,
      { simplified },
    ).then((d) => d.word),
}
