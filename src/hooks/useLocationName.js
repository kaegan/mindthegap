import { useState, useEffect } from 'react'
import centroid from '@turf/centroid'

export function useLocationName(feature) {
  const [name, setName] = useState(null)

  useEffect(() => {
    if (!feature) { setName(null); return }

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
        if (area && road) setName(`${road}, ${area}`)
        else setName(area || road || null)
      })
      .catch(() => { if (!cancelled) setName(null) })

    return () => { cancelled = true }
  }, [feature?.properties?.dauid])

  return name
}
