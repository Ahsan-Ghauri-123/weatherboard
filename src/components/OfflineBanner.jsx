export function OfflineBanner({ isOffline = false }) {
  return (
    <div role="status" aria-live="polite">
      {isOffline ? (
        <p className="border-b border-banner-line bg-banner px-4 py-2.5 text-sm leading-6 font-medium text-banner-ink md:px-6 xl:px-8">
          <span className="mx-auto block w-full max-w-7xl">
            You are offline. Saved readings still open. City search waits until the connection returns.
          </span>
        </p>
      ) : null}
    </div>
  )
}
