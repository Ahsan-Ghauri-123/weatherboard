import { useEffect, useId, useState } from 'react'
import { inputClass, primaryButtonClass, surfaceClass } from '../lib/classes.js'

export function CitySearch({
  value,
  onChange,
  onSubmit,
  onSelect,
  onBlurEmpty,
  suggestions = [],
  suggestionStatus = 'idle',
  suggestionError = '',
  error = '',
}) {
  const listId = useId()
  const [activeIndex, setActiveIndex] = useState(-1)
  const showList = suggestions.length > 0 && suggestionStatus === 'ready'
  const describedBy = ['city-search-hint', error ? 'city-search-error' : '', suggestionError ? 'city-search-status' : '']
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    setActiveIndex(suggestions.length > 0 ? 0 : -1)
  }, [suggestions])

  function handleKeyDown(event) {
    if (!showList) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % suggestions.length)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      onSelect?.(suggestions[activeIndex])
    }

    if (event.key === 'Escape') {
      setActiveIndex(-1)
    }
  }

  return (
    <form role="search" noValidate onSubmit={onSubmit} className={`${surfaceClass} p-4 md:p-5`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="city-search" className="mb-1.5 block text-sm font-semibold text-ink">
            City
          </label>
          <input
            id="city-search"
            name="city"
            type="text"
            role="combobox"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!value.trim()) onBlurEmpty?.()
            }}
            maxLength={80}
            autoComplete="off"
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              showList && activeIndex >= 0 ? `${listId}-${suggestions[activeIndex].id}` : undefined
            }
            className={`${inputClass} ${error ? 'border-danger' : ''}`}
          />
          {showList ? (
            <ul
              id={listId}
              role="listbox"
              aria-label="Matching cities"
              className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-line bg-white p-1 shadow-[0_18px_40px_-28px_rgba(20,35,51,0.65)]"
            >
              {suggestions.map((city, index) => {
                const place = [city.admin1, city.country].filter(Boolean).join(', ')
                const selected = index === activeIndex
                return (
                  <li key={city.id} id={`${listId}-${city.id}`} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      className={`flex min-h-11 w-full cursor-pointer flex-col items-start justify-center rounded-lg px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sea ${
                        selected ? 'bg-foam' : 'hover:bg-foam'
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onSelect?.(city)}
                    >
                      <span className="text-sm font-semibold text-ink">{city.name}</span>
                      {place ? <span className="text-xs text-muted">{place}</span> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
        <button type="submit" className={`${primaryButtonClass} w-full md:w-auto`}>
          Search
        </button>
      </div>
      {error ? (
        <p id="city-search-error" role="alert" className="mt-3 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
      {suggestionStatus === 'loading' ? (
        <p id="city-search-status" className="mt-3 text-sm text-muted" role="status">
          Searching cities…
        </p>
      ) : null}
      {suggestionStatus === 'empty' ? (
        <p id="city-search-status" className="mt-3 text-sm font-medium text-danger" role="status">
          No cities match that name. Check the spelling and try again.
        </p>
      ) : null}
      {suggestionStatus === 'error' ? (
        <p id="city-search-status" className="mt-3 text-sm font-medium text-danger" role="alert">
          {suggestionError}
        </p>
      ) : null}
      <p id="city-search-hint" className="mt-3 max-w-3xl text-sm leading-6 text-pretty text-muted">
        Type at least two letters and choose a city. Weather comes from Open-Meteo.
      </p>
    </form>
  )
}
