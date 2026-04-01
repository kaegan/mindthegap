import centroid from '@turf/centroid'
import distance from '@turf/distance'
import { point } from '@turf/helpers'

export function findNearestStops(daFeature, stopsGeoJSON, count = 5) {
  const center = centroid(daFeature)
  const centerCoords = center.geometry.coordinates

  const withDistance = stopsGeoJSON.features.map(stop => {
    const d = distance(
      point(centerCoords),
      point(stop.geometry.coordinates),
      { units: 'meters' }
    )
    return {
      name: stop.properties.name,
      stop_id: stop.properties.stop_id,
      trips_per_day: stop.properties.trips_per_day,
      distance_m: Math.round(d),
      lat: stop.geometry.coordinates[1],
      lng: stop.geometry.coordinates[0],
    }
  })

  withDistance.sort((a, b) => a.distance_m - b.distance_m)
  return withDistance.slice(0, count)
}
