import { Link } from '@tanstack/react-router'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { CardBack, CardFront } from './CardFace'
import { DeckSettings } from './DeckSettings'
import { PracticeDrawing, PracticeRelated } from './PracticePanel'
import { RemediationPanel } from './RemediationPanel'
import { Btn, Input, Select } from './ui'
import type { Card, CardKind, Rating } from '../../helpers/chinese/api'

const RATINGS: Array<{ rating: Rating; label: string; className: string }> = [
  { rating: 'AGAIN', label: 'Again', className: '!border-red-500' },
  { rating: 'HARD', label: 'Hard', className: '!border-orange-400' },
  { rating: 'GOOD', label: 'Good', className: '!border-green-500' },
  { rating: 'EASY', label: 'Easy', className: '!border-sky-400' },
  // Never shown again
  { rating: 'KNOWN', label: 'Known', className: '!border-zinc-400' },
]

function NewDeckForm({ onDone }: { onDone?: () => void }) {
  const createDeck = useStudyStore((s) => s.createDeck)
  const [name, setName] = useState('Most common characters')
  const [cardKind, setCardKind] = useState<CardKind>('CHARACTER')

  return (
    <form
      className="flex flex-wrap items-end gap-3"
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
        className="max-md:w-full"
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
        className="w-48 max-md:w-full"
      >
        <option value="CHARACTER">Characters (字)</option>
        <option value="WORD">Vocab words (词)</option>
      </Select>
      <Btn type="submit" variant="outlined" className="max-md:w-full">
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
    <div className="flex gap-3 px-2 font-['HelveticaNeueMedium']">
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

const TABS = [
  ['meaning', 'Meaning'],
  ['draw', 'Draw'],
  ['related', 'Related'],
] as const
type Tab = (typeof TABS)[number][0]

/**
 * The revealed card's details. Meaning, drawing practice and related vocab
 * share one space as tabs instead of stacking. None of them affect scheduling.
 */
function CardDetails({ card }: { card: Card }) {
  const [tab, setTab] = useState<Tab>('meaning')

  // The area never shrinks for this card, so switching to a shorter tab
  // doesn't pull the rating buttons (or the scroll position) up.
  const panelRef = useRef<HTMLDivElement>(null)
  const [minHeight, setMinHeight] = useState(0)
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const observer = new ResizeObserver(() =>
      setMinHeight((h) => Math.max(h, el.offsetHeight)),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex border-b border-zinc-800" role="tablist">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "-mb-px flex-1 cursor-pointer border-0 border-b-2 border-solid bg-transparent py-2 font-['HelveticaNeueMedium'] text-sm uppercase tracking-wide",
              {
                'border-white text-white': tab === key,
                'border-transparent text-zinc-500 hover:text-zinc-300':
                  tab !== key,
              },
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div ref={panelRef} style={{ minHeight }}>
        {tab === 'meaning' && <CardBack card={card} />}
        {tab === 'draw' && <PracticeDrawing card={card} />}
        {tab === 'related' && <PracticeRelated card={card} />}
      </div>
    </div>
  )
}

function StudyPanel() {
  const { study, revealed, reveal, answer, busy, refresh, studyMore } =
    useStudyStore()

  // Space reveals, 1-4 answer — like Anki
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!study?.card || study.remediation) return
      if (e.target instanceof HTMLInputElement) return
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        reveal()
      } else if (revealed && ['1', '2', '3', '4', '5'].includes(e.key)) {
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
        <div className="flex flex-wrap gap-3">
          <Btn variant="outlined" onClick={studyMore} disabled={busy}>
            Keep going (+10 new cards)
          </Btn>
          <Btn variant="text" onClick={refresh}>
            Check again
          </Btn>
        </div>
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
          <CardDetails key={card.id} card={card} />
          <div className="grid grid-cols-5 gap-3 pt-2 max-md:gap-2">
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
          Show answer
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
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-sm text-zinc-400 no-underline hover:text-white"
          >
            ← r2dliu.com
          </Link>
          <div className="flex-1" />
          {mode === 'study' && <Counts />}
          {deck && mode === 'study' && (
            <Btn variant="text" onClick={() => setMode('settings')}>
              Settings
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
            {decks.length > 0 && (
              <Btn
                variant="text"
                className="self-start"
                onClick={() => setMode('study')}
              >
                Cancel
              </Btn>
            )}
          </div>
        ) : mode === 'settings' && deck ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-3">
              {decks.length > 1 && (
                <Select
                  label="Deck"
                  value={deckId ?? ''}
                  onChange={(e) => selectDeck(e.target.value)}
                  className="w-64 max-md:w-full"
                >
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              )}
              <Btn variant="outlined" onClick={() => setMode('new')}>
                New deck
              </Btn>
            </div>
            <DeckSettings
              key={deck.id}
              deck={deck}
              onClose={() => setMode('study')}
            />
          </div>
        ) : (
          <StudyPanel />
        )}
      </div>
    </div>
  )
}
