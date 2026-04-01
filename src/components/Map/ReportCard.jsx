import { IconXmarkOutline18 } from 'nucleo-ui-outline-18'
import { IconBusOutline24 } from 'nucleo-core-outline-24'
import { getGrade, getPercentile, getPercentileLabel } from '../../utils/gapStats'
import { getGapColor } from '../../utils/colors'

function GradeCircle({ grade }) {
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
      style={{ backgroundColor: grade.color + '22', color: grade.color, border: `2px solid ${grade.color}` }}
    >
      {grade.letter}
    </div>
  )
}

function StatBox({ label, value, sub }) {
  return (
    <div className="cs-panel p-3">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-gray-900 font-semibold text-sm">{value}</div>
      {sub && <div className="text-[11px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
  )
}

function ComparisonBar({ gapScore, avgGapScore }) {
  const pct = Math.min(gapScore, 1) * 100
  const avgPct = Math.min(avgGapScore, 1) * 100

  return (
    <div className="mt-4">
      <div className="text-xs text-gray-400 mb-2">Gap Score vs Metro Average</div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{
        background: `linear-gradient(to right, #fef3c7, #f59e0b, #dc2626)`
      }}>
        {/* Metro average marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-800/80"
          style={{ left: `${avgPct}%` }}
        />
        {/* This area marker */}
        <div
          className="absolute -top-1 w-0 h-0"
          style={{
            left: `${pct}%`,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '6px solid #111827',
            transform: 'translateX(-5px)',
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        <span>Low gap</span>
        <span>High gap</span>
      </div>
      <div className="flex gap-4 mt-1.5 text-[11px]">
        <span className="text-gray-600">▲ This area: {gapScore.toFixed(2)}</span>
        <span className="text-gray-500">│ Avg: {avgGapScore.toFixed(2)}</span>
      </div>
    </div>
  )
}

function StopItem({ stop }) {
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-gray-100 last:border-0">
      <IconBusOutline24 size={14} className="text-cyan-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-900 truncate">{stop.name}</div>
        <div className="text-[11px] text-gray-500">{stop.distance_m}m away</div>
      </div>
      <div className="text-[11px] text-cyan-400/80 whitespace-nowrap">{stop.trips_per_day} trips/day</div>
    </div>
  )
}

export default function ReportCard({ feature, nearestStops, metroStats, onClose }) {
  if (!feature) return null

  const p = feature.properties
  const grade = getGrade(p.gap_score || 0)
  const gapPercentile = getPercentile(p.gap_score || 0, metroStats.gapScores)
  const transitPercentile = getPercentile(p.transit_score || 0, metroStats.transitScores)

  return (
    <div className="report-card absolute top-3 right-3 bottom-3 w-80 max-sm:top-auto max-sm:left-3 max-sm:right-3 max-sm:bottom-3 max-sm:w-auto max-sm:max-h-[60vh] z-[1001] cs-panel overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div>
          <h3 className="text-gray-900 font-semibold text-base">{p.name || 'Area'}</h3>
          <div className="text-xs text-gray-500">{p.dauid}</div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors p-1 -mr-1 -mt-1"
        >
          <IconXmarkOutline18 size={18} />
        </button>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        {/* Grade */}
        <div className="flex items-center gap-3">
          <GradeCircle grade={grade} />
          <div>
            <div className="text-gray-900 font-semibold">{(p.gap_score || 0).toFixed(2)}</div>
            <div className="text-xs" style={{ color: grade.color }}>{grade.label}</div>
            <div className="text-[11px] text-gray-500">{getPercentileLabel(gapPercentile)} in Metro Vancouver</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <StatBox
            label="Population"
            value={(p.population || 0).toLocaleString()}
            sub="residents"
          />
          <StatBox
            label="Density"
            value={(p.pop_density || 0).toLocaleString()}
            sub="/km²"
          />
          <StatBox
            label="Transit Access"
            value={`${Math.round((p.transit_score || 0) * 100)}%`}
            sub={getPercentileLabel(transitPercentile)}
          />
          <StatBox
            label="Land Area"
            value={`${(p.land_area_km2 || 0).toFixed(2)}`}
            sub="km²"
          />
        </div>

        {/* Comparison bar */}
        <ComparisonBar gapScore={p.gap_score || 0} avgGapScore={metroStats.avgGapScore} />

        {/* Nearest stops */}
        {nearestStops.length > 0 && (
          <div className="mt-1">
            <div className="text-xs text-gray-400 mb-2 font-medium">Nearest Transit Stops</div>
            <div className="cs-panel p-2">
              {nearestStops.map(stop => (
                <StopItem key={stop.stop_id} stop={stop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
