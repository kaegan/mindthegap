import { useState } from 'react'
import { IconMapOutlineDuo18 as Map } from 'nucleo-ui-outline-duo-18'
import { IconCursorRippleOutlineDuo18 as MousePointerClick } from 'nucleo-ui-outline-duo-18'
import { IconLayersOutlineDuo18 as Layers } from 'nucleo-ui-outline-duo-18'
import { IconChartColumnOutlineDuo18 as BarChart3 } from 'nucleo-ui-outline-duo-18'
import neighborhoodScoredImg from '../../assets/neighborhood-scored.png'
import fullPictureImg from '../../assets/full-picture.png'
import multimodalLayerImg from '../../assets/multimodal-layer.png'
import hotspotImg from '../../assets/hotspot.png'

const features = [
  {
    icon: Map,
    tag: 'Coverage Analysis',
    headline: 'Every neighborhood, scored',
    body: 'MindTheGap analyzes 3,590 dissemination areas across Metro Vancouver, combining population density with transit accessibility to produce a single gap score for each zone.',
    screenshot: neighborhoodScoredImg,
    alt: 'Heatmap showing transit coverage gaps across Metro Vancouver',
  },
  {
    icon: MousePointerClick,
    tag: 'Interactive Reports',
    headline: 'Click any zone. Get the full picture.',
    body: 'Select a neighborhood to open a detailed report card — gap score grade, population stats, nearest transit stops, and how the area compares to the metro average.',
    screenshot: fullPictureImg,
    alt: 'Report card showing gap score, population, and nearby transit stops',
  },
  {
    icon: Layers,
    tag: 'Multi-Modal Layers',
    headline: 'SkyTrain, bus, SeaBus — all on one map',
    body: "Toggle transit layers on and off to see how different modes overlap. Quickly spot where rail coverage ends and bus routes don't pick up the slack.",
    screenshot: multimodalLayerImg,
    alt: 'Map with SkyTrain, bus, and SeaBus transit layers toggled on',
  },
  {
    icon: BarChart3,
    tag: 'Hotspot Detection',
    headline: 'Find the clusters that matter most',
    body: 'The hotspot layer surfaces areas where multiple coverage gaps converge — helping planners prioritize the neighborhoods where new service would have the greatest impact.',
    screenshot: hotspotImg,
    alt: 'Hotspot heatmap highlighting clusters of transit coverage gaps',
  },
]

function ScreenshotFrame({ feature }) {
  const [imgError, setImgError] = useState(false)
  const Icon = feature.icon

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      {!imgError ? (
        <img
          src={feature.screenshot}
          alt={feature.alt}
          className="w-full h-auto block"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="aspect-video flex items-center justify-center bg-gray-50 text-gray-400">
          <div className="text-center">
            <Icon className="w-10 h-10 mx-auto mb-2" />
            <span className="text-sm">Screenshot — {feature.tag}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureBlock({ feature, index }) {
  const isReversed = index % 2 !== 0
  const Icon = feature.icon

  return (
    <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}>
      {/* Text side */}
      <div className="flex-1 min-w-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 mb-4">
          <Icon className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-medium text-violet-600 uppercase tracking-wider">{feature.tag}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3 font-heading">
          {feature.headline}
        </h3>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
          {feature.body}
        </p>
      </div>

      {/* Screenshot side */}
      <div className="flex-1 min-w-0 w-full">
        <ScreenshotFrame feature={feature} />
      </div>
    </div>
  )
}

export default function ProductFeatures() {
  return (
    <section className="relative bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tighter font-heading">
            Built to surface what's <span className="text-violet-600">hidden in plain sight</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Transit maps show where service exists. MindTheGap shows where it doesn't — and who's affected.
          </p>
        </div>

        {/* Feature blocks */}
        <div className="space-y-20 sm:space-y-28">
          {features.map((feature, i) => (
            <FeatureBlock key={feature.tag} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
