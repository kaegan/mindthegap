import { useState, useEffect, useRef } from 'react'
import { IconPlusFillDuo18 as Plus } from 'nucleo-ui-fill-duo-18'

const faqs = [
  {
    q: 'What does this map actually show?',
    a: 'Every dot is one of the 966 signalized intersections in the City of Vancouver, scored and colored by how many crashes (and how many injuries) it has seen over five years. Bigger, redder dots are the riskiest.',
  },
  {
    q: 'Where does the data come from?',
    a: "Two real open datasets: the City of Vancouver's traffic-signals dataset (the 966 signal locations) and ICBC's reported-crashes data for Vancouver, 2016–2020 (~27,000 geolocated records). No numbers are invented — every crash count is straight from ICBC.",
  },
  {
    q: 'How is the risk score calculated?',
    a: 'Each crash is snapped to its nearest signal within 50 meters. For every intersection we tally total crashes and weight injury (casualty) crashes 3× property-damage ones, then rank all 966 intersections into a 0–1 percentile. So the score is relative: a 0.9 means riskier than 90% of Vancouver signals.',
  },
  {
    q: "Wait a minute, isn't this vibe coded?",
    a: "Busted! I built this with a mix of Figma and Claude Code. I'm definitely not a designer or a developer. This is meant to demonstrate that in just a few hours, I can whip something up that's passable. When paired with Miovision's own design system and data, I should be able to prototype new ideas, and even push small changes to the product.",
  },
  {
    q: "What's the point of vibe coding an app?",
    a: (<>The role of the PM is changing. What you used to have to <em>tell</em> people, you can now <em>show</em> them. Mastery of AI tools is crucial. I'm fond of <a href="https://x.com/wadefoster/status/2038979630590509553" target="_blank" rel="noopener noreferrer" className="text-brand underline hover:text-brand-hover transition-colors">this AI fluency rubric from Zapier</a> which breaks down AI fluency by traditional software company roles into four levels: Unacceptable, Capable, Adoptive, and Transformative. Currently I'd say I'm working on being in the "adoptive" category, and working my way up.</>),
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
    <div className="border-b border-border">
      <button
        className="w-full flex items-center justify-between py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base sm:text-lg font-medium text-text-primary group-hover:text-brand transition-colors pr-4">
          {q}
        </span>
        <span className={`text-text-secondary shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <Plus className="w-5 h-5" />
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${height}px` : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="pb-5 text-text-secondary leading-relaxed text-sm sm:text-base max-w-2xl">
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
      className="relative px-6 sm:px-12 py-20 sm:py-28 bg-surface-warm"
    >
      <div className="max-w-3xl mx-auto">
        <div className="w-10 h-1 bg-brand rounded-full mb-6" />
        <h2 className="text-4xl sm:text-5xl font-extrabold text-text-primary mb-8 tracking-tighter font-heading">
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
