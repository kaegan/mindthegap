import centroid from '@turf/centroid'

// Extract a clean road name from a transit stop name
// e.g. "Eastbound Westminster Hwy @ No. 4 Rd" → "Westminster Hwy & No. 4 Rd"
function roadFromStop(stopName) {
  if (!stopName) return null
  const match = stopName.match(
    /^(?:Northbound|Southbound|Eastbound|Westbound|NB|SB|EB|WB)\s+(.+?)\s+@\s+(.+)$/i
  )
  if (match) return `${match[1]} & ${match[2]}`
  const atSplit = stopName.split(' @ ')
  if (atSplit.length === 2) return `${atSplit[0]} & ${atSplit[1]}`
  return stopName
}

// Approximate Metro Vancouver municipalities from centroid coordinates
const MUNICIPALITIES = [
  ['White Rock',      49.005, 49.035, -122.830, -122.770],
  ['Port Moody',      49.270, 49.310, -122.880, -122.820],
  ['New Westminster', 49.185, 49.230, -122.940, -122.880],
  ['Port Coquitlam',  49.240, 49.280, -122.790, -122.720],
  ['Pitt Meadows',    49.200, 49.260, -122.720, -122.650],
  ['West Vancouver',  49.320, 49.400, -123.280, -123.120],
  ['North Vancouver', 49.290, 49.370, -123.120, -122.890],
  ['Richmond',        49.100, 49.200, -123.270, -123.060],
  ['Vancouver',       49.200, 49.310, -123.230, -123.020],
  ['Burnaby',         49.200, 49.290, -123.020, -122.890],
  ['Coquitlam',       49.230, 49.360, -122.890, -122.720],
  ['Delta',           49.000, 49.160, -123.100, -122.890],
  ['Surrey',          49.000, 49.220, -122.890, -122.680],
  ['Maple Ridge',     49.180, 49.350, -122.680, -122.450],
  ['Langley',         49.000, 49.180, -122.680, -122.440],
]

function getMunicipality(lat, lng) {
  for (const [name, minLat, maxLat, minLng, maxLng] of MUNICIPALITIES) {
    if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) return name
  }
  return 'Metro Vancouver'
}

/**
 * For each critical gap feature, compute a display name from the nearest stop
 * and a city from approximate bounding boxes. Returns { [dauid]: { name, city } }
 */
export function computeAreaNames(features, stopsData) {
  if (!features || !stopsData) return {}

  const stopFeatures = stopsData.features
  const result = {}

  for (const f of features) {
    const c = centroid(f)
    const [lng, lat] = c.geometry.coordinates

    // Find nearest stop
    let closest = null
    let minDist = Infinity
    for (const s of stopFeatures) {
      const [sLng, sLat] = s.geometry.coordinates
      const d = (lat - sLat) ** 2 + (lng - sLng) ** 2
      if (d < minDist) { minDist = d; closest = s }
    }

    const road = closest ? roadFromStop(closest.properties.name) : null
    const city = getMunicipality(lat, lng)

    result[f.properties.dauid] = { name: road || city, city }
  }

  return result
}
