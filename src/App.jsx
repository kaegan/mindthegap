import MapSection from './components/Map/MapSection'
import HeroSections from './components/Hero/HeroSections'
import Footer from './components/Layout/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Top hero — branding + intro */}
      <section className="flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center">
        <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-2xl mb-6">
          M
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Mind the Gap
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
          Where does Metro Vancouver's transit fall short? This tool maps coverage gaps — areas where people live but buses don't reach.
        </p>
      </section>

      {/* Map in a contained box */}
      <MapSection />

      {/* Resume / cover letter sections */}
      <HeroSections />
      <Footer />
    </div>
  )
}

export default App
