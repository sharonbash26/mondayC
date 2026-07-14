// Deterministic avatar: background color derived from a hash of the name,
// so the same person always gets the same color. Initials + accessible label.
const palette = [
  '#e2445c', // red
  '#fdab3d', // orange
  '#00c875', // green
  '#579bfc', // blue
  '#6161ff', // purple
  '#a25ddc', // violet
  '#ff642e', // deep orange
  '#037f4c', // deep green
]

function hash(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return h
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({
  name,
  size = 24,
  className = '',
}: {
  name: string
  size?: number
  className?: string
}) {
  const color = palette[hash(name) % palette.length]
  return (
    <span
      title={name}
      aria-label={`Assignee: ${name}`}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.42 }}
    >
      {initials(name)}
    </span>
  )
}
