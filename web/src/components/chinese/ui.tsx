// Plain Tailwind form controls in the site's black/white style (like the
// stacker game's buttons), so the feature doesn't depend on MUI form styling.
import CircularProgress from '@mui/material/CircularProgress'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'

export function Btn({
  className,
  variant = 'outlined',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'outlined' | 'text'
}) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "cursor-pointer px-4 py-1.5 font-['HelveticaNeueMedium'] text-sm uppercase tracking-wide text-white transition-colors disabled:cursor-default disabled:opacity-40",
        {
          'min-h-10 border-2 border-white bg-black enabled:hover:bg-white enabled:hover:text-black':
            variant === 'outlined',
          'border-0 bg-transparent enabled:hover:underline': variant === 'text',
        },
        className,
      )}
    />
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <label
      className={cn('flex flex-col gap-1 text-xs text-zinc-400', className)}
    >
      {label}
      {children}
    </label>
  )
}

const controlClass =
  'h-10 border border-zinc-600 bg-black px-3 text-base text-white outline-none focus:border-white'

export function Input({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <Field label={label} className={className}>
      <input {...props} className={controlClass} />
    </Field>
  )
}

export function Select({
  label,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <Field label={label} className={className}>
      <select {...props} className={controlClass}>
        {children}
      </select>
    </Field>
  )
}

/**
 * Loading indicator for the flashcards page: the same white MUI
 * CircularProgress the old climbing classes page used.
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-16', className)}>
      <CircularProgress sx={{ color: 'white' }} aria-label="Loading" />
    </div>
  )
}

/**
 * Text clamped to a few lines. When it's longer, tapping it (or More)
 * expands it in place instead of cutting it off with an ellipsis.
 */
export function Expandable({
  lines,
  className,
  moreLabel = 'More',
  lessLabel = 'Less',
  children,
}: {
  lines: number
  className?: string
  moreLabel?: string
  lessLabel?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      if (!open) setOverflows(el.scrollHeight > el.clientHeight + 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [open, children])

  return (
    <div className="flex flex-col items-start">
      <div
        ref={ref}
        className={cn(className, overflows && 'cursor-pointer')}
        style={
          open
            ? undefined
            : {
                display: '-webkit-box',
                WebkitLineClamp: lines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
        }
        onClick={() => overflows && setOpen(!open)}
      >
        {children}
      </div>
      {overflows && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="cursor-pointer border-0 bg-transparent p-0 pt-0.5 text-xs uppercase tracking-wide text-zinc-500 hover:text-white"
        >
          {open ? `${lessLabel} ▴` : `${moreLabel} ▾`}
        </button>
      )}
    </div>
  )
}

/**
 * Wraps a drawing canvas so touching it only ever draws:
 * - no native drag (iOS otherwise lifts the canvas as a "ghost" image, as if
 *   it were a picture being dragged), long-press menu or tap highlight
 * - no text selection anywhere on the page while a finger is down (a stroke
 *   that strays off the canvas would otherwise highlight what it crosses)
 */
export function DrawingSurface({
  className,
  style,
  children,
}: {
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Must be non-passive to cancel the browser's own touch handling (drag,
    // long-press, scrolling). React's touch listeners are passive, so attach
    // directly. Pointer events, which do the drawing, still fire.
    const cancel = (e: Event) => {
      if (e.cancelable) e.preventDefault()
    }
    el.addEventListener('touchstart', cancel, { passive: false })
    el.addEventListener('touchmove', cancel, { passive: false })
    el.addEventListener('dragstart', cancel)
    el.addEventListener('contextmenu', cancel)
    return () => {
      el.removeEventListener('touchstart', cancel)
      el.removeEventListener('touchmove', cancel)
      el.removeEventListener('dragstart', cancel)
      el.removeEventListener('contextmenu', cancel)
    }
  }, [])

  const lockSelection = () => {
    const root = document.documentElement
    window.getSelection()?.removeAllRanges()
    root.style.setProperty('user-select', 'none')
    root.style.setProperty('-webkit-user-select', 'none')
    const release = () => {
      root.style.removeProperty('user-select')
      root.style.removeProperty('-webkit-user-select')
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
  }

  return (
    <div
      ref={ref}
      draggable={false}
      onPointerDownCapture={lockSelection}
      className={cn('touch-none select-none', className)}
      style={{
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        // Not in React's CSS types
        ...({ WebkitUserDrag: 'none' } as CSSProperties),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Classes for drawing areas: no text selection or iOS long-press menu */
export const NO_SELECT = 'select-none [-webkit-touch-callout:none]'
