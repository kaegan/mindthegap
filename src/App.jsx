import { lazy, Suspense } from 'react'
import Header from './components/Layout/Header'
import Section from './components/Hero/Section'
import StationTag from './components/Hero/StationTag'
import AnimatedNumber from './components/Hero/AnimatedNumber'
import { aboutSection } from './components/Hero/sections'
import FAQ from './components/Hero/FAQ'
import Footer from './components/Layout/Footer'
import useInView from './hooks/useInView'
import heroStats from './data/heroStats.json'

// The map (Leaflet + a 350 KB data fetch) mounts only once the section nears
// the viewport, keeping it all off the initial load.
const MapSection = lazy(() => import('./components/Map/MapSection'))

function MapPlaceholder() {
  return <div className="h-[500px] sm:h-[600px] lg:h-[700px] cs-hatch" aria-hidden="true" />
}

// Every figure here is generated from the scored data by scripts/build-hero-stats.js.
const shareOfResidents = Math.round((heroStats.criticalResidents / heroStats.gradedResidents) * 100)

const strip = [
  { value: heroStats.criticalAreas, label: 'critical areas', dot: 'bg-gap-high', accent: true },
  { value: shareOfResidents, label: 'of residents in graded areas', dot: 'bg-ink', format: (n) => `${n}%` },
  { value: heroStats.areasGraded, label: 'areas graded', dot: 'bg-ink' },
]

function App() {
  const [heroRef, heroVisible] = useInView(0.2)
  const [mapRef, mapVisible] = useInView(0, '0px 0px 600px 0px')

  return (
    <div className="min-h-screen bg-white text-ink font-sans">
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />

      <main id="main">
      {/* ── Hero ── */}
      <section ref={heroRef} className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 sm:pt-28">
        <div className="py-12 sm:py-16 border-b border-rule">
          <StationTag label="Metro Vancouver" className="mb-8" />

          <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.6rem] font-bold tracking-tight leading-[1.04] mb-6 font-heading max-w-4xl">
            <span className="text-transit">
              <AnimatedNumber value={heroStats.criticalResidents} start={heroVisible} />
            </span>{' '}
            residents live in Metro Vancouver's worst transit gaps
          </h1>
          <p className="text-lg sm:text-xl text-graphite leading-relaxed max-w-xl">
            Where people live, but transit doesn't go.
          </p>
          <p className="mt-3 text-base text-graphite max-w-xl">
            A solo data product by{' '}
            <a href="#about" className="text-ink font-medium underline decoration-rule underline-offset-4 hover:decoration-transit transition-colors">
              Kaegan Donnelly
            </a>
            , a product manager in Vancouver.
          </p>
        </div>

        {/* Findings strip */}
        <div className="grid grid-cols-3 border-b border-rule">
          {strip.map((s, i) => (
            <div
              key={s.label}
              className={`py-6 sm:py-7 flex items-baseline gap-3 sm:gap-4 ${i > 0 ? 'pl-4 sm:pl-7' : ''} ${i < strip.length - 1 ? 'border-r border-rule' : ''}`}
            >
              <span className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full shrink-0 -translate-y-0.5 ${s.dot}`} />
              <div>
                <div className={`text-2xl sm:text-[2.4rem] font-bold tracking-tight leading-none font-heading ${s.accent ? 'text-transit' : 'text-ink'}`}>
                  <AnimatedNumber value={s.value} start={heroVisible} delay={80 * (i + 1)} format={s.format} />
                </div>
                <div className="text-[10px] sm:text-xs tracking-[0.12em] uppercase text-faint mt-1.5 sm:mt-2 leading-snug">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Method, once */}
        <p className="cs-mono text-[12px] sm:text-[13px] text-faint py-4 border-b border-rule">
          Gap score ≥ {heroStats.criticalThreshold} · 600 m walk to a stop · {heroStats.areasTotal.toLocaleString()} dissemination areas · 2021 Census + TransLink GTFS
        </p>
      </section>

      {/* ── Map ── */}
      <section id="map" ref={mapRef} className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 pb-16 sm:pb-20">
        <div className="flex items-baseline gap-4 flex-wrap mb-4">
          <StationTag label="The map" />
          <span className="text-sm text-graphite">Each area scored by transit trips per resident. Red is worst.</span>
        </div>
        <div className="border-2 border-ink rounded-[3px] overflow-hidden">
          {mapVisible ? (
            <Suspense fallback={<MapPlaceholder />}>
              <MapSection />
            </Suspense>
          ) : (
            <MapPlaceholder />
          )}
        </div>
      </section>

      <FAQ />
      <Section section={aboutSection} />
      </main>
      <Footer />
    </div>
  )
}

export default App
