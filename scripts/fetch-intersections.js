/**
 * fetch-intersections.js
 *
 * Downloads every signalized intersection in the City of Vancouver from the
 * City's Open Data portal (the `traffic-signals` dataset) and writes them out
 * as a GeoJSON FeatureCollection of points.
 *
 * Source: https://opendata.vancouver.ca/explore/dataset/traffic-signals/
 *   966 records. Fields: type (signal type), geo_local_area (neighbourhood),
 *   geo_point_2d { lon, lat }.
 *
 * Output:
 *   public/data/raw/intersections.geojson
 */

import fs from 'fs'
import path from 'path'

const EXPORT_URL =
  'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/traffic-signals/exports/geojson'
const OUT = path.join(process.cwd(), 'public', 'data', 'raw', 'intersections.geojson')

async function main() {
  console.log('Fetching Vancouver traffic signals from Open Data portal...')
  const res = await fetch(EXPORT_URL, { headers: { 'User-Agent': 'mindthegap/1.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching traffic-signals`)
  const geojson = await res.json()

  // Normalize: ensure each feature has a stable `signal_type` and `neighbourhood`
  // property. The portal nests these under feature.properties already.
  let kept = 0
  const features = geojson.features.filter(f => {
    const c = f.geometry?.coordinates
    return Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1])
  }).map(f => {
    kept++
    return {
      type: 'Feature',
      geometry: f.geometry,
      properties: {
        signal_type: f.properties.type || 'Signal',
        neighbourhood: f.properties.geo_local_area || null,
      },
    }
  })

  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify({ type: 'FeatureCollection', features }))
  console.log(`Wrote ${kept} signalized intersections → ${path.relative(process.cwd(), OUT)}`)
}

main().catch(err => {
  console.error('Failed:', err.message)
  process.exit(1)
})
