import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { api } from '../../helpers/chinese/api'
import type {
  Deck,
  DeckInput,
  Rating,
  StudyState,
} from '../../helpers/chinese/api'

export type Language = 'en' | 'zh'
const LANGUAGE_KEY = 'chinese-flashcards-language'

function savedLanguage(): Language {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === 'zh' ? 'zh' : 'en'
  } catch {
    return 'en'
  }
}

/** The study state with every remediation step shown as finished */
function completed(study: StudyState): StudyState {
  if (!study.remediation) return study
  return {
    ...study,
    remediation: {
      ...study.remediation,
      steps: study.remediation.steps.map((s) => ({
        ...s,
        done: Math.max(s.done, s.required),
        satisfied: true,
        drawProgress: s.drawTargets
          ? Object.fromEntries(
              s.drawTargets.map((t) => [
                t,
                Math.max(
                  Number(s.drawProgress?.[t] ?? 0),
                  Number(s.config.repetitions ?? 1),
                ),
              ]),
            )
          : s.drawProgress,
      })),
    },
  }
}

interface ChineseStudyState {
  decks: Array<Deck>
  /** False until the first deck list arrives; until then decks is unknown */
  decksLoaded: boolean
  deckId: string | null
  study: StudyState | null
  revealed: boolean
  cardShownAt: number
  busy: boolean
  error: string | null
  /**
   * Set when a remediation has just been finished: the next card is held here
   * until the learner presses Next, so they can keep exploring the missed one.
   */
  pendingNext: StudyState | null
  /** Definitions and interface in English or Chinese */
  language: Language
  setLanguage: (language: Language) => void
  /** Move on from a finished remediation */
  advance: () => void
  loadDecks: () => Promise<void>
  selectDeck: (deckId: string | null) => Promise<void>
  createDeck: (input: DeckInput) => Promise<void>
  updateDeck: (input: DeckInput) => Promise<void>
  deleteDeck: () => Promise<void>
  refresh: () => Promise<void>
  reveal: () => void
  /** Allow 10 more new cards today */
  studyMore: () => Promise<void>
  answer: (rating: Rating) => Promise<void>
  /** Apply a study state returned by a remediation mutation */
  setStudy: (study: StudyState) => void
  run: <T>(fn: () => Promise<T>) => Promise<T | undefined>
}

export const useStudyStore = create<ChineseStudyState>()(
  devtools((set, get) => ({
    decks: [],
    decksLoaded: false,
    deckId: null,
    study: null,
    revealed: false,
    cardShownAt: 0,
    busy: false,
    error: null,
    pendingNext: null,
    language: 'en',

    setLanguage: (language) => {
      try {
        localStorage.setItem(LANGUAGE_KEY, language)
      } catch {
        // Not saved; still applies for this visit
      }
      set({ language })
    },

    advance: () => {
      const next = get().pendingNext
      if (!next) return
      set({ pendingNext: null, study: null })
      get().setStudy(next)
    },

    run: async (fn) => {
      set({ busy: true, error: null })
      try {
        return await fn()
      } catch (e) {
        set({ error: e instanceof Error ? e.message : String(e) })
        return undefined
      } finally {
        set({ busy: false })
      }
    },

    setStudy: (study) => {
      const prev = get().study
      // A remediation mutation finished the last task: stay on the card
      if (
        prev?.remediation &&
        prev.card &&
        (!study.remediation || study.card?.id !== prev.card.id)
      ) {
        set({ study: completed(prev), pendingNext: study })
        return
      }
      const sameCard =
        prev?.card?.id === study.card?.id &&
        !!prev?.remediation === !!study.remediation
      set({
        study,
        revealed: sameCard ? get().revealed : false,
        cardShownAt: sameCard ? get().cardShownAt : Date.now(),
      })
    },

    loadDecks: async () => {
      if (get().language !== savedLanguage()) set({ language: savedLanguage() })
      const decks = await get().run(api.decks)
      if (!decks) return
      set({ decks, decksLoaded: true })
      if (!get().deckId && decks.length) {
        await get().selectDeck(decks[0].id)
      }
    },

    selectDeck: async (deckId) => {
      set({ deckId, study: null, revealed: false, pendingNext: null })
      if (deckId) await get().refresh()
    },

    refresh: async () => {
      const { deckId } = get()
      if (!deckId) return
      const study = await get().run(() => api.study(deckId))
      if (study) get().setStudy(study)
    },

    createDeck: async (input) => {
      const deck = await get().run(() => api.createDeck(input))
      if (!deck) return
      set({ decks: [...get().decks, deck] })
      await get().selectDeck(deck.id)
    },

    updateDeck: async (input) => {
      const { deckId } = get()
      if (!deckId) return
      const deck = await get().run(() => api.updateDeck(deckId, input))
      if (!deck) return
      set({ decks: get().decks.map((d) => (d.id === deck.id ? deck : d)) })
      await get().refresh()
    },

    deleteDeck: async () => {
      const { deckId } = get()
      if (!deckId) return
      await get().run(() => api.deleteDeck(deckId))
      const decks = get().decks.filter((d) => d.id !== deckId)
      set({ decks })
      await get().selectDeck(decks[0]?.id ?? null)
    },

    reveal: () => set({ revealed: true }),

    studyMore: async () => {
      const { deckId } = get()
      if (!deckId) return
      const study = await get().run(() => api.studyMore(deckId))
      if (study) get().setStudy(study)
    },

    answer: async (rating) => {
      const card = get().study?.card
      if (!card || get().busy) return
      const duration = Date.now() - get().cardShownAt
      const study = await get().run(() =>
        api.answerCard(card.id, rating, duration),
      )
      if (study) get().setStudy(study)
    },
  })),
)
