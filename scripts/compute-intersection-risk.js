/**
 * compute-intersection-risk.js
 *
 * Joins real ICBC crash records to the City of Vancouver's signalized
 * intersections and computes a 0–1 safety-risk score for each intersection.
 *
 * Inputs:
 *   public/data/raw/intersections.geojson       (from fetch-intersections.js)
 *   public/data/raw/icbc-crashes-vancouver.csv  (ICBC reported crashes, 2016–2020)
 *     columns: Location, Crash Type, Municipality, Year, Crash Count, Latitude, Longitude
 *     Crash Type ∈ { "Casualty", "Property damage only" }
 *
 * Method:
 *   - Each crash record carries lat/lng. We snap it to the nearest signalized
 *     intersection within SNAP_RADIUS metres (crashes farther than that are
 *     mid-block or at unsignalized intersections and are ignored — we only
 *     score signals).
 *   - Per intersection we sum: total crashes, casualty crashes, property-damage
 *     crashes, and a per-year breakdown.
 *   - Severity-weighted exposure = casualty × CASUALTY_WEIGHT + pdo × 1.
 *   - risk_score = percentile rank of weighted exposure across all
 *     intersections (spreads scores evenly 0–1, mirroring compute-gaps.js).
 *
 * Output:
 *   public/data/intersection-risk.json  (GeoJSON points with risk properties)
 */

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'public', 'data')
const RAW_DIR = path.join(DATA_DIR, 'raw')

const SNAP_RADIUS = 50 // metres — a crash within this of a signal counts toward it
const CASUALTY_WEIGHT = 3 // an injury/fatal crash weighs 3× a property-damage crash
const GRID_DEG = 0.0009 // ~100m grid cells for the spatial index

// Fast equirectangular distance in metres (fine at neighbourhood scale).
function metres(lat1, lng1, lat2, lng2) {
  const dLat = (lat2 - lat1) * 111320
  const dLng = (lng2 - lng1) * 111320 * Math.cos((lat1 * Math.PI) / 180)
  return Math.sqrt(dLat * dLat + dLng * dLng)
}

// Minimal CSV parser. The ICBC file has no quoted commas in the fields we use,
// but Location can contain none either ("ST A & ST B"), so a plain split is safe.
function parseCrashCSV(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(Boolean)
  const headers = lines[0].split(',')
  const idx = name => headers.indexOf(name)
  const iLoc = idx('Location'), iType = idx('Crash Type'), iYear = idx('Year')
  const iCount = idx('Crash Count'), iLat = idx('Latitude'), iLng = idx('Longitude')
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const v = lines[i].split(',')
    const lat = parseFloat(v[iLat]), lng = parseFloat(v[iLng])
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
    rows.push({
      location: v[iLoc],
      casualty: v[iType] === 'Casualty',
      year: v[iYear],
      count: parseInt(v[iCount], 10) || 0,
      lat,
      lng,
    })
  }
  return rows
}

function cellKey(lat, lng) {
  return `${Math.floor(lat / GRID_DEG)},${Math.floor(lng / GRID_DEG)}`
}

