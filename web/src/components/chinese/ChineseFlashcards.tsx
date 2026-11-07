import { Link } from '@tanstack/react-router'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { useT } from '../../helpers/chinese/i18n'
import { CardBack, CardFront } from './CardFace'
import { DeckSettings } from './DeckSettings'
import { PracticeDrawing, PracticeRelated } from './PracticePanel'
import { RemediationPanel } from './RemediationPanel'
import { Btn, Input, Select, Spinner } from './ui'
import type { Card, CardKind, Rating } from '../../helpers/chinese/api'

const RATINGS: Array<{ rating: Rating; className: string }> = [
  { rating: 'AGAIN', className: '!border-red-500' },
  { rating: 'HARD', className: '!border-orange-400' },
  { rating: 'GOOD', className: '!border-green-500' },
  { rating: 'EASY', className: '!border-sky-400' },
  // Never shown again
  { rating: 'KNOWN', className: '!border-zinc-400' },
]

function NewDeckForm({ onDone }: { onDone?: () => void }) {
  const createDeck = useStudyStore((s) => s.createDeck)
  const busy = useStudyStore((s) => s.busy)
  const t = useT()
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
        label={t('deckName')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="max-md:w-full"
      />
      <Select
        label={t('cards')}
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
        <option value="CHARACTER">{t('cardsCharacter')}</option>
        <option value="WORD">{t('cardsWord')}</option>
      </Select>
      <Btn
        type="submit"
        variant="outlined"
        className="max-md:w-full"
        disabled={busy}
      >
        {t('createDeck')}
      </Btn>
    </form>
  )
}

function Counts() {
  const study = useStudyStore((s) => s.pendingNext ?? s.study)
  const t = useT()
  if (!study) return null
  const { counts } = study
  return (
    <div className="flex gap-3 px-2 font-['HelveticaNeueMedium']">
      <span className="text-sky-400" title={t('countNew')}>
        {counts.new}
      </span>
      <span className="text-red-400" title={t('countLearning')}>
        {counts.learning}
      </span>
      <span className="text-green-400" title={t('countReview')}>
        {counts.review}
      </span>
    </div>
  )
}

const TABS = ['meaning', 'draw', 'related'] as const
type Tab = (typeof TABS)[number]

/**
 * The revealed card's details. Meaning, drawing practice and related vocab
 * share one space as tabs instead of stacking. None of them affect scheduling.
 */
function CardDetails({ card }: { card: Card }) {
  const [tab, setTab] = useState<Tab>('meaning')
  const t = useT()

  // The tabs fill whatever height is left on screen; size the drawing canvas
  // to fit it (leaving room for the mode toggle and buttons).
  const panelRef = useRef<HTMLDivElement>(null)
  const [drawSize, setDrawSize] = useState(260)
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const observer = new ResizeObserver(() =>
      setDrawSize(
        Math.round(
          // Reserve room for the mode toggle, the result lines and buttons
          Math.max(140, Math.min(340, el.clientWidth, el.clientHeight - 156)),
        ),
      ),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex border-b border-zinc-800" role="tablist">
        {TABS.map((key) => (
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
            {t(key)}
          </button>
        ))}
      </div>
      {/* Fills the space between the tabs and the rating buttons */}
      <div
        ref={panelRef}
        className={cn(
          'min-h-0 flex-1',
          // The draw tab is sized to fit; the others may scroll if long
          tab === 'draw' ? 'overflow-hidden' : 'overflow-y-auto',
        )}
      >
        {tab === 'meaning' && <CardBack card={card} />}
        {tab === 'draw' && <PracticeDrawing card={card} size={drawSize} />}
        {tab === 'related' && <PracticeRelated card={card} />}
      </div>
    </div>
  )
}

/** '10m' -> '10分钟', '3.5d' -> '3.5天' */
function intervalZh(label: string | undefined) {
  if (!label) return label
  const units: Record<string, string> = {
    m: '分钟',
    h: '小时',
    d: '天',
    mo: '个月',
  }
  return label.replace(/(mo|m|h|d)$/, (u) => units[u])
}

