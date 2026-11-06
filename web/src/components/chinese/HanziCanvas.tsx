import { useEffect, useRef, useState } from 'react'
import { api } from '../../helpers/chinese/api'
import type HanziWriter from 'hanzi-writer'

import type { StrokeData } from '../../helpers/chinese/api'

const strokeCache = new Map<string, Promise<StrokeData | null>>()

/** Stroke data comes from our own strokes table, not the Hanzi Writer CDN. */
function loadStrokes(hanzi: string) {
  if (!strokeCache.has(hanzi)) {
    strokeCache.set(hanzi, api.strokeData(hanzi))
  }
  return strokeCache.get(hanzi)!
}

interface Props {
  hanzi: string
  mode: 'animate' | 'quiz' | 'static'
  size?: number
  showOutline?: boolean
  onQuizComplete?: (totalMistakes: number) => void
  onQuizMistake?: (totalMistakes: number) => void
  /** Change to restart the quiz/animation */
  resetKey?: number
}

export function HanziCanvas({
  hanzi,
  mode,
  size = 200,
  showOutline = true,
  onQuizComplete,
  onQuizMistake,
  resetKey = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriter | null>(null)
  const [missing, setMissing] = useState(false)
  // Keep callbacks current without restarting the writer
  const callbacks = useRef({ onQuizComplete, onQuizMistake })
  callbacks.current = { onQuizComplete, onQuizMistake }

  useEffect(() => {
    let cancelled = false
    const el = ref.current
    if (!el) return

    Promise.all([import('hanzi-writer'), loadStrokes(hanzi)]).then(
      ([{ default: Writer }, data]) => {
        if (cancelled) return
        if (!data || !data.strokes.length) {
          setMissing(true)
          return
        }
        setMissing(false)
        el.innerHTML = ''
        const writer = Writer.create(el, hanzi, {
          width: size,
          height: size,
          padding: 8,
          showOutline: mode === 'quiz' ? showOutline : true,
          showCharacter: mode !== 'quiz',
          strokeColor: '#ffffff',
          radicalColor: '#7dd3fc',
          outlineColor: '#3f3f46',
          drawingColor: '#ffffff',
          highlightColor: '#fbbf24',
          drawingWidth: 6,
          strokeAnimationSpeed: 1.5,
          delayBetweenStrokes: 250,
          charDataLoader: () => data,
        })
        writerRef.current = writer
        if (mode === 'animate') {
          writer.loopCharacterAnimation()
        } else if (mode === 'quiz') {
          writer.quiz({
            onMistake: (s) =>
              callbacks.current.onQuizMistake?.(s.totalMistakes),
            onComplete: (s) =>
              callbacks.current.onQuizComplete?.(s.totalMistakes),
          })
        }
      },
    )

    return () => {
      cancelled = true
      writerRef.current?.cancelQuiz()
      writerRef.current = null
      el.innerHTML = ''
    }
  }, [hanzi, mode, size, showOutline, resetKey])

  return (
    <div
      className="relative border border-zinc-700 bg-zinc-950"
      style={{ width: size, height: size }}
    >
      {/* Rice-paper guide lines */}
      <svg
        className="pointer-events-none absolute inset-0"
        width={size}
        height={size}
        aria-hidden
      >
        <g stroke="#27272a" strokeDasharray="4 4">
          <line x1={0} y1={0} x2={size} y2={size} />
          <line x1={size} y1={0} x2={0} y2={size} />
          <line x1={size / 2} y1={0} x2={size / 2} y2={size} />
          <line x1={0} y1={size / 2} x2={size} y2={size / 2} />
        </g>
      </svg>
      <div ref={ref} className="relative touch-none" />
      {missing && (
        <div
          className="absolute inset-0 flex items-center justify-center text-white"
          style={{ fontSize: size * 0.7 }}
        >
          {hanzi}
        </div>
      )}
    </div>
  )
}
