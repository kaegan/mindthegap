/**
 * Convert GeoJSON data files to TopoJSON for smaller payloads.
 * TopoJSON shares arcs between adjacent polygons, dramatically reducing
 * file size for census boundary data.
 *
 * Run: node scripts/build-topojson.js
 */
import { readFileSync, writeFileSync } from 'fs'
import { topology } from 'topojson-server'
import { presimplify, simplify, quantile } from 'topojson-simplify'

const DATA_DIR = 'public/data'

function convert(inputFile, layerName, { simplifyQuantile, quantization } = {}) {
  const geojson = JSON.parse(readFileSync(`${DATA_DIR}/${inputFile}`, 'utf-8'))
  let topo = topology({ [layerName]: geojson }, quantization)

  if (simplifyQuantile) {
    topo = presimplify(topo)
    topo = simplify(topo, quantile(topo, simplifyQuantile))
  }

  const outFile = inputFile.replace('.geojson', '.topojson')
  writeFileSync(`${DATA_DIR}/${outFile}`, JSON.stringify(topo))

  const inSize = readFileSync(`${DATA_DIR}/${inputFile}`).length
  const outSize = readFileSync(`${DATA_DIR}/${outFile}`).length
  const pct = ((1 - outSize / inSize) * 100).toFixed(0)
  console.log(`${inputFile} → ${outFile}: ${(inSize/1024).toFixed(0)} KB → ${(outSize/1024).toFixed(0)} KB (${pct}% smaller)`)
}

convert('gap-analysis.geojson', 'gaps', { quantization: 1e5 })
convert('routes.geojson', 'routes', { simplifyQuantile: 0.05, quantization: 1e5 })
convert('stops.geojson', 'stops', { quantization: 1e5 })
