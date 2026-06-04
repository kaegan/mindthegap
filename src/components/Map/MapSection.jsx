import { useState, useEffect, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMapEvents } from 'react-leaflet'
import Legend from './Legend'
import LayerToggle from './LayerToggle'
import HotspotLayer from './HotspotLayer'
import ReportCard from './ReportCard'
import IntersectionLayer from './IntersectionLayer'
import { featureKey } from '../../utils/featureKey'
import { computeCityStats } from '../../utils/gapStats'

const VANCOUVER_CENTER = [49.25, -123.12]
const DEFAULT_ZOOM = 12

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick })
  return null
}

// Initial layer/filter state can be set via URL params so a map view is
// shareable (and so screenshots are reproducible): ?hotspots=1&injury=1&ped=1
// and ?focus=lat,lng to open a specific intersection's report card.
const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
const initialFocus = params.get('focus')

function MapSection() {
  const [data, setData] = useState(null)
  const [showRisk, setShowRisk] = useState(true)
  const [showHotspots, setShowHotspots] = useState(params.get('hotspots') === '1')
  const [filterInjury, setFilterInjury] = useState(params.get('injury') === '1')
  const [filterPed, setFilterPed] = useState(params.get('ped') === '1')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('/data/intersection-risk.json')
      .then(r => (r.ok ? r.json() : null))
      .then(fc => {
        setData(fc)
        if (fc && initialFocus) {
          const hit = fc.features.find(f => featureKey(f) === initialFocus)
          if (hit) setSelected(hit)
        }
      })
      .catch(() => {})
  }, [])

  const cityStats = useMemo(() => (data ? computeCityStats(data) : null), [data])

  // Visibility predicate for the risk points, driven by the highlight filters.
  const predicate = useMemo(() => {
    if (!filterInjury && !filterPed) return null
    return p =>
      (!filterInjury || p.casualty_rate >= 33) &&
      (!filterPed || /Pedestrian/i.test(p.signal_type || ''))
  }, [filterInjury, filterPed])

  const handleMapClick = useCallback(() => setSelected(null), [])

  return (
    <section>
      <div className="relative">
        <div className="h-[500px] sm:h-[600px] lg:h-[700px]">
          <MapContainer
            center={VANCOUVER_CENTER}
            zoom={DEFAULT_ZOOM}
            className="w-full h-full"
            zoomControl={false}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />
            <MapClickHandler onMapClick={handleMapClick} />

            {showHotspots && data && <HotspotLayer data={data} />}
            {showRisk && data && (
              <IntersectionLayer
                data={data}
                predicate={predicate}
                selectedKey={selected ? featureKey(selected) : null}
                onSelect={setSelected}
              />
            )}
          </MapContainer>
        </div>

        {/* Floating UI panels */}
        <Legend showHotspots={showHotspots} />
        <LayerToggle
          showRisk={showRisk}
          setShowRisk={setShowRisk}
          showHotspots={showHotspots}
          setShowHotspots={setShowHotspots}
          filterInjury={filterInjury}
          setFilterInjury={setFilterInjury}
          filterPed={filterPed}
          setFilterPed={setFilterPed}
        />

        {selected && cityStats && (
          <ReportCard
            feature={selected}
            cityStats={cityStats}
            onClose={() => setSelected(null)}
          />
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] cs-panel px-3 py-1.5 text-xs text-gray-400 pointer-events-none">
          Use +/- or pinch to zoom
        </div>
      </div>
    </section>
  )
}

export default MapSection
