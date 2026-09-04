import { useState } from 'react'
import { capture } from '../../lib/analytics'
import { IconPlus } from '../icons'

const faqs = [
  {
    q: 'How is the gap score calculated?',
    a: "For each area, I count the daily transit trips within a 600-metre walk of its centre and divide by resident population to get trips per capita. That figure is percentile-ranked against every area above a density floor (400 people/km²), and the gap score is the squared inverse of that percentile. Fewer trips per resident means a higher gap. Areas below the density floor are grey and ungraded. The score is a percentile rank, so it's relative. It finds the worst-served areas in this region, not areas below an absolute standard. A city with great coverage everywhere would still show a spread.",
  },
  {
    q: 'Is the data accurate?',
    a: "Treat it as directional. GTFS shows scheduled service, not what actually runs, and 2021 census data misses newer developments. Edges are rough: an area beside a SkyTrain station can still score badly if feeder buses are sparse.",
  },
  {
    q: 'Can I download the scored data?',
    a: (<>Yes. The scored dissemination areas are available as <a href="/data/vancouver-transit-gaps.geojson" download className="text-transit underline hover:opacity-80">GeoJSON</a> (geometry plus gap score, population, and trips per capita), under CC&nbsp;BY&nbsp;4.0. Source data is TransLink's GTFS feed and Statistics Canada's 2021 Census.</>),
  },
  {
    q: 'Why build this, and what did Claude do?',
    a: (<>PMs used to <em>tell</em>: PRDs, wireframes, meetings. Now they can <em>show</em>. I picked the problem, chose the data, defined the score, and made the design calls. Claude Code did the implementation and I reviewed every PR. Built solo in a few days.</>),
  },
]

function FAQItem({ q, a, panelId }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-rule">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => { if (!open) capture('faq_opened', { question: q }); setOpen(!open) }}
      >
        <span className="text-base sm:text-lg font-semibold text-ink group-hover:text-transit transition-colors pr-4">
          {q}
        </span>
        <span className={`text-faint group-hover:text-transit shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          <IconPlus size={20} />
        </span>
      </button>
      <div id={panelId} className="faq-panel" data-open={open} inert={!open}>
        <div>
          <div className="pb-5 text-graphite leading-relaxed text-sm sm:text-base max-w-2xl">
            {a}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="relative bg-paper border-t border-rule">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6 tracking-tight font-heading">
            FAQ
          </h2>
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} {...faq} panelId={`faq-panel-${i}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
