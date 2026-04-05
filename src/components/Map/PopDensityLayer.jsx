import { createLayerComponent } from '@react-leaflet/core'
import L from 'leaflet'
import 'leaflet.heat'
import centroid from '@turf/centroid'

function geojsonToHeatPoints(geojson) {
  // Find max density to normalize intensities
  const densities = geojson.features
    .filter(f => !f.properties.low_density && f.properties.pop_density > 0)
    .map(f => f.properties.pop_density)
  const maxDensity = Math.max(...densities)

  return geojson.features
    .filter(f => !f.properties.low_density && f.properties.pop_density > 0)
    .map(f => {
      const c = centroid(f)
      const [lng, lat] = c.geometry.coordinates
      const intensity = f.properties.pop_density / maxDensity
      return [lat, lng, intensity]
    })
}

function createHeatLayer(props, context) {
  const points = geojsonToHeatPoints(props.data)
  const instance = L.heatLayer(points, {
    radius: 25,
    blur: 20,
    maxZoom: 14,
    max: 0.85,
    minOpacity: 0.25,
    gradient: {
      0.0: '#eff6ff',
      0.2: '#93c5fd',
      0.4: '#3b82f6',
      0.6: '#1d4ed8',
      0.8: '#1e3a8a',
      1.0: '#312e81',
    },
  })
  return { instance, context }
}

function updateHeatLayer(instance, props, prevProps) {
  if (props.data !== prevProps.data) {
    instance.setLatLngs(geojsonToHeatPoints(props.data))
  }
}

const PopDensityLayer = createLayerComponent(createHeatLayer, updateHeatLayer)
export default PopDensityLayer
