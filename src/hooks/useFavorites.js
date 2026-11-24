import { useCallback, useEffect, useState } from 'react'
import { readJson, writeJson } from '../lib/storage.js'

const STORAGE_KEY = 'weatherboard.favorites'
const MAX_FAVORITES = 5

function isCity(value) {
  return Boolean(
    value &&
      typeof value.id === 'string' &&
      value.id.length > 0 &&
      typeof value.name === 'string' &&
      value.name.length > 0 &&
      Number.isFinite(value.latitude) &&
      Number.isFinite(value.longitude),
  )
}

function toStoredCity(city) {
  return {
    id: city.id,
    name: city.name,
    country: city.country || '',
    admin1: city.admin1 || '',
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone || 'auto',
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => readJson(STORAGE_KEY, []).filter(isCity).map(toStoredCity))
  const [storageWarning, setStorageWarning] = useState('')

  useEffect(() => {
    const saved = writeJson(STORAGE_KEY, favorites)
    setStorageWarning(
      saved ? '' : 'This browser blocked saved cities. The list will last only until you close this tab.',
    )
  }, [favorites])

  const addFavorite = useCallback((city) => {
    if (!isCity(city)) return 'invalid'

    let outcome = 'added'
    setFavorites((current) => {
      if (current.some((item) => item.id === city.id)) {
        outcome = 'exists'
        return current
      }
      if (current.length >= MAX_FAVORITES) {
        outcome = 'limit'
        return current
      }
      return [...current, toStoredCity(city)]
    })
    return outcome
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites((current) => current.filter((city) => city.id !== id))
  }, [])

  return { favorites, addFavorite, removeFavorite, storageWarning, maxFavorites: MAX_FAVORITES }
}
