import { useMemo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { featureKey } from '../../utils/featureKey'

const TOP_N = 25

function badgeIcon(rank) {
  const size = Math.round(30 - (rank - 1) * (10 / (TOP_N - 1)))
  const color = rank <= 5 ? '#dc2626' : rank <= 15 ? '#ef4444' : '#f97316'
  const fontSize = size <= 22 ? 9 : 11
  const html = `<div style="
    width:${size}px;height:${size}px;
    background:${color};
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    color:white;font-weight:700;font-size:${fontSize}px;
    border:2px solid white;
    box-shadow:0 2px 6px rgba(0,0,0,0.4);
    cursor:pointer;
    line-height:1;
  ">${rank}</div>`
  return L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] })
}

export default function HotspotLayer({ data, onSelect }) {
  const hotspots = useMemo(() => {
    return [...data.features]
      .filter(f => f.properties.risk_score > 0)
      .sort((a, b) => b.properties.risk_score - a.properties.risk_score)
      .slice(0, TOP_N)
      .map((f, i) => ({ feature: f, rank: i + 1 }))
  }, [data])

  return (
    <>
      {hotspots.map(({ feature: f, rank }) => {
        const [lng, lat] = f.geometry.coordinates
        const p = f.properties
        return (
          <Marker
            key={featureKey(f)}
            position={[lat, lng]}
            icon={badgeIcon(rank)}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e)
                onSelect(f)
              },
            }}
            zIndexOffset={1000 - rank}
          >
            <Tooltip className="cs-tooltip" direction="top" offset={[0, -4]}>
              <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 600, color: '#111827' }}>#{rank} · {p.name}</div>
                <div style={{ color: '#6b7280' }}>
                  Risk score {p.risk_score.toFixed(2)} · {p.total_crashes} crashes
                </div>
              </div>
            </Tooltip>
          </Marker>
        )
      })}
    </>
  )
}
