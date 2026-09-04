import { getGapColor } from './colors.js'

// One definition of "critical", shared by the hero stats build script, the
// explorer and the legend. Areas at or above this gap score are the ones the
// headline counts.
export const CRITICAL_THRESHOLD = 0.9

export function isCritical(props) {
  return !props.low_density && (props.gap_score || 0) >= CRITICAL_THRESHOLD
}

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

// A high gap percentile is bad. Say so, rather than "Top 2%", which reads as praise.
export function gapPercentileLabel(percentile) {
  if (percentile >= 99) return 'Among the worst in Metro Vancouver'
  if (percentile >= 50) return `Worse than ${percentile}% of areas`
  return `Better than ${100 - percentile}% of areas`
}

// A high service percentile is good.
export function servicePercentileLabel(percentile) {
  if (percentile <= 0) return 'Lowest in Metro Vancouver'
  if (percentile >= 50) return `More than ${percentile}% of areas`
  return `Less than ${100 - percentile}% of areas`
}

export const GRADES = [
  { max: 0.2, letter: 'A', label: 'Well covered', textColor: '#15803d' },
  { max: 0.4, letter: 'B', label: 'Adequate coverage', textColor: '#a16207' },
  { max: 0.6, letter: 'C', label: 'Below average', textColor: '#c2410c' },
  { max: 0.8, letter: 'D', label: 'Poorly covered', textColor: '#dc2626' },
  { max: 1.0, letter: 'F', label: 'Severely underserved', textColor: '#991b1b' },
]

export const LOW_DENSITY_GRADE = {
  letter: '–',
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
