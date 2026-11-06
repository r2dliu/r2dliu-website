import { Link } from '@tanstack/react-router'
import cn from 'classnames'
import { useEffect, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { CardBack, CardFront } from './CardFace'
import { DeckSettings } from './DeckSettings'
import { RemediationPanel } from './RemediationPanel'
import { Btn, Input, Select } from './ui'
import type { CardKind, Rating } from '../../helpers/chinese/api'

const RATINGS: Array<{ rating: Rating; label: string; className: string }> = [
  { rating: 'AGAIN', label: 'Again', className: '!border-red-500' },
  { rating: 'HARD', label: 'Hard', className: '!border-orange-400' },
  { rating: 'GOOD', label: 'Good', className: '!border-green-500' },
  { rating: 'EASY', label: 'Easy', className: '!border-sky-400' },
]

function NewDeckForm({ onDone }: { onDone?: () => void }) {
  const createDeck = useStudyStore((s) => s.createDeck)
  const [name, setName] = useState('Most common characters')
  const [cardKind, setCardKind] = useState<CardKind>('CHARACTER')

  return (
    <form
      className="flex flex-wrap items-center gap-3"
      onSubmit={async (e) => {
        e.preventDefault()
        await createDeck({ name, cardKind })
        onDone?.()
      }}
    >
      <Input
        label="Deck name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Select
        label="Cards"
        value={cardKind}
        onChange={(e) => {
          const kind = e.target.value as CardKind
          setCardKind(kind)
          setName(
            kind === 'WORD' ? 'Most common words' : 'Most common characters',
          )
        }}
        className="w-48"
      >
        <option value="CHARACTER">Characters (字)</option>
        <option value="WORD">Vocab words (词)</option>
      </Select>
      <Btn type="submit" variant="outlined">
        Create deck
      </Btn>
    </form>
  )
}

function Counts() {
  const study = useStudyStore((s) => s.study)
  if (!study) return null
  const { counts } = study
  return (
    <div className="flex gap-4 font-['HelveticaNeueMedium'] text-lg">
      <span className="text-sky-400" title="New cards left today">
        {counts.new}
      </span>
      <span className="text-red-400" title="Learning">
        {counts.learning}
      </span>
      <span className="text-green-400" title="Reviews due">
        {counts.review}
      </span>
    </div>
  )
}

function StudyPanel() {
  const { study, revealed, reveal, answer, busy, refresh } = useStudyStore()

  // Space reveals, 1-4 answer — like Anki
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!study?.card || study.remediation) return
      if (e.target instanceof HTMLInputElement) return
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        reveal()
      } else if (revealed && ['1', '2', '3', '4'].includes(e.key)) {
        answer(RATINGS[Number(e.key) - 1].rating)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [study, revealed, reveal, answer])

  if (!study) return <div className="text-zinc-400">Loading…</div>

  const { card, remediation } = study
  if (remediation && card) {
    return <RemediationPanel card={card} remediation={remediation} />
  }

  if (!card) {
    return (
      <div className="flex flex-col items-start gap-3 py-10">
        <div className="font-['HelveticaNeueBold'] text-3xl">
          Done for now 🎉
        </div>
        <div className="text-zinc-400">
          {study.nextDueAt
            ? `Next card is due ${new Date(study.nextDueAt).toLocaleString()}.`
            : 'No cards are scheduled.'}
          {study.counts.new === 0 && ' New card limit reached for today.'}
        </div>
        <Btn variant="outlined" onClick={refresh}>
          Check again
        </Btn>
      </div>
    )
  }

  const preview = Object.fromEntries(
    card.intervalPreview.map((p) => [p.rating, p.label]),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {card.state.toLowerCase()}
        {card.lapses ? ` · ${card.lapses} lapses` : ''}
      </div>
      <CardFront card={card} />
      {revealed ? (
        <>
          <hr className="border-zinc-800" />
          <CardBack card={card} />
          <div className="grid grid-cols-4 gap-3 pt-2 max-md:gap-2">
            {RATINGS.map(({ rating, label, className }, i) => (
              <Btn
                key={rating}
                variant="outlined"
                disabled={busy}
                className={cn('!flex !flex-col items-center', className)}
                onClick={() => answer(rating)}
              >
                <span className="text-xs text-zinc-400">{preview[rating]}</span>
                <span>{label}</span>
                <span className="text-[10px] text-zinc-500 max-md:hidden">
                  {i + 1}
                </span>
              </Btn>
            ))}
          </div>
        </>
      ) : (
        <Btn variant="outlined" onClick={reveal} className="self-center">
          Show answer (space)
        </Btn>
      )}
    </div>
  )
}

export function ChineseFlashcards() {
  const { decks, deckId, selectDeck, loadDecks, error, study } = useStudyStore()
  const [mode, setMode] = useState<'study' | 'settings' | 'new'>('study')

  useEffect(() => {
    loadDecks()
  }, [loadDecks])

  const deck = decks.find((d) => d.id === deckId) ?? study?.deck

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 md:p-10">
        <Link
          to="/"
          className="self-start text-sm text-zinc-400 no-underline hover:text-white"
        >
          ← r2dliu.com
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <div className="font-['HelveticaNeueBold'] text-4xl max-md:text-3xl">
            中文 Flashcards
          </div>
          <div className="flex-1" />
          {decks.length > 0 && (
            <Select
              label="Deck"
              value={deckId ?? ''}
              onChange={(e) => {
                setMode('study')
                selectDeck(e.target.value)
              }}
              className="w-56"
            >
              {decks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          )}
          {deck && mode === 'study' && (
            <Btn variant="text" onClick={() => setMode('settings')}>
              Settings
            </Btn>
          )}
          {decks.length > 0 && mode !== 'new' && (
            <Btn variant="text" onClick={() => setMode('new')}>
              New deck
            </Btn>
          )}
        </div>

        {error && (
          <div className="border border-red-500 px-4 py-2 text-red-300">
            {error}
          </div>
        )}

        {decks.length === 0 || mode === 'new' ? (
          <div className="flex flex-col gap-4">
            <div className="font-['HelveticaNeueLight'] text-xl text-zinc-300">
              Cards are introduced from most to least common (SUBTLEX-CH
              frequency). Failing a card can require extra work before you move
              on — configure it in the deck settings.
            </div>
            <NewDeckForm onDone={() => setMode('study')} />
          </div>
        ) : mode === 'settings' && deck ? (
          <DeckSettings
            key={deck.id}
            deck={deck}
            onClose={() => setMode('study')}
          />
        ) : (
          <>
            <Counts />
            <StudyPanel />
          </>
        )}
      </div>
    </div>
  )
}
