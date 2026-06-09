import { useState } from 'react'
import { IconMapFillDuo18 as Map } from 'nucleo-ui-fill-duo-18'
import { IconCursorRippleFillDuo18 as MousePointerClick } from 'nucleo-ui-fill-duo-18'
import { IconLayersFillDuo18 as Layers } from 'nucleo-ui-fill-duo-18'
// Screenshots live in /public/screenshots and are referenced by URL so a
// missing capture degrades to the ScreenshotFrame placeholder instead of
// breaking the build.
const rankedOverviewImg = '/screenshots/risk-scored.png'
const reportCardImg = '/screenshots/report-card.png'
const injuryFilterImg = '/screenshots/highlight-injury.png'

const features = [
  {
    icon: Map,
    tag: 'Ranked overview',
    headline: 'The whole city, triaged worst-first',
    body: "Vancouver's signals arrive pre-ranked. Numbered badges flag the top 25 hotspots — 1 is the city's worst — turning 966 intersections into an ordered, defensible list of where to start.",
    screenshot: rankedOverviewImg,
    alt: 'Vancouver map with the 25 highest-risk intersections marked by numbered badges',
  },
  {
    icon: MousePointerClick,
    tag: 'Evidence card',
    headline: 'The crash record behind one signal',
    body: 'Click any intersection for its dossier: letter grade, percentile, total crashes, injury versus property-only counts, injury rate, a five-year trend, and how it ranks against the city average.',
    screenshot: reportCardImg,
    alt: 'Report card showing a risk grade, crash counts, injury rate, and a crashes-by-year chart',
  },
  {
    icon: Layers,
    tag: 'Targeted filters',
    headline: "Narrow to the risk you're funding",
    body: 'Check High injury rate (≥33%) and the map rings every qualifying signal while the rest fade back. Or isolate pedestrian-actuated signals to focus on vulnerable-road-user exposure.',
    screenshot: injuryFilterImg,
    alt: 'Map filtered to intersections with a high injury rate, each ringed with a highlight',
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
          <p className="text-xs font-medium tracking-wide text-text-muted mb-3">From data to decision</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary font-heading">
            Defend every fix-this-first call with evidence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
            Triage all 966 of Vancouver's signalized intersections, open the crash record behind any one of them, then narrow to the risk profile your program is funded to address.
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
