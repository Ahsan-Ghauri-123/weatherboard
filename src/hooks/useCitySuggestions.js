import { useEffect, useState } from 'react'
import { searchCities } from '../services/openMeteo.js'

const PAUSE_MS = 250

export function useCitySuggestions(query) {
  const [suggestions, setSuggestions] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [suggestionQuery, setSuggestionQuery] = useState('')

  useEffect(() => {
    const name = query.trim().replace(/\s+/g, ' ')
    if (name.length < 2) {
      setSuggestions([])
      setStatus('idle')
      setError('')
      setSuggestionQuery('')
      return undefined
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setStatus('loading')
      try {
        const cities = await searchCities(name, controller.signal)
        setSuggestions(cities)
        setSuggestionQuery(name)
        setError('')
        setStatus(cities.length > 0 ? 'ready' : 'empty')
      } catch (requestError) {
        if (requestError.name === 'AbortError') return
        setSuggestions([])
        setSuggestionQuery(name)
        setStatus('error')
        setError('City search failed. Check your connection and try again.')
      }
    }, PAUSE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return { suggestions, status, error, suggestionQuery }
}
