const tools = ['React', 'Vite', 'Tailwind', 'Leaflet', 'Turf', 'Claude Code', 'PostHog', 'Vercel']

export default function TechLogos() {
  return (
    <div className="flex flex-wrap items-center gap-3.5 mt-8">
      {tools.map((tool) => (
        <div key={tool} className="cs-panel px-5 py-3">
          <span className="text-[15px] font-medium text-ink">{tool}</span>
        </div>
      ))}
    </div>
  )
}
