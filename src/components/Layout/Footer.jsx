import logoSvg from '../../assets/mindthegap-logo.svg'

const link = 'text-graphite hover:text-transit transition-colors'

export default function Footer() {
  return (
    <footer className="bg-paper border-t-2 border-ink">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-sm">
        <div className="flex flex-col gap-3">
          <img src={logoSvg} alt="MindTheGap" className="h-[26px] w-auto self-start" />
          <p className="cs-mono text-[12px] text-faint">
            Data:{' '}
            <a href="https://www.translink.ca/about-us/doing-business-with-translink/app-developer-resources" className="underline hover:text-transit transition-colors" target="_blank" rel="noopener noreferrer">TransLink GTFS</a>
            {' · '}
            <a href="https://www.statcan.gc.ca" className="underline hover:text-transit transition-colors" target="_blank" rel="noopener noreferrer">Statistics Canada 2021</a>
            {' · '}CC BY 4.0
          </p>
        </div>
        <div className="flex gap-5">
          <a href="https://github.com/kaegan/mindthegap" target="_blank" rel="noopener noreferrer" className={link}>GitHub</a>
          <a href="mailto:hello@mindthegap.fyi" className={link}>Email</a>
          <a href="https://www.linkedin.com/in/kaegandonnelly" target="_blank" rel="noopener noreferrer" className={link}>LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
