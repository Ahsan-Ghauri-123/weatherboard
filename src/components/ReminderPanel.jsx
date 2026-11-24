import { useEffect, useState } from 'react'
import { primaryButtonClass, surfaceClass } from '../lib/classes.js'
import { readJson, writeJson } from '../lib/storage.js'

const TIME_KEY = 'weatherboard.reminderTime'
const ENABLED_KEY = 'weatherboard.reminderOn'

export function ReminderPanel() {
  const supported = typeof window !== 'undefined' && 'Notification' in window
  const [time, setTime] = useState(() => {
    const saved = readJson(TIME_KEY, '07:00')
    return typeof saved === 'string' && /^\d{2}:\d{2}$/.test(saved) ? saved : '07:00'
  })
  const [enabled, setEnabled] = useState(() => readJson(ENABLED_KEY, false) === true)
  const [permission, setPermission] = useState(() => (supported ? Notification.permission : 'unsupported'))
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!supported || !enabled || permission !== 'granted') return undefined

    const timer = window.setInterval(() => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      if (`${hours}:${minutes}` !== time) return

      const stamp = now.toDateString()
      if (sessionStorage.getItem('weatherboard.reminderFired') === `${stamp}-${time}`) return
      sessionStorage.setItem('weatherboard.reminderFired', `${stamp}-${time}`)

      try {
        new Notification('WeatherBoard', {
          body: "Time to check today's weather.",
          tag: 'weatherboard-daily',
        })
      } catch {
        setMessage('The reminder could not be shown. Check the browser notification settings.')
      }
    }, 15000)

    return () => window.clearInterval(timer)
  }, [enabled, permission, supported, time])

  async function handleEnable() {
    if (!supported) {
      setMessage('This browser does not support notifications. The rest of WeatherBoard still works.')
      return
    }

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result !== 'granted') {
      setEnabled(false)
      writeJson(ENABLED_KEY, false)
      setMessage(
        result === 'denied'
          ? 'Notifications are blocked for this site. Allow them in the browser settings. Nothing else is affected.'
          : 'Notifications were not allowed. You can turn the reminder on later.',
      )
      return
    }

    setEnabled(true)
    writeJson(ENABLED_KEY, true)
    writeJson(TIME_KEY, time)
    const scheduled = await scheduleClosedTabReminder(time)
    setMessage(
      scheduled
        ? 'Reminder is on. This browser can deliver it even when WeatherBoard is closed.'
        : 'Reminder is on while WeatherBoard is open. This browser cannot schedule it after the tab closes.',
    )
  }

  function handleTimeChange(nextTime) {
    setTime(nextTime)
    writeJson(TIME_KEY, nextTime)
    if (enabled && permission === 'granted') {
      scheduleClosedTabReminder(nextTime)
    }
  }

  function handleTurnOff() {
    setEnabled(false)
    writeJson(ENABLED_KEY, false)
    setMessage('The daily reminder is off.')
  }

  return (
    <section aria-labelledby="reminder-heading" className={`${surfaceClass} p-4 md:p-5`}>
      <h2 id="reminder-heading" className="font-display text-2xl tracking-tight">
        Morning reminder
      </h2>
      <p className="mt-2 text-sm leading-6 text-pretty text-muted">
        WeatherBoard can remind you to check the forecast. The browser asks for permission only after you turn this on.
      </p>
      <label htmlFor="reminder-time" className="mt-4 block text-sm font-semibold text-ink">
        Reminder time
      </label>
      <input
        id="reminder-time"
        type="time"
        value={time}
        onChange={(event) => handleTimeChange(event.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {enabled && permission === 'granted' ? (
          <button type="button" className={primaryButtonClass} onClick={handleTurnOff}>
            Turn off
          </button>
        ) : (
          <button type="button" className={primaryButtonClass} onClick={handleEnable}>
            Turn on reminder
          </button>
        )}
      </div>
      {message ? (
        <p className="mt-3 text-sm leading-6 text-muted" role="status">
          {message}
        </p>
      ) : null}
      {!supported ? (
        <p className="mt-3 text-sm leading-6 text-muted">
          This browser does not support notifications. Search, forecast, and saved cities still work.
        </p>
      ) : null}
    </section>
  )
}

async function scheduleClosedTabReminder(time) {
  if (!('serviceWorker' in navigator) || typeof window.TimestampTrigger !== 'function') return false

  try {
    const registration = await navigator.serviceWorker.ready
    await registration.showNotification('WeatherBoard', {
      tag: 'weatherboard-daily',
      body: "Time to check today's weather.",
      showTrigger: new window.TimestampTrigger(nextOccurrence(time)),
    })
    return true
  } catch {
    return false
  }
}

function nextOccurrence(time) {
  const [hours, minutes] = time.split(':').map(Number)
  const next = new Date()
  next.setHours(hours, minutes, 0, 0)
  if (next.getTime() <= Date.now()) next.setDate(next.getDate() + 1)
  return next.getTime()
}
