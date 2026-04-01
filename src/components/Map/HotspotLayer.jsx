import { createLayerComponent } from '@react-leaflet/core'
import L from 'leaflet'
import 'leaflet.heat'
import { centroid } from '@turf/turf'

function geojsonToHeatPoints(geojson) {
  return geojson.features
    .filter(f => f.properties.gap_score > 0.45)
    .map(f => {
      const c = centroid(f)
      const [lng, lat] = c.geometry.coordinates
      return [lat, lng, f.properties.gap_score]
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
      0.0: '#1e1b4b',
      0.2: '#7c3aed',
      0.4: '#f59e0b',
      0.6: '#f97316',
      0.8: '#ef4444',
      1.0: '#fef08a',
    },
  })
  return { instance, context }
}

function updateHeatLayer(instance, props, prevProps) {
  if (props.data !== prevProps.data) {
    instance.setLatLngs(geojsonToHeatPoints(props.data))
  }
}

const HotspotLayer = createLayerComponent(createHeatLayer, updateHeatLayer)
export default HotspotLayer
