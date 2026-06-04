import { useMemo, useRef, useCallback } from 'react'
import { IconRankingFillDuo18 as Ranking } from 'nucleo-ui-fill-duo-18'
import { IconPeopleFillDuo18 as People } from 'nucleo-ui-fill-duo-18'
import { IconXmarkFillDuo18 as X } from 'nucleo-ui-fill-duo-18'
import { IconFireFlameFillDuo18 as Flame } from 'nucleo-ui-fill-duo-18'
import { getGrade } from '../../utils/gapStats'
import { getGapColor } from '../../utils/colors'
import { computeAreaNames } from '../../utils/areaNames'

function MiniGrade({ score }) {
  const grade = getGrade(score)
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0"
      style={{ backgroundColor: grade.color + '22', color: grade.color, border: `1.5px solid ${grade.color}` }}
    >
      {grade.letter}
    </span>
  )
}

export default function GapExplorer({ gapData, stopsData, onSelectDA, selectedDAUID, onClose }) {
  const listRef = useRef(null)

  const rankedGaps = useMemo(() => {
    if (!gapData) return []
    return gapData.features
      .filter(f => (f.properties.gap_score || 0) >= 0.6)
      .map(f => ({
        feature: f,
        dauid: f.properties.dauid,
        gapScore: f.properties.gap_score || 0,
        population: f.properties.population || 0,
        popDensity: f.properties.pop_density || 0,
        transitScore: f.properties.transit_score || 0,
        impact: (f.properties.gap_score || 0) * (f.properties.population || 0),
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 25)
  }, [gapData])

  const areaNames = useMemo(
    () => computeAreaNames(rankedGaps.map(g => g.feature), stopsData),
    [rankedGaps, stopsData]
  )

  const totalAffected = useMemo(
    () => rankedGaps.reduce((sum, g) => sum + g.population, 0),
    [rankedGaps]
  )

  const handleItemClick = useCallback((gap) => {
    onSelectDA(gap.feature)
  }, [onSelectDA])

  if (rankedGaps.length === 0) return null

  return (
    <div className="gap-explorer absolute top-4 left-4 bottom-20 w-72 max-sm:top-auto max-sm:left-3 max-sm:right-3 max-sm:bottom-16 max-sm:w-auto max-sm:max-h-[50vh] z-[1001] cs-panel flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 pb-2 border-b border-gray-200/60 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame size={16} style={{ color: '#dc2626' }} />
            <h3 className="text-sm font-semibold text-gray-900 font-heading">Critical Gaps</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-0.5 -mr-0.5 cursor-pointer"
            aria-label="Close explorer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Summary stats */}
        <div className="flex gap-3 text-[11px]">
          <div className="flex items-center gap-1 text-gray-500">
            <Ranking size={12} style={{ color: '#f97316' }} />
            <span><span className="font-semibold text-gray-700">{rankedGaps.length}</span> areas</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <People size={12} style={{ color: '#f97316' }} />
            <span><span className="font-semibold text-gray-700">{totalAffected.toLocaleString()}</span> residents</span>
          </div>
        </div>
      </div>

      {/* Ranked list */}
      <div ref={listRef} className="flex-1 overflow-y-auto min-h-0">
        {rankedGaps.map((gap, i) => {
          const isActive = gap.dauid === selectedDAUID
          const loc = areaNames[gap.dauid]
          const displayName = loc?.name || 'Area'
          const cityName = loc?.city
          return (
            <button
              key={gap.dauid}
              onClick={() => handleItemClick(gap)}
              className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer border-b border-gray-100 last:border-0 ${
                isActive ? 'bg-orange-50/80' : 'hover:bg-gray-50/80'
              }`}
            >
              <span className="text-[11px] font-semibold text-gray-400 w-5 text-right shrink-0">
                {i + 1}
              </span>
              <MiniGrade score={gap.gapScore} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 truncate">{displayName}</div>
                <div className="flex gap-2 text-[11px] text-gray-500">
                  {cityName && <span className="text-gray-400">{cityName}</span>}
                  <span>{gap.population.toLocaleString()} people</span>
                  <span style={{ color: getGapColor(gap.gapScore) }}>
                    {gap.gapScore.toFixed(2)}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
