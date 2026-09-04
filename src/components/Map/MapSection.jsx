import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMapEvents, useMap, CircleMarker, Tooltip } from 'react-leaflet'
import { feature } from 'topojson-client'
import { capture } from '../../lib/analytics'
import Legend from './Legend'
import LayerToggle from './LayerToggle'
import HotspotLayer from './HotspotLayer'
import PopDensityLayer from './PopDensityLayer'
import ReportCard from './ReportCard'
import NearbyStopsMarkers from './NearbyStopsMarkers'
import GapExplorer from './GapExplorer'
import FlyToFeature from './FlyToFeature'
import L from 'leaflet'
import { getGapColor, LOW_DENSITY_COLOR } from '../../utils/colors'
import { computeMetroStats } from '../../utils/gapStats'
import { findNearestStops } from '../../utils/nearestStops'

function fetchTopoJSON(url, layerName) {
  return fetch(url)
    .then(r => r.ok ? r.json() : null)
    .then(topo => topo ? feature(topo, topo.objects[layerName]) : null)
}

const VANCOUVER_CENTER = [49.25, -123.1]
const DEFAULT_ZOOM = 11

const DEFAULT_STYLE = (score, lowDensity) => ({
  className: 'gap-path',
  fillColor: lowDensity ? LOW_DENSITY_COLOR : getGapColor(score),
  fillOpacity: lowDensity ? 0.35 : 0.65,
  weight: 0.5,
  color: 'rgba(0,0,0,0.08)',
})

const HIGHLIGHT_STYLE = (score, lowDensity) => ({
  className: 'gap-path',
  fillColor: lowDensity ? LOW_DENSITY_COLOR : getGapColor(score),
  fillOpacity: lowDensity ? 0.55 : 0.85,
  weight: 3,
  color: '#16171b',
})

// Hovered from the Worst-gaps list: an ink outline, no fill change
const HOVER_STYLE = (score, lowDensity) => ({
  ...DEFAULT_STYLE(score, lowDensity),
  weight: 2,
  color: '#16171b',
})

// Before the one-time reveal, every graded area is grey; the CSS transition
// on `.gap-path` then carries each one to its colour, reddest last.
const UNREVEALED_STYLE = (lowDensity) => ({
  ...DEFAULT_STYLE(0, lowDensity),
  fillColor: LOW_DENSITY_COLOR,
})

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
let hasRevealed = false // once per page, not once per layer mount

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

