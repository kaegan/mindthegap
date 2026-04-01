/**
 * process-census.js
 *
 * Reads the StatsCan DA boundary shapefile + census profile CSV to produce
 * a GeoJSON file of Metro Vancouver DAs with population density.
 *
 * How it works:
 * - Reads the boundary shapefile, filtering to DAs in Metro Vancouver (DAUID starts with 5915)
 * - Reads the census profile CSV, extracting population (characteristic ID 1) per DA
 * - Joins population onto the boundary polygons
 * - Computes population density = population / land area
 * - Simplifies the polygon geometry to reduce file size
 * - Writes out a GeoJSON file
 *
 * Input:
 *   data/raw/da_boundaries/lda_000b21a_e.shp  (StatsCan DA boundaries)
 *   data/raw/census_profile_bc/98-401-X2021006_English_CSV_data.csv  (Census profile)
 *
 * Output:
 *   public/data/census-das.geojson
 */

import * as shapefile from 'shapefile'
import fs from 'fs'
import path from 'path'
import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import proj4 from 'proj4'
import * as turf from '@turf/turf'

// StatsCan Lambert Conformal Conic projection → WGS84
const LAMBERT = '+proj=lcc +lat_1=49 +lat_2=77 +lat_0=63.390675 +lon_0=-91.86666666666666 +x_0=6200000 +y_0=3000000 +datum=NAD83 +units=m +no_defs'
const WGS84 = 'EPSG:4326'

const OUT_DIR = path.join(process.cwd(), 'public', 'data')

// Find the census profile CSV — it could be in different subdirectory names
function findCensusCSV() {
  const rawDir = path.join(process.cwd(), 'data', 'raw')
  // Look for any CSV file matching the census profile pattern
  const candidates = []
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.match(/98-401.*English.*CSV.*data.*\.csv$/i) || entry.name.match(/98-401.*eng.*data.*\.csv$/i)) {
        candidates.push(full)
      }
    }
  }
  walk(rawDir)
  if (candidates.length === 0) {
    // Try a broader pattern
    function walk2(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk2(full)
        else if (entry.name.endsWith('.csv') && entry.name.includes('data') && fs.statSync(full).size > 1000000) {
          candidates.push(full)
        }
      }
    }
    walk2(rawDir)
  }
  return candidates[0] || null
}

// Stream-parse the census CSV to extract population per DA
// The census profile CSV has columns like:
// DGUID, CHARACTERISTIC_ID, C1_COUNT_TOTAL, etc.
// We want CHARACTERISTIC_ID=1 (Population 2021) for DAs (DGUID starting with 2021S0512)
async function extractPopulation(csvPath) {
  console.log(`  Reading: ${csvPath}`)
  const lines = createInterface({ input: createReadStream(csvPath, { encoding: 'utf-8' }) })
  let headers = null
  const popByDauid = new Map()
  let lineCount = 0

  for await (const line of lines) {
    lineCount++
    if (!headers) {
      // Parse header — handle BOM and quoted fields
      const cleaned = line.replace(/^\uFEFF/, '')
      headers = parseCSVLine(cleaned)
      console.log(`  Headers: ${headers.slice(0, 5).join(', ')}...`)
      continue
    }

    if (lineCount % 1000000 === 0) console.log(`  ...processed ${(lineCount / 1000000).toFixed(1)}M rows`)

    const values = parseCSVLine(line)
    const dguid = values[headers.indexOf('DGUID')] || values[headers.indexOf('"DGUID"')] || ''

    // Only care about DAs (DGUID format: 2021S0512XXXXXXXX)
    if (!dguid.startsWith('2021S0512')) continue

    // Only care about Metro Vancouver DAs (DAUID starts with 5915)
    const dauid = dguid.replace('2021S0512', '')
    if (!dauid.startsWith('5915')) continue

    // Get characteristic ID — we want "1" which is "Population, 2021"
    const charIdIdx = headers.indexOf('CHARACTERISTIC_ID')
    const charId = charIdIdx >= 0 ? values[charIdIdx] : ''
    if (charId !== '1') continue

    // Get the total count
    const countIdx = headers.indexOf('C1_COUNT_TOTAL')
    const count = countIdx >= 0 ? parseInt(values[countIdx]?.replace(/,/g, '')) : NaN

    if (!isNaN(count)) {
      popByDauid.set(dauid, count)
    }
  }

  console.log(`  Found population for ${popByDauid.size} Metro Vancouver DAs`)
  return popByDauid
}

// Simple CSV line parser that handles quoted fields
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

// Reproject a single coordinate from Lambert to WGS84
function reprojectCoord(coord) {
  const [lon, lat] = proj4(LAMBERT, WGS84, coord)
  // Round to 5 decimal places (~1m precision) to save file size
  return [Math.round(lon * 100000) / 100000, Math.round(lat * 100000) / 100000]
}

// Reproject all coordinates from Lambert to WGS84, keeping all points
function reprojectGeometry(geometry) {
  if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: geometry.coordinates.map(ring => ring.map(reprojectCoord)),
    }
  } else if (geometry.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: geometry.coordinates.map(polygon =>
        polygon.map(ring => ring.map(reprojectCoord))
      ),
    }
  }
  return geometry
}

// Reproject then simplify using Douglas-Peucker (preserves shape-defining vertices)
function reprojectAndSimplify(geometry) {
  const reprojected = reprojectGeometry(geometry)
  const feature = turf.feature(reprojected)
  const simplified = turf.simplify(feature, { tolerance: 0.0001, highQuality: true })
  return simplified.geometry
}

async function main() {
  // Step 1: Find census CSV
  console.log('Step 1: Finding census profile CSV...')
  const csvPath = findCensusCSV()
  if (!csvPath) {
    console.error('ERROR: Could not find census profile CSV in data/raw/')
    console.error('Expected a file matching: 98-401-*English*CSV*data*.csv')
    console.error('Please unzip the StatsCan census profile download into data/raw/')
    process.exit(1)
  }

  // Step 2: Extract population
  console.log('Step 2: Extracting population data from census profile...')
  const popByDauid = await extractPopulation(csvPath)

  // Step 3: Read shapefile and build GeoJSON
  console.log('Step 3: Reading DA boundaries and building GeoJSON...')
  const source = await shapefile.open(
    'data/raw/da_boundaries/lda_000b21a_e.shp',
    'data/raw/da_boundaries/lda_000b21a_e.dbf'
  )

  const features = []
  let result
  while (!(result = await source.read()).done) {
    const p = result.value.properties
    if (!p.DAUID.startsWith('5915')) continue

    const pop = popByDauid.get(p.DAUID) || 0
    const area = parseFloat(p.LANDAREA) || 0.001
    const popDensity = pop / area

    features.push({
      type: 'Feature',
      geometry: reprojectAndSimplify(result.value.geometry),
      properties: {
        dauid: p.DAUID,
        name: `DA ${p.DAUID}`,
        population: pop,
        land_area_km2: Math.round(area * 1000) / 1000,
        pop_density: Math.round(popDensity),
      },
    })
  }

  const geojson = { type: 'FeatureCollection', features }
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'census-das.geojson'), JSON.stringify(geojson))
  console.log(`  Wrote ${features.length} Metro Vancouver DAs to census-das.geojson`)
  console.log(`  ${popByDauid.size} DAs had population data`)
  console.log('Done!')
}

main().catch(console.error)
