import { useEffect, useRef, useState } from 'react'
import Header from './components/Layout/Header'
import MapSection from './components/Map/MapSection'
import HeroSections from './components/Hero/HeroSections'
import FAQ from './components/Hero/FAQ'
import Footer from './components/Layout/Footer'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          setProgress(docHeight > 0 ? scrollY / docHeight : 0)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
      <div
        className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-emerald-500 transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

function App() {
  const [mapRef, mapVisible] = useInView(0.1)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      <ScrollProgress />
      <Header />

      {/* ── Hero Impact Zone ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 sm:pt-40 pb-16 sm:pb-20 text-center overflow-hidden">
        {/* Ambient glow orb */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-500/[0.07] blur-[120px] pointer-events-none" />

        <h1 className="gradient-text text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter max-w-4xl leading-[1.1] mb-6">
          67,000 residents live in Metro Vancouver's transit blind spots
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed mb-10">
          This tool maps coverage gaps — areas where people live but buses don't reach.
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-12">
          {[
            { value: '3,590', label: 'areas analyzed' },
            { value: '67K', label: 'underserved' },
            { value: '72', label: 'critical gaps' },
          ].map((s) => (
            <div key={s.label} className="cs-panel px-4 py-2 sm:px-5 sm:py-2.5 flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white">{s.value}</span>
              <span className="text-xs sm:text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce-slow text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Map with storytelling wrapper ── */}
      <div id="map" ref={mapRef} className={`transition-all duration-700 ${mapVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`}>
        <div className="text-center mb-6 px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Transit Coverage Analysis</p>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Every colored zone is a neighborhood. The redder the zone, the more people are underserved by transit.
          </p>
        </div>
        {/* Gradient border wrapper */}
        <div className="mx-4 sm:mx-8 p-[1px] rounded-xl bg-gradient-to-br from-violet-500/40 via-amber-500/20 to-emerald-500/40 max-w-7xl lg:mx-auto">
          <div className="rounded-xl overflow-hidden bg-gray-950">
            <MapSection />
          </div>
        </div>
      </div>

      {/* Resume / cover letter sections */}
      <HeroSections />
      <FAQ />
      <Footer />
    </div>
  )
}

export default App
