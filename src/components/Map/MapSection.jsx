import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet'
import Legend from './Legend'
import LayerToggle from './LayerToggle'
import { getGapColor } from '../../utils/colors'

const VANCOUVER_CENTER = [49.25, -123.1]
const DEFAULT_ZOOM = 11

function GapLayer({ data }) {
  const style = (feature) => {
    const score = feature.properties.gap_score || 0
    return {
      fillColor: getGapColor(score),
      fillOpacity: 0.65,
      weight: 0.5,
      color: 'rgba(255,255,255,0.15)',
    }
  }

  const onEachFeature = (feature, layer) => {
    const p = feature.properties
    const densityStr = (p.pop_density || 0).toLocaleString()
    const transitPct = Math.round((p.transit_score || 0) * 100)
    const gapStr = (p.gap_score || 0).toFixed(2)

    layer.bindTooltip(
      `<div style="font-size:13px; line-height:1.5">
        <div style="font-weight:600; color:#fff; margin-bottom:2px">${p.name || 'Area'}</div>
        <div style="color:#cbd5e1">Population density: ${densityStr}/km²</div>
        <div style="color:#cbd5e1">Transit access: ${transitPct}%</div>
        <div style="font-weight:600; color:${getGapColor(p.gap_score || 0)}; margin-top:2px">
          Gap score: ${gapStr}
        </div>
      </div>`,
      { sticky: true, className: 'cs-tooltip' }
    )
  }

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
}

function TransitRouteLayer({ data }) {
  const style = {
    color: '#60a5fa',
    weight: 1.5,
    opacity: 0.4,
  }
  return <GeoJSON data={data} style={() => style} />
}

function MapSection() {
  const [gapData, setGapData] = useState(null)
  const [routeData, setRouteData] = useState(null)
  const [showRoutes, setShowRoutes] = useState(false)
  const [showGaps, setShowGaps] = useState(true)

  useEffect(() => {
    fetch('/data/gap-analysis.geojson')
      .then(r => r.ok ? r.json() : null)
      .then(setGapData)
      .catch(() => {})

    fetch('/data/routes.geojson')
      .then(r => r.ok ? r.json() : null)
      .then(setRouteData)
      .catch(() => {})
  }, [])

  return (
    <section className="px-4 sm:px-8 pb-12">
      <div className="relative max-w-7xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Map container — fixed height, not fullscreen */}
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
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />

            {showGaps && gapData && <GapLayer data={gapData} />}
            {showRoutes && routeData && <TransitRouteLayer data={routeData} />}
          </MapContainer>
        </div>

        {/* Floating UI panels — Cities Skylines style */}
        <Legend />
        <LayerToggle
          showGaps={showGaps}
          setShowGaps={setShowGaps}
          showRoutes={showRoutes}
          setShowRoutes={setShowRoutes}
        />

        {/* Scroll-zoom hint overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] cs-panel px-3 py-1.5 text-xs text-gray-400 pointer-events-none">
          Use +/- or pinch to zoom
        </div>
      </div>
    </section>
  )
}

export default MapSection
