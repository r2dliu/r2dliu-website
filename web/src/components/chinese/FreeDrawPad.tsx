import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'

import { useT } from '../../helpers/chinese/i18n'
import { HanziCanvas, loadStrokes } from './HanziCanvas'
import { Btn, NO_SELECT, noSelectWhileDrawing } from './ui'
import type {
  DrawingResult,
  DrawnStroke,
  StrokeData,
} from '../../helpers/chinese/api'

const PAD = 8

/**
 * Draw a whole character freely, then score it. Coordinates are converted to
 * Make Me a Hanzi's 1024 box (y up, baseline at -124), the same space as the
 * reference strokes, so the server can compare them.
 */
export function FreeDrawPad({
  hanzi,
  size = 280,
  onSubmit,
  next,
  footer,
}: {
  hanzi: string
  size?: number
  /** Score the drawing; resolve to null if it failed */
  onSubmit: (strokes: Array<DrawnStroke>) => Promise<DrawingResult | null>
  /** Shown after a result: move on, e.g. to the word's next character */
  next?: { label: string; onClick: () => void }
  /** Extra line under the result, e.g. whether it counted */
  footer?: (result: DrawingResult) => React.ReactNode
}) {
  const t = useT()
  const scale = (size - 2 * PAD) / 1024
  const [strokes, setStrokes] = useState<Array<Array<[number, number]>>>([])
  const [result, setResult] = useState<DrawingResult | null>(null)
  const [reference, setReference] = useState<StrokeData | null>(null)
  const [showing, setShowing] = useState(false)
  const [checking, setChecking] = useState(false)
  const drawing = useRef(false)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    loadStrokes(hanzi).then(setReference)
  }, [hanzi])

  const point = (e: React.PointerEvent): [number, number] => {
    const rect = svgRef.current!.getBoundingClientRect()
    return [
      ((e.clientX - rect.left) / rect.width) * size,
      ((e.clientY - rect.top) / rect.height) * size,
    ]
  }

  const onDown = (e: React.PointerEvent) => {
    if (result) return
    e.preventDefault()
    svgRef.current?.setPointerCapture(e.pointerId)
    drawing.current = true
    setStrokes((s) => [...s, [point(e)]])
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const p = point(e)
    setStrokes((s) => {
      const last = s[s.length - 1]
      const [lx, ly] = last[last.length - 1]
      if (Math.hypot(p[0] - lx, p[1] - ly) < 2) return s
      return [...s.slice(0, -1), [...last, p]]
    })
  }
  // A tap or a tiny wobble isn't a stroke: drop it unless the pointer
  // travelled at least this far (px)
  const minStroke = Math.max(8, size * 0.03)
  const onUp = () => {
    if (!drawing.current) return
    drawing.current = false
    setStrokes((s) => {
      const last = s[s.length - 1]
      let length = 0
      for (let i = 1; i < last.length; i++) {
        length += Math.hypot(
          last[i][0] - last[i - 1][0],
          last[i][1] - last[i - 1][1],
        )
      }
      return length < minStroke ? s.slice(0, -1) : s
    })
  }

  const toReference = (s: Array<[number, number]>): DrawnStroke =>
    s.map(([x, y]) => [
      Math.round((x - PAD) / scale),
      Math.round((size - PAD - y) / scale - 124),
    ])

  const check = async () => {
    if (!strokes.length) return
    setChecking(true)
    const r = await onSubmit(strokes.map(toReference))
    setChecking(false)
    if (r) setResult(r)
  }

  const reset = () => {
    setStrokes([])
    setResult(null)
    setShowing(false)
  }

  // Score of each drawn stroke, for colouring the result
  const strokeScore = (i: number) =>
    result?.matches.find((m) => m.drawnIndex === i)?.score ?? 0
  const colour = (score: number) =>
    score >= 0.7 ? '#4ade80' : score >= 0.4 ? '#fbbf24' : '#f87171'

  // The canvas, then one row of buttons, then a fixed-height area for the
  // result: every state has the same layout, so nothing moves around.
  let controls: React.ReactNode
  if (showing) {
    controls = (
      <Btn variant="text" onClick={() => setShowing(false)}>
        {t('backToDrawing')}
      </Btn>
    )
  } else if (result) {
    controls = (
      <>
        <Btn variant="outlined" onClick={reset}>
          {t('drawAgain')}
        </Btn>
        {next && (
          <Btn variant="outlined" onClick={next.onClick}>
            {next.label}
          </Btn>
        )}
        <Btn variant="text" onClick={() => setShowing(true)}>
          {t('showStrokes')}
        </Btn>
      </>
    )
  } else {
    controls = (
      <>
        <Btn
          variant="outlined"
          className="min-w-24 max-md:min-w-20"
          onClick={check}
          disabled={!strokes.length || checking}
        >
          {checking ? t('checking') : t('check')}
        </Btn>
        <Btn
          variant="text"
          onClick={() => setStrokes((s) => s.slice(0, -1))}
          disabled={!strokes.length}
        >
          {t('undo')}
        </Btn>
        <Btn variant="text" onClick={reset} disabled={!strokes.length}>
          {t('clear')}
        </Btn>
        <Btn variant="text" onClick={() => setShowing(true)}>
          {t('showStrokes')}
        </Btn>
      </>
    )
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', NO_SELECT)}>
      <div
        className="relative"
        style={{ width: size, height: size }}
        {...noSelectWhileDrawing()}
      >
        {showing ? (
          <HanziCanvas hanzi={hanzi} mode="animate" size={size} />
        ) : (
          <svg
            ref={svgRef}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="touch-none select-none border border-zinc-700 bg-zinc-950"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <g stroke="#27272a" strokeDasharray="4 4">
              <line x1={0} y1={0} x2={size} y2={size} />
              <line x1={size} y1={0} x2={0} y2={size} />
              <line x1={size / 2} y1={0} x2={size / 2} y2={size} />
              <line x1={0} y1={size / 2} x2={size} y2={size / 2} />
            </g>
            {/* The reference only appears with the result, never while drawing */}
            {reference && result && (
              <g
                transform={`translate(${PAD}, ${size - PAD - 124 * scale}) scale(${scale}, ${-scale})`}
                fill="#52525b"
              >
                {reference.strokes.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            )}
            {strokes.map((s, i) => (
              <polyline
                key={i}
                points={s.map((p) => p.join(',')).join(' ')}
                fill="none"
                stroke={result ? colour(strokeScore(i)) : '#ffffff'}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>
        )}
        {/* Score sits on the canvas so the result adds little height */}
        {result && !showing && (
          <div className="pointer-events-none absolute left-2 top-1 font-['HelveticaNeueBold'] text-2xl">
            {Math.round(result.accuracy)}%
          </div>
        )}
      </div>

      <div className="flex min-h-10 flex-nowrap justify-center gap-2 whitespace-nowrap max-md:gap-0.5 [&>button]:max-md:!px-1.5">
        {controls}
      </div>

      {/* Room for the result's lines whether or not there is one yet */}
      <div className="flex min-h-14 w-full max-w-sm flex-col items-center gap-0.5 text-center text-xs text-zinc-400">
        {result && (
          <>
            <div>
              {t('strokesLine', {
                s: result.drawnStrokes,
                e: result.expectedStrokes,
                o: result.inOrder,
                d: result.correctDirection,
              })}
            </div>
            {result.recognized.length > 0 && (
              <div>
                {result.recognized[0].hanzi === hanzi ? (
                  <>{t('recognised', { h: hanzi })}</>
                ) : (
                  <>
                    {t('looksLike')}{' '}
                    <span className="text-base text-white">
                      {result.recognized[0].hanzi}
                    </span>
                  </>
                )}
                {result.recognized.length > 1 &&
                  t('also', {
                    list: result.recognized
                      .slice(1, 4)
                      .map((r) => r.hanzi)
                      .join(' '),
                  })}
              </div>
            )}
            {footer?.(result)}
          </>
        )}
      </div>
    </div>
  )
}
