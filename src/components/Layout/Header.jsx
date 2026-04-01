import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import logoSvg from '../../assets/mindthegap-logo.svg'

const navLinks = [
  { label: 'Map', href: '#map' },
  { label: 'About', href: '#origin' },
  { label: 'Experience', href: '#track-record' },
  { label: 'FAQ', href: '#faq' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img
            src={logoSvg}
            alt="Mind the Gap"
            className="h-10 sm:h-14"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-black hover:text-black/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-medium text-black border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
          >
            Get in touch
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-black hover:text-black/70"
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
        <nav className="sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-black hover:text-black/70 transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-medium text-black border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Get in touch
          </a>
        </nav>
      )}
    </header>
  )
}
