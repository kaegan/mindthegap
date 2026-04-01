export default function LogoMarquee({ logos }) {
  const doubled = [...logos, ...logos]
  return (
    <div
      className="mt-8 overflow-hidden"
      style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
    >
      <div className="animate-marquee gap-14">
        {doubled.map((logo, i) =>
          logo.src ? (
            <img key={i} src={logo.src} alt={logo.name} className="h-6 sm:h-7 opacity-50 hover:opacity-80 transition-opacity shrink-0" />
          ) : (
            <span key={i} className="text-base font-bold text-gray-400 hover:text-gray-600 transition-colors shrink-0 tracking-tight">
              {logo.name}
            </span>
          )
        )}
      </div>
    </div>
  )
}
