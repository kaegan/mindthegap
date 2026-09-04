import { useState } from 'react'
import { capture } from '../../lib/analytics'
import { IconX, IconChevron, IconStop } from '../icons'
import { getGrade, getPercentile, gapPercentileLabel, servicePercentileLabel } from '../../utils/gapStats'
import { useLocationName } from '../../hooks/useLocationName'

function GradeCircle({ grade }) {
  return (
    <div
      className="num w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
      style={{ backgroundColor: grade.color + '22', color: grade.textColor, border: `2px solid ${grade.color}` }}
    >
      {grade.letter}
    </div>
  )
}

function Row({ label, value, sub }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 border-b border-rule last:border-0">
      <dt className="text-xs text-faint">{label}</dt>
      <dd className="text-right">
        <span className="num text-sm font-semibold text-ink">{value}</span>
        {sub && <span className="block text-[11px] text-faint">{sub}</span>}
      </dd>
    </div>
  )
}

function ComparisonBar({ gapScore, avgGapScore }) {
  const pct = Math.min(gapScore, 1) * 100
  const avgPct = Math.min(avgGapScore, 1) * 100

  return (
    <div className="mt-4">
      <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-faint mb-3">This area vs Metro average</div>

      <div className="relative h-5 mb-0.5">
        <div className="absolute flex flex-col items-center" style={{ left: `${pct}%`, bottom: 0, transform: 'translateX(-50%)' }}>
          <span className="num text-[11px] font-semibold text-ink leading-none whitespace-nowrap">{gapScore.toFixed(2)}</span>
          <div className="mt-0.5 w-0 h-0 border-l-4 border-r-4 border-t-[5px] border-l-transparent border-r-transparent border-t-ink" />
        </div>
      </div>

      <div className="h-2" style={{ background: 'linear-gradient(to right, #fef3c7, #fbbf24, #f59e0b, #ef4444, #dc2626)' }} />

      <div className="relative h-5 mt-0.5">
        <div className="absolute top-0 flex flex-col items-center" style={{ left: `${avgPct}%`, transform: 'translateX(-50%)' }}>
          <div className="w-px h-2 bg-ink" />
          <span className="num text-[10px] text-faint leading-none mt-1 whitespace-nowrap">avg {avgGapScore.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-faint">
        <span>Low gap</span>
        <span>High gap</span>
      </div>
    </div>
  )
}

function StopItem({ stop }) {
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-rule last:border-0">
      <IconStop size={14} className="text-transit mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-ink truncate">{stop.name}</div>
        <div className="num text-[11px] text-faint">{stop.distance_m} m away</div>
      </div>
      <div className="num text-[11px] text-faint whitespace-nowrap">{stop.trips_per_day} trips/day</div>
    </div>
  )
}

function MethodologySection({ tripsPerCapita, gapScore }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => { if (!open) capture('methodology_expanded'); setOpen(!open) }}
        aria-expanded={open}
        className="text-[11px] text-faint hover:text-ink transition-colors flex items-center gap-1"
      >
        <IconChevron size={12} className={`transition-transform ${open ? 'rotate-90' : ''}`} />
        How is this calculated?
      </button>
      {open && (
        <div className="mt-2 border border-rule rounded-[3px] p-3 text-[11px] text-graphite space-y-2">
          <div>Transit trips available per resident within a 600 m walk, percentile-ranked against every area above 400 residents/km².</div>
          <div className="cs-mono text-[10px] bg-paper rounded-[3px] p-2 text-ink">gap = (1 − trips_per_capita_percentile)²</div>
          <dl>
            <Row label="Trips / resident" value={(tripsPerCapita || 0).toFixed(1)} />
            <Row label="Gap score" value={(gapScore || 0).toFixed(2)} />
          </dl>
        </div>
      )}
    </div>
  )
}

export default function ReportCard({ feature, displayName, nearestStops, metroStats, onClose }) {
  const p = feature.properties
  const isLowDensity = p.low_density
  const grade = getGrade(p.gap_score || 0, isLowDensity)
  const gapPercentile = getPercentile(p.gap_score || 0, metroStats.gapScores)
  const transitPercentile = getPercentile(p.transit_score || 0, metroStats.transitScores)
  const geocoded = useLocationName(feature)
  // The explorer's name wins so the list and the card agree; the geocoded
  // name is a secondary line when it adds something.
  const title = displayName?.name || geocoded || p.name || 'Area'
  const subtitle = [displayName?.city, geocoded && geocoded !== title ? geocoded : null]
    .filter(Boolean).join(' · ')

  return (
    <div className="report-card panel-in absolute top-3 right-3 bottom-3 w-80 sm:right-14 max-sm:top-auto max-sm:left-3 max-sm:right-3 max-sm:bottom-3 max-sm:w-auto max-sm:max-h-[45vh] z-[901] cs-panel flex flex-col min-h-0">
      <div className="flex items-start justify-between p-4 pb-2 shrink-0">
        <div className="min-w-0">
          <h3 className="text-ink font-semibold text-base leading-tight">{title}</h3>
          <div className="text-[11px] text-faint mt-0.5 truncate">
            {subtitle || `DA ${p.dauid}`}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close report card"
          className="text-faint hover:text-ink transition-colors p-1 -mr-1 -mt-1 shrink-0"
        >
          <IconX size={18} />
        </button>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3 overflow-y-auto min-h-0">
        <div className="flex items-center gap-3">
          <GradeCircle grade={grade} />
          <div>
            {isLowDensity ? (
              <>
                <div className="text-ink font-semibold">Low density</div>
                <div className="text-xs text-faint">Under 400 residents/km², not graded</div>
              </>
            ) : (
              <>
                <div className="num text-ink font-semibold">{(p.gap_score || 0).toFixed(2)}</div>
                <div className="text-xs font-medium" style={{ color: grade.textColor }}>{grade.label}</div>
                <div className="text-[11px] text-faint">{gapPercentileLabel(gapPercentile)}</div>
              </>
            )}
          </div>
        </div>

        {!isLowDensity && <MethodologySection tripsPerCapita={p.trips_per_capita} gapScore={p.gap_score} />}

        <dl className="border-t border-rule">
          <Row label="Population" value={(p.population || 0).toLocaleString()} />
          <Row label="Density" value={`${(p.pop_density || 0).toLocaleString()} /km²`} />
          <Row
            label="Trips per resident"
            value={(p.trips_per_capita || 0).toFixed(1)}
            sub={isLowDensity ? null : servicePercentileLabel(transitPercentile)}
          />
          <Row label="Land area" value={`${(p.land_area_km2 || 0).toFixed(2)} km²`} />
        </dl>

        {!isLowDensity && <ComparisonBar gapScore={p.gap_score || 0} avgGapScore={metroStats.avgGapScore} />}

        {nearestStops.length > 0 && (
          <div className="mt-1">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-faint mb-1">Nearest stops</div>
            {nearestStops.map(stop => <StopItem key={stop.stop_id} stop={stop} />)}
          </div>
        )}
      </div>
    </div>
  )
}
