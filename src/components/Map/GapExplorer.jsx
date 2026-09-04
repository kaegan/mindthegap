import { useMemo, useCallback } from 'react'
import { IconX } from '../icons'
import { getGrade, CRITICAL_THRESHOLD, isCritical } from '../../utils/gapStats'
import { computeAreaNames } from '../../utils/areaNames'

function MiniGrade({ score }) {
  const grade = getGrade(score)
  return (
    <span
      className="num inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0"
      style={{ backgroundColor: grade.color + '22', color: grade.textColor, border: `1.5px solid ${grade.color}` }}
    >
      {grade.letter}
    </span>
  )
}

export default function GapExplorer({ gapData, stopsData, onSelectDA, onHoverDA, selectedDAUID, hoveredDAUID, onClose }) {
  const { ranked, criticalCount } = useMemo(() => {
    if (!gapData) return { ranked: [], criticalCount: 0 }
    const critical = gapData.features.filter(f => isCritical(f.properties))
    const ranked = critical
      .map(f => ({
        feature: f,
        dauid: f.properties.dauid,
        gapScore: f.properties.gap_score || 0,
        population: f.properties.population || 0,
        impact: (f.properties.gap_score || 0) * (f.properties.population || 0),
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 25)
    return { ranked, criticalCount: critical.length }
  }, [gapData])

  const areaNames = useMemo(
    () => computeAreaNames(ranked.map(g => g.feature), stopsData),
    [ranked, stopsData]
  )

  const handleItemClick = useCallback((gap) => {
    onSelectDA(gap.feature, areaNames[gap.dauid])
  }, [onSelectDA, areaNames])

  if (ranked.length === 0) return null

  return (
    <div className="gap-explorer panel-in absolute top-4 left-4 bottom-20 w-72 max-sm:top-auto max-sm:left-3 max-sm:right-3 max-sm:bottom-16 max-sm:w-auto max-sm:max-h-[50vh] z-[1001] cs-panel flex flex-col overflow-hidden">
      <div className="p-3 pb-2.5 border-b border-rule shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink font-heading">Worst gaps</h3>
          <button
            onClick={onClose}
            className="text-faint hover:text-ink transition-colors p-0.5 -mr-0.5 cursor-pointer"
            aria-label="Close list"
          >
            <IconX size={16} />
          </button>
        </div>
        <p className="text-[11px] text-faint mt-0.5">
          Top 25 by people affected, of <span className="num font-semibold text-ink">{criticalCount}</span> critical areas (score ≥ {CRITICAL_THRESHOLD})
        </p>
      </div>

      <ol className="flex-1 overflow-y-auto min-h-0">
        {ranked.map((gap, i) => {
          const isActive = gap.dauid === selectedDAUID
          const isHovered = gap.dauid === hoveredDAUID
          const loc = areaNames[gap.dauid]
          return (
            <li key={gap.dauid}>
              <button
                onClick={() => handleItemClick(gap)}
                onMouseEnter={() => onHoverDA?.(gap.dauid)}
                onMouseLeave={() => onHoverDA?.(null)}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer border-b border-rule last:border-0 ${
                  isActive ? 'bg-[#eef3fb]' : isHovered ? 'bg-[#f3f2ef]' : 'hover:bg-[#f3f2ef]'
                }`}
              >
                <span className="num text-[11px] font-semibold text-faint w-5 text-right shrink-0">{i + 1}</span>
                <MiniGrade score={gap.gapScore} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-ink truncate">{loc?.name || 'Area'}</div>
                  <div className="flex gap-2 text-[11px] text-faint num">
                    {loc?.city && <span>{loc.city}</span>}
                    <span>{gap.population.toLocaleString()} people</span>
                    <span>{gap.gapScore.toFixed(2)}</span>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
