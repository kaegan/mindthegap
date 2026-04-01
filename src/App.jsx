import { IconMapPinOutlineDuo18 as MapPin } from 'nucleo-ui-outline-duo-18'
import { IconUsersOutlineDuo18 as Users } from 'nucleo-ui-outline-duo-18'
import { IconAlertWarningOutlineDuo18 as AlertTriangle } from 'nucleo-ui-outline-duo-18'
import Header from './components/Layout/Header'
import MapSection from './components/Map/MapSection'
import ProductFeatures from './components/Product/ProductFeatures'
import HeroSections from './components/Hero/HeroSections'
import FAQ from './components/Hero/FAQ'
import Footer from './components/Layout/Footer'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 sm:pt-40 pb-8 sm:pb-12 text-center overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-300/[0.08] blur-[120px] pointer-events-none" />
        <div className="absolute top-32 left-1/3 w-[400px] h-[300px] rounded-full bg-amber-200/[0.06] blur-[100px] pointer-events-none" />

        <h1 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter max-w-4xl leading-[1.1] mb-6 font-heading">
          67,000 residents live in Metro Vancouver's transit blind spots
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed mb-10">
          MindTheGap finds coverage gaps — areas where people live but buses don't reach.
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8">
          {[
            { value: '3,590', label: 'areas analyzed', color: 'text-violet-400', icon: MapPin },
            { value: '67K', label: 'underserved', color: 'text-amber-400', icon: Users },
            { value: '72', label: 'critical gaps', color: 'text-red-400', icon: AlertTriangle },
          ].map((s) => (
            <div key={s.label} className="cs-panel px-4 py-2 sm:px-5 sm:py-2.5 flex items-center gap-2">
              <s.icon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${s.color} opacity-70`} />
              <span className={`text-sm sm:text-base font-bold ${s.color}`}>{s.value}</span>
              <span className="text-xs sm:text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Map ── */}
      <div id="map">
        <div className="text-center mb-6 px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Transit Coverage Analysis</p>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Every colored zone is a neighborhood. The redder the zone, the more people are underserved by transit.
          </p>
        </div>
        <div className="mx-4 sm:mx-8 rounded-xl border border-gray-200 max-w-7xl lg:mx-auto overflow-hidden">
          <MapSection />
        </div>
      </div>

      <ProductFeatures />

      {/* ── Transition: product → about ── */}
      <div id="about" className="relative bg-gray-50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">About the builder</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tighter font-heading">
            A PM who still shows up to <span className="text-violet-600">city hall</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            MindTheGap is a side project by a product manager who's spent a decade shipping software — and a lifetime caring about transit.
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
