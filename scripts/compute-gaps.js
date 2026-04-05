/**
 * compute-gaps.js
 *
 * Combines the transit stop data with census DA data to compute
 * a coverage gap score for each DA.
 *
 * How it works:
 * - Loads stops.geojson (transit stops with trips_per_day)
 * - Loads census-das.geojson (DA polygons with population density)
 * - For each DA, counts how many transit trips serve stops within
 *   walking distance (600m for bus, 1200m for rail) of the DA centroid
 * - Normalizes both transit access and population pressure to 0-1
 * - Gap score = population_pressure × (1 - transit_access)
 *   High score = lots of people, little transit (the problem Spare solves)
 *
 * Output:
 *   public/data/gap-analysis.geojson (DAs with gap_score added)
 */

import fs from 'fs'
import path from 'path'
import * as turf from '@turf/turf'

const DATA_DIR = path.join(process.cwd(), 'public', 'data')

function main() {
  console.log('Step 1: Loading data...')
  const stops = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'stops.geojson'), 'utf-8'))
  const das = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'census-das.geojson'), 'utf-8'))

  console.log(`  ${stops.features.length} transit stops`)
  console.log(`  ${das.features.length} dissemination areas`)

  // Build a spatial index of stops using a simple grid
  // (Turf's operations are slow on 8000+ stops × 3500+ DAs without indexing)
  console.log('Step 2: Building spatial index of stops...')
  const GRID_SIZE = 0.01 // ~1km grid cells
  const stopGrid = new Map()

  for (const stop of stops.features) {
    const [lon, lat] = stop.geometry.coordinates
    const key = `${Math.floor(lon / GRID_SIZE)},${Math.floor(lat / GRID_SIZE)}`
    if (!stopGrid.has(key)) stopGrid.set(key, [])
    stopGrid.get(key).push(stop)
  }

  // For a given point, get nearby stops from the grid
  function getNearbyStops(lon, lat, radiusKm) {
    const gridRadius = Math.ceil(radiusKm / 1.11) // rough km to degrees
    const centerX = Math.floor(lon / GRID_SIZE)
    const centerY = Math.floor(lat / GRID_SIZE)
    const nearby = []
    for (let dx = -gridRadius; dx <= gridRadius; dx++) {
      for (let dy = -gridRadius; dy <= gridRadius; dy++) {
        const key = `${centerX + dx},${centerY + dy}`
        const cell = stopGrid.get(key)
        if (cell) nearby.push(...cell)
      }
    }
    return nearby
  }

  console.log('Step 3: Computing transit access for each DA...')
  const WALK_RADIUS_BUS = 0.6   // 600m in km
  const WALK_RADIUS_RAIL = 1.2  // 1200m in km — we treat all stops as bus for now
  const WALK_RADIUS = WALK_RADIUS_BUS // Using 600m default

  let maxTrips = 0
  let maxPopDensity = 0

  // First pass: compute raw transit access and find maximums
  for (const da of das.features) {
    const centroid = turf.centroid(da)
    const [lon, lat] = centroid.geometry.coordinates

    // Find stops within walking distance
    const nearby = getNearbyStops(lon, lat, WALK_RADIUS + 0.5)
    let totalTrips = 0

    for (const stop of nearby) {
      const dist = turf.distance(centroid, stop, { units: 'kilometers' })
      if (dist <= WALK_RADIUS) {
        totalTrips += stop.properties.trips_per_day || 0
      }
    }

    da.properties.transit_trips = totalTrips
    da.properties.centroid_lon = Math.round(lon * 10000) / 10000
    da.properties.centroid_lat = Math.round(lat * 10000) / 10000

    if (totalTrips > maxTrips) maxTrips = totalTrips
    if (da.properties.pop_density > maxPopDensity) maxPopDensity = da.properties.pop_density
  }

  console.log(`  Max transit trips near any DA: ${maxTrips}`)
  console.log(`  Max population density: ${maxPopDensity}/km²`)

  // Density floor: DAs below this are classified as "low density" and
  // rendered differently on the map (gray, ungraded)
  const DENSITY_FLOOR = 400 // people/km²

  // Second pass: per-capita coverage scoring
  // Instead of population × (1 - transit), we use trips_per_capita to measure
  // how well-served residents actually are. This prevents high-density areas
  // with decent transit from being penalized, and avoids misleading "great
  // coverage" labels on empty rural areas.
  console.log('Step 4: Computing per-capita coverage scores...')

  function percentileRank(sortedArr, value) {
    let count = 0
    for (const v of sortedArr) {
      if (v < value) count++
      else break
    }
    return sortedArr.length > 1 ? count / (sortedArr.length - 1) : 0
  }

  // Separate above/below density floor
  const aboveFloor = das.features.filter(da =>
    da.properties.pop_density >= DENSITY_FLOOR && da.properties.population > 0
  )
  const belowFloor = das.features.filter(da =>
    da.properties.pop_density < DENSITY_FLOOR || da.properties.population === 0
  )

  console.log(`  ${aboveFloor.length} DAs above density floor (${DENSITY_FLOOR}/km²)`)
  console.log(`  ${belowFloor.length} DAs below density floor`)

  // Compute trips-per-capita for above-floor DAs
  for (const da of aboveFloor) {
    da.properties._tpc = da.properties.transit_trips / da.properties.population
  }

  // Percentile rank trips-per-capita among above-floor DAs only
  const tpcValues = aboveFloor.map(da => da.properties._tpc).sort((a, b) => a - b)

  // Also compute transit and population percentiles across ALL DAs (for display context)
  const transitValues = das.features.map(da => da.properties.transit_trips).sort((a, b) => a - b)
  const popValues = das.features.map(da => da.properties.pop_density).sort((a, b) => a - b)

  let gapCount = 0

  for (const da of aboveFloor) {
    const tpcPercentile = percentileRank(tpcValues, da.properties._tpc)
    const transitScore = percentileRank(transitValues, da.properties.transit_trips)
    const popPressure = percentileRank(popValues, da.properties.pop_density)

    // Coverage gap = inverse of per-capita transit access, squared to
    // compress the middle and make red areas genuinely stand out
    const gapScore = (1 - tpcPercentile) ** 2

    da.properties.transit_score = Math.round(transitScore * 1000) / 1000
    da.properties.pop_pressure = Math.round(popPressure * 1000) / 1000
    da.properties.gap_score = Math.round(gapScore * 1000) / 1000
    da.properties.trips_per_capita = Math.round(da.properties._tpc * 100) / 100
    da.properties.low_density = false

    if (gapScore > 0.5) gapCount++

    delete da.properties.transit_trips
    delete da.properties.centroid_lon
    delete da.properties.centroid_lat
    delete da.properties._tpc
  }

  for (const da of belowFloor) {
    const transitScore = percentileRank(transitValues, da.properties.transit_trips)
    const popPressure = percentileRank(popValues, da.properties.pop_density)

    da.properties.transit_score = Math.round(transitScore * 1000) / 1000
    da.properties.pop_pressure = Math.round(popPressure * 1000) / 1000
    da.properties.gap_score = 0
    da.properties.trips_per_capita = da.properties.population > 0
      ? Math.round((da.properties.transit_trips / da.properties.population) * 100) / 100
      : 0
    da.properties.low_density = true

    delete da.properties.transit_trips
    delete da.properties.centroid_lon
    delete da.properties.centroid_lat
  }

  console.log(`  ${gapCount} DAs have gap score > 0.5 (significant gaps)`)

  // Sort features by gap score for easy inspection
  das.features.sort((a, b) => b.properties.gap_score - a.properties.gap_score)

  // Log top 10 gaps
  console.log('\nTop 10 coverage gaps:')
  for (const da of das.features.slice(0, 10)) {
    const p = da.properties
    console.log(`  DA ${p.dauid}: gap=${p.gap_score} pop_density=${p.pop_density}/km² transit=${p.transit_score}`)
  }

  // Write output
  fs.writeFileSync(path.join(DATA_DIR, 'gap-analysis.geojson'), JSON.stringify(das))
  const sizeMB = (fs.statSync(path.join(DATA_DIR, 'gap-analysis.geojson')).size / 1024 / 1024).toFixed(1)
  console.log(`\nWrote gap-analysis.geojson (${sizeMB} MB)`)
  console.log('Done!')
}

main()
