// Two-tone station plate: red dot segment joined to a dark label segment.
export default function StationTag({ label, className = '' }) {
  return (
    <div className={`inline-flex items-stretch w-max rounded-[3px] overflow-hidden ${className}`}>
      <span className="flex items-center bg-transit px-2.5">
        <span className="w-[7px] h-[7px] rounded-full bg-white" />
      </span>
      <span className="flex items-center bg-ink text-white text-[11px] font-semibold tracking-[0.12em] uppercase px-3 py-1.5">
        {label}
      </span>
    </div>
  )
}
