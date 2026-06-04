// Stable identity for an intersection feature, derived from its coordinates.
// Used to track the selected marker across renders.
export function featureKey(f) {
  const [lng, lat] = f.geometry.coordinates
  return `${lat.toFixed(5)},${lng.toFixed(5)}`
}
