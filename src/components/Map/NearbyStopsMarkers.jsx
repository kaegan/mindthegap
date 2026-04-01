import { CircleMarker, Tooltip } from 'react-leaflet'

export default function NearbyStopsMarkers({ stops }) {
  if (!stops || stops.length === 0) return null

  return (
    <>
      {stops.map(stop => (
        <CircleMarker
          key={stop.stop_id}
          center={[stop.lat, stop.lng]}
          radius={5}
          pathOptions={{
            fillColor: '#22d3ee',
            fillOpacity: 0.9,
            color: '#374151',
            weight: 1.5,
          }}
        >
          <Tooltip className="cs-tooltip" direction="top" offset={[0, -6]}>
            <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
              <div style={{ fontWeight: 600, color: '#111827' }}>{stop.name}</div>
              <div style={{ color: '#6b7280' }}>{stop.trips_per_day} trips/day · {stop.distance_m}m away</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  )
}
