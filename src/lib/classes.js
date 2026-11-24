export const focusRingClass =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea'

export const surfaceClass =
  'rounded-2xl border border-line bg-white shadow-[0_18px_40px_-28px_rgba(20,35,51,0.65)]'

export const primaryButtonClass = `inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-sea px-4 text-sm font-semibold text-white transition-colors hover:bg-sea-strong disabled:cursor-not-allowed disabled:opacity-60 ${focusRingClass}`

export const secondaryButtonClass = `inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-foam disabled:cursor-not-allowed disabled:opacity-60 ${focusRingClass}`

export const quietButtonClass = `inline-flex h-11 cursor-pointer items-center justify-center rounded-xl px-3 text-sm font-semibold text-sea transition-colors hover:bg-foam ${focusRingClass}`

export const inputClass = `h-11 w-full rounded-xl border border-line bg-white px-3 text-base text-ink outline-none transition-colors focus-visible:border-sea ${focusRingClass}`
