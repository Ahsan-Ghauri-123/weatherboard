import { focusRingClass } from '../lib/classes.js'

export function Header({ unit = 'celsius', onUnitChange }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 md:px-6 md:py-4 xl:px-8">
        <svg
          viewBox="0 0 32 32"
          className="size-10 shrink-0 text-sea"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="32" height="32" rx="10" fill="currentColor" />
          <circle cx="16" cy="16" r="4" fill="#fff" />
          <path
            d="M16 6.25v2.4M16 23.35v2.4M6.25 16h2.4M23.35 16h2.4M9.1 9.1l1.7 1.7M21.2 21.2l1.7 1.7M22.9 9.1l-1.7 1.7M10.8 21.2l-1.7 1.7"
            fill="none"
            stroke="#fff"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
        <div className="min-w-0">
          <h1 className="font-display text-2xl leading-none tracking-tight text-ink">WeatherBoard</h1>
          <p className="mt-1 text-sm leading-5 text-muted">
            Current conditions, forecast, and saved cities.
          </p>
        </div>
        <div
          role="group"
          aria-label="Temperature unit"
          className="ml-auto flex shrink-0 rounded-xl border border-line bg-white p-1"
        >
          <UnitButton selected={unit === 'celsius'} onClick={() => onUnitChange?.('celsius')}>
            °C
          </UnitButton>
          <UnitButton selected={unit === 'fahrenheit'} onClick={() => onUnitChange?.('fahrenheit')}>
            °F
          </UnitButton>
        </div>
      </div>
    </header>
  )
}

function UnitButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-semibold ${focusRingClass} ${
        selected ? 'bg-sea text-white' : 'text-ink hover:bg-foam'
      }`}
    >
      {children}
    </button>
  )
}
