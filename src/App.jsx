import { IconMapPinFillDuo18 as MapPin } from 'nucleo-ui-fill-duo-18'
import { IconUsersFillDuo18 as Users } from 'nucleo-ui-fill-duo-18'
import { IconSirenFillDuo18 as AlertTriangle } from 'nucleo-ui-fill-duo-18'
import Header from './components/Layout/Header'
import MapSection from './components/Map/MapSection'
import ProductFeatures from './components/Product/ProductFeatures'
import HeroSections from './components/Hero/HeroSections'
import Footer from './components/Layout/Footer'

function App() {
  return (
    <div className="min-h-screen bg-surface text-text-primary font-sans">
      <Header />

      {/* ── Hero ── */}
      <section className="relative px-6 pt-28 sm:pt-36 pb-8 sm:pb-10">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-wide text-text-muted mb-4">
              Vancouver intersection safety analysis
            </p>
            <h1 className="text-text-primary text-4xl sm:text-5xl lg:text-6xl font-bold max-w-4xl leading-[1.08] mb-5 font-heading">
              Vancouver's most dangerous intersections, scored from real crash data
            </h1>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
              MindTheGap ranks signalized intersections using ICBC crash records, then shows the corridors where risk clusters instead of stopping at a citywide heat map.
            </p>
          </div>

          <div className="cs-panel p-4 sm:p-5">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-4">
              Dataset summary
            </p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: '966', label: 'signalized intersections', icon: MapPin },
                { value: '34K', label: 'injury crashes reviewed', icon: Users },
                { value: '383', label: 'high-risk signals flagged', icon: AlertTriangle },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 border-t border-border pt-3 first:border-t-0 first:pt-0">
                  <s.icon className="w-[18px] h-[18px] text-brand opacity-75" />
                  <span className="text-lg font-semibold text-text-primary tabular-nums">{s.value}</span>
                  <span className="text-sm text-text-secondary">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <div id="map">
        <div className="max-w-6xl mx-auto mb-4 px-6">
          <p className="text-xs font-medium tracking-wide text-text-muted mb-2">Interactive map</p>
          <p className="text-sm text-text-secondary max-w-2xl">
            Ranked badges show the top 25 intersections. Turn on all intersections to compare every signalized location by injury-weighted crash history.
          </p>
        </div>
        <div className="mx-0 sm:mx-6 border-y sm:border border-border max-w-7xl lg:mx-auto overflow-hidden">
          <MapSection />
        </div>
      </div>

      <ProductFeatures />

      {/* ── Transition: product → about ── */}
      <div id="about" className="relative bg-surface-warm py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-medium tracking-wide text-text-muted mb-3">About the builder</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary font-heading">
            A PM who still shows up to <span className="text-brand">city hall</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-xl mx-auto">
            MindTheGap is a side project by a product manager who's spent a decade shipping software, and a lifetime caring about how cities move.
          </p>
        </div>
      </div>

      <HeroSections />
      <Footer />
    </div>
  )
}

export default App
