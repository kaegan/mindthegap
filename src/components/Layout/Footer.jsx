import logoSvg from '../../assets/mindthegap-logo.svg'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t-2 border-ink">
      <div className="py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <img src={logoSvg} alt="MindTheGap" className="h-[26px] w-auto" />
            <p className="text-sm text-graphite font-medium">
              Mapping where Metro Vancouver's transit falls short.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2 text-sm text-graphite">
            <div className="flex gap-4">
              <a href="https://github.com/kaegan/mindthegap" target="_blank" rel="noopener noreferrer" className="text-graphite hover:text-transit transition-colors">GitHub</a>
              <a href="mailto:hello@mindthegap.fyi" className="text-graphite hover:text-transit transition-colors">Email</a>
              <a href="https://www.linkedin.com/in/kaegandonnelly" target="_blank" rel="noopener noreferrer" className="text-graphite hover:text-transit transition-colors">LinkedIn</a>
            </div>
            <p>
              Data from{' '}
              <a href="https://www.statcan.gc.ca" className="text-graphite underline hover:text-transit transition-colors" target="_blank" rel="noopener noreferrer">Statistics Canada</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
