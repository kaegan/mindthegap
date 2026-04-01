/**
 * process-gtfs.js
 *
 * Reads TransLink GTFS data and produces two GeoJSON files:
 * 1. stops.geojson — every transit stop with its weekday trip count and transit mode
 * 2. routes.geojson — transit route shapes as lines, tagged by mode
 *
 * Transit modes (from GTFS route_type):
 *   1 = skytrain, 2 = commuter_rail (WCE), 3 = bus, 4 = seabus, 715 = bus
 *
 * How it works:
 * - Looks at calendar.txt to find which service IDs run on weekdays
 * - Looks at trips.txt to find which trips use those weekday services
 * - Maps routes → route_type to tag shapes and stops by transit mode
 * - Counts how many times each stop appears in stop_times.txt for those trips
 * - Outputs each stop as a GeoJSON point with "trips_per_day" and "mode" properties
 */

import fs from 'fs'
import path from 'path'
import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const RAW_DIR = path.join(process.cwd(), 'data', 'raw', 'gtfs')
const OUT_DIR = path.join(process.cwd(), 'public', 'data')

// Helper to parse a CSV file line by line (streaming, memory-friendly)
async function parseCSV(filename) {
  const filepath = path.join(RAW_DIR, filename)
  const lines = createInterface({ input: createReadStream(filepath) })
  let headers = null
  const rows = []

  for await (const line of lines) {
    if (!headers) {
      headers = line.split(',').map(h => h.trim())
      continue
    }
    const values = line.split(',').map(v => v.trim())
    const row = {}
    headers.forEach((h, i) => { row[h] = values[i] || '' })
    rows.push(row)
  }
  return rows
}

// Map GTFS route_type to our mode labels
function routeTypeToMode(routeType) {
  switch (routeType) {
    case '1': return 'skytrain'
    case '2': return 'commuter_rail'
    case '4': return 'seabus'
    default: return 'bus'   // 3 and 715
  }
}

// Same but returns a Map for large files (stop_times) — streams and counts per stop
// Also tracks which modes serve each stop via allTripModeMap (all trips, not just weekday)
async function countStopTrips(weekdayTripIds, allTripModeMap) {
  const filepath = path.join(RAW_DIR, 'stop_times.txt')
  const lines = createInterface({ input: createReadStream(filepath) })
  let headers = null
  const stopCounts = new Map()
  const stopModes = new Map()    // stop_id → Set of modes
  let processed = 0

  for await (const line of lines) {
    if (!headers) {
      headers = line.split(',').map(h => h.trim())
      continue
    }
    processed++
    if (processed % 500000 === 0) console.log(`  ...processed ${(processed / 1000000).toFixed(1)}M stop_times rows`)

    const values = line.split(',').map(v => v.trim())
    const tripId = values[headers.indexOf('trip_id')]
    const stopId = values[headers.indexOf('stop_id')]

    // Tag stop modes from ALL trips (so WCE etc. get tagged even if not weekday)
    const mode = allTripModeMap.get(tripId)
    if (mode) {
      if (!stopModes.has(stopId)) stopModes.set(stopId, new Set())
      stopModes.get(stopId).add(mode)
    }
    // Only count weekday trips for frequency stats
    if (weekdayTripIds.has(tripId)) {
      stopCounts.set(stopId, (stopCounts.get(stopId) || 0) + 1)
    }
  }
  return { stopCounts, stopModes }
}

