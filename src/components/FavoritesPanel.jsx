import { useState } from 'react'
import { primaryButtonClass, quietButtonClass, secondaryButtonClass, surfaceClass } from '../lib/classes.js'

export function FavoritesPanel({
  favorites = [],
  activeId = '',
  maxFavorites = 5,
  storageWarning = '',
  onSelect,
  onRemove,
}) {
  const [pendingId, setPendingId] = useState(null)
  const countLabel = `${favorites.length} of ${maxFavorites} saved`

  return (
    <aside
      aria-labelledby="favorites-heading"
      className={`${surfaceClass} p-4 md:p-5`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="favorites-heading" className="font-display text-2xl tracking-tight">
          Saved cities
        </h2>
        {favorites.length > 0 ? <p className="text-sm font-medium text-muted">{countLabel}</p> : null}
      </div>
      {storageWarning ? <p className="mt-3 text-sm font-medium text-danger">{storageWarning}</p> : null}

      {favorites.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-line bg-foam px-3 py-6 text-sm leading-6 text-pretty text-muted">
          No saved cities yet. Search for a city, then use Save city. The list stays in this browser.
        </p>
      ) : (
        <ul className="mt-4 grid max-h-96 gap-1 overflow-auto pr-1">
          {favorites.map((city) => {
            const isActive = city.id === activeId
            const confirming = pendingId === city.id

            return (
              <li key={city.id} className="grid gap-2">
                {confirming ? (
                  <div className="rounded-xl bg-foam px-3 py-3">
                    <p className="text-sm font-medium text-ink">Remove {city.name} from saved cities?</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className={primaryButtonClass}
                        onClick={() => {
                          setPendingId(null)
                          onRemove?.(city.id)
                        }}
                      >
                        Remove
                      </button>
                      <button type="button" className={secondaryButtonClass} onClick={() => setPendingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className={`flex h-11 min-w-0 flex-1 cursor-pointer items-center rounded-xl px-2 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-sea ${
                        isActive ? 'bg-foam text-ink' : 'text-ink hover:bg-foam'
                      }`}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => onSelect?.(city)}
                    >
                      <span
                        className={`mr-2 size-1.5 shrink-0 rounded-full ${isActive ? 'bg-sea' : 'bg-line'}`}
                        aria-hidden="true"
                      />
                      <span className="truncate" title={city.name}>
                        {city.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      className={quietButtonClass}
                      aria-label={`Remove ${city.name}`}
                      onClick={() => setPendingId(city.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}
