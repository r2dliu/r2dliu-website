import cn from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { api } from '../../helpers/chinese/api'
import { useDefinition, useT } from '../../helpers/chinese/i18n'
import { CardDetails } from './CardDetails'
import { CardFront } from './CardFace'
import { summary } from './RelatedList'
import { Btn, Spinner } from './ui'
import type {
  Card,
  CardAction,
  CardState,
  Deck,
  DeckFilter,
  DeckItem,
} from '../../helpers/chinese/api'

const FILTERS: Array<DeckFilter> = [
  'ALL',
  'NEW',
  'LEARNING',
  'REVIEW',
  'KNOWN',
  'UPCOMING',
]

const STATE_COLOURS: Record<CardState, string> = {
  NEW: 'text-sky-400',
  LEARNING: 'text-red-400',
  RELEARNING: 'text-red-400',
  REVIEW: 'text-green-400',
  KNOWN: 'text-zinc-400',
  UPCOMING: 'text-zinc-600',
}

/** '3d', '2h', '10m' (or 3天, 2小时, 10分钟) until a time */
function useUntil() {
  const zh = useStudyStore((s) => s.language) === 'zh'
  return (iso: string) => {
    const s = (new Date(iso).getTime() - Date.now()) / 1000
    if (s <= 0) return null
    const [n, unit] =
      s < 3600
        ? [Math.round(s / 60), zh ? '分钟' : 'm']
        : s < 86400
          ? [Math.round(s / 3600), zh ? '小时' : 'h']
          : s < 30 * 86400
            ? [Math.round(s / 86400), zh ? '天' : 'd']
            : [Math.round(s / (30 * 86400)), zh ? '个月' : 'mo']
    return `${Math.max(1, n)}${unit}`
  }
}

function StateLabel({ item }: { item: DeckItem }) {
  const t = useT()
  const until = useUntil()
  const scheduled = ['LEARNING', 'RELEARNING', 'REVIEW'].includes(item.state)
  const wait = scheduled && item.due ? until(item.due) : null
  return (
    <div className="flex shrink-0 flex-col items-end text-xs">
      <span className={STATE_COLOURS[item.state]}>
        {t(`state_${item.state}`)}
      </span>
      {scheduled && (
        <span className="text-zinc-500">
          {wait ? t('dueIn', { d: wait }) : t('dueNow')}
        </span>
      )}
    </div>
  )
}

