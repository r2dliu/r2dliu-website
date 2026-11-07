import { useEffect, useRef, useState } from 'react'

import { HanziCanvas, loadStrokes } from './HanziCanvas'
import { Btn } from './ui'
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
  footer,
}: {
  hanzi: string
  size?: number
  /** Score the drawing; resolve to null if it failed */
  onSubmit: (strokes: Array<DrawnStroke>) => Promise<DrawingResult | null>
  /** Extra line under the result, e.g. whether it counted */
  footer?: (result: DrawingResult) => React.ReactNode
}) {
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
  const onUp = () => {
    drawing.current = false
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

  if (showing) {
    return (
      <div className="flex flex-col items-center gap-2">
        <HanziCanvas hanzi={hanzi} mode="animate" size={size} />
        <Btn variant="text" onClick={() => setShowing(false)}>
          Back to drawing
        </Btn>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
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
        {/* Score sits on the canvas so the result adds little height */}
        {result && (
          <div className="pointer-events-none absolute left-2 top-1 font-['HelveticaNeueBold'] text-2xl">
            {Math.round(result.accuracy)}%
          </div>
        )}
      </div>

      {result ? (
        <div className="flex w-full max-w-sm flex-col items-center gap-0.5 text-center text-xs text-zinc-400">
          <div>
            Strokes {result.drawnStrokes}/{result.expectedStrokes} · Order{' '}
            {result.inOrder}/{result.expectedStrokes} · Direction{' '}
            {result.correctDirection}/{result.expectedStrokes}
          </div>
          {result.recognized.length > 0 && (
            <div>
              {result.recognized[0].hanzi === hanzi ? (
                <>Recognised as {hanzi} ✓</>
              ) : (
                <>
                  Looks more like{' '}
                  <span className="text-base text-white">
                    {result.recognized[0].hanzi}
                  </span>
                </>
              )}
              {result.recognized.length > 1 &&
                ` · also ${result.recognized
                  .slice(1, 4)
                  .map((r) => r.hanzi)
                  .join(' ')}`}
            </div>
          )}
          {footer?.(result)}
          <div className="flex gap-2 pt-1.5">
            <Btn variant="outlined" onClick={reset}>
              Draw again
            </Btn>
            <Btn variant="text" onClick={() => setShowing(true)}>
              Show strokes
            </Btn>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2 max-md:gap-1 [&>button]:max-md:!px-2">
          <Btn
            variant="outlined"
            onClick={check}
            disabled={!strokes.length || checking}
          >
            {checking ? 'Checking…' : 'Check'}
          </Btn>
          <Btn
            variant="text"
            onClick={() => setStrokes((s) => s.slice(0, -1))}
            disabled={!strokes.length}
          >
            Undo
          </Btn>
          <Btn variant="text" onClick={reset} disabled={!strokes.length}>
            Clear
          </Btn>
          <Btn variant="text" onClick={() => setShowing(true)}>
            Show strokes
          </Btn>
        </div>
      )}
    </div>
  )
}
