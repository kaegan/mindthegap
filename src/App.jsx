import { IconMapPinFillDuo18 as MapPin } from 'nucleo-ui-fill-duo-18'
import { IconUsersFillDuo18 as Users } from 'nucleo-ui-fill-duo-18'
import { IconSirenFillDuo18 as AlertTriangle } from 'nucleo-ui-fill-duo-18'
import Header from './components/Layout/Header'
import MapSection from './components/Map/MapSection'
import ProductFeatures from './components/Product/ProductFeatures'
import HeroSections from './components/Hero/HeroSections'
import FAQ from './components/Hero/FAQ'
import Footer from './components/Layout/Footer'

function App() {
  return (
    <div className="min-h-screen bg-surface text-text-primary font-sans">
      <Header />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 sm:pt-40 pb-8 sm:pb-12 text-center overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-300/[0.08] blur-[120px] pointer-events-none" />
        <div className="absolute top-32 left-1/3 w-[400px] h-[300px] rounded-full bg-amber-200/[0.06] blur-[100px] pointer-events-none" />

        <h1 className="text-text-primary text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter max-w-4xl leading-[1.1] mb-6 font-heading">
          Vancouver's most dangerous intersections, scored from 92,000 real crashes
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl leading-relaxed mb-10">
          MindTheGap scores every signalized intersection in Vancouver on five years of ICBC crash data, then surfaces the risk corridors that need attention first.
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8">
          {[
            { value: '966', label: 'signals analyzed', color: 'text-violet-400', icon: MapPin },
            { value: '34K', label: 'injury crashes', color: 'text-amber-400', icon: Users },
            { value: '383', label: 'high-risk', color: 'text-red-400', icon: AlertTriangle },
          ].map((s) => (
            <div key={s.label} className="cs-panel px-4 py-2 sm:px-5 sm:py-2.5 flex items-center gap-2">
              <s.icon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${s.color} opacity-70`} />
              <span className={`text-sm sm:text-base font-bold ${s.color}`}>{s.value}</span>
              <span className="text-xs sm:text-sm text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Map ── */}
      <div id="map">
        <div className="text-center mb-6 px-6">
          <p className="text-xs font-medium tracking-wide text-text-muted mb-2">Intersection Safety Analysis</p>
          <p className="text-sm text-text-secondary max-w-lg mx-auto">
            The top 25 most dangerous intersections are ranked and labelled by badge. Toggle the heatmap to see all 966 signalized intersections scored by crash history.
          </p>
        </div>
        <div className="mx-4 sm:mx-8 rounded-xl border border-border max-w-7xl lg:mx-auto overflow-hidden">
          <MapSection />
        </div>
      </div>

      <ProductFeatures />

      {/* ── Transition: product → about ── */}
      <div id="about" className="relative bg-surface-warm py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-medium tracking-wide text-text-muted mb-3">About the builder</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tighter font-heading">
            A PM who still shows up to <span className="text-brand">city hall</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-xl mx-auto">
            MindTheGap is a side project by a product manager who's spent a decade shipping software, and a lifetime caring about how cities move.
          </p>
        </div>
      </div>

      <HeroSections />
      <FAQ />
      <Footer />
    </div>
  )
}

export default App
