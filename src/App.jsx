import { useEffect, useRef, useState } from 'react'
import { CitySearch } from './components/CitySearch.jsx'
import { CurrentWeather } from './components/CurrentWeather.jsx'
import { ErrorState } from './components/ErrorState.jsx'
import { FavoritesPanel } from './components/FavoritesPanel.jsx'
import { ForecastCard } from './components/ForecastCard.jsx'
import { Header } from './components/Header.jsx'
import { LoadingState } from './components/LoadingState.jsx'
import { OfflineBanner } from './components/OfflineBanner.jsx'
import { ReminderPanel } from './components/ReminderPanel.jsx'
import { useCitySuggestions } from './hooks/useCitySuggestions.js'
import { useFavorites } from './hooks/useFavorites.js'
import { useOnlineStatus } from './hooks/useOnlineStatus.js'
import { readLastView, readUnit, writeLastView, writeUnit } from './lib/lastView.js'
import { surfaceClass } from './lib/classes.js'
import { fetchForecast, searchCities } from './services/openMeteo.js'

export default function App() {
  const isOnline = useOnlineStatus()
  const { favorites, addFavorite, removeFavorite, storageWarning, maxFavorites } = useFavorites()
  const [query, setQuery] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [activeCity, setActiveCity] = useState(null)
  const [observation, setObservation] = useState(null)
  const [forecast, setForecast] = useState([])
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [staleNote, setStaleNote] = useState('')
  const [unit, setUnit] = useState(readUnit)
  const [pinnedQuery, setPinnedQuery] = useState('')
  const { suggestions, status: suggestionStatus, error: suggestionError, suggestionQuery } = useCitySuggestions(query)
  const requestRef = useRef(null)

  const isFavorite = activeCity ? favorites.some((city) => city.id === activeCity.id) : false
  const normalizedQuery = query.trim().replace(/\s+/g, ' ')
  const matchingSuggestions =
    suggestionQuery === normalizedQuery && normalizedQuery !== pinnedQuery ? suggestions : []

  useEffect(() => {
    document.title = activeCity ? `${activeCity.name} · WeatherBoard` : 'WeatherBoard'
  }, [activeCity])

  useEffect(() => {
    const last = readLastView()
    if (!last) return undefined

    setActiveCity(last.city)
    setQuery(last.city.name)
    setPinnedQuery(last.city.name)
    setObservation(last.observation)
    setForecast(last.forecast)
    setStatus('ready')

    if (!navigator.onLine) {
      setStaleNote('Showing the last saved reading while you are offline.')
      return undefined
    }

    const controller = new AbortController()
    requestRef.current = controller
    fetchForecast(last.city, controller.signal)
      .then((report) => {
        setObservation(report.observation)
        setForecast(report.forecast)
        setStatus('ready')
        setStaleNote('')
        writeLastView(last.city, report)
      })
      .catch((error) => {
        if (error.name === 'AbortError') return
        setStaleNote('Showing the last saved reading. A new one could not be loaded.')
      })

    return () => controller.abort()
  }, [])

  async function loadWeather(city, { background = false } = {}) {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller

    setActiveCity(city)
    setQuery(city.name)
    setPinnedQuery(city.name)
    setFieldError('')
    setSaveMessage('')
    setErrorMessage('')

    if (!background) {
      setStatus('loading')
      setObservation(null)
      setForecast([])
      setStaleNote('')
    }

    if (!navigator.onLine) {
      const cached = readLastView()
      if (cached?.city.id === city.id) {
        setObservation(cached.observation)
        setForecast(cached.forecast)
        setStatus('ready')
        setStaleNote('Showing the last saved reading while you are offline.')
        return
      }
      setStatus('error')
      setErrorMessage(`You are offline, and there is no saved reading for ${city.name}. Reconnect and try again.`)
      return
    }

    try {
      const report = await fetchForecast(city, controller.signal)
      setObservation(report.observation)
      setForecast(report.forecast)
      setStatus('ready')
      setStaleNote('')
      writeLastView(city, report)
    } catch (error) {
      if (error.name === 'AbortError') return
      const cached = readLastView()
      if (cached?.city.id === city.id) {
        setObservation(cached.observation)
        setForecast(cached.forecast)
        setStatus('ready')
        setStaleNote(`Showing the last saved reading for ${city.name}. A new one could not be loaded.`)
        return
      }
      setStatus('error')
      setErrorMessage(`Weather for ${city.name} could not be loaded. Check your connection, then try again.`)
    }
  }

  function handleQueryChange(value) {
    setQuery(value)
    if (fieldError) setFieldError('')
  }

  async function handleSearch(event) {
    event.preventDefault()
    if (!normalizedQuery) {
      setFieldError('Enter a city name.')
      return
    }
    if (!isOnline) {
      setFieldError('You are offline, so city search is paused. Reconnect, or open a saved city.')
      return
    }

    if (matchingSuggestions.length > 0) {
      loadWeather(matchingSuggestions[0])
      return
    }

    try {
      const cities = await searchCities(normalizedQuery)
      if (cities.length === 0) {
        setFieldError(`No cities match “${normalizedQuery}”. Check the spelling and try again.`)
        return
      }
      loadWeather(cities[0])
    } catch {
      setFieldError('City search failed. Check your connection and try again.')
    }
  }

  function handleSave() {
    if (!activeCity) return
    const outcome = addFavorite(activeCity)
    setSaveMessage(
      outcome === 'limit' ? 'You can save 5 cities. Remove one before adding another.' : '',
    )
  }

  function handleRemoveFavorite(id = activeCity?.id) {
    if (!id) return
    removeFavorite(id)
    setSaveMessage('')
  }

  function handleUnitChange(nextUnit) {
    setUnit(nextUnit)
    writeUnit(nextUnit)
  }

  const selectionMessage =
    status === 'ready' && activeCity && observation
      ? `${activeCity.name}: ${observation.condition}.`
      : ''

  return (
    <div className="board-bg relative text-ink">
      <a
        href="#content"
        className="absolute top-0 left-4 z-50 -translate-y-full rounded-b-xl bg-sea px-3 py-2 text-sm font-semibold text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <OfflineBanner isOffline={!isOnline} />
      <Header unit={unit} onUnitChange={handleUnitChange} />
      <main
        id="content"
        tabIndex={-1}
        aria-busy={status === 'loading'}
        className="mx-auto w-full max-w-7xl px-4 py-5 outline-none md:px-6 md:py-8 xl:px-8"
      >
        <p className="sr-only" aria-live="polite">
          {selectionMessage}
        </p>
        <CitySearch
          value={query}
          onChange={handleQueryChange}
          onSubmit={handleSearch}
          onSelect={loadWeather}
          onBlurEmpty={() => setFieldError('Enter a city name.')}
          suggestions={matchingSuggestions}
          suggestionStatus={
            normalizedQuery.length < 2 || normalizedQuery === pinnedQuery ? 'idle' : suggestionStatus
          }
          suggestionError={suggestionError}
          error={fieldError}
        />
        <div className="mt-5 grid items-start gap-5 md:mt-6 xl:grid-cols-[minmax(0,1fr)_20.5rem] xl:gap-6">
          <div className="grid min-w-0 gap-5">
            {status === 'error' ? (
              <ErrorState message={errorMessage} onRetry={() => activeCity && loadWeather(activeCity)} />
            ) : null}
            {status === 'loading' ? (
              <LoadingState label={`Loading weather for ${activeCity?.name ?? 'this city'}`} />
            ) : (
              <CurrentWeather
                city={activeCity}
                observation={observation}
                unit={unit}
                isFavorite={isFavorite}
                saveMessage={saveMessage}
                note={staleNote}
                onSave={handleSave}
                onRemove={() => handleRemoveFavorite()}
              />
            )}
            <section aria-labelledby="forecast-heading">
              <h2 id="forecast-heading" className="font-display text-2xl tracking-tight">
                5-day forecast
              </h2>
              {forecast.length > 0 ? (
                <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                  {forecast.map((day) => (
                    <li key={day.id}>
                      <ForecastCard day={day} unit={unit} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`${surfaceClass} mt-3 px-4 py-8 text-center md:px-6 md:py-10`}>
                  <p className="font-semibold">No forecast loaded</p>
                  <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-pretty text-muted">
                    Choose a city to load the next five days.
                  </p>
                </div>
              )}
            </section>
          </div>
          <div className="grid gap-5 xl:sticky xl:top-24">
            <FavoritesPanel
              favorites={favorites}
              activeId={activeCity?.id ?? ''}
              maxFavorites={maxFavorites}
              storageWarning={storageWarning}
              onSelect={loadWeather}
              onRemove={handleRemoveFavorite}
            />
            <ReminderPanel />
          </div>
        </div>
        <p className="mt-8 text-center text-xs leading-5 text-muted">
          Weather data from Open-Meteo. Saved cities stay in this browser.
        </p>
      </main>
    </div>
  )
}
