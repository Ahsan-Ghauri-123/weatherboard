import { readJson, writeJson } from './storage.js'

const LAST_VIEW_KEY = 'weatherboard.lastView'
const UNIT_KEY = 'weatherboard.unit'

export function readLastView() {
  const saved = readJson(LAST_VIEW_KEY, null)
  if (!saved?.city?.id || !saved.observation || !Array.isArray(saved.forecast)) return null
  if (!Number.isFinite(saved.city.latitude) || !Number.isFinite(saved.city.longitude)) return null
  return saved
}

export function writeLastView(city, report) {
  writeJson(LAST_VIEW_KEY, {
    city,
    observation: report.observation,
    forecast: report.forecast,
  })
}

export function readUnit() {
  const unit = readJson(UNIT_KEY, 'celsius')
  return unit === 'fahrenheit' ? 'fahrenheit' : 'celsius'
}

export function writeUnit(unit) {
  writeJson(UNIT_KEY, unit === 'fahrenheit' ? 'fahrenheit' : 'celsius')
}
