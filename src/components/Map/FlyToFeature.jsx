import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export default function FlyToFeature({ feature }) {
  const map = useMap()

  useEffect(() => {
    if (!feature) return
    const bounds = L.geoJSON(feature).getBounds()
    map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 14, duration: 1.2 })
  }, [feature, map])

  return null
}
