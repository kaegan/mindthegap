import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMapEvents, useMap, CircleMarker, Tooltip } from 'react-leaflet'
import { feature } from 'topojson-client'
import posthog from 'posthog-js'
import Legend from './Legend'
import LayerToggle from './LayerToggle'
import HotspotLayer from './HotspotLayer'
import ReportCard from './ReportCard'
import NearbyStopsMarkers from './NearbyStopsMarkers'
import L from 'leaflet'
import { getGapColor } from '../../utils/colors'
import { computeMetroStats } from '../../utils/gapStats'
import { findNearestStops } from '../../utils/nearestStops'

function fetchTopoJSON(url, layerName) {
  return fetch(url)
    .then(r => r.ok ? r.json() : null)
    .then(topo => topo ? feature(topo, topo.objects[layerName]) : null)
}

const VANCOUVER_CENTER = [49.25, -123.1]
const DEFAULT_ZOOM = 11

const DEFAULT_STYLE = (score) => ({
  fillColor: getGapColor(score),
  fillOpacity: 0.65,
  weight: 0.5,
  color: 'rgba(0,0,0,0.08)',
})

const HIGHLIGHT_STYLE = (score) => ({
  fillColor: getGapColor(score),
  fillOpacity: 0.85,
  weight: 3,
  color: '#111827',
})

function InvalidateSizeOnMount() {
  const map = useMap()
  useEffect(() => {
    // Leaflet sometimes calculates container size before layout settles
    const timer = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(timer)
  }, [map])
  return null
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick })
  return null
}

