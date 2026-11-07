import cn from 'classnames'
import { useEffect, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { api } from '../../helpers/chinese/api'
import { DrawingPad } from './DrawingPad'
import { FreeDrawPad } from './FreeDrawPad'
import { RelatedList } from './RelatedList'
import type { Card, RelatedItem } from '../../helpers/chinese/api'

function Choice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<[T, string]>
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'min-w-10 cursor-pointer border bg-black px-3 py-1 text-white',
            {
              'border-white': key === value,
              'border-zinc-700 text-zinc-500': key !== value,
            },
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/** Optional drawing practice for any card; nothing is recorded. */
export function PracticeDrawing({
  card,
  size,
}: {
  card: Card
  /** Canvas size in px, to fit the space available */
  size?: number
}) {
  const run = useStudyStore((s) => s.run)
  const chars = card.character
    ? [card.character]
    : (card.word?.characters ?? [])
  const unique = chars.filter(
    (c, i) =>
      c.strokeCount && chars.findIndex((x) => x.hanzi === c.hanzi) === i,
  )
  const [current, setCurrent] = useState(unique[0]?.hanzi ?? '')
  const [mode, setMode] = useState<'free' | 'guided'>('free')
  const [mistakes, setMistakes] = useState(0)
  const [result, setResult] = useState<string | null>(null)

  if (!unique.length) {
    return <div className="text-zinc-400">No stroke data for this card.</div>
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-4">
        <Choice
          options={[
            ['free', 'Free draw'],
            ['guided', 'Guided'],
          ]}
          value={mode}
          onChange={setMode}
        />
        {unique.length > 1 && (
          <Choice
            options={unique.map((c) => [c.hanzi, c.hanzi])}
            value={current}
            onChange={(h) => {
              setCurrent(h)
              setResult(null)
              setMistakes(0)
            }}
          />
        )}
      </div>
      {mode === 'free' ? (
        <FreeDrawPad
          key={current}
          hanzi={current}
          size={size}
          onSubmit={async (strokes) =>
            (await run(() => api.scoreDrawing(current, strokes))) ?? null
          }
        />
      ) : (
        <>
          <DrawingPad
            key={current}
            hanzi={current}
            size={size}
            onMistake={(m) => {
              setMistakes(m)
              if (m === 0) setResult(null)
            }}
            onComplete={(m) =>
              setResult(`Done with ${m} mistake${m === 1 ? '' : 's'}.`)
            }
          />
          <div className="text-sm text-zinc-400">
            {result ?? `Mistakes: ${mistakes}`}
          </div>
        </>
      )}
    </div>
  )
}

/** Optional related vocab for any card. */
export function PracticeRelated({ card }: { card: Card }) {
  const run = useStudyStore((s) => s.run)
  const [items, setItems] = useState<Array<RelatedItem> | null>(null)

  useEffect(() => {
    setItems(null)
    run(() => api.relatedItems(card.id)).then((r) => setItems(r ?? []))
  }, [card.id, run])

  if (!items) return <div className="text-zinc-400">Loading…</div>
  return <RelatedList items={items} />
}
