import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { api } from '../../helpers/chinese/api'
import type {
  Deck,
  DeckInput,
  Rating,
  StudyState,
} from '../../helpers/chinese/api'

interface ChineseStudyState {
  decks: Array<Deck>
  deckId: string | null
  study: StudyState | null
  revealed: boolean
  cardShownAt: number
  busy: boolean
  error: string | null
  loadDecks: () => Promise<void>
  selectDeck: (deckId: string | null) => Promise<void>
  createDeck: (input: DeckInput) => Promise<void>
  updateDeck: (input: DeckInput) => Promise<void>
  deleteDeck: () => Promise<void>
  refresh: () => Promise<void>
  reveal: () => void
  answer: (rating: Rating) => Promise<void>
  /** Apply a study state returned by a remediation mutation */
  setStudy: (study: StudyState) => void
  run: <T>(fn: () => Promise<T>) => Promise<T | undefined>
}

export const useStudyStore = create<ChineseStudyState>()(
  devtools((set, get) => ({
    decks: [],
    deckId: null,
    study: null,
    revealed: false,
    cardShownAt: 0,
    busy: false,
    error: null,

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
      const decks = await get().run(api.decks)
      if (!decks) return
      set({ decks })
      if (!get().deckId && decks.length) {
        await get().selectDeck(decks[0].id)
      }
    },

    selectDeck: async (deckId) => {
      set({ deckId, study: null, revealed: false })
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
