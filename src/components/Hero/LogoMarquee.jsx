export default function LogoMarquee({ logos }) {
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-4">
      {logos.map((logo) =>
        logo.src ? (
          <img key={logo.name} src={logo.src} alt={logo.name} className="h-6 sm:h-7 opacity-60" />
        ) : (
          <span key={logo.name} className="text-base font-semibold text-text-muted">
            {logo.name}
          </span>
        )
      )}
    </div>
  )
}