function GapLayer({ data, selectedDAUID, onSelectDA }) {
  const map = useMap()
  const layersRef = useRef(new Map())
  const selectedLayerRef = useRef(null)
  const tooltipRef = useRef(L.tooltip({ className: 'cs-tooltip' }))
  const draggingRef = useRef(false)

  useEffect(() => {
    const onDragStart = () => {
      draggingRef.current = true
      map.closeTooltip(tooltipRef.current)
    }
    const onDragEnd = () => { draggingRef.current = false }
    map.on('dragstart', onDragStart)
    map.on('dragend', onDragEnd)
    return () => {
      map.off('dragstart', onDragStart)
      map.off('dragend', onDragEnd)
    }
  }, [map])

  const onEachFeature = useCallback((feature, layer) => {
    const p = feature.properties
    const dauid = p.dauid
    layersRef.current.set(dauid, layer)

    const densityStr = (p.pop_density || 0).toLocaleString()
    const transitPct = Math.round((p.transit_score || 0) * 100)
    const gapStr = (p.gap_score || 0).toFixed(2)
    const content = `<div style="font-size:13px; line-height:1.5">
        <div style="font-weight:600; color:#111827; margin-bottom:2px">${p.name || 'Area'}</div>
        <div style="color:#4b5563">Population density: ${densityStr}/km²</div>
        <div style="color:#4b5563">Transit access: ${transitPct}%</div>
        <div style="font-weight:600; color:${getGapColor(p.gap_score || 0)}; margin-top:2px">
          Gap score: ${gapStr}
        </div>
      </div>`

    layer.on('mouseover', () => {
      if (!draggingRef.current) tooltipRef.current.setContent(content)
    })
    layer.on('mousemove', (e) => {
      if (draggingRef.current) return
      tooltipRef.current.setLatLng(e.latlng)
      if (!map.hasLayer(tooltipRef.current)) tooltipRef.current.addTo(map)
    })
    layer.on('mouseout', () => {
      map.closeTooltip(tooltipRef.current)
    })

    layer.on('click', (e) => {
      L.DomEvent.stopPropagation(e)
      posthog.capture('zone_clicked', {
        dauid: dauid,
        name: p.name,
        gap_score: p.gap_score,
        population: p.population,
      })
      onSelectDA(feature)
    })
  }, [onSelectDA, map])

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

// Colors and weights per transit mode
const TRANSIT_MODES = {
  skytrain:       { color: '#1e3a5f', weight: 5,   opacity: 0.9,  label: 'SkyTrain',         accent: 'accent-sky-900' },
  seabus:         { color: '#2563eb', weight: 4,   opacity: 0.85, label: 'SeaBus',           accent: 'accent-blue-600' },
  commuter_rail:  { color: '#2563eb', weight: 4,   opacity: 0.85, label: 'West Coast Express', accent: 'accent-blue-600' },
  bus:            { color: '#93c5fd', weight: 1,   opacity: 0.3,  label: 'Bus Routes',       accent: 'accent-blue-300' },
}

function TransitRouteLayer({ data, mode }) {
  const filtered = useMemo(() => ({
    type: 'FeatureCollection',
    features: data.features.filter(f => f.properties.mode === mode),
  }), [data, mode])

  const cfg = TRANSIT_MODES[mode]
  const smooth = mode !== 'bus'
  const style = {
    color: cfg.color,
    weight: cfg.weight,
    opacity: cfg.opacity,
    ...(smooth && { smoothFactor: 3, lineCap: 'round', lineJoin: 'round' }),
  }
  if (filtered.features.length === 0) return null
  return <GeoJSON data={filtered} style={() => style} />
}

function SkyTrainStations({ stopsData }) {
  const stations = useMemo(() => {
    if (!stopsData) return []
    // Get skytrain stops, deduplicate by station name (removing platform suffixes)
    const byName = new Map()
    for (const f of stopsData.features) {
      if (!f.properties.modes || !f.properties.modes.includes('skytrain')) continue
      const baseName = f.properties.name.replace(/ @ (Platform \d+|Canada Line)/, '')
      if (!byName.has(baseName) || f.properties.trips_per_day > byName.get(baseName).properties.trips_per_day) {
        byName.set(baseName, f)
      }
    }
    return [...byName.entries()].map(([name, f]) => ({
      name,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      trips_per_day: f.properties.trips_per_day,
    }))
  }, [stopsData])

  if (stations.length === 0) return null
  return (
    <>
      {stations.map(s => (
        <CircleMarker
          key={s.name}
          center={[s.lat, s.lng]}
          radius={7}
          pathOptions={{ fillColor: '#dbeafe', fillOpacity: 1, color: '#1e3a5f', weight: 2.5 }}
        >
          <Tooltip className="cs-tooltip" direction="top" offset={[0, -6]}>
            <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
              <div style={{ fontWeight: 600, color: '#1e3a5f' }}>{s.name}</div>
              <div style={{ color: '#6b7280' }}>{s.trips_per_day} trips/day</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  )
}

function BusStops({ stopsData }) {
  const stops = useMemo(() => {
    if (!stopsData) return []
    return stopsData.features
      .filter(f => f.properties.modes && f.properties.modes.includes('bus'))
      .map(f => ({
        name: f.properties.name,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        trips_per_day: f.properties.trips_per_day,
      }))
  }, [stopsData])

  if (stops.length === 0) return null
  return (
    <>
      {stops.map(s => (
        <CircleMarker
          key={`${s.lat}-${s.lng}`}
          center={[s.lat, s.lng]}
          radius={2.5}
          pathOptions={{ fillColor: '#93c5fd', fillOpacity: 0.6, color: '#93c5fd', weight: 0.5 }}
        >
          <Tooltip className="cs-tooltip" direction="top" offset={[0, -4]}>
            <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
              <div style={{ fontWeight: 600, color: '#111827' }}>{s.name}</div>
              <div style={{ color: '#6b7280' }}>{s.trips_per_day} trips/day</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  )
}

function MapSection() {
  const [gapData, setGapData] = useState(null)
  const [routeData, setRouteData] = useState(null)
  const [stopsData, setStopsData] = useState(null)
  const [showGaps, setShowGaps] = useState(true)
  const [showHotspots, setShowHotspots] = useState(false)
  const [showBus, setShowBus] = useState(false)
  const [showSkyTrain, setShowSkyTrain] = useState(false)
  const [showSeaBus, setShowSeaBus] = useState(false)
  const [showWCE, setShowWCE] = useState(false)
  const [selectedDA, setSelectedDA] = useState(null)

  const anyRouteOn = showBus || showSkyTrain || showSeaBus || showWCE
  const needStops = anyRouteOn || selectedDA

  useEffect(() => {
    fetchTopoJSON('/data/gap-analysis.topojson', 'gaps')
      .then(setGapData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (anyRouteOn && !routeData) {
      fetchTopoJSON('/data/routes.topojson', 'routes')
        .then(setRouteData)
        .catch(() => {})
    }
  }, [anyRouteOn, routeData])

  useEffect(() => {
    if (needStops && !stopsData) {
      fetchTopoJSON('/data/stops.topojson', 'stops')
        .then(setStopsData)
        .catch(() => {})
    }
  }, [needStops, stopsData])

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
    <section>
      <div className="relative">
        {/* Map container */}
        <div className="h-[500px] sm:h-[600px] lg:h-[700px]">
          <MapContainer
            center={VANCOUVER_CENTER}
            zoom={DEFAULT_ZOOM}
            className="w-full h-full"
            zoomControl={false}
            scrollWheelZoom={false}
            touchZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomright" />
            <InvalidateSizeOnMount />
            <MapClickHandler onMapClick={handleMapClick} />

            {showGaps && gapData && (
              <GapLayer
                data={gapData}
                selectedDAUID={selectedDA?.properties.dauid}
                onSelectDA={setSelectedDA}
              />
            )}
            {showHotspots && gapData && <HotspotLayer data={gapData} />}
            {showBus && routeData && <TransitRouteLayer data={routeData} mode="bus" />}
            {showBus && stopsData && <BusStops stopsData={stopsData} />}
            {showWCE && routeData && <TransitRouteLayer data={routeData} mode="commuter_rail" />}
            {showSeaBus && routeData && <TransitRouteLayer data={routeData} mode="seabus" />}
            {showSkyTrain && routeData && <TransitRouteLayer data={routeData} mode="skytrain" />}
            {showSkyTrain && stopsData && <SkyTrainStations stopsData={stopsData} />}
            {selectedDA && <NearbyStopsMarkers stops={nearestStops} />}
          </MapContainer>
        </div>

        {/* Floating UI panels */}
        <Legend showHotspots={showHotspots} />
        <LayerToggle
          showGaps={showGaps}
          setShowGaps={setShowGaps}
          showHotspots={showHotspots}
          setShowHotspots={setShowHotspots}
          showBus={showBus}
          setShowBus={setShowBus}
          showSkyTrain={showSkyTrain}
          setShowSkyTrain={setShowSkyTrain}
          showSeaBus={showSeaBus}
          setShowSeaBus={setShowSeaBus}
          showWCE={showWCE}
          setShowWCE={setShowWCE}
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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[900] cs-panel px-3 py-1.5 text-xs text-gray-400 pointer-events-none">
          Use +/- or pinch to zoom
        </div>
      </div>
    </section>
  )
}

export default MapSection
