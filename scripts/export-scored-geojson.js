/**
 * Export the scored dissemination areas as a plain GeoJSON download, so anyone
 * can inspect or reuse the underlying data ("here is my data, check my work").
 *
 * Source: public/data/gap-analysis.topojson
 * Output: public/data/vancouver-transit-gaps.geojson
 *
 * Run: node scripts/export-scored-geojson.js
 */
import { readFileSync, writeFileSync, statSync } from 'fs'
import { feature } from 'topojson-client'

const IN = 'public/data/gap-analysis.topojson'
const OUT = 'public/data/vancouver-transit-gaps.geojson'

const topo = JSON.parse(readFileSync(IN, 'utf8'))
const key = Object.keys(topo.objects)[0]
const fc = feature(topo, topo.objects[key])

// Round coordinates to ~0.1 m to trim file size without visible loss.
const round = (n) => Math.round(n * 1e6) / 1e6
const roundCoords = (c) =>
  typeof c[0] === 'number' ? [round(c[0]), round(c[1])] : c.map(roundCoords)

for (const f of fc.features) {
  if (f.geometry) f.geometry.coordinates = roundCoords(f.geometry.coordinates)
}

// A little self-documentation for anyone who opens the raw file.
const out = {
  type: 'FeatureCollection',
  name: 'Metro Vancouver transit coverage gaps — scored dissemination areas',
  license: 'CC BY 4.0',
  sources: ['TransLink GTFS', 'Statistics Canada 2021 Census'],
  features: fc.features,
}

writeFileSync(OUT, JSON.stringify(out))
console.log(
  `wrote ${OUT}: ${fc.features.length} features, ${(statSync(OUT).size / 1e6).toFixed(2)} MB`
)
