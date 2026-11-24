const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function searchCities(name, signal) {
  const url = new URL(GEO_URL)
  url.searchParams.set('name', name)
  url.searchParams.set('count', '5')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('City search failed.')
  }

  const data = await response.json()
  const seen = new Set()
  return (data.results ?? []).map(toCity).filter(Boolean).filter((city) => {
    const key = `${city.name}|${city.admin1}|${city.country}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function fetchForecast(city, signal) {
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', String(city.latitude))
  url.searchParams.set('longitude', String(city.longitude))
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
  )
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  )
  url.searchParams.set('temperature_unit', 'celsius')
  url.searchParams.set('wind_speed_unit', 'kmh')
  url.searchParams.set('timezone', city.timezone || 'auto')
  url.searchParams.set('forecast_days', '5')

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error('Weather request failed.')
  }

  const data = await response.json()
  return toReport(data)
}

function toCity(result) {
  if (!result || !Number.isFinite(result.latitude) || !Number.isFinite(result.longitude)) return null
  if (typeof result.name !== 'string' || result.name.trim() === '') return null

  return {
    id: String(result.id),
    name: result.name,
    country: result.country || '',
    admin1: result.admin1 || '',
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone || 'auto',
  }
}

function toReport(data) {
  const current = data.current ?? {}
  const daily = data.daily ?? {}
  const dates = Array.isArray(daily.time) ? daily.time : []

  return {
    observation: {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      condition: describeWeatherCode(current.weather_code),
      observedAt: formatObservedAt(current.time),
    },
    forecast: dates.slice(0, 5).map((date, index) => ({
      id: date,
      label: formatDayLabel(date),
      condition: describeWeatherCode(daily.weather_code?.[index]),
      high: daily.temperature_2m_max?.[index],
      low: daily.temperature_2m_min?.[index],
      precipitation: daily.precipitation_probability_max?.[index],
    })),
  }
}

export function describeWeatherCode(code) {
  if (code === 0) return 'Clear'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code === 45 || code === 48) return 'Fog'
  if (code >= 51 && code <= 67) return 'Rain'
  if (code >= 71 && code <= 77) return 'Snow'
  if (code >= 80 && code <= 82) return 'Rain showers'
  if (code >= 95 && code <= 99) return 'Thunderstorm'
  return 'Unknown conditions'
}

function formatDayLabel(isoDate) {
  const date = new Date(`${isoDate}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return isoDate
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function formatObservedAt(value) {
  const match = typeof value === 'string' ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value) : null
  if (!match) return ''
  const hour = Number(match[4])
  const minute = match[5]
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minute} ${suffix}`
}
