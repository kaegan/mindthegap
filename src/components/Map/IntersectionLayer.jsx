import { useMemo } from 'react'
import { CircleMarker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { getRiskColor } from '../../utils/colors'
import { featureKey } from '../../utils/featureKey'

// Marker radius grows with crash volume (sqrt keeps the busiest intersections
// from swamping the map), with a floor so quiet signals stay clickable.
function radiusFor(totalCrashes) {
  return Math.max(4, Math.min(14, 3 + Math.sqrt(totalCrashes) * 0.7))
}

export default function IntersectionLayer({ data, predicate, dim, selectedKey, onSelect }) {
  const visible = useMemo(
    () => data.features.filter(f => (predicate ? predicate(f.properties) : true)),
    [data, predicate]
  )

  return (
    <>
      {visible.map(f => {
        const p = f.properties
        const [lng, lat] = f.geometry.coordinates
        const key = featureKey(f)
        const isSelected = key === selectedKey
        return (
          <CircleMarker
            key={key}
            center={[lat, lng]}
            radius={isSelected ? radiusFor(p.total_crashes) + 4 : radiusFor(p.total_crashes)}
            pathOptions={{
              fillColor: getRiskColor(p.risk_score),
              fillOpacity: dim ? 0.35 : 0.8,
              color: isSelected ? '#111827' : 'rgba(0,0,0,0.25)',
              weight: isSelected ? 3 : 0.75,
            }}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e)
                onSelect(f)
              },
            }}
          >
            <Tooltip className="cs-tooltip" direction="top" offset={[0, -6]}>
              <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                <div style={{ color: '#6b7280' }}>
                  {p.total_crashes} crashes · {p.casualty_crashes} with injuries
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        )
      })}
    </>
  )
}
