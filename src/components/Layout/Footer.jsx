export default function Footer() {
  return (
    <footer className="bg-gray-950">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="py-12 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <img src="/mindthegap-logo.svg" alt="Mind the Gap" className="h-8 opacity-60" />
            <p className="text-sm gradient-text font-medium">
              Mapping where Metro Vancouver's transit falls short.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2 text-sm text-gray-500">
            <div className="flex gap-4">
              <a href="mailto:hello@mindthegap.fyi" className="text-gray-400 hover:text-white transition-colors">Email</a>
              <a href="https://www.linkedin.com/in/kaegandonnelly" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
            </div>
            <p>
              Data from{' '}
              <a href="https://www.translink.ca" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">TransLink</a>
              {' & '}
              <a href="https://www.statcan.gc.ca" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Statistics Canada</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
