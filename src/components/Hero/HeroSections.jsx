const sections = [
  {
    id: 'origin',
    headline: 'This started at city hall.',
    body: "At 10, I put on my only suit and asked my mom to drive me to Port Moody City Hall so I could speak at a community hearing about the proposed Evergreen Line. It took two more decades, but the line was eventually built. I choose to believe these events are related.",
    accent: 'bg-orange-500',
  },
  {
    id: 'why-spare',
    headline: 'Transit + AI is my sweet spot.',
    body: "I studied Human Geography at UBC to become a city planner. Then I spent 7 years building an AI platform at Lumen5. Spare sits right at the intersection — and that's exactly why I'm here.",
    accent: 'bg-blue-500',
  },
  {
    id: 'track-record',
    headline: 'I ship things that move numbers.',
    stats: [
      { value: '40%', label: 'increase in paid purchases from voiceover-driven videos (ElevenLabs)' },
      { value: '30%', label: 'reduction in video creation time via LLM-powered workflows' },
      { value: '100+', label: 'Enterprise brands including KPMG, PwC, and Siemens' },
      { value: '7 yrs', label: 'scaling Lumen5 from fledgling startup to established platform' },
    ],
    accent: 'bg-emerald-500',
  },
  {
    id: 'approach',
    headline: 'PM who speaks both languages.',
    body: "I'm not an engineer, but I can translate between AI capabilities and customer problems. At Lumen5, I led roadmap planning across four product teams, managed vendor relationships with Shutterstock and ElevenLabs, and was the face of the product externally.",
    accent: 'bg-purple-500',
  },
  {
    id: 'contact',
    headline: "Let's talk.",
    body: "I'm open to both the Staff and Senior PM roles. Domain fit and being a strong contributor matters more to me than title.",
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/kaegandonnelly' },
      { label: 'Email', url: 'mailto:kaegan@icloud.com' },
    ],
    accent: 'bg-orange-500',
  },
]

function StatCard({ value, label }) {
  return (
    <div className="cs-panel p-6 flex-1 min-w-[200px]">
      <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

export default function HeroSections() {
  return (
    <div>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="min-h-[60vh] flex items-center justify-center px-6 sm:px-12 py-20 border-t border-white/5"
        >
          <div className="max-w-3xl w-full">
            <div className={`w-10 h-1 ${section.accent} rounded-full mb-6`} />
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
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            )}

            {section.links && (
              <div className="flex gap-4 mt-6">
                {section.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cs-panel px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
