import { useState, useEffect, useRef } from 'react'
import centroid from '@turf/centroid'

export function useLocationNames(features) {
  const [names, setNames] = useState({})
  const resolvedRef = useRef(new Set())
  const activeRef = useRef(0)

  useEffect(() => {
    if (!features || features.length === 0) return

    const toResolve = features.filter(f => !resolvedRef.current.has(f.properties.dauid))
    if (toResolve.length === 0) return

    const runId = ++activeRef.current

    async function resolve() {
      for (const f of toResolve) {
        if (activeRef.current !== runId) return
        const dauid = f.properties.dauid
        if (resolvedRef.current.has(dauid)) continue

        try {
          const center = centroid(f)
          const [lng, lat] = center.geometry.coordinates
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=16`,
            { headers: { 'Accept-Language': 'en' } }
          )
          if (activeRef.current !== runId) return
          const data = await resp.json()

          const a = data.address || {}
          const neighbourhood = a.suburb || a.neighbourhood || a.city_district || ''
          const road = a.road || ''
          const city = a.city || a.town || a.municipality || ''
          const specific = neighbourhood && road ? `${road}, ${neighbourhood}` : (neighbourhood || road || null)

          resolvedRef.current.add(dauid)
          setNames(prev => ({ ...prev, [dauid]: { specific, city } }))
        } catch {
          resolvedRef.current.add(dauid)
          setNames(prev => ({ ...prev, [dauid]: { specific: null, city: null } }))
        }

        // Rate limit: Nominatim allows 1 req/sec
        await new Promise(r => setTimeout(r, 300))
      }
    }

    resolve()
  }, [features])

  return names
}
