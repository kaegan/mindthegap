const sections = [
  {
    id: 'origin',
    emoji: '🏛️',
    headline: 'This started at city hall',
    body: "At 10 years old, I put on my best (only) suit and asked my mom to drive me to Port Moody City Hall so I could speak at a community hearing about the proposed Evergreen Line. It took two more decades, but the line was eventually built. I choose to believe these events are related.",
    accent: 'emerald',
    bg: 'bg-gray-950',
  },
  {
    id: 'why-spare',
    emoji: '🚍',
    headline: 'Transit + AI is my sweet spot',
    body: "I studied Human Geography at UBC with the goal of becoming a planner. Life took an unexpected turn to tech. I spent the last 7+ years building an AI video creation platform at Lumen5.",
    accent: 'purple',
    bg: 'bg-[#0c1425]',
  },
  {
    id: 'track-record',
    emoji: '📈',
    headline: 'I ship things that move metrics',
    stats: [
      { value: '40%', label: 'increase in paid purchases from AI voiceover-driven videos powered by ElevenLabs' },
      { value: '30%', label: 'reduction in video creation time from AI-powered script generation' },
      { value: '25%', label: 'lift in activation thanks to undo/redo, faster rendering, and targeted onboarding' },
    ],
    accent: 'pink',
    bg: 'bg-gray-950',
  },
  {
    id: 'enterprise',
    emoji: '🏢',
    headline: 'Large Enterprises are my focus',
    body: "I helped lead a transition from self-serve to Enterprise. We saw consistent 20-40% revenue growth in the Enterprise segment over the last five years.",
    logos: [
      { name: 'KPMG', color: '#00338D' },
      { name: 'Siemens', color: '#009999' },
      { name: 'PwC', color: '#D04A02' },
      { name: 'Deloitte', color: '#86BC25' },
      { name: 'Accenture', color: '#A100FF' },
      { name: 'SAP', color: '#0FAAFF' },
    ],
    accent: 'amber',
    bg: 'bg-[#0c1425]',
  },
  {
    id: 'advocate',
    emoji: '📣',
    headline: "I'm an advocate for products I love",
    body: "In earlier years at Lumen5, I owned product marketing end-to-end — coordinating and building out materials for our launches. I would happily be an enthusiastic, credible advocate for Spare, both with transit agencies and the broader product community.",
    youtube: 'https://www.youtube.com/embed/d9VSYecC5YM',
    accent: 'emerald',
    bg: 'bg-gray-950',
  },
  {
    id: 'approach',
    emoji: '🔀',
    headline: 'PM who speaks both languages',
    body: "I'm not an engineer, but I can translate between AI capabilities and customer problems. At Lumen5, I led roadmap planning across four product teams, managed vendor relationships with Shutterstock and ElevenLabs, and was the face of the product externally.",
    techLogos: true,
    accent: 'purple',
    bg: 'bg-[#0c1425]',
  },
  {
    id: 'contact',
    emoji: '👋',
    headline: "Let's talk",
    body: "I'm open to both the Staff and Senior PM roles. Domain fit and being a strong contributor matters more to me than title.",
    links: [
      { label: '✉️  hello@mindthegap.fyi', url: 'mailto:hello@mindthegap.fyi' },
      { label: '💼  LinkedIn', url: 'https://www.linkedin.com/in/kaegandonnelly' },
    ],
    accent: 'amber',
    bg: 'bg-gray-950',
  },
]

// Logo brand palette: purple #8B5CF6, pink #EC4899, amber #F59E0B, emerald #10B981
const accentColors = {
  purple: { bar: 'bg-violet-500', glow: 'shadow-violet-500/20', stat: 'text-violet-400', border: 'border-violet-500/20' },
  pink: { bar: 'bg-pink-500', glow: 'shadow-pink-500/20', stat: 'text-pink-400', border: 'border-pink-500/20' },
  amber: { bar: 'bg-amber-500', glow: 'shadow-amber-500/20', stat: 'text-amber-400', border: 'border-amber-500/20' },
  emerald: { bar: 'bg-emerald-500', glow: 'shadow-emerald-500/20', stat: 'text-emerald-400', border: 'border-emerald-500/20' },
}

function StatCard({ value, label, color }) {
  return (
    <div className="cs-panel p-6 flex-1 min-w-[220px]">
      <div className={`text-3xl sm:text-4xl font-extrabold mb-2 ${color}`}>{value}</div>
      <div className="text-sm text-gray-400 leading-relaxed">{label}</div>
    </div>
  )
}

function LogoCloud({ logos }) {
  return (
    <div className="flex flex-wrap items-center gap-4 mt-8">
      {logos.map((logo) => (
        <div
          key={logo.name}
          className="cs-panel px-5 py-3 flex items-center gap-3"
        >
          <div
            className="w-2 h-5 rounded-sm shrink-0"
            style={{ backgroundColor: logo.color }}
          />
          <span className="text-sm font-semibold tracking-wide" style={{ color: logo.color }}>
            {logo.name}
          </span>
        </div>
      ))}
    </div>
  )
}

function TechLogos() {
  const tools = [
    { name: 'Jira', icon: '🎯' },
    { name: 'Figma', icon: '🎨' },
    { name: 'SQL', icon: '🗄️' },
    { name: 'Python', icon: '🐍' },
    { name: 'Amplitude', icon: '📊' },
    { name: 'GitHub', icon: '🐙' },
  ]
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {tools.map((tool) => (
        <div
          key={tool.name}
          className="cs-panel px-4 py-2.5 text-sm text-gray-300 flex items-center gap-2"
        >
          <span className="text-lg">{tool.icon}</span>
          <span className="font-medium">{tool.name}</span>
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

export default function HeroSections() {
  return (
    <div>
      {sections.map((section) => {
        const colors = accentColors[section.accent] || accentColors.orange
        return (
          <section
            key={section.id}
            id={section.id}
            className={`min-h-[60vh] flex items-center justify-center px-6 sm:px-12 py-20 ${section.bg}`}
          >
            <div className="max-w-3xl w-full">
              {/* Emoji + accent bar */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{section.emoji}</span>
                <div className={`w-10 h-1 ${colors.bar} rounded-full`} />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
                {section.headline}
              </h2>

              {section.body && (
                <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                  {section.body}
                </p>
              )}

              {section.stats && (
                <div className="flex flex-wrap gap-4 mt-2">
                  {section.stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} color={colors.stat} />
                  ))}
                </div>
              )}

              {section.logos && <LogoCloud logos={section.logos} />}

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
                      className={`cs-panel px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all hover:shadow-lg ${colors.glow}`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
