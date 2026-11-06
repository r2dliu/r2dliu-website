import cn from 'classnames'
import { useEffect, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { api } from '../../helpers/chinese/api'
import { DrawingPad } from './DrawingPad'
import { RelatedList } from './RelatedList'
import type { Card, RelatedItem } from '../../helpers/chinese/api'

/** Optional drawing practice for any card; nothing is recorded. */
export function PracticeDrawing({ card }: { card: Card }) {
  const chars = card.character
    ? [card.character]
    : (card.word?.characters ?? [])
  const unique = chars.filter(
    (c, i) =>
      c.strokeCount && chars.findIndex((x) => x.hanzi === c.hanzi) === i,
  )
  const [current, setCurrent] = useState(unique[0]?.hanzi ?? '')
  const [mistakes, setMistakes] = useState(0)
  const [result, setResult] = useState<string | null>(null)

  if (!unique.length) {
    return <div className="text-zinc-400">No stroke data for this card.</div>
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {unique.length > 1 && (
        <div className="flex gap-2">
          {unique.map((c) => (
            <button
              key={c.hanzi}
              type="button"
              onClick={() => {
                setCurrent(c.hanzi)
                setResult(null)
                setMistakes(0)
              }}
              className={cn(
                'cursor-pointer border bg-black px-3 py-1 text-xl text-white',
                {
                  'border-white': c.hanzi === current,
                  'border-zinc-700 text-zinc-500': c.hanzi !== current,
                },
              )}
            >
              {c.hanzi}
            </button>
          ))}
        </div>
      )}
      <DrawingPad
        key={current}
        hanzi={current}
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