function StudyPanel() {
  const {
    study,
    revealed,
    reveal,
    answer,
    busy,
    refresh,
    studyMore,
    language,
  } = useStudyStore()
  const t = useT()

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

  if (!study) return <Spinner />

  const { card, remediation } = study
  if (remediation && card) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto pb-3">
        <RemediationPanel card={card} remediation={remediation} />
      </div>
    )
  }

  if (!card) {
    return (
      <div className="flex flex-col items-start gap-3 py-10">
        <div className="font-['HelveticaNeueBold'] text-3xl">
          {t('doneForNow')}
        </div>
        <div className="text-zinc-400">
          {study.nextDueAt
            ? t('nextDue', { when: new Date(study.nextDueAt).toLocaleString() })
            : t('noneScheduled')}
          {study.counts.new === 0 && t('limitReached')}
        </div>
        <div className="flex flex-wrap gap-3">
          <Btn variant="outlined" onClick={studyMore} disabled={busy}>
            {t('keepGoing')}
          </Btn>
          <Btn variant="text" onClick={refresh}>
            {t('checkAgain')}
          </Btn>
        </div>
      </div>
    )
  }

  const preview = Object.fromEntries(
    card.intervalPreview.map((p) => [p.rating, p.label]),
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 md:gap-5">
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {t(`state_${card.state}`)}
        {card.lapses ? ` · ${t('lapses', { n: card.lapses })}` : ''}
      </div>
      <CardFront card={card} compact={revealed} />
      {revealed ? (
        <>
          <CardDetails key={card.id} card={card} />
          <div className="grid shrink-0 grid-cols-5 gap-3 pb-3 max-md:gap-1.5">
            {RATINGS.map(({ rating, className }, i) => (
              <Btn
                key={rating}
                variant="outlined"
                disabled={busy}
                className={cn(
                  '!flex !flex-col items-center max-md:!px-1 max-md:!py-1',
                  className,
                )}
                onClick={() => answer(rating)}
              >
                <span className="text-xs text-zinc-400">
                  {rating === 'KNOWN'
                    ? t('never')
                    : language === 'zh'
                      ? intervalZh(preview[rating])
                      : preview[rating]}
                </span>
                <span>{t(rating)}</span>
                <span className="text-[10px] text-zinc-500 max-md:hidden">
                  {i + 1}
                </span>
              </Btn>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex-1" />
          {/* Where the rating buttons will appear, within thumb reach */}
          <Btn
            variant="outlined"
            onClick={reveal}
            className="mb-3 shrink-0 self-stretch md:self-center"
          >
            {t('showAnswer')}
          </Btn>
        </>
      )}
    </div>
  )
}

export function ChineseFlashcards() {
  const {
    decks,
    decksLoaded,
    deckId,
    selectDeck,
    loadDecks,
    error,
    study,
    language,
    setLanguage,
  } = useStudyStore()
  const t = useT()
  const [mode, setMode] = useState<'study' | 'settings' | 'new'>('study')

  useEffect(() => {
    loadDecks()
  }, [loadDecks])

  const deck = decks.find((d) => d.id === deckId) ?? study?.deck

  return (
    // While studying the page is exactly one screen tall and never scrolls;
    // settings and new-deck screens scroll normally.
    <div
      className={cn(
        'h-dvh w-full overflow-x-hidden',
        mode === 'study' && decks.length > 0
          ? 'overflow-hidden'
          : 'overflow-y-auto',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-4xl flex-col gap-3 px-4 pt-3 md:gap-6 md:px-10 md:pt-8',
          mode === 'study' && decks.length > 0 ? 'h-full' : 'pb-10',
        )}
      >
        <div className="flex shrink-0 items-center gap-2">
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
              {t('settings')}
            </Btn>
          )}
        </div>
        {error && (
          <div className="border border-red-500 px-4 py-2 text-red-300">
            {error}
          </div>
        )}

        {!decksLoaded ? (
          // Until decks arrive we don't know if any exist: don't offer to create one
          <Spinner />
        ) : decks.length === 0 || mode === 'new' ? (
          <div className="flex flex-col gap-4">
            <div className="font-['HelveticaNeueLight'] text-xl text-zinc-300">
              {t('intro')}
            </div>
            <NewDeckForm onDone={() => setMode('study')} />
            {decks.length > 0 && (
              <Btn
                variant="text"
                className="self-start"
                onClick={() => setMode('study')}
              >
                {t('cancel')}
              </Btn>
            )}
          </div>
        ) : mode === 'settings' && deck ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end gap-3">
              <Select
                label={t('language')}
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
                className="w-40 max-md:w-full"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
              </Select>
              {decks.length > 1 && (
                <Select
                  label={t('deck')}
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
                {t('newDeck')}
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
