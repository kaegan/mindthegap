/**
 * process-gtfs.js
 *
 * Reads TransLink GTFS data and produces two GeoJSON files:
 * 1. stops.geojson — every transit stop with its weekday trip count
 * 2. routes.geojson — transit route shapes as lines
 *
 * How it works:
 * - Looks at calendar.txt to find which service IDs run on weekdays
 * - Looks at trips.txt to find which trips use those weekday services
 * - Counts how many times each stop appears in stop_times.txt for those trips
 * - Outputs each stop as a GeoJSON point with a "trips_per_day" property
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

// Same but returns a Map for large files (stop_times) — streams and counts per stop
async function countStopTrips(weekdayTripIds) {
  const filepath = path.join(RAW_DIR, 'stop_times.txt')
  const lines = createInterface({ input: createReadStream(filepath) })
  let headers = null
  const stopCounts = new Map()
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

    if (weekdayTripIds.has(tripId)) {
      stopCounts.set(stopId, (stopCounts.get(stopId) || 0) + 1)
    }
  }
  return stopCounts
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

  console.log('Step 2: Reading trips.txt to find weekday trips...')
  const trips = await parseCSV('trips.txt')
  const weekdayTripIds = new Set(
    trips.filter(t => weekdayServiceIds.has(t.service_id)).map(t => t.trip_id)
  )
  console.log(`  Found ${weekdayTripIds.size} weekday trips`)

  console.log('Step 3: Counting stop visits from stop_times.txt (this is the big one)...')
  const stopCounts = await countStopTrips(weekdayTripIds)
  console.log(`  Counted visits for ${stopCounts.size} stops`)

  console.log('Step 4: Reading stops.txt and building GeoJSON...')
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
      },
    }))

  const stopsGeoJSON = { type: 'FeatureCollection', features: stopFeatures }
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'stops.geojson'), JSON.stringify(stopsGeoJSON))
  console.log(`  Wrote ${stopFeatures.length} stops to stops.geojson`)

  console.log('Step 5: Building route shapes GeoJSON...')
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
      properties: { shape_id: shapeId },
    })
  }

  const routesGeoJSON = { type: 'FeatureCollection', features: routeFeatures }
  fs.writeFileSync(path.join(OUT_DIR, 'routes.geojson'), JSON.stringify(routesGeoJSON))
  console.log(`  Wrote ${routeFeatures.length} route shapes to routes.geojson`)

  console.log('Done!')
}

main().catch(console.error)
