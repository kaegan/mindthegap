import Header from './components/Layout/Header'
import MapSection from './components/Map/MapSection'
import HeroSections from './components/Hero/HeroSections'
import FAQ from './components/Hero/FAQ'
import Footer from './components/Layout/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <Header />

      {/* Top hero — branding + intro */}
      <section className="flex flex-col items-center justify-center px-6 pt-28 pb-12 text-center">
        <img
          src="/mindthegap-logo.svg"
          alt="Mind the Gap"
          className="h-16 sm:h-20 mb-8"
        />
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
          Where does Metro Vancouver's transit fall short? This tool maps coverage gaps — areas where people live but buses don't reach.
        </p>
      </section>

      {/* Map in a contained box */}
      <div id="map">
        <MapSection />
      </div>

      {/* Resume / cover letter sections */}
      <HeroSections />
      <FAQ />
      <Footer />
    </div>
  )
}

export default App
