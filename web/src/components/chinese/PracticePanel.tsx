import cn from 'classnames'
import { useEffect, useState } from 'react'

import { useStudyStore } from '../../stores/chinese/studyStore'
import { api } from '../../helpers/chinese/api'
import { useT } from '../../helpers/chinese/i18n'
import { DrawingPad } from './DrawingPad'
import { FreeDrawPad } from './FreeDrawPad'
import { RelatedTabs } from './RelatedList'
import { NO_SELECT, Spinner } from './ui'
import type { Card, RelatedGroup } from '../../helpers/chinese/api'

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
  const t = useT()
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
    return <div className="text-zinc-400">{t('noStrokeData')}</div>
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', NO_SELECT)}>
      <div className="flex flex-wrap justify-center gap-4">
        <Choice
          options={[
            ['free', t('freeDraw')],
            ['guided', t('guided')],
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
            onComplete={(m) => setResult(t('guidedDone', { m }))}
          />
          <div className="text-sm text-zinc-400">
            {result ?? t('mistakes', { m: mistakes })}
          </div>
        </>
      )}
    </div>
  )
}

/** Optional related vocab for any card. */
export function PracticeRelated({ card }: { card: Card }) {
  const run = useStudyStore((s) => s.run)
  const [groups, setGroups] = useState<Array<RelatedGroup> | null>(null)

  useEffect(() => {
    setGroups(null)
    run(() => api.relatedGroups(card.id)).then((r) => setGroups(r ?? []))
  }, [card.id, run])

  if (!groups) return <Spinner />
  return <RelatedTabs groups={groups} />
}
