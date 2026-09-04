import { capture } from '../../lib/analytics'
import StationTag from './StationTag'

export default function Section({ section, showDivider }) {
  return (
    <div>
      {showDivider && <div className="h-px bg-rule" />}

      <section
        id={section.id}
        className={`relative ${section.bg}`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            {section.tag && <StationTag label={section.tag} className="mb-5" />}

            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6 tracking-tight font-heading">
              {section.headline}
            </h2>

            {section.body && (
              (Array.isArray(section.body) ? section.body : [section.body]).map((paragraph, i) => (
                <p key={i} className={`text-lg text-graphite leading-relaxed${i > 0 ? ' mt-4' : ''}`}>
                  {paragraph}
                </p>
              ))
            )}

            {section.links && (
              <div className="flex flex-wrap gap-3 mt-8">
                {section.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target={link.url.startsWith('mailto:') ? undefined : '_blank'}
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
        </div>
      </section>
    </div>
  )
}
