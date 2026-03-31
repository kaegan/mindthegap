import { useState } from 'react'

const faqs = [
  {
    q: 'What does this map actually show?',
    a: 'It highlights dissemination areas (small census zones) in Metro Vancouver where people live but transit service is limited. The darker the color, the bigger the gap between population density and nearby transit frequency.',
  },
  {
    q: 'Where does the data come from?',
    a: "Transit data comes from TransLink's GTFS feed (stop locations and trip frequencies). Population data comes from Statistics Canada's 2021 Census at the dissemination area level.",
  },
  {
    q: 'How is the gap score calculated?',
    a: 'For each area, we count the total daily transit trips within a 600-meter walking distance of its center. We then normalize both population pressure and transit access into percentiles. The gap score is: population pressure percentile multiplied by (1 minus transit access percentile). High population + low transit = high gap.',
  },
  {
    q: 'Why 600 meters?',
    a: "600 meters is a commonly used walkability threshold for bus stops — roughly a 7-8 minute walk. It's the distance most people are willing to walk to catch a bus. Rail stations use a 1,200-meter buffer.",
  },
  {
    q: 'Did you really speak at city hall when you were 10?',
    a: "Yes. My mom drove me. I wore her friend's son's suit. The Evergreen Line opened 20 years later. Correlation is not causation, but I'm not ruling it out.",
  },
  {
    q: 'Did you build this yourself?',
    a: "I built this with Claude Code (Anthropic's AI coding tool). I wrote the prompts, made the design decisions, and shaped the data pipeline — Claude wrote the code. It's a good example of how I work: I don't need to be the one writing every line, but I need to understand what's happening and why.",
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/5">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base sm:text-lg font-medium text-white group-hover:text-emerald-400 transition-colors pr-4">
          {q}
        </span>
        <span className={`text-gray-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-5 text-gray-400 leading-relaxed text-sm sm:text-base max-w-2xl">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section
      id="faq"
      className="min-h-[60vh] flex items-center justify-center px-6 sm:px-12 py-20 bg-[#0c1425]"
    >
      <div className="max-w-3xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">&#10067;</span>
          <div className="w-10 h-1 bg-emerald-500 rounded-full" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 tracking-tight">
          FAQ
        </h2>
        <div>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </div>
      </div>
    </section>
  )
}
