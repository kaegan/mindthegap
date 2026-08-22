import { capture } from '../../lib/analytics'
import Timeline from './Timeline'
import TechLogos from './TechLogos'
import StationTag from './StationTag'

function HighlightedHeadline({ text, accentWord }) {
  if (!accentWord) return text
  const idx = text.toLowerCase().indexOf(accentWord.toLowerCase())
  if (idx === -1) return text
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + accentWord.length)
  const after = text.slice(idx + accentWord.length)
  return <>{before}<span className="text-transit">{match}</span>{after}</>
}

export default function Section({ section, showDivider }) {
  return (
    <div>
      {showDivider && (
        <div className="h-px bg-gray-200" />
      )}

      <section
        id={section.id}
        className={`relative px-6 sm:px-12 py-16 sm:py-24 ${section.bg}`}
      >
        <div className="max-w-3xl mx-auto">
          {section.tag && (
            <div className="mb-5">
              <StationTag label={section.tag} />
            </div>
          )}

          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6 tracking-tight font-heading">
            <HighlightedHeadline text={section.headline} accentWord={section.accentWord} />
          </h2>

          {section.body && (
            Array.isArray(section.body) ? (
              section.body.map((paragraph, i) => (
                <p key={i} className={`text-lg text-graphite leading-relaxed max-w-2xl${i > 0 ? ' mt-4' : ''}`}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-lg text-graphite leading-relaxed max-w-2xl">
                {section.body}
              </p>
            )
          )}

          {section.timeline && <Timeline steps={section.timeline} />}

          {section.techLogos && <TechLogos />}

          {section.links && (
            <div className="flex flex-wrap gap-4 mt-8">
              {section.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => capture('cta_clicked', { label: link.label, url: link.url })}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-[3px] text-sm font-semibold transition-colors ${link.primary
                    ? 'bg-ink hover:bg-transit text-white'
                    : 'border border-ink text-ink hover:bg-ink hover:text-white'
                  }`}
                >
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
