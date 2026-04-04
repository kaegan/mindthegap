import { useState, useEffect, useRef } from 'react'
import posthog from 'posthog-js'
import { IconPlusFillDuo18 as Plus } from 'nucleo-ui-fill-duo-18'

const faqs = [
  {
    q: 'Where does the data come from?',
    a: "Transit data comes from TransLink's GTFS feed (stop locations and trip frequencies). Population data comes from Statistics Canada's 2021 Census at the dissemination area level.",
  },
  {
    q: 'How is the gap score calculated?',
    a: "For each area, I count the total daily transit trips within a 600-meter walking distance of its centre. I then normalize both population pressure and transit access into percentiles. The gap score is: population pressure percentile multiplied by (1 minus transit access percentile). High population + low transit = high gap.",
  },
  {
    q: 'Is the data accurate?',
    a: "It's directional, not definitive. The GTFS feed captures scheduled service, not real-time reliability, and the census data is from 2021 so new developments won't show up. Some edges are rough (e.g. a zone near a SkyTrain station might still score high if bus feeder routes are sparse). This is a starting point for conversation, not a planning tool.",
  },
  {
    q: 'How did you build this?',
    a: "Mind the Gap is a React 19 single-page app built with Vite, Tailwind CSS, and Leaflet for the interactive map. Geospatial calculations use Turf.js, and transit boundary data is compressed with TopoJSON. I used Figma (mostly for the logo) and Claude Code. All vibe coded with natural language. 21 PRs and 81 commits over about a day and a half.",
  },
  {
    q: 'What parts did you do vs Claude?',
    a: "I did all the product thinking: came up with the concept, chose the data sources, defined how the gap score should work, made the design decisions, and wrote most of the copy (I let Claude do some of the more marketing-y stuff to describe the app). Claude Code handled the implementation, with me creating and reviewing each PR. A bit like being a PM on a one person team.",
  },
  {
    q: 'Why build something like this?',
    a: (<>I wanted to hint at how the PM role is changing and how I'm changing with it. What PMs used to <em>tell</em>, through lengthy PRDs, hacky wireframes, and lots and lots of meetings, they can now often <em>show</em>, using prototypes, examples, and sometimes by actually shipping. And also, I wanted to show my enthusiasm for this role in particular. I hope I got your attention! 👋</>),
  },
  {
    q: 'How does this connect to the role at Spare?',
    a: "I wanted to take a problem Spare customers have and make a mini-app that'd get them maybe 5% of the way towards solving it. Though there's some overlap with the Enterprise and AI-focus, video is quite different from what Spare is up to. I want to show that even in a day or two I can start to think a little bit like a PM at Spare. If I were to join Spare, I'd use these skills to build interactive prototypes, brainstorm new ideas with designers, and build internal tools to speed up my own and others' workflows. I've also been building AI agents into my daily workflow, like an automated pipeline that monitors, scores, and surfaces job postings for fit.",
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
        onClick={() => { if (!open) posthog.capture('faq_opened', { question: q }); setOpen(!open) }}
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
      className="relative px-6 sm:px-12 py-16 sm:py-24 bg-gray-50"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 tracking-tight font-heading">
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
