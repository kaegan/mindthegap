export const LOW_DENSITY_COLOR = '#d1d5db' // gray-300

/**
 * Maps a gap score (0 to 1) to a color on a yellow-orange-red ramp.
 * 0 = low gap (light yellow), 1 = high gap (deep red).
 */
export function getGapColor(score) {
  const stops = [
    [0, '#fef3c7'],
    [0.15, '#fde68a'],
    [0.3, '#fbbf24'],
    [0.45, '#f59e0b'],
    [0.6, '#f97316'],
    [0.8, '#ef4444'],
    [1, '#dc2626'],
  ]

  if (score <= 0) return stops[0][1]
  if (score >= 1) return stops[stops.length - 1][1]

  for (let i = 1; i < stops.length; i++) {
    if (score <= stops[i][0]) {
      const [prevVal, prevColor] = stops[i - 1]
      const [nextVal, nextColor] = stops[i]
      const t = (score - prevVal) / (nextVal - prevVal)
      return interpolateColor(prevColor, nextColor, t)
    }
  }
  return stops[stops.length - 1][1]
}

function interpolateColor(c1, c2, t) {
  const r1 = parseInt(c1.slice(1, 3), 16)
  const g1 = parseInt(c1.slice(3, 5), 16)
  const b1 = parseInt(c1.slice(5, 7), 16)
  const r2 = parseInt(c2.slice(1, 3), 16)
  const g2 = parseInt(c2.slice(3, 5), 16)
  const b2 = parseInt(c2.slice(5, 7), 16)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
