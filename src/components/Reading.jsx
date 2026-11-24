export function Reading({ value, className = '' }) {
  if (!value) {
    return (
      <span className={className}>
        <span className="sr-only">Not available</span>
        <span aria-hidden="true">—</span>
      </span>
    )
  }

  return <span className={className}>{value}</span>
}