function GapLayer({ data, selectedDAUID, hoveredDAUID, onSelectDA }) {
  const map = useMap()
  const layersRef = useRef(new Map())
  const selectedLayerRef = useRef(null)
  const hoveredLayerRef = useRef(null)
  const [revealed, setRevealed] = useState(() => hasRevealed || reduceMotion())

  useEffect(() => {
    if (revealed) return
    // Two frames so the grey paths are painted before the colour lands
    let f2
    const f1 = requestAnimationFrame(() => { f2 = requestAnimationFrame(() => { setRevealed(true); hasRevealed = true }) })
    const done = setTimeout(() => map.getContainer().classList.add('gap-reveal-done'), 1300)
    return () => { cancelAnimationFrame(f1); cancelAnimationFrame(f2); clearTimeout(done) }
  }, [revealed, map])
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

    const content = p.low_density
      ? `<div style="font-size:13px; line-height:1.5">
          <div style="font-weight:600; color:#16171b; margin-bottom:2px">${p.name || 'Area'}</div>
          <div style="color:#5a5d66">Low density (${densityStr}/km²)</div>
          <div style="color:#6b6e76; margin-top:2px">Not graded</div>
        </div>`
      : `<div style="font-size:13px; line-height:1.5">
          <div style="font-weight:600; color:#16171b; margin-bottom:2px">${p.name || 'Area'}</div>
          <div style="color:#5a5d66">Density: ${densityStr}/km²</div>
          <div style="color:#5a5d66">Trips/resident: ${(p.trips_per_capita || 0).toFixed(1)}</div>
          <div style="display:flex; align-items:center; gap:6px; font-weight:600; color:#16171b; margin-top:2px">
            <span style="display:inline-block; width:10px; height:10px; background:${getGapColor(p.gap_score || 0)}; border:1px solid rgba(22,23,27,0.25)"></span>
            Coverage gap: ${(p.gap_score || 0).toFixed(2)}
          </div>
        </div>`

    // Per-path reveal delay, proportional to gap score
    layer.on('add', () => {
      layer.getElement()?.style.setProperty('--gap', String(p.low_density ? 0 : (p.gap_score || 0)))
    })

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
      capture('zone_clicked', {
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
      const prev = selectedLayerRef.current.feature.properties
      selectedLayerRef.current.setStyle(DEFAULT_STYLE(prev.gap_score || 0, prev.low_density))
    }
    // Highlight new
    if (selectedDAUID) {
      const layer = layersRef.current.get(selectedDAUID)
      if (layer) {
        const props = layer.feature.properties
        layer.setStyle(HIGHLIGHT_STYLE(props.gap_score || 0, props.low_density))
        layer.bringToFront()
        selectedLayerRef.current = layer
      }
    } else {
      selectedLayerRef.current = null
    }
  }, [selectedDAUID])

  // Outline the area hovered in the Worst-gaps list
  useEffect(() => {
    const prev = hoveredLayerRef.current
    if (prev && prev.feature.properties.dauid !== selectedDAUID) {
      const pp = prev.feature.properties
      prev.setStyle(DEFAULT_STYLE(pp.gap_score || 0, pp.low_density))
    }
    hoveredLayerRef.current = null
    if (hoveredDAUID && hoveredDAUID !== selectedDAUID) {
      const layer = layersRef.current.get(hoveredDAUID)
      if (layer) {
        const pr = layer.feature.properties
        layer.setStyle(HOVER_STYLE(pr.gap_score || 0, pr.low_density))
        layer.bringToFront()
        hoveredLayerRef.current = layer
      }
    }
  }, [hoveredDAUID, selectedDAUID])

  const style = (feature) => {
    const { gap_score, low_density, dauid } = feature.properties
    if (!revealed) return UNREVEALED_STYLE(low_density)
    if (dauid === selectedDAUID) return HIGHLIGHT_STYLE(gap_score || 0, low_density)
    if (dauid === hoveredDAUID) return HOVER_STYLE(gap_score || 0, low_density)
    return DEFAULT_STYLE(gap_score || 0, low_density)
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
              <div style={{ color: '#5a5d66' }}>{s.trips_per_day} trips/day</div>
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
              <div style={{ fontWeight: 600, color: '#16171b' }}>{s.name}</div>
              <div style={{ color: '#5a5d66' }}>{s.trips_per_day} trips/day</div>
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
  const [showPopDensity, setShowPopDensity] = useState(false)
  const [showBus, setShowBus] = useState(false)
  const [showSkyTrain, setShowSkyTrain] = useState(false)
  const [showSeaBus, setShowSeaBus] = useState(false)
  const [showWCE, setShowWCE] = useState(false)
  const [selectedDA, setSelectedDA] = useState(null)
  const [selectedName, setSelectedName] = useState(null)
  const [hoveredDAUID, setHoveredDAUID] = useState(null)
  const [showExplorer, setShowExplorerState] = useState(false)
  const [layersOpen, setLayersOpen] = useState(() => window.innerWidth >= 640)
  const [flyTarget, setFlyTarget] = useState(null)

  // Below `sm` the list and the layers panel share the same screen; only one
  // is open at a time.
  const setShowExplorer = useCallback((next) => {
    setShowExplorerState(prev => {
      const value = typeof next === 'function' ? next(prev) : next
      if (value && window.innerWidth < 640) setLayersOpen(false)
      return value
    })
  }, [])

  const [gapStatus, setGapStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [gapAttempt, setGapAttempt] = useState(0)

  const anyRouteOn = showBus || showSkyTrain || showSeaBus || showWCE
  const needStops = anyRouteOn || selectedDA || showExplorer

  useEffect(() => {
    let stale = false
    fetchTopoJSON('/data/gap-analysis.topojson', 'gaps')
      .then(data => {
        if (stale) return
        if (!data) throw new Error('gap data unavailable')
        setGapData(data)
        setGapStatus('ready')
      })
      .catch(() => { if (!stale) setGapStatus('error') })
    return () => { stale = true }
  }, [gapAttempt])

  const retryGapData = useCallback(() => {
    setGapStatus('loading')
    setGapAttempt(a => a + 1)
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
    setSelectedName(null)
  }, [])

  const handleMapSelect = useCallback((feature) => {
    setSelectedDA(feature)
    setSelectedName(null)
  }, [])

  const handleExplorerSelect = useCallback((feature, name) => {
    setSelectedDA(feature)
    setSelectedName(name || null)
    setFlyTarget(feature)
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
              attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
              url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={16}
            />
            <ZoomControl position="bottomright" />
            <InvalidateSizeOnMount />
            <MapClickHandler onMapClick={handleMapClick} />

            {showGaps && gapData && (
              <GapLayer
                data={gapData}
                selectedDAUID={selectedDA?.properties.dauid}
                hoveredDAUID={hoveredDAUID}
                onSelectDA={handleMapSelect}
              />
            )}
            {showHotspots && gapData && <HotspotLayer data={gapData} />}
            {showPopDensity && gapData && <PopDensityLayer data={gapData} />}
            {showBus && routeData && <TransitRouteLayer data={routeData} mode="bus" />}
            {showBus && stopsData && <BusStops stopsData={stopsData} />}
            {showWCE && routeData && <TransitRouteLayer data={routeData} mode="commuter_rail" />}
            {showSeaBus && routeData && <TransitRouteLayer data={routeData} mode="seabus" />}
            {showSkyTrain && routeData && <TransitRouteLayer data={routeData} mode="skytrain" />}
            {showSkyTrain && stopsData && <SkyTrainStations stopsData={stopsData} />}
            {selectedDA && <NearbyStopsMarkers stops={nearestStops} />}
            <FlyToFeature feature={flyTarget} />
          </MapContainer>
        </div>

        {/* Floating UI panels */}
        <Legend showHotspots={showHotspots} showPopDensity={showPopDensity} />
        <LayerToggle
          open={layersOpen}
          setOpen={setLayersOpen}
          showGaps={showGaps}
          setShowGaps={setShowGaps}
          showHotspots={showHotspots}
          setShowHotspots={setShowHotspots}
          showPopDensity={showPopDensity}
          setShowPopDensity={setShowPopDensity}
          showBus={showBus}
          setShowBus={setShowBus}
          showSkyTrain={showSkyTrain}
          setShowSkyTrain={setShowSkyTrain}
          showSeaBus={showSeaBus}
          setShowSeaBus={setShowSeaBus}
          showWCE={showWCE}
          setShowWCE={setShowWCE}
          showExplorer={showExplorer}
          setShowExplorer={setShowExplorer}
        />

        {/* Gap Explorer */}
        {showExplorer && gapData && (
          <GapExplorer
            gapData={gapData}
            stopsData={stopsData}
            onSelectDA={handleExplorerSelect}
            onHoverDA={setHoveredDAUID}
            selectedDAUID={selectedDA?.properties.dauid}
            hoveredDAUID={hoveredDAUID}
            onClose={() => { setShowExplorer(false); setHoveredDAUID(null) }}
          />
        )}

        {/* Report card */}
        {selectedDA && metroStats && (
          <ReportCard
            feature={selectedDA}
            displayName={selectedName}
            nearestStops={nearestStops}
            metroStats={metroStats}
            onClose={() => { setSelectedDA(null); setSelectedName(null) }}
          />
        )}

        {/* Scroll-zoom hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[900] cs-mono text-[11px] text-faint bg-white/85 px-2.5 py-1 pointer-events-none">
          +/− or pinch to zoom
        </div>

        {/* Coverage-data loading / error overlay */}
        {gapStatus !== 'ready' && (
          <div className="absolute inset-0 z-[950] flex items-center justify-center pointer-events-none">
            {gapStatus === 'loading' ? (
              <div className="cs-panel px-4 py-3 flex items-center gap-3" role="status">
                <span className="w-4 h-4 rounded-full border-2 border-transit border-t-transparent animate-spin" aria-hidden="true" />
                <span className="text-sm text-graphite">Loading coverage data…</span>
              </div>
            ) : (
              <div className="cs-panel px-4 py-3 flex items-center gap-3 pointer-events-auto" role="alert">
                <span className="text-sm text-graphite">Couldn't load coverage data.</span>
                <button onClick={retryGapData} className="text-sm font-semibold text-transit hover:underline">
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default MapSection
