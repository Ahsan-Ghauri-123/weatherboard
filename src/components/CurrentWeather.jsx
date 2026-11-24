import { useEffect, useState } from 'react'
import { Reading } from './Reading.jsx'
import { WeatherGlyph } from './WeatherGlyph.jsx'
import { primaryButtonClass, secondaryButtonClass, surfaceClass } from '../lib/classes.js'
import { formatPercent, formatTemperature, formatWind } from '../lib/format.js'

export function CurrentWeather({
  city = null,
  observation = null,
  unit = 'celsius',
  isFavorite = false,
  saveMessage = '',
  note = '',
  onSave,
  onRemove,
}) {
  const [confirming, setConfirming] = useState(false)
  const temperature = formatTemperature(observation?.temperature, unit)
  const feelsLike = formatTemperature(observation?.feelsLike, unit)
  const humidity = formatPercent(observation?.humidity)
  const wind = formatWind(observation?.windSpeed)
  const condition = typeof observation?.condition === 'string' ? observation.condition.trim() : ''
  const observedAt = typeof observation?.observedAt === 'string' ? observation.observedAt.trim() : ''
  const place = [city?.admin1, city?.country].filter(Boolean).join(', ')

  useEffect(() => {
    setConfirming(false)
  }, [city?.id])

  return (
    <section aria-labelledby="current-heading" className={`${surfaceClass} p-4 md:p-6`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            id="current-heading"
            className="text-xs font-semibold tracking-[0.18em] text-sea uppercase"
          >
            Current conditions
          </h2>
          <p className="mt-2 font-display text-4xl leading-none tracking-tight break-words text-ink md:text-5xl">
            {city?.name || 'No city selected'}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-pretty text-muted">
            {!city
              ? 'Search for a city to see the current reading and a 5-day forecast.'
              : observation
                ? place || 'Latest reading'
                : 'The latest reading for this city is not available yet.'}
          </p>
          {note ? <p className="mt-2 text-sm font-medium text-banner-ink">{note}</p> : null}
        </div>
        {city ? (
          <div className="w-full sm:w-auto">
            {confirming ? (
              <div className="rounded-xl border border-line bg-foam p-3">
                <p className="text-sm font-medium text-ink">Remove {city.name} from saved cities?</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className={primaryButtonClass}
                    onClick={() => {
                      setConfirming(false)
                      onRemove?.()
                    }}
                  >
                    Remove
                  </button>
                  <button type="button" className={secondaryButtonClass} onClick={() => setConfirming(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={`${secondaryButtonClass} w-full sm:w-auto`}
                aria-pressed={isFavorite}
                onClick={() => {
                  if (isFavorite) setConfirming(true)
                  else onSave?.()
                }}
              >
                {isFavorite ? 'Saved' : 'Save city'}
              </button>
            )}
            {saveMessage ? (
              <p className="mt-2 text-sm font-medium text-danger" role="status">
                {saveMessage}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-foam px-4 py-4 md:px-5 md:py-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Temperature</p>
          <p className="mt-2 font-display leading-none tracking-tight">
            {temperature ? (
              <span className="text-6xl md:text-7xl">{temperature}</span>
            ) : (
              <span className="text-4xl text-muted md:text-5xl">Not loaded</span>
            )}
          </p>
          <p className="mt-3 text-sm leading-5 text-muted">
            {condition || 'No live reading'}
            {observedAt ? ` · ${observedAt}` : ''}
          </p>
        </div>
        <WeatherGlyph condition={condition} className="size-16 shrink-0 text-sea md:size-20" />
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 md:gap-3">
        <Metric label="Feels like" value={feelsLike} />
        <Metric label="Humidity" value={humidity} />
        <Metric label="Wind" value={wind} />
      </dl>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-line bg-white px-2.5 py-3 md:px-3">
      <dt className="text-xs leading-4 font-semibold tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-2 font-display text-lg leading-none tracking-tight break-words md:text-2xl">
        <Reading value={value} />
      </dd>
    </div>
  )
}
