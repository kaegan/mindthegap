import { Link } from 'react-router-dom'
import { IconEnvelopeFillDuo18 as Mail } from 'nucleo-ui-fill-duo-18'
import logoSvg from '../../assets/mindthegap-logo.svg'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <img src={logoSvg} alt="Mind the Gap" className="h-8 opacity-70" />
            <p className="text-sm text-gray-500 font-medium">
              Mapping where Metro Vancouver's transit falls short.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2 text-sm text-gray-500">
            <div className="flex gap-4">
              <a href="mailto:hello@mindthegap.fyi" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"><Mail className="w-4 h-4" />Email</a>
              <a href="https://www.linkedin.com/in/kaegandonnelly" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>LinkedIn</a>
            </div>
            <div>
              <Link to="/changelog" className="text-gray-500 hover:text-gray-900 transition-colors">What's New</Link>
            </div>
            <p>
              Data from{' '}
              <a href="https://www.statcan.gc.ca" className="text-gray-500 hover:text-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">Statistics Canada</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
