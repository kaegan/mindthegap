import { getGapColor } from './colors'

export function computeMetroStats(gapGeoJSON) {
  const features = gapGeoJSON.features
  const gapScores = []
  const transitScores = []
  const popDensities = []
  let totalPopulation = 0

  for (const f of features) {
    const p = f.properties
    gapScores.push(p.gap_score || 0)
    transitScores.push(p.transit_score || 0)
    popDensities.push(p.pop_density || 0)
    totalPopulation += p.population || 0
  }

  gapScores.sort((a, b) => a - b)
  transitScores.sort((a, b) => a - b)
  popDensities.sort((a, b) => a - b)

  const avg = arr => arr.reduce((s, v) => s + v, 0) / arr.length

  return {
    avgGapScore: avg(gapScores),
    avgTransitScore: avg(transitScores),
    avgPopDensity: avg(popDensities),
    totalPopulation,
    gapScores,
    transitScores,
    popDensities,
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
  if (percentile <= 20) return `Bottom ${percentile}%`
  if (percentile >= 80) return `Top ${100 - percentile}%`
  return `${percentile}th percentile`
}

const GRADES = [
  { max: 0.2, letter: 'A', label: 'Well covered', textColor: '#15803d' },
  { max: 0.4, letter: 'B', label: 'Adequate coverage', textColor: '#a16207' },
  { max: 0.6, letter: 'C', label: 'Below average', textColor: '#c2410c' },
  { max: 0.8, letter: 'D', label: 'Poorly covered', textColor: '#dc2626' },
  { max: 1.0, letter: 'F', label: 'Severely underserved', textColor: '#991b1b' },
]

export const LOW_DENSITY_GRADE = {
  letter: '\u2013',
  label: 'Low density',
  color: '#9ca3af',
}

export function getGrade(gapScore, lowDensity) {
  if (lowDensity) return LOW_DENSITY_GRADE
  for (const g of GRADES) {
    if (gapScore <= g.max) {
      return { letter: g.letter, label: g.label, color: getGapColor(gapScore), textColor: g.textColor }
    }
  }
  return { letter: 'F', label: 'Severely underserved', color: getGapColor(1), textColor: '#991b1b' }
}