function main() {
  console.log('Step 1: Loading intersections + crashes...')
  const signals = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'intersections.geojson'), 'utf-8'))
  const crashes = parseCrashCSV(fs.readFileSync(path.join(RAW_DIR, 'icbc-crashes-vancouver.csv'), 'utf-8'))
  console.log(`  ${signals.features.length} signalized intersections`)
  console.log(`  ${crashes.length} geolocated crash records`)

  // Initialize per-signal accumulators + spatial index.
  const grid = new Map()
  signals.features.forEach((f, i) => {
    const [lng, lat] = f.geometry.coordinates
    f._lat = lat
    f._lng = lng
    f._agg = { total: 0, casualty: 0, pdo: 0, byYear: {}, names: {} }
    const k = cellKey(lat, lng)
    if (!grid.has(k)) grid.set(k, [])
    grid.get(k).push(i)
  })

  console.log('Step 2: Snapping crashes to nearest signal (≤50m)...')
  let matched = 0
  for (const c of crashes) {
    const cx = Math.floor(c.lat / GRID_DEG)
    const cy = Math.floor(c.lng / GRID_DEG)
    let best = null
    let bestDist = SNAP_RADIUS
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const cell = grid.get(`${cx + dx},${cy + dy}`)
        if (!cell) continue
        for (const si of cell) {
          const f = signals.features[si]
          const d = metres(c.lat, c.lng, f._lat, f._lng)
          if (d <= bestDist) {
            bestDist = d
            best = f
          }
        }
      }
    }
    if (!best) continue
    matched += c.count
    const a = best._agg
    a.total += c.count
    if (c.casualty) a.casualty += c.count
    else a.pdo += c.count
    a.byYear[c.year] = (a.byYear[c.year] || 0) + c.count
    if (c.location) a.names[c.location] = (a.names[c.location] || 0) + c.count
  }
  console.log(`  ${matched} crashes snapped to a signalized intersection`)

  console.log('Step 3: Computing severity-weighted exposure + percentile risk score...')
  const weighted = signals.features.map(f => f._agg.casualty * CASUALTY_WEIGHT + f._agg.pdo)
  const sorted = [...weighted].sort((a, b) => a - b)
  function percentileRank(value) {
    let count = 0
    for (const v of sorted) {
      if (v < value) count++
      else break
    }
    return sorted.length > 1 ? count / (sorted.length - 1) : 0
  }

  let highRisk = 0, pedSignals = 0
  const out = signals.features.map(f => {
    const a = f._agg
    const w = a.casualty * CASUALTY_WEIGHT + a.pdo
    // Intersections with zero recorded crashes get score 0 (genuinely safe in
    // the record), not the bottom percentile, to avoid a misleading gradient.
    const risk = a.total === 0 ? 0 : Math.round(percentileRank(w) * 1000) / 1000
    if (risk > 0.6) highRisk++
    if (/Pedestrian/i.test(f.properties.signal_type)) pedSignals++
    // Human-readable intersection name = the crash location that most often
    // snapped here (titlecased). Falls back to the neighbourhood for signals
    // with no recorded crashes.
    const topName = Object.entries(a.names).sort((x, y) => y[1] - x[1])[0]?.[0]
    // ICBC labels complex junctions with many "&" segments (onramps, turn lanes).
    // Keep the two primary cross-streets for a readable, still-truthful name.
    const name = topName
      ? topName
          .split('&')
          .map(s => s.trim())
          .filter(Boolean)
          .slice(0, 2)
          .join(' & ')
          .replace(/\b\w[\w']*\b/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())
      : (f.properties.neighbourhood || 'Signalized intersection')
    return {
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        name,
        signal_type: f.properties.signal_type,
        neighbourhood: f.properties.neighbourhood,
        risk_score: risk,
        total_crashes: a.total,
        casualty_crashes: a.casualty,
        pdo_crashes: a.pdo,
        casualty_rate: a.total ? Math.round((a.casualty / a.total) * 100) : 0,
        crashes_by_year: a.byYear,
      },
    }
  })

  const fc = { type: 'FeatureCollection', features: out }
  const outPath = path.join(DATA_DIR, 'intersection-risk.json')
  fs.writeFileSync(outPath, JSON.stringify(fc))
  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(0)

  // Sanity report
  const withCrashes = out.filter(f => f.properties.total_crashes > 0).length
  console.log(`  ${withCrashes}/${out.length} intersections have ≥1 recorded crash`)
  console.log(`  ${highRisk} intersections score > 0.6 (high risk)`)
  console.log(`  ${pedSignals} pedestrian-actuated signals`)
  console.log(`\nTop 10 highest-risk signalized intersections (2016–2020):`)
  out
    .filter(f => f.properties.total_crashes > 0)
    .sort((a, b) => b.properties.risk_score - a.properties.risk_score || b.properties.total_crashes - a.properties.total_crashes)
    .slice(0, 10)
    .forEach(f => {
      const p = f.properties
      console.log(`  ${p.neighbourhood || '—'}: risk=${p.risk_score} crashes=${p.total_crashes} (casualty=${p.casualty_crashes})`)
    })
  console.log(`\nWrote intersection-risk.json (${sizeKB} KB)`)
}

main()