async function main() {
  console.log('Step 1: Reading calendar.txt to find weekday service IDs...')
  const calendar = await parseCSV('calendar.txt')
  // A weekday service runs on at least one of Mon-Fri
  const weekdayServiceIds = new Set(
    calendar
      .filter(r => r.monday === '1' || r.tuesday === '1' || r.wednesday === '1' || r.thursday === '1' || r.friday === '1')
      .map(r => r.service_id)
  )
  console.log(`  Found ${weekdayServiceIds.size} weekday service IDs`)

  console.log('Step 2: Reading routes.txt for transit mode mapping...')
  const routes = await parseCSV('routes.txt')
  const routeModeMap = new Map()  // route_id → mode
  for (const r of routes) {
    routeModeMap.set(r.route_id, routeTypeToMode(r.route_type))
  }
  console.log(`  Mapped ${routeModeMap.size} routes to modes`)

  console.log('Step 3: Reading trips.txt to find weekday trips and map shapes...')
  const trips = await parseCSV('trips.txt')
  const weekdayTripIds = new Set()
  const tripModeMap = new Map()      // trip_id → mode
  const shapeToMode = new Map()      // shape_id → mode
  const shapeToRouteName = new Map() // shape_id → route_short_name
  for (const t of trips) {
    const mode = routeModeMap.get(t.route_id) || 'bus'
    // Always map shapes and modes (some services like WCE use calendar_dates
    // instead of calendar.txt weekday flags, so we'd miss their geometry)
    if (t.shape_id) {
      shapeToMode.set(t.shape_id, mode)
      const route = routes.find(r => r.route_id === t.route_id)
      if (route) shapeToRouteName.set(t.shape_id, route.route_short_name || route.route_long_name)
    }
    // Only count weekday trips for stop frequency stats
    if (weekdayServiceIds.has(t.service_id)) {
      weekdayTripIds.add(t.trip_id)
      tripModeMap.set(t.trip_id, mode)
    }
  }
  console.log(`  Found ${weekdayTripIds.size} weekday trips, ${shapeToMode.size} shapes mapped`)

  // Build a mode map for ALL trips (not just weekday) so stops get tagged correctly
  const allTripModeMap = new Map()
  for (const t of trips) {
    allTripModeMap.set(t.trip_id, routeModeMap.get(t.route_id) || 'bus')
  }

  console.log('Step 4: Counting stop visits from stop_times.txt (this is the big one)...')
  const { stopCounts, stopModes } = await countStopTrips(weekdayTripIds, allTripModeMap)
  console.log(`  Counted visits for ${stopCounts.size} stops`)

  console.log('Step 5: Reading stops.txt and building GeoJSON...')
  const stops = await parseCSV('stops.txt')
  const stopFeatures = stops
    .filter(s => s.stop_lat && s.stop_lon && s.location_type === '0')
    .map(s => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(s.stop_lon), parseFloat(s.stop_lat)],
      },
      properties: {
        stop_id: s.stop_id,
        name: s.stop_name,
        trips_per_day: stopCounts.get(s.stop_id) || 0,
        modes: stopModes.has(s.stop_id) ? [...stopModes.get(s.stop_id)] : ['bus'],
      },
    }))

  const stopsGeoJSON = { type: 'FeatureCollection', features: stopFeatures }
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'stops.geojson'), JSON.stringify(stopsGeoJSON))
  console.log(`  Wrote ${stopFeatures.length} stops to stops.geojson`)

  console.log('Step 6: Building route shapes GeoJSON...')
  const shapes = await parseCSV('shapes.txt')
  // Group shape points by shape_id
  const shapeGroups = new Map()
  for (const pt of shapes) {
    if (!shapeGroups.has(pt.shape_id)) shapeGroups.set(pt.shape_id, [])
    shapeGroups.get(pt.shape_id).push({
      lat: parseFloat(pt.shape_pt_lat),
      lon: parseFloat(pt.shape_pt_lon),
      seq: parseInt(pt.shape_pt_sequence),
    })
  }

  const routeFeatures = []
  for (const [shapeId, points] of shapeGroups) {
    points.sort((a, b) => a.seq - b.seq)
    routeFeatures.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: points.map(p => [p.lon, p.lat]),
      },
      properties: {
        shape_id: shapeId,
        mode: shapeToMode.get(shapeId) || 'bus',
        route_name: shapeToRouteName.get(shapeId) || '',
      },
    })
  }

  const routesGeoJSON = { type: 'FeatureCollection', features: routeFeatures }
  fs.writeFileSync(path.join(OUT_DIR, 'routes.geojson'), JSON.stringify(routesGeoJSON))
  console.log(`  Wrote ${routeFeatures.length} route shapes to routes.geojson`)

  console.log('Done!')
}

main().catch(console.error)
