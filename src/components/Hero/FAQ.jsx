import { useState, useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'

const faqs = [
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
    q: "Wait a minute, isn't this vibe coded?",
    a: "Busted! I built this with a mix of Figma and Claude Code. I'm definitely not a designer or a developer. This is meant to demonstrate that in just a few hours, I can whip something up that's passable. When paired with Spare's own design system, I should be able to prototype new ideas, and even push small changes to the app.",
  },
  {
    q: "What's the point of vibe coding an app?",
    a: (<>The role of the PM is changing. What you used to have to <em>tell</em> people, you can now <em>show</em> them. Mastery of AI tools is crucial. I'm fond of <a href="https://x.com/wadefoster/status/2038979630590509553" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline hover:text-emerald-500 transition-colors">this AI fluency rubric from Zapier</a> which breaks down AI fluency by traditional software company roles into four levels – Unacceptable, Capable, Adoptive, and Transformative. Currently I'd say I'm working on being in the "adoptive" category, and working my way up.</>),
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
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-violet-600 transition-colors pr-4">
          {q}
        </span>
        <span className={`text-gray-500 shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <Plus className="w-5 h-5" />
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${height}px` : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="pb-5 text-gray-500 leading-relaxed text-sm sm:text-base max-w-2xl">
          {a}
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative px-6 sm:px-12 py-20 sm:py-28 bg-gray-50"
    >
      <div className="max-w-3xl mx-auto">
        <div className="w-10 h-1 bg-violet-500 rounded-full mb-6" />
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8 tracking-tighter font-heading">
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
