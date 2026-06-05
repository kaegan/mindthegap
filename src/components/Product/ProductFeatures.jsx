import { useState } from 'react'
import { IconMapFillDuo18 as Map } from 'nucleo-ui-fill-duo-18'
import { IconCursorRippleFillDuo18 as MousePointerClick } from 'nucleo-ui-fill-duo-18'
import { IconLayersFillDuo18 as Layers } from 'nucleo-ui-fill-duo-18'
import { IconHotspotFillDuo18 as BarChart3 } from 'nucleo-ui-fill-duo-18'
// Screenshots live in /public/screenshots and are referenced by URL so a
// missing capture degrades to the ScreenshotFrame placeholder instead of
// breaking the build.
const neighborhoodScoredImg = '/screenshots/risk-scored.png'
const fullPictureImg = '/screenshots/report-card.png'
const multimodalLayerImg = '/screenshots/highlight-injury.png'
const hotspotImg = '/screenshots/hotspots.png'

const features = [
  {
    icon: Map,
    tag: 'Risk Analysis',
    headline: 'Every intersection, scored',
    body: 'MindTheGap joins five years of ICBC crash records to all 966 signalized intersections in Vancouver, then weights injury crashes more heavily to produce a single 0-1 risk score.',
    screenshot: neighborhoodScoredImg,
    alt: 'Map of Vancouver intersections colored by crash risk',
  },
  {
    icon: MousePointerClick,
    tag: 'Interactive Reports',
    headline: 'Click any intersection. Get the full crash profile.',
    body: 'Select a signal to open a detailed report card: risk grade, total crashes, injury crashes, injury rate, a crashes-by-year trend, and how it compares to the city average.',
    screenshot: fullPictureImg,
    alt: 'Report card showing crash counts, injury rate, and yearly trend',
  },
  {
    icon: Layers,
    tag: 'Targeted Highlights',
    headline: 'Filter to what matters',
    body: "Highlight intersections with the highest injury rates, or isolate pedestrian-actuated signals, to compare vulnerable-road-user exposure against overall crash volume.",
    screenshot: multimodalLayerImg,
    alt: 'Map filtered to high-injury-rate intersections',
  },
  {
    icon: BarChart3,
    tag: 'Hotspot Detection',
    headline: 'Find the risk corridors that matter most',
    body: 'The hotspot layer surfaces stretches where multiple high-risk intersections cluster, helping prioritize the corridors where a signal-timing or detection upgrade would prevent the most harm.',
    screenshot: hotspotImg,
    alt: 'Heatmap highlighting clusters of high-risk intersections',
  },
]

function ScreenshotFrame({ feature }) {
  const [imgError, setImgError] = useState(false)
  const Icon = feature.icon

  return (
    <div className="relative rounded-lg overflow-hidden border border-border shadow-panel">
      {!imgError ? (
        <img
          src={feature.screenshot}
          alt={feature.alt}
          className="w-full h-auto block"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="aspect-video flex items-center justify-center bg-surface-warm text-text-muted">
          <div className="text-center">
            <Icon className="w-10 h-10 mx-auto mb-2" />
            <span className="text-sm">Screenshot: {feature.tag}</span>
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
        <div className="inline-flex items-center gap-2 mb-4">
          <Icon className="w-3.5 h-3.5 text-brand" />
          <span className="text-xs font-semibold text-brand tracking-wide">{feature.tag}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 font-heading">
          {feature.headline}
        </h3>
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-lg">
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
    <section className="relative bg-surface py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs font-medium tracking-wide text-text-muted mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary font-heading">
            Built to rank intersection risk, not just plot crashes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
            The workflow connects crash history, injury severity, signal locations, and corridor clustering so the highest-priority locations are easier to defend.
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
