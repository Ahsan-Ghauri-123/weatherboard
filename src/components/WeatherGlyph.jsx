function classifyCondition(condition) {
  if (typeof condition !== 'string' || condition.trim() === '') return 'idle'

  const value = condition.toLowerCase()
  if (value.includes('thunder') || value.includes('storm')) return 'rain'
  if (value.includes('snow') || value.includes('sleet') || value.includes('ice')) return 'snow'
  if (value.includes('rain') || value.includes('drizzle') || value.includes('shower')) return 'rain'
  if (value.includes('fog') || value.includes('mist') || value.includes('haze')) return 'fog'
  if (value.includes('cloud') || value.includes('overcast')) return 'cloud'
  if (value.includes('clear') || value.includes('sun')) return 'clear'
  return 'cloud'
}

function IconIdle() {
  return (
    <>
      <circle
        cx="12"
        cy="12"
        r="7.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeDasharray="3 2.4"
      />
      <path d="M9 12h6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </>
  )
}

function IconClear() {
  return (
    <>
      <circle cx="12" cy="12" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 3.25v2.1M12 18.65v2.1M3.25 12h2.1M18.65 12h2.1M5.7 5.7l1.5 1.5M16.8 16.8l1.5 1.5M18.3 5.7l-1.5 1.5M7.2 16.8l-1.5 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </>
  )
}

function IconCloud() {
  return (
    <path
      d="M8 17.25h8.2a3.15 3.15 0 0 0 .35-6.28 4.45 4.45 0 0 0-8.55-1.15A3.05 3.05 0 0 0 8 17.25Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
  )
}

function IconRain() {
  return (
    <>
      <path
        d="M8 14.25h8.2a3.15 3.15 0 0 0 .35-6.28 4.45 4.45 0 0 0-8.55-1.15A3.05 3.05 0 0 0 8 14.25Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 16.75v2.2M12 16.75v2.2M15 16.75v2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </>
  )
}

function IconSnow() {
  return (
    <path
      d="M12 3.5v17M5.2 7.2l13.6 9.6M18.8 7.2 5.2 16.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  )
}

function IconFog() {
  return (
    <path
      d="M4 8.5h16M6 12h12M4 15.5h16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  )
}

const ICONS = {
  idle: IconIdle,
  clear: IconClear,
  cloud: IconCloud,
  rain: IconRain,
  snow: IconSnow,
  fog: IconFog,
}

export function WeatherGlyph({ condition = '', className = 'size-10' }) {
  const Icon = ICONS[classifyCondition(condition)]

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <Icon />
    </svg>
  )
}
