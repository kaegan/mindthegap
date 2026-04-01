import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMapEvents } from 'react-leaflet'
import Legend from './Legend'
import LayerToggle from './LayerToggle'
import HotspotLayer from './HotspotLayer'
import ReportCard from './ReportCard'
import NearbyStopsMarkers from './NearbyStopsMarkers'
import L from 'leaflet'
import { getGapColor } from '../../utils/colors'
import { computeMetroStats } from '../../utils/gapStats'
import { findNearestStops } from '../../utils/nearestStops'

const VANCOUVER_CENTER = [49.25, -123.1]
const DEFAULT_ZOOM = 11

const DEFAULT_STYLE = (score) => ({
  fillColor: getGapColor(score),
  fillOpacity: 0.65,
  weight: 0.5,
  color: 'rgba(255,255,255,0.15)',
})

const HIGHLIGHT_STYLE = (score) => ({
  fillColor: getGapColor(score),
  fillOpacity: 0.85,
  weight: 3,
  color: '#ffffff',
})

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: onMapClick,
  })
  return null
}

function GapLayer({ data, selectedDAUID, onSelectDA }) {
  const layersRef = useRef(new Map())
  const selectedLayerRef = useRef(null)

  const onEachFeature = useCallback((feature, layer) => {
    const p = feature.properties
    const dauid = p.dauid
    layersRef.current.set(dauid, layer)

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

    layer.on('click', (e) => {
      L.DomEvent.stopPropagation(e)
      onSelectDA(feature)
    })
  }, [onSelectDA])

  // Imperatively update highlight when selection changes
  useEffect(() => {
    // Reset previous
    if (selectedLayerRef.current) {
      const prevScore = selectedLayerRef.current.feature.properties.gap_score || 0
      selectedLayerRef.current.setStyle(DEFAULT_STYLE(prevScore))
    }
    // Highlight new
    if (selectedDAUID) {
      const layer = layersRef.current.get(selectedDAUID)
      if (layer) {
        layer.setStyle(HIGHLIGHT_STYLE(layer.feature.properties.gap_score || 0))
        layer.bringToFront()
        selectedLayerRef.current = layer
      }
    } else {
      selectedLayerRef.current = null
    }
  }, [selectedDAUID])

  const style = (feature) => {
    const score = feature.properties.gap_score || 0
    if (feature.properties.dauid === selectedDAUID) return HIGHLIGHT_STYLE(score)
    return DEFAULT_STYLE(score)
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
  const [stopsData, setStopsData] = useState(null)
  const [showRoutes, setShowRoutes] = useState(false)
  const [showGaps, setShowGaps] = useState(true)
  const [showHotspots, setShowHotspots] = useState(false)
  const [selectedDA, setSelectedDA] = useState(null)

  useEffect(() => {
    fetch('/data/gap-analysis.geojson')
      .then(r => r.ok ? r.json() : null)
      .then(setGapData)
      .catch(() => {})

    fetch('/data/routes.geojson')
      .then(r => r.ok ? r.json() : null)
      .then(setRouteData)
      .catch(() => {})

    fetch('/data/stops.geojson')
      .then(r => r.ok ? r.json() : null)
      .then(setStopsData)
      .catch(() => {})
  }, [])

  const metroStats = useMemo(
    () => gapData ? computeMetroStats(gapData) : null,
    [gapData]
  )

  const nearestStops = useMemo(
    () => selectedDA && stopsData ? findNearestStops(selectedDA, stopsData) : [],
    [selectedDA, stopsData]
  )

  const handleMapClick = useCallback(() => {
    setSelectedDA(null)
  }, [])

  return (
    <section className="pb-12">
      <div className="relative">
        {/* Map container */}
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
            <MapClickHandler onMapClick={handleMapClick} />

            {showGaps && gapData && (
              <GapLayer
                data={gapData}
                selectedDAUID={selectedDA?.properties.dauid}
                onSelectDA={setSelectedDA}
              />
            )}
            {showHotspots && gapData && <HotspotLayer data={gapData} />}
            {showRoutes && routeData && <TransitRouteLayer data={routeData} />}
            {selectedDA && <NearbyStopsMarkers stops={nearestStops} />}
          </MapContainer>
        </div>

        {/* Floating UI panels */}
        <Legend showHotspots={showHotspots} />
        <LayerToggle
          showGaps={showGaps}
          setShowGaps={setShowGaps}
          showRoutes={showRoutes}
          setShowRoutes={setShowRoutes}
          showHotspots={showHotspots}
          setShowHotspots={setShowHotspots}
        />

        {/* Report card */}
        {selectedDA && metroStats && (
          <ReportCard
            feature={selectedDA}
            nearestStops={nearestStops}
            metroStats={metroStats}
            onClose={() => setSelectedDA(null)}
          />
        )}

        {/* Scroll-zoom hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] cs-panel px-3 py-1.5 text-xs text-gray-400 pointer-events-none">
          Use +/- or pinch to zoom
        </div>
      </div>
    </section>
  )
}

export default MapSection
