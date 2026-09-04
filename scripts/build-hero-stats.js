/**
 * Derive the headline numbers from the scored data, so the hero can never
 * drift from what the map actually shows.
 *
 * Source: public/data/vancouver-transit-gaps.geojson
 * Output: src/data/heroStats.json
 *
 * "Critical" is defined once, in src/utils/gapStats.js (CRITICAL_THRESHOLD),
 * and used by the hero, the explorer and the legend alike.
 *
 * Run: node scripts/build-hero-stats.js
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { CRITICAL_THRESHOLD, isCritical } from '../src/utils/gapStats.js'

const IN = 'public/data/vancouver-transit-gaps.geojson'
const OUT = 'src/data/heroStats.json'

const { features } = JSON.parse(readFileSync(IN, 'utf8'))

const graded = features.filter(f => !f.properties.low_density)
const critical = graded.filter(f => isCritical(f.properties))
const pop = list => list.reduce((sum, f) => sum + (f.properties.population || 0), 0)

const stats = {
  areasTotal: features.length,
  areasGraded: graded.length,
  gradedResidents: pop(graded),
  criticalThreshold: CRITICAL_THRESHOLD,
  criticalAreas: critical.length,
  criticalResidents: pop(critical),
  generatedAt: new Date().toISOString().slice(0, 10),
}

mkdirSync('src/data', { recursive: true })
writeFileSync(OUT, JSON.stringify(stats, null, 2) + '\n')
console.log(`Wrote ${OUT}:`, stats)
