import { primaryButtonClass, surfaceClass } from '../lib/classes.js'

export function ErrorState({ title = 'Weather unavailable', message, onRetry }) {
  return (
    <div role="alert" className={`${surfaceClass} flex flex-col items-start gap-3 p-5 md:p-6`}>
      <h2 className="font-display text-2xl tracking-tight">{title}</h2>
      {message ? <p className="max-w-prose text-sm leading-6 text-muted">{message}</p> : null}
      {onRetry ? (
        <button type="button" className={primaryButtonClass} onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}
