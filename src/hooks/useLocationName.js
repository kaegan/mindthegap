import { useState, useEffect } from 'react'
import centroid from '@turf/centroid'

export function useLocationName(feature) {
  const dauid = feature?.properties?.dauid ?? null
  // Store the name keyed by the area it belongs to, and derive the return
  // value — no reset-in-effect needed when the selection changes.
  const [result, setResult] = useState({ dauid: null, name: null })

  useEffect(() => {
    if (!feature) return

    let cancelled = false
    const center = centroid(feature)
    const [lng, lat] = center.geometry.coordinates

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=16`,
      { headers: { 'Accept-Language': 'en' } }
    )
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        const a = data.address || {}
        const area = a.suburb || a.neighbourhood || a.city_district || a.town || a.city || ''
        const road = a.road || ''
        const name = area && road ? `${road}, ${area}` : (area || road || null)
        setResult({ dauid: feature.properties.dauid, name })
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [feature])

  return result.dauid === dauid ? result.name : null
}
