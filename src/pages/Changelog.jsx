import { Link } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const releases = [
  {
    title: 'Per-Capita Coverage Scoring',
    date: 'April 4, 2026',
    description:
      'Redesigned the gap score formula to measure transit trips per resident instead of weighting raw population against transit access. Areas below 400 people/km\u00B2 are now shown in gray and left ungraded, so rural zones no longer get misleading "excellent coverage" labels. A squared power curve focuses visual intensity on the truly underserved areas.',
  },
  {
    title: 'Gap Explorer',
    date: 'April 3, 2026',
    description:
      'Browse the 25 most critical transit coverage gaps in Metro Vancouver, ranked by impact. Each entry shows a letter grade, affected population, and gap score. Click any row to fly to that area on the map and open its report card for a closer look.',
  },
  {
    title: 'Neighborhood Report Cards',
    date: 'April 1, 2026',
    description:
      'Click any neighborhood on the map to open a detailed report card. Each card shows the area\'s gap score as a letter grade, population density, and the nearest transit stops with walking distances. An expandable methodology section explains how the score is calculated.',
  },
  {
    title: 'Transit Layer Controls',
    date: 'April 1, 2026',
    description:
      'Toggle individual transit modes on and off directly from the map. Bus, SkyTrain, SeaBus, and West Coast Express routes each render in distinct colors so you can see exactly which modes serve which areas. A collapsible layers panel keeps the UI clean while giving you full control.',
  },
  {
    title: 'Bus Stop Markers',
    date: 'April 1, 2026',
    description:
      'Every bus stop in Metro Vancouver is now plotted on the map. Zoom in to see stop-level detail alongside the route lines and coverage gap overlay.',
  },
  {
    title: 'Collapsible Legend',
    date: 'April 1, 2026',
    description:
      'The coverage gap legend now collapses to a single icon so the map isn\'t cluttered on smaller screens. On mobile, layers default to expanded for easy discovery.',
  },
  {
    title: 'Faster Map Loading',
    date: 'April 1, 2026',
    description:
      'Route and stop data now lazy-loads as you interact with the map, and all geographic data has been converted to TopoJSON, cutting payload sizes by roughly 50%. Mobile load times improved significantly.',
  },
  {
    title: 'Coverage Gap Heatmap',
    date: 'March 31, 2026',
    description:
      'A heatmap layer highlights clusters of underserved areas at a glance. Toggle it on to see hot zones where multiple high-gap neighborhoods overlap, making regional patterns easier to spot than the polygon-by-polygon view alone.',
  },
]

export default function Changelog() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      <Header />

      <main className="flex-1 pt-32 sm:pt-40 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-block"
          >
            &larr; Back to map
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter font-heading text-gray-900 mb-3">
            What's New
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mb-12">
            Feature releases for the Mind the Gap interactive transit map.
          </p>

          <div className="space-y-10">
            {releases.map((release) => (
              <article key={release.title}>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{release.date}</p>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 font-heading">
                  {release.title}
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  {release.description}
                </p>
              </article>
            ))}
          </div>

          <hr className="my-12 border-gray-200" />

          <article>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">March 31, 2026</p>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 font-heading">
              Launch
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Mind the Gap launches as an interactive choropleth map of transit coverage gaps across Metro Vancouver's 3,590 dissemination areas. The gap score algorithm combines population pressure with transit access -- measuring how many transit trips are reachable within walking distance (600 m for bus stops, 1,200 m for rail stations) -- to surface the 72 most critical gaps affecting 67,000+ residents.
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
