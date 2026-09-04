// The one overline style used everywhere: a small ink square and tracked caps.
export default function StationTag({ label, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="w-1.5 h-1.5 bg-ink shrink-0" aria-hidden="true" />
      <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-faint">
        {label}
      </span>
    </div>
  )
}
