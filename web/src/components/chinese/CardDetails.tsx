import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'

import { useT } from '../../helpers/chinese/i18n'
import { CardBack } from './CardFace'
import { PracticeDrawing, PracticeRelated } from './PracticePanel'
import type { Card } from '../../helpers/chinese/api'

const TABS = ['meaning', 'draw', 'related'] as const
type Tab = (typeof TABS)[number]

/**
 * The revealed card's details. Meaning, drawing practice and related vocab
 * share one space as tabs instead of stacking. None of them affect scheduling.
 */
export function CardDetails({ card }: { card: Card }) {
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
