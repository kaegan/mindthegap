import { useState } from 'react'
import { IconXmarkFillDuo18 as X } from 'nucleo-ui-fill-duo-18'
import { IconBusFillDuo18 as Bus } from 'nucleo-ui-fill-duo-18'
import { IconPeopleFillDuo18 as People } from 'nucleo-ui-fill-duo-18'
import { IconGrid4x4FillDuo18 as Grid } from 'nucleo-ui-fill-duo-18'
import { IconRouteFillDuo18 as Route } from 'nucleo-ui-fill-duo-18'
import { IconCompassFillDuo18 as Compass } from 'nucleo-ui-fill-duo-18'
import { getGrade, getPercentile, getPercentileLabel } from '../../utils/gapStats'
import { useLocationName } from '../../hooks/useLocationName'

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

function StatBox({ label, value, sub, icon: Icon }) {
  return (
    <div className="cs-panel p-3">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
        {Icon && <Icon size={12} className="text-gray-400" />}
        {label}
      </div>
      <div className="text-gray-900 font-semibold text-sm">{value}</div>
      {sub && <div className="text-[11px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
  )
}

function ComparisonBar({ gapScore, avgGapScore }) {
  const pct = Math.min(gapScore, 1) * 100
  const avgPct = Math.min(avgGapScore, 1) * 100

  return (
    <div className="mt-5">
      <div className="text-xs text-gray-400 mb-3">Gap Score vs Metro Average</div>

      {/* Score marker above bar */}
      <div className="relative h-5 mb-0.5">
        <div
          className="absolute flex flex-col items-center"
          style={{ left: `${pct}%`, bottom: 0, transform: 'translateX(-50%)' }}
        >
          <span className="text-[11px] font-semibold text-gray-900 leading-none whitespace-nowrap">
            {gapScore.toFixed(2)}
          </span>
          <div className="mt-0.5" style={{
            width: 0, height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '5px solid #374151',
          }} />
        </div>
      </div>

      {/* Gradient bar */}
      <div className="relative">
        <div className="h-2 rounded-full" style={{
          background: 'linear-gradient(to right, #fef3c7, #fbbf24, #f59e0b, #ef4444, #dc2626)'
        }} />
      </div>

      {/* Average marker below bar */}
      <div className="relative h-5 mt-0.5">
        <div
          className="absolute top-0 flex flex-col items-center"
          style={{ left: `${avgPct}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-px h-2 bg-gray-500" />
          <span className="text-[10px] text-gray-500 leading-none mt-1 whitespace-nowrap">
            avg {avgGapScore.toFixed(2)}
          </span>
        </div>
      </div>
      {/* End labels */}
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>Low gap</span>
        <span>High gap</span>
      </div>
    </div>
  )
}

function StopItem({ stop }) {
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-gray-100 last:border-0">
      <Bus size={14} className="text-cyan-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-900 truncate">{stop.name}</div>
        <div className="text-[11px] text-gray-500">{stop.distance_m}m away</div>
      </div>
      <div className="text-[11px] text-cyan-400/80 whitespace-nowrap">{stop.trips_per_day} trips/day</div>
    </div>
  )
}

function MethodologySection({ popPressure, transitScore, gapScore }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
      >
        <span className="transition-transform inline-block" style={{ transform: open ? 'rotate(90deg)' : 'none' }}>
          &#9656;
        </span>
        How is this calculated?
      </button>
      {open && (
        <div className="mt-2 cs-panel p-3 text-[11px] text-gray-600 space-y-2">
          <div>
            The gap score measures how underserved an area is by transit relative to its population density.
          </div>
          <div className="font-mono text-[10px] bg-gray-50 rounded p-2 text-gray-700">
            gap = pop_pressure &times; (1 &minus; transit_access)
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Population pressure</span>
              <span className="font-medium">{(popPressure || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transit access</span>
              <span className="font-medium">{(transitScore || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-1 mt-1">
              <span className="text-gray-500">Gap score</span>
              <span className="font-semibold text-gray-900">{(gapScore || 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="text-gray-400 text-[10px]">
            Values are percentile-ranked across all areas in Metro Vancouver. A high gap score means many people live here but transit service is limited.
          </div>
        </div>
      )}
    </div>
  )
}

export default function ReportCard({ feature, nearestStops, metroStats, onClose }) {
  if (!feature) return null

  const p = feature.properties
  const grade = getGrade(p.gap_score || 0)
  const transitPercentile = getPercentile(p.transit_score || 0, metroStats.transitScores)
  const locationName = useLocationName(feature)

  return (
    <div className="report-card absolute top-3 right-3 bottom-3 w-80 max-sm:top-auto max-sm:left-3 max-sm:right-3 max-sm:bottom-3 max-sm:w-auto max-sm:max-h-[60vh] z-[1001] cs-panel overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div>
          <h3 className="text-gray-900 font-semibold text-base">
            {locationName || p.name || 'Area'}
          </h3>
          <div className="text-[11px] text-gray-400">DA {p.dauid}</div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors p-1 -mr-1 -mt-1"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        {/* Grade */}
        <div className="flex items-center gap-3">
          <GradeCircle grade={grade} />
          <div>
            <div className="text-gray-900 font-semibold">{(p.gap_score || 0).toFixed(2)}</div>
            <div className="text-xs font-medium" style={{ color: grade.textColor }}>{grade.label}</div>
          </div>
        </div>

        <MethodologySection
          popPressure={p.pop_pressure}
          transitScore={p.transit_score}
          gapScore={p.gap_score}
        />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <StatBox
            icon={People}
            label="Population"
            value={(p.population || 0).toLocaleString()}
            sub="residents"
          />
          <StatBox
            icon={Grid}
            label="Density"
            value={(p.pop_density || 0).toLocaleString()}
            sub="/km²"
          />
          <StatBox
            icon={Route}
            label="Transit Access"
            value={`${Math.round((p.transit_score || 0) * 100)}%`}
            sub={getPercentileLabel(transitPercentile)}
          />
          <StatBox
            icon={Compass}
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
