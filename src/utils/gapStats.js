import { getRiskColor } from './colors'

/**
 * Aggregate stats across every signalized intersection, used to position a
 * single intersection against the city (percentiles, averages, totals).
 */
export function computeCityStats(geojson) {
  const features = geojson.features
  const riskScores = []
  let totalCrashes = 0
  let totalCasualty = 0
  let highRiskCount = 0

  for (const f of features) {
    const p = f.properties
    riskScores.push(p.risk_score || 0)
    totalCrashes += p.total_crashes || 0
    totalCasualty += p.casualty_crashes || 0
    if ((p.risk_score || 0) > 0.6) highRiskCount++
  }

  riskScores.sort((a, b) => a - b)
  const avg = arr => arr.reduce((s, v) => s + v, 0) / arr.length

  return {
    avgRiskScore: avg(riskScores),
    riskScores,
    totalCrashes,
    totalCasualty,
    highRiskCount,
    intersectionCount: features.length,
  }
}

export function getPercentile(value, sortedArray) {
  let count = 0
  for (const v of sortedArray) {
    if (v < value) count++
    else break
  }
  return Math.round((count / sortedArray.length) * 100)
}

export function getPercentileLabel(percentile) {
  if (percentile <= 20) return `Safer than ${Math.max(1, 100 - percentile)}%`
  if (percentile >= 80) return `Top ${Math.max(1, 100 - percentile)}% riskiest`
  return `${percentile}th percentile`
}

const GRADES = [
  { max: 0.2, letter: 'A', label: 'Very safe' },
  { max: 0.4, letter: 'B', label: 'Low risk' },
  { max: 0.6, letter: 'C', label: 'Moderate risk' },
  { max: 0.8, letter: 'D', label: 'High risk' },
  { max: 1.01, letter: 'F', label: 'Critical risk' },
]

export function getGrade(riskScore) {
  for (const g of GRADES) {
    if (riskScore <= g.max) {
      return { letter: g.letter, label: g.label, color: getRiskColor(riskScore) }
    }
  }
  return { letter: 'F', label: 'Critical risk', color: getRiskColor(1) }
}
