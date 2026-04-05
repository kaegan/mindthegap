import { IconMapPinFillDuo18 as MapPin } from 'nucleo-ui-fill-duo-18'
import { IconUsersFillDuo18 as Users } from 'nucleo-ui-fill-duo-18'
import { IconSirenFillDuo18 as AlertTriangle } from 'nucleo-ui-fill-duo-18'
import Header from './components/Layout/Header'
import WhatsNewToast from './components/WhatsNewToast'
import MapSection from './components/Map/MapSection'
import ProductFeatures from './components/Product/ProductFeatures'
import HeroSections from './components/Hero/HeroSections'
import FAQ from './components/Hero/FAQ'
import Footer from './components/Layout/Footer'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <WhatsNewToast />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 sm:pt-40 pb-8 sm:pb-12 text-center overflow-hidden">
        <h1 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter max-w-4xl leading-[1.1] mb-6 font-heading">
          67,000 residents live in Metro Vancouver's transit blind spots
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed mb-10">
          MindTheGap finds coverage gaps – areas where people live but buses and trains don't reach.
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8">
          {[
            { value: '3,590', label: 'areas analyzed', iconColor: 'text-violet-400', icon: MapPin },
            { value: '67K', label: 'underserved', iconColor: 'text-amber-400', icon: Users },
            { value: '72', label: 'critical gaps', iconColor: 'text-red-400', icon: AlertTriangle },
          ].map((s) => (
            <div key={s.label} className="cs-panel px-5 py-2.5 sm:px-6 sm:py-3 flex items-center gap-2">
              <s.icon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${s.iconColor} opacity-70`} />
              <span className="text-base sm:text-lg font-bold text-gray-900">{s.value}</span>
              <span className="text-xs sm:text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Map ── */}
      <div id="map">
        <div className="text-center mb-6 px-6">
          <p className="text-xs tracking-[0.2em] text-gray-500 mb-2">Transit Coverage Analysis</p>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Every colored zone is a dissemination area. Transit access is measured within a 600m walking radius. The redder the zone, the more people are underserved.
          </p>
        </div>
        <div className="mx-4 sm:mx-8 rounded-xl border border-gray-200 max-w-7xl lg:mx-auto overflow-hidden">
          <MapSection />
        </div>
      </div>

      <ProductFeatures />

      {/* ── Transition: product → about ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />
      <div id="origin" className="relative bg-gray-50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.2em] text-gray-400 mb-3">A little about Kaegan</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-heading">
            A PM who shows up to <span className="text-violet-600">city hall</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            Hi Spare! 👋 I'm Kaegan.
          </p>
          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            At 10 years old, I put on my best (only) suit and asked my mom to drive me to city hall so I could speak at a community hearing about the proposed Evergreen Line. It took two more decades, but the line was eventually built.
          </p>
          <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-xl mx-auto italic">
            I choose to believe these events are related.
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
