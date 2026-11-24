# WeatherBoard

A responsive weather dashboard. Search for a city, read the current conditions and a 5-day forecast, and save up to five cities in this browser.

## Setup

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

```bash
npm run build
npm run preview
```

`preview` serves the production build, including the service worker.

No API key is required.

## Architecture

- `src/components` holds the screen pieces: search, current conditions, forecast cards, saved cities, reminder, and loading or error states.
- `src/services/openMeteo.js` calls the public Open-Meteo geocoding and forecast APIs and maps the response into the view model.
- `src/hooks` keeps saved cities and the debounced city suggestions.
- `src/App.jsx` loads a city, stores the last successful reading, and chooses what to show when a request fails.
- `public/sw.js` caches the app shell and the last Open-Meteo forecast response so a previously viewed city can open offline.

## APIs

- [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) for live city suggestions. No key.
- [Open-Meteo Forecast](https://open-meteo.com/en/docs) for current conditions and the 5-day forecast. No key.

The brief also names GeoDB Cities and OpenWeatherMap. Both need a free account key. Open-Meteo covers search and weather without one, so the app runs as soon as it is installed.

## Known limitations

- Live URL: not deployed yet.
- Closed-tab reminders use the experimental Notification Triggers API when the browser provides it. Otherwise the reminder runs while WeatherBoard is open.
- The service worker is registered only in the production build, so `npm run dev` does not cache the app shell. The last reading is still kept in `localStorage`.
- Offline mode can show the last successful reading. It cannot search for a new city without a connection.

## Scripts

- `npm run dev` starts the local app.
- `npm run build` creates the production build.
- `npm run preview` serves that build.
- `npm run lint` runs oxlint.