/** One card, full size, with its tabs and the actions you can take on it. */
function CardView({
  deckId,
  item,
  position,
  onBack,
  onPrev,
  onNext,
  onChanged,
}: {
  deckId: string
  item: DeckItem
  position: string
  onBack: () => void
  onPrev?: () => void
  onNext?: () => void
  onChanged: (item: DeckItem) => void
}) {
  const t = useT()
  const { run, busy } = useStudyStore()
  const [card, setCard] = useState<Card | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setCard(null)
    setMessage(null)
    run(() => api.card(deckId, item)).then((c) => setCard(c ?? null))
    // Only reload for a different row, not when this one's state changes
  }, [deckId, item.key])

  const update = (next: Card, note?: string) => {
    setCard(next)
    setMessage(note ?? null)
    onChanged({
      ...item,
      state: next.state,
      cardId: next.id,
      due: new Date().toISOString(),
    })
  }

  const act = async (action: CardAction) => {
    if (!card) return
    const next = await run(() => api.editCard(card.id, action))
    if (next) update(next, action === 'STUDY_NOW' ? t('queuedNow') : undefined)
  }

  // Add something not in the deck yet, to be studied straight away
  const learnNext = async () => {
    const next = await run(async () => {
      const added = await api.addToDeck(deckId, item.hanzi)
      return api.editCard(added.id, 'STUDY_NOW')
    })
    if (next) update(next, t('queuedNow'))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 items-center gap-2">
        <Btn variant="text" className="!px-0" onClick={onBack}>
          ← {t('back')}
        </Btn>
        <div className="flex-1 text-center text-xs text-zinc-500">
          {position}
        </div>
        <Btn
          variant="text"
          className="!px-3 !text-2xl !leading-none"
          aria-label={t('prev')}
          disabled={!onPrev}
          onClick={onPrev}
        >
          ‹
        </Btn>
        <Btn
          variant="text"
          className="!px-3 !text-2xl !leading-none"
          aria-label={t('next')}
          disabled={!onNext}
          onClick={onNext}
        >
          ›
        </Btn>
      </div>
      {!card ? (
        <Spinner />
      ) : (
        <>
          <div className="flex shrink-0 items-center justify-between">
            <StateLabel item={{ ...item, state: card.state }} />
            {card.lapses > 0 && (
              <span className="text-xs text-zinc-500">
                {t('lapses', { n: card.lapses })}
              </span>
            )}
          </div>
          <CardFront card={card} compact />
          <CardDetails key={card.id} card={card} />
          {message && (
            <div className="shrink-0 text-sm text-green-400">{message}</div>
          )}
          <div className="flex shrink-0 flex-wrap gap-2 pb-3">
            {card.state === 'UPCOMING' ? (
              <Btn variant="outlined" disabled={busy} onClick={learnNext}>
                {t('learnNext')}
              </Btn>
            ) : (
              <>
                <Btn
                  variant="outlined"
                  disabled={busy}
                  onClick={() => act('STUDY_NOW')}
                >
                  {t('studyNow')}
                </Btn>
                {card.state !== 'KNOWN' && (
                  <Btn
                    variant="outlined"
                    disabled={busy}
                    onClick={() => act('KNOWN')}
                  >
                    {t('markKnown')}
                  </Btn>
                )}
                {card.state !== 'NEW' && (
                  <Btn
                    variant="text"
                    disabled={busy}
                    onClick={() => act('RESET')}
                  >
                    {t('resetCard')}
                  </Btn>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Browse a deck: every card in frequency order, filtered by state or search,
 * plus what isn't in the deck yet. Tap one to view it and change it.
 */
export function DeckBrowser({
  deck,
  onClose,
}: {
  deck: Deck
  onClose: () => void
}) {
  const t = useT()
  const definition = useDefinition()
  const run = useStudyStore((s) => s.run)
  const [filter, setFilter] = useState<DeckFilter>('ALL')
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<Array<DeckItem>>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)
  const request = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Search as you type, once typing pauses
  useEffect(() => {
    const id = setTimeout(() => setSearch(query.trim()), 250)
    return () => clearTimeout(id)
  }, [query])

  const load = useCallback(
    async (offset: number) => {
      const id = ++request.current
      setLoading(true)
      const page = await run(() =>
        api.deckItems(deck.id, filter, search, offset),
      )
      if (id !== request.current) return
      setLoading(false)
      if (!page) return
      setTotal(page.total)
      setItems((prev) => (offset === 0 ? page.items : [...prev, ...page.items]))
    },
    [deck.id, filter, search, run],
  )

  useEffect(() => {
    setItems([])
    listRef.current?.scrollTo({ top: 0 })
    load(0)
  }, [load])

  const hasMore = items.length < total
  const loadMore = useCallback(() => {
    if (!loading && hasMore) load(items.length)
  }, [loading, hasMore, load, items.length])

  // Load the next page when the end of the list scrolls into view
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && loadMore(),
      { root: listRef.current, rootMargin: '400px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  const step = (delta: number) => {
    if (selected === null) return
    const next = selected + delta
    if (next >= items.length - 5) loadMore()
    if (next >= 0 && next < items.length) setSelected(next)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {selected !== null && items[selected] && (
        <CardView
          deckId={deck.id}
          item={items[selected]}
          position={`${selected + 1} / ${total}`}
          onBack={() => setSelected(null)}
          onPrev={selected > 0 ? () => step(-1) : undefined}
          onNext={
            selected < items.length - 1 || hasMore ? () => step(1) : undefined
          }
          onChanged={(changed) =>
            setItems((prev) =>
              prev.map((i, n) => (n === selected ? changed : i)),
            )
          }
        />
      )}

      {/* Kept mounted while a card is open, so the scroll position stays */}
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-3',
          selected !== null && 'hidden',
        )}
      >
        <div className="flex shrink-0 items-center gap-2">
          <Btn variant="text" className="!px-0" onClick={onClose}>
            ← {t('done')}
          </Btn>
          <div className="flex-1 truncate text-right font-['HelveticaNeueMedium']">
            {deck.name}
          </div>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search')}
          className="h-10 shrink-0 border border-zinc-600 bg-black px-3 text-base text-white outline-none focus:border-white"
        />
        <div className="flex shrink-0 gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'shrink-0 cursor-pointer border bg-black px-3 py-1 text-sm',
                f === filter
                  ? 'border-white text-white'
                  : 'border-zinc-700 text-zinc-500',
              )}
            >
              {t(`filter_${f}`)}
            </button>
          ))}
        </div>
        <div className="shrink-0 text-xs text-zinc-500">
          {filter === 'UPCOMING'
            ? t('upcomingCount', { n: total })
            : t('itemCount', { n: total })}
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto pb-3">
          {!loading && items.length === 0 && (
            <div className="py-6 text-zinc-500">{t('noItems')}</div>
          )}
          <ul className="flex flex-col divide-y divide-zinc-800">
            {items.map((item, i) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  className="flex w-full cursor-pointer items-center gap-3 bg-transparent px-1 py-2.5 text-left text-white hover:bg-zinc-900"
                >
                  <span className="min-w-12 text-2xl leading-none">
                    {item.hanzi}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-['HelveticaNeueMedium'] text-sm">
                      {item.pinyin}
                    </span>
                    <span className="truncate font-['HelveticaNeueLight'] text-sm text-zinc-400">
                      {summary(definition(item))}
                    </span>
                  </span>
                  <StateLabel item={item} />
                </button>
              </li>
            ))}
          </ul>
          <div ref={sentinelRef} />
          {loading && <Spinner className="py-6" />}
          {!loading && hasMore && (
            <Btn variant="text" className="mt-2" onClick={loadMore}>
              {t('loadMore')}
            </Btn>
          )}
        </div>
      </div>
    </div>
  )
}
