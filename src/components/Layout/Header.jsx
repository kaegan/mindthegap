import { useState } from 'react'
import { capture } from '../../lib/analytics'
import logoSvg from '../../assets/mindthegap-logo.svg'
const Menu = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
)
const X = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)

const navLinks = [
  { label: 'Map', href: '/#map' },
  { label: "How it's built", href: '/#how-its-built' },
  { label: 'About', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
]

const SOURCE_URL = 'https://github.com/kaegan/mindthegap'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-b-2 border-ink">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 sm:px-8 py-3.5">
        {/* Name-plate logo */}
        <a href="/" className="flex items-center" aria-label="Mind the Gap">
          <img src={logoSvg} alt="MindTheGap" className="h-[30px] w-auto block" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => capture('nav_clicked', { label: link.label, href: link.href })}
              className="text-ink hover:text-transit transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => capture('nav_clicked', { label: 'View source', href: SOURCE_URL })}
            className="inline-flex items-center gap-2 bg-ink text-white font-semibold px-4 py-2.5 rounded-[3px] hover:bg-transit transition-colors whitespace-nowrap"
          >
            View source <span aria-hidden="true">&#8594;</span>
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-ink hover:text-transit transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden bg-white border-t-2 border-ink px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink hover:text-transit transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-ink text-white text-sm font-semibold px-4 py-2.5 rounded-[3px] hover:bg-transit transition-colors text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            View source <span aria-hidden="true">&#8594;</span>
          </a>
        </nav>
      )}
    </header>
  )
}
