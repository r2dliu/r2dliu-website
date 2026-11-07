// Plain Tailwind form controls in the site's black/white style (like the
// stacker game's buttons), so the feature doesn't depend on MUI form styling.
import CircularProgress from '@mui/material/CircularProgress'
import cn from 'classnames'
import type {
  ButtonHTMLAttributes,
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
