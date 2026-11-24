import { Reading } from './Reading.jsx'
import { WeatherGlyph } from './WeatherGlyph.jsx'
import { surfaceClass } from '../lib/classes.js'
import { formatPercent, formatTemperature } from '../lib/format.js'

export function ForecastCard({ day, unit = 'celsius' }) {
  if (!day) return null

  const label = typeof day.label === 'string' ? day.label.trim() : ''
  const condition = typeof day.condition === 'string' ? day.condition.trim() : ''
  const high = formatTemperature(day.high, unit)
  const low = formatTemperature(day.low, unit)
  const precipitation = formatPercent(day.precipitation)

  return (
    <article className={`${surfaceClass} flex h-full flex-col p-3.5 md:p-4`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">
          {label ? label : <Reading value={null} />}
        </h3>
        <WeatherGlyph condition={condition} className="size-7 shrink-0 text-sea" />
      </div>
      <p className="mt-3 text-sm leading-5 text-pretty text-muted">
        {condition || 'Conditions not loaded'}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <p>
          <span className="block text-xs font-semibold tracking-wide text-muted uppercase">High</span>
          <span className="mt-1 block font-display text-2xl leading-none text-warm">
            <Reading value={high} />
          </span>
        </p>
        <p>
          <span className="block text-xs font-semibold tracking-wide text-muted uppercase">Low</span>
          <span className="mt-1 block font-display text-2xl leading-none text-cool">
            <Reading value={low} />
          </span>
        </p>
      </div>
      <p className="mt-3 text-xs font-medium text-muted">
        Precip <Reading value={precipitation} />
      </p>
    </article>
  )
}
