import { createLayerComponent } from '@react-leaflet/core'
import L from 'leaflet'
import 'leaflet.heat'
import centroid from '@turf/centroid'

function geojsonToHeatPoints(geojson) {
  const densities = geojson.features
    .filter(f => !f.properties.low_density && f.properties.pop_density > 0)
    .map(f => f.properties.pop_density)
    .sort((a, b) => a - b)

  // Use 90th percentile as ceiling so the top decile saturates and
  // lower-density areas fade out instead of forming a uniform blob
  const p90 = densities[Math.floor(densities.length * 0.9)]

  return geojson.features
    .filter(f => !f.properties.low_density && f.properties.pop_density > 0)
    .map(f => {
      const c = centroid(f)
      const [lng, lat] = c.geometry.coordinates
      // Clamp to p90, then apply a power curve to push low values toward zero
      const normalized = Math.min(f.properties.pop_density / p90, 1)
      const intensity = Math.pow(normalized, 3)
      return [lat, lng, intensity]
    })
}

function createHeatLayer(props, context) {
  const points = geojsonToHeatPoints(props.data)
  const instance = L.heatLayer(points, {
    radius: 18,
    blur: 15,
    maxZoom: 14,
    max: 0.6,
    minOpacity: 0.15,
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
