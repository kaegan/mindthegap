import { useEffect, useRef, useState } from 'react'

const sections = [
  {
    id: 'origin',
    headline: 'This started at city hall',
    accentWord: 'city hall',
    body: "At 10 years old, I put on my best (only) suit and asked my mom to drive me to Port Moody City Hall so I could speak at a community hearing about the proposed Evergreen Line. It took two more decades, but the line was eventually built.",
    pullQuote: "I choose to believe these events are related.",
    accent: 'emerald',
    bg: 'bg-gray-950',
    glowPosition: '-top-32 -right-32',
  },
  {
    id: 'why-spare',
    headline: 'Transit + AI is my sweet spot',
    accentWord: 'sweet spot',
    body: "I studied Human Geography at UBC with the goal of becoming a planner. Life took an unexpected turn to tech. I spent the last 7+ years building an AI video creation platform at Lumen5.",
    timeline: [
      { label: 'UBC', sub: 'Human Geography' },
      { label: 'Hootsuite', sub: 'Social media' },
      { label: 'Baremetrics', sub: 'Analytics' },
      { label: 'Lumen5', sub: 'AI video, 7+ yrs' },
      { label: 'Spare', sub: "What's next", highlight: true },
    ],
    accent: 'purple',
    bg: 'bg-gray-900',
    glowPosition: '-top-20 -left-32',
  },
  {
    id: 'track-record',
    headline: 'I ship things that move metrics',
    accentWord: 'metrics',
    stats: [
      { value: '40%', numericValue: 40, suffix: '%', label: 'increase in paid purchases from AI voiceover-driven videos powered by ElevenLabs' },
      { value: '30%', numericValue: 30, suffix: '%', label: 'reduction in video creation time from AI-powered script generation' },
      { value: '25%', numericValue: 25, suffix: '%', label: 'lift in activation thanks to undo/redo, faster rendering, and targeted onboarding' },
    ],
    accent: 'pink',
    bg: 'bg-gray-950',
    glowPosition: '-bottom-32 -left-20',
  },
  {
    id: 'enterprise',
    headline: 'Large Enterprises are my focus',
    accentWord: 'Enterprises',
    body: "I helped lead a transition from self-serve to Enterprise. We saw consistent 20-40% revenue growth in the Enterprise segment over the last five years.",
    logos: [
      { name: 'KPMG' },
      { name: 'Siemens', src: 'https://cdn.simpleicons.org/siemens/ffffff' },
      { name: 'PwC' },
      { name: 'Deloitte' },
      { name: 'Accenture', src: 'https://cdn.simpleicons.org/accenture/ffffff' },
      { name: 'SAP', src: 'https://cdn.simpleicons.org/sap/ffffff' },
      { name: 'Cisco', src: 'https://cdn.simpleicons.org/cisco/ffffff' },
      { name: 'Swiss Re' },
      { name: 'Best Western' },
      { name: 'Mitsubishi' },
      { name: 'Baker Hughes' },
    ],
    accent: 'amber',
    bg: 'bg-gray-900',
    glowPosition: '-top-32 -right-20',
  },
  {
    id: 'advocate',
    headline: "I'm an advocate for products I love",
    accentWord: 'advocate',
    body: "In earlier years at Lumen5, I owned product marketing end-to-end — coordinating and building out materials for our launches. I would happily be an enthusiastic, credible advocate for Spare, both with transit agencies and the broader product community.",
    youtube: 'https://www.youtube.com/embed/d9VSYecC5YM',
    accent: 'emerald',
    bg: 'bg-gray-950',
    glowPosition: '-bottom-20 -right-32',
  },
  {
    id: 'approach',
    headline: 'My daily toolkit',
    accentWord: 'toolkit',
    body: "I'm not an engineer, but I can translate between AI capabilities and customer problems. At Lumen5, I led roadmap planning across four product teams, managed vendor relationships with Shutterstock and ElevenLabs, and was the face of the product externally.",
    techLogos: true,
    accent: 'purple',
    bg: 'bg-gray-900',
    glowPosition: '-top-20 -left-20',
  },
  {
    id: 'contact',
    headline: "Let's talk",
    body: "I'm open to both the Staff and Senior PM roles. Domain fit and being a strong contributor matters more to me than title.",
    links: [
      { label: 'Email me', url: 'mailto:hello@mindthegap.fyi', primary: true, icon: 'email' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/kaegandonnelly', icon: 'linkedin' },
      { label: 'Resume & Cover Letter', url: 'https://canva.link/9smwv33yz6e02au', icon: 'resume' },
    ],
    accent: 'amber',
    bg: 'bg-gray-950',
    glowPosition: '-top-32 left-1/2 -translate-x-1/2',
  },
]

const accentColors = {
  purple: {
    bar: 'bg-violet-500', stat: 'text-violet-400', dot: 'bg-violet-500', ring: 'ring-violet-500/40',
    glow: 'bg-violet-500/[0.07]', divider: 'via-violet-500/30', accent: 'text-violet-400',
  },
  pink: {
    bar: 'bg-pink-500', stat: 'text-pink-400', dot: 'bg-pink-500', ring: 'ring-pink-500/40',
    glow: 'bg-pink-500/[0.07]', divider: 'via-pink-500/30', accent: 'text-pink-400',
  },
  amber: {
    bar: 'bg-amber-500', stat: 'text-amber-400', dot: 'bg-amber-500', ring: 'ring-amber-500/40',
    glow: 'bg-amber-500/[0.07]', divider: 'via-amber-500/30', accent: 'text-amber-400',
  },
  emerald: {
    bar: 'bg-emerald-500', stat: 'text-emerald-400', dot: 'bg-emerald-500', ring: 'ring-emerald-500/40',
    glow: 'bg-emerald-500/[0.07]', divider: 'via-emerald-500/30', accent: 'text-emerald-400',
  },
}

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

// ── Animated counter ──
function AnimatedNumber({ target, suffix, color, visible }) {
  const [current, setCurrent] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!visible || hasRun.current) return
    hasRun.current = true
    const duration = 1500
    const start = performance.now()
    const ease = (t) => 1 - Math.pow(1 - t, 3) // easeOutCubic

    function tick(now) {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      setCurrent(Math.round(ease(t) * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [visible, target])

  return (
    <span className={`text-3xl sm:text-4xl font-extrabold ${color}`}>
      {current}{suffix}
    </span>
  )
}

function StatCard({ numericValue, suffix, label, color, visible }) {
  return (
    <div className="cs-panel p-6 flex-1 min-w-[200px] border-t-2 border-pink-500/40 shadow-lg shadow-pink-500/5">
      <div className="mb-2">
        <AnimatedNumber target={numericValue} suffix={suffix} color={color} visible={visible} />
      </div>
      <div className="text-sm text-gray-400 leading-relaxed">{label}</div>
    </div>
  )
}

function LogoMarquee({ logos }) {
  const doubled = [...logos, ...logos]
  return (
    <div
      className="mt-8 overflow-hidden"
      style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
    >
      <div className="animate-marquee gap-14">
        {doubled.map((logo, i) =>
          logo.src ? (
            <img key={i} src={logo.src} alt={logo.name} className="h-6 sm:h-7 opacity-40 hover:opacity-80 transition-opacity shrink-0" />
          ) : (
            <span key={i} className="text-base font-bold text-white/30 hover:text-white/60 transition-colors shrink-0 tracking-tight">
              {logo.name}
            </span>
          )
        )}
      </div>
    </div>
  )
}

function Timeline({ steps, colors }) {
  return (
    <div className="mt-10 overflow-x-auto pb-2">
      <div className="flex items-start min-w-max">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-start">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full mt-0.5 ring-2 ring-offset-2 ring-offset-gray-900 ${
                  step.highlight
                    ? `${colors.dot} ${colors.ring} animate-pulse-ring`
                    : 'bg-white/20 ring-white/10'
                }`}
              />
              <div className="mt-3 text-center w-24">
                <div className={`text-sm font-semibold ${step.highlight ? 'text-white' : 'text-gray-300'}`}>
                  {step.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 leading-snug">{step.sub}</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 sm:w-20 h-px mx-2 mt-[0.5rem] ${
                i >= steps.length - 2 ? 'bg-gradient-to-r from-white/10 to-violet-500/30' : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TechLogos() {
  const tools = [
    { name: 'Notion', src: 'https://cdn.simpleicons.org/notion/ffffff' },
    { name: 'Slack', src: 'https://cdn.simpleicons.org/slack/ffffff' },
    { name: 'Claude', src: 'https://cdn.simpleicons.org/claude/ffffff' },
    { name: 'Mixpanel', src: 'https://cdn.simpleicons.org/mixpanel/ffffff' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-4 mt-8">
      {tools.map((tool) => (
        <div key={tool.name} className="cs-panel px-5 py-3 flex items-center gap-3">
          <img src={tool.src} alt={tool.name} className="h-5 w-5" />
          <span className="text-sm font-medium text-gray-300">{tool.name}</span>
        </div>
      ))}
    </div>
  )
}

function YouTubeEmbed({ url }) {
  return (
    <div className="mt-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={url}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

const linkIcons = {
  email: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  resume: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

function HighlightedHeadline({ text, accentWord, accentClass }) {
  if (!accentWord) return text
  const idx = text.toLowerCase().indexOf(accentWord.toLowerCase())
  if (idx === -1) return text
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + accentWord.length)
  const after = text.slice(idx + accentWord.length)
  return <>{before}<span className={accentClass}>{match}</span>{after}</>
}

export default function HeroSections() {
  return (
    <div>
      {sections.map((section, sectionIdx) => {
        const colors = accentColors[section.accent] || accentColors.emerald
        const [ref, visible] = useInView()
        const isContact = section.id === 'contact'

        return (
          <div key={section.id}>
            {/* Gradient divider between sections */}
            {sectionIdx > 0 && (
              <div className={`h-px bg-gradient-to-r from-transparent ${colors.divider} to-transparent`} />
            )}

            <section
              id={section.id}
              ref={ref}
              className={`relative px-6 sm:px-12 py-20 sm:py-28 ${section.bg} overflow-hidden transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              {/* Ambient glow orb */}
              <div className={`absolute ${section.glowPosition} w-[500px] h-[500px] rounded-full ${colors.glow} blur-[120px] pointer-events-none`} />

              {/* Contact section: extra gradient wash */}
              {isContact && (
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.03] to-emerald-500/[0.03] pointer-events-none" />
              )}

              <div className="relative max-w-3xl mx-auto">
                <div className={`w-10 h-1 ${colors.bar} rounded-full mb-6`} />

                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tighter">
                  <HighlightedHeadline text={section.headline} accentWord={section.accentWord} accentClass={colors.accent} />
                </h2>

                {section.body && (
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    {section.body}
                  </p>
                )}

                {section.pullQuote && (
                  <p className="mt-4 text-gray-500 italic text-base">
                    {section.pullQuote}
                  </p>
                )}

                {section.timeline && <Timeline steps={section.timeline} colors={colors} />}

                {section.stats && (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {section.stats.map((stat) => (
                      <StatCard key={stat.label} {...stat} color={colors.stat} visible={visible} />
                    ))}
                  </div>
                )}

                {section.logos && <LogoMarquee logos={section.logos} />}

                {section.techLogos && <TechLogos />}

                {section.youtube && <YouTubeEmbed url={section.youtube} />}

                {section.links && (
                  <div className="flex flex-wrap gap-4 mt-8">
                    {section.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 ${link.primary
                          ? 'bg-gradient-to-r from-violet-600 to-emerald-500 hover:from-violet-500 hover:to-emerald-400 px-8 py-3 rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                          : 'cs-panel px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all'
                        }`}
                      >
                        {link.icon && linkIcons[link.icon]}
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )
      })}
    </div>
  )
}
