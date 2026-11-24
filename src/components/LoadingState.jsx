import { surfaceClass } from '../lib/classes.js'

export function LoadingState({
  label = 'Loading weather',
  detail = 'The board will fill in when the reading arrives.',
}) {
  return (
    <div role="status" aria-live="polite" className={`${surfaceClass} flex min-h-56 items-center gap-4 p-5 md:p-6`}>
      <span
        className="size-8 shrink-0 animate-spin rounded-full border-2 border-line border-t-sea motion-reduce:animate-none"
        aria-hidden="true"
      />
      <div>
        <p className="font-display text-2xl tracking-tight">{label}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{detail}</p>
      </div>
    </div>
  )
}
