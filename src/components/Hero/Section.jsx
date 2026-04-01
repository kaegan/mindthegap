import StatCard from './StatCard'
import Timeline from './Timeline'
import LogoMarquee from './LogoMarquee'
import TechLogos from './TechLogos'
import YouTubeEmbed from './YouTubeEmbed'
import { linkIcons } from './linkIcons'

function HighlightedHeadline({ text, accentWord }) {
  if (!accentWord) return text
  const idx = text.toLowerCase().indexOf(accentWord.toLowerCase())
  if (idx === -1) return text
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + accentWord.length)
  const after = text.slice(idx + accentWord.length)
  return <>{before}<span className="text-violet-600">{match}</span>{after}</>
}

export default function Section({ section, showDivider }) {
  return (
    <div>
      {showDivider && (
        <div className="h-px bg-gray-200" />
      )}

      <section
        id={section.id}
        className={`relative px-6 sm:px-12 py-20 sm:py-28 ${section.bg}`}
      >
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-1 bg-violet-500 rounded-full mb-6" />

          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tighter font-heading">
            <HighlightedHeadline text={section.headline} accentWord={section.accentWord} />
          </h2>

          {section.body && (
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              {section.body}
            </p>
          )}

          {section.pullQuote && (
            <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-2xl">
              {section.pullQuote}
            </p>
          )}

          {section.timeline && <Timeline steps={section.timeline} />}

          {section.stats && (
            <div className="flex flex-wrap gap-4 mt-2">
              {section.stats.map((stat) => (
                <StatCard key={stat.label} {...stat} visible={true} />
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
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${link.primary
                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                    : 'border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
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
}
