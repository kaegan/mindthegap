import { IconXmarkFillDuo18 as X } from 'nucleo-ui-fill-duo-18'
import { IconCollisionFillDuo18 as Crash } from 'nucleo-ui-fill-duo-18'
import { IconHeartPulseFillDuo18 as Pulse } from 'nucleo-ui-fill-duo-18'
import { IconShieldFillDuo18 as Shield } from 'nucleo-ui-fill-duo-18'
import { IconCircleSignalFillDuo18 as Signal } from 'nucleo-ui-fill-duo-18'
import { getGrade, getPercentile, getPercentileLabel } from '../../utils/gapStats'

function GradeCircle({ grade }) {
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
      style={{ backgroundColor: grade.color + '33', color: grade.color, border: `2.5px solid ${grade.color}` }}
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

function ComparisonBar({ riskScore, avgRiskScore }) {
  const pct = Math.min(riskScore, 1) * 100
  const avgPct = Math.min(avgRiskScore, 1) * 100
  const multiple = avgRiskScore > 0 ? (riskScore / avgRiskScore).toFixed(1) : '–'

  return (
    <div className="mt-4">
      <div className="text-xs text-gray-400 mb-2">Risk vs City Average</div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{
        background: `linear-gradient(to right, #fef3c7, #f59e0b, #dc2626)`
      }}>
        {/* City average line */}
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-800/80"
          style={{ left: `${avgPct}%` }}
        />
        {/* This intersection marker — clamped so it never clips at edges */}
        <div
          className="absolute -top-1 w-0 h-0"
          style={{
            left: `calc(${Math.min(Math.max(pct, 5), 95)}% - 5px)`,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '6px solid #111827',
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        <span>Low risk</span>
        <span>High risk</span>
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[11px]">
        <div className="flex gap-3">
          <span className="text-gray-600 flex items-center gap-1">
            <span className="inline-block w-0 h-0" style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #111827' }} />
            This: {riskScore.toFixed(2)}
          </span>
          <span className="text-gray-500">│ City avg: {avgRiskScore.toFixed(2)}</span>
        </div>
        <span className="font-semibold text-orange-600">{multiple}× avg</span>
      </div>
    </div>
  )
}

function CrashesByYear({ byYear }) {
  const years = Object.keys(byYear).sort()
  if (years.length === 0) return null
  const max = Math.max(...years.map(y => byYear[y]))
  const has2020 = years.includes('2020')
  return (
    <div className="mt-1">
      <div className="text-xs text-gray-400 mb-2 font-medium">Crashes by Year</div>
      <div className="cs-panel p-3 flex items-end justify-between gap-2 h-24">
        {years.map(y => (
          <div key={y} className="flex flex-col items-center gap-1 flex-1">
            <div className="text-[10px] text-gray-500">{byYear[y]}</div>
            <div
              className="w-full rounded-t"
              style={{ height: `${Math.max(4, (byYear[y] / max) * 56)}px`, backgroundColor: y === '2020' ? '#fdba74' : '#f97316' }}
            />
            <div className="text-[10px] text-gray-400">'{y.slice(2)}</div>
          </div>
        ))}
      </div>
      {has2020 && (
        <div className="text-[10px] text-gray-400 mt-1.5">* 2020 reflects reduced traffic during COVID-19</div>
      )}
    </div>
  )
}

export default function ReportCard({ feature, cityStats, onClose }) {
  if (!feature) return null

  const p = feature.properties
  const grade = getGrade(p.risk_score || 0)
  const riskPercentile = getPercentile(p.risk_score || 0, cityStats.riskScores)

  return (
    <div className="report-card absolute top-3 right-3 bottom-3 w-80 max-sm:top-auto max-sm:left-3 max-sm:right-3 max-sm:bottom-3 max-sm:w-auto max-sm:max-h-[60vh] z-[1001] cs-panel overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="min-w-0 pr-2">
          <h3 className="text-gray-900 font-semibold text-base leading-tight">{p.name}</h3>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Signal size={11} className="text-gray-400 shrink-0" />
            {p.signal_type}{p.neighbourhood ? ` · ${p.neighbourhood}` : ''}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors p-1 -mr-1 -mt-1 shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        {/* Grade */}
        <div className="flex items-center gap-3">
          <GradeCircle grade={grade} />
          <div>
            <div className="text-gray-900 font-semibold">{(p.risk_score || 0).toFixed(2)}</div>
            <div className="text-xs" style={{ color: grade.color }}>{grade.label}</div>
            <div className="text-[11px] text-gray-500">{getPercentileLabel(riskPercentile)} in Vancouver</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          <StatBox
            icon={Crash}
            label="Total crashes"
            value={(p.total_crashes || 0).toLocaleString()}
            sub="2016–2020"
          />
          <StatBox
            icon={Pulse}
            label="With injuries"
            value={(p.casualty_crashes || 0).toLocaleString()}
            sub="crashes with injuries"
          />
          <StatBox
            icon={Shield}
            label="Property only"
            value={(p.pdo_crashes || 0).toLocaleString()}
            sub="no injuries"
          />
          <StatBox
            icon={Pulse}
            label="Injury rate"
            value={`${p.casualty_rate || 0}%`}
            sub="of all crashes"
          />
        </div>

        {/* Comparison bar */}
        <ComparisonBar riskScore={p.risk_score || 0} avgRiskScore={cityStats.avgRiskScore} />

        {/* Crashes by year */}
        <CrashesByYear byYear={p.crashes_by_year || {}} />
      </div>
    </div>
  )
}
