import { lazy, Suspense } from 'react'
import Header from './components/Layout/Header'
import HeroSections from './components/Hero/HeroSections'
import Section from './components/Hero/Section'
import { aboutSection } from './components/Hero/sections'
import FAQ from './components/Hero/FAQ'
import Footer from './components/Layout/Footer'
import useInView from './hooks/useInView'

// The map (Leaflet + a 350 KB data fetch) mounts only once the section nears
// the viewport, keeping it all off the initial load.
const MapSection = lazy(() => import('./components/Map/MapSection'))

function MapPlaceholder() {
  return <div className="h-[500px] sm:h-[600px] lg:h-[700px] cs-hatch" aria-hidden="true" />
}

const heroStats = [
  { value: '3,590', label: 'areas analyzed', dot: 'bg-ink', valueColor: 'text-ink' },
  { value: '67K', label: 'underserved', dot: 'bg-transit', valueColor: 'text-transit' },
  { value: '72', label: 'critical gaps', dot: 'bg-signal', valueColor: 'text-ink' },
]

function App() {
  const [mapRef, mapVisible] = useInView(0, '0px 0px 600px 0px')

  return (
    <div className="min-h-screen bg-white text-ink font-sans">
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />

      <main id="main">
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-24 sm:pt-28">
        <div className="grid lg:grid-cols-[1fr_300px] border-b border-rule">
          {/* Message */}
          <div className="py-12 sm:py-16 lg:pr-12 lg:border-r border-rule">
            {/* Directional strip */}
            <div className="inline-flex items-stretch border-[1.5px] border-ink rounded-[3px] overflow-hidden mb-8">
              <span className="flex items-center bg-ink text-white px-3 text-sm" aria-hidden="true">&#9654;</span>
              <span className="flex items-center px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-[0.14em]">
                METRO VANCOUVER&nbsp;&nbsp;·&nbsp;&nbsp;GEOSPATIAL COVERAGE GAPS
              </span>
            </div>

            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.6rem] font-bold tracking-tight leading-[1.04] mb-6 font-heading">
              <span className="text-transit">67,000</span> residents live in Metro Vancouver's transit blind spots
            </h1>
            <p className="text-lg sm:text-xl text-graphite leading-relaxed max-w-xl">
              MindTheGap finds coverage gaps — areas where people live but buses and trains don't reach.
            </p>
          </div>

          {/* Coordinate / method rail */}
          <div className="cs-mono py-8 sm:py-10 lg:py-16 lg:pl-9 border-t border-rule lg:border-t-0">
            <div className="text-[11px] tracking-[0.1em] text-faint mb-1.5">STATION</div>
            <div className="text-sm font-medium text-ink mb-6">49.2827&deg; N, 123.1207&deg; W</div>
            <div className="text-[11px] tracking-[0.1em] text-faint mb-1.5">METHOD</div>
            <div className="text-[13px] leading-relaxed text-graphite">
              600&thinsp;m walking radius<br />
              3,590 dissemination areas<br />
              2021 census + GTFS
            </div>
          </div>
        </div>

        {/* Stat signage strip */}
        <div className="grid grid-cols-3 border-b border-rule">
          {heroStats.map((s, i) => (
            <div
              key={s.label}
              className={`py-6 sm:py-7 flex items-baseline gap-3 sm:gap-4 ${i > 0 ? 'pl-4 sm:pl-7' : ''} ${i < heroStats.length - 1 ? 'border-r border-rule' : ''}`}
            >
              <span className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full shrink-0 -translate-y-0.5 ${s.dot}`} />
              <div>
                <div className={`text-2xl sm:text-[2.4rem] font-bold tracking-tight leading-none font-heading ${s.valueColor}`}>
                  {s.value}
                </div>
                <div className="text-[10px] sm:text-xs tracking-[0.12em] uppercase text-faint mt-1.5 sm:mt-2">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Map ── */}
      <section id="map" ref={mapRef} className="max-w-6xl mx-auto px-6 sm:px-8 pt-14 sm:pt-16 pb-16 sm:pb-24">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <span className="bg-ink text-white text-[11px] font-bold tracking-[0.12em] px-3 py-1.5 rounded-[3px]">THE MAP</span>
          <span className="text-sm text-graphite">Every zone scored by how underserved it is. Redder = worse.</span>
        </div>
        <div className="border-2 border-ink rounded-[4px] overflow-hidden">
          {mapVisible ? (
            <Suspense fallback={<MapPlaceholder />}>
              <MapSection />
            </Suspense>
          ) : (
            <MapPlaceholder />
          )}
        </div>
      </section>

      <HeroSections />
      <FAQ />
      <Section section={aboutSection} />
      </main>
      <Footer />
    </div>
  )
}

export default App
