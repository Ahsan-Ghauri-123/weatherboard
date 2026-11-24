function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

export function formatTemperature(value, unit = 'celsius') {
  if (!isNumber(value)) return null
  const reading = unit === 'fahrenheit' ? value * (9 / 5) + 32 : value
  const suffix = unit === 'fahrenheit' ? '°F' : '°C'
  return `${Math.round(reading)}${suffix}`
}

export function formatPercent(value) {
  if (!isNumber(value)) return null
  return `${Math.round(value)}%`
}

export function formatWind(value) {
  if (!isNumber(value)) return null
  return `${Math.round(value)} km/h`
}
