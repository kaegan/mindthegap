import { useState, useEffect, useRef } from 'react'
import useInView from '../../hooks/useInView'

const faqs = [
  {
    q: 'Why did you build this?',
    a: "The product manager role is changing from leading by telling to leading by showing. Accessible development tools like Claude Code mean a PM can build small prototypes to test and explain ideas. I wanted to demonstrate this by taking a few hours to build a small, fun, Spare-adjacent mini-tool.",
  },
  {
    q: 'What does this map actually show?',
    a: 'It highlights dissemination areas (small census zones) in Metro Vancouver where people live but transit service is limited.',
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
    q: 'How did you build this?',
    a: "I used Claude, Claude Code, and Figma. I wrote the prompts, made the design decisions, paired on a design system, and even made my own logo (not a strength of mine, but fun nonetheless!).",
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [open])

  return (
    <div className="border-b border-white/5">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base sm:text-lg font-medium text-white group-hover:text-violet-400 transition-colors pr-4">
          {q}
        </span>
        <span className={`text-gray-500 shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${height}px` : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="pb-5 text-gray-400 leading-relaxed text-sm sm:text-base max-w-2xl">
          {a}
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [ref, visible] = useInView()

  return (
    <section
      id="faq"
      ref={ref}
      className={`relative px-6 sm:px-12 py-20 sm:py-28 bg-gray-900 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="max-w-3xl mx-auto">
        <div className="w-10 h-1 bg-violet-500 rounded-full mb-6" />
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-tighter font-heading">
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
