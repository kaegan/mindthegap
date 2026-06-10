import { useState } from 'react'
import { Link } from 'react-router-dom'
import posthog from 'posthog-js'
const Menu = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
)
const X = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)
import logoSvg from '../../assets/mindthegap-logo.svg'

const navLinks = [
  { label: 'Map', href: '/#map' },
  { label: 'About', href: '/#origin' },
  { label: 'Experience', href: '/#track-record' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logoSvg}
            alt="Mind the Gap"
            className="h-10 sm:h-14"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => posthog.capture('nav_clicked', { label: link.label, href: link.href })}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contact"
            onClick={() => posthog.capture('nav_clicked', { label: 'Get in touch', href: '/#contact' })}
            className="text-sm font-medium text-text-secondary border border-border-strong hover:border-border-strong hover:bg-surface-warm px-4 py-2 rounded-lg transition-colors"
          >
            Get in touch
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-text-primary hover:text-text-primary/70"
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
        <nav className="sm:hidden bg-surface border-t border-border px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contact"
            className="text-sm font-medium text-text-secondary border border-border-strong hover:border-border-strong px-4 py-2 rounded-lg transition-colors text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Get in touch
          </a>
        </nav>
      )}
    </header>
  )
}
