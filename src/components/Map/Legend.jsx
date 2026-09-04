import { useState } from 'react'
import { IconLegend } from '../icons'
import { GRADES, CRITICAL_THRESHOLD } from '../../utils/gapStats'
import { getGapColor, LOW_DENSITY_COLOR } from '../../utils/colors'

const Overline = ({ children, className = '' }) => (
  <h3 className={`text-[11px] font-semibold tracking-[0.12em] uppercase text-faint ${className}`}>{children}</h3>
)

export default function Legend({ showHotspots, showPopDensity }) {
  const [open, setOpen] = useState(() => window.innerWidth >= 640)

  return (
    <div className="absolute bottom-20 left-4 z-[900]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="cs-panel p-2 cursor-pointer text-ink hover:bg-[#f3f2ef] transition-colors"
          aria-label="Show legend"
        >
          <IconLegend size={18} />
        </button>
      )}

      {open && (
        <div className="cs-panel p-4 panel-in w-[212px]">
          <div className="flex items-center justify-between mb-3">
            <Overline>Coverage gap</Overline>
            <button
              onClick={() => setOpen(false)}
              className="text-faint hover:text-ink transition-colors cursor-pointer -mr-1"
              aria-label="Collapse legend"
            >
              <IconLegend size={14} />
            </button>
          </div>

          {/* Grade scale: five bands, each drawn in the ramp colour at its midpoint */}
          <div className="grid grid-cols-5 gap-px">
            {GRADES.map((g, i) => {
              const lo = i === 0 ? 0 : GRADES[i - 1].max
              return (
                <div key={g.letter} className="flex flex-col items-center gap-1">
                  <div className="w-full h-3" style={{ backgroundColor: getGapColor((lo + g.max) / 2) }} />
                  <span className="num text-[11px] font-semibold text-ink">{g.letter}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-[10px] text-faint mt-0.5">
            <span>Well covered</span>
            <span>Underserved</span>
          </div>
          <p className="text-[11px] text-faint mt-2.5 leading-snug">
            Fewer transit trips per resident, larger gap. Score ≥ {CRITICAL_THRESHOLD} counts as critical.
          </p>
          <div className="flex items-center gap-2 mt-2.5">
            <div className="w-4 h-3" style={{ backgroundColor: LOW_DENSITY_COLOR }} />
            <span className="text-[11px] text-faint">Low density, ungraded</span>
          </div>

          {showHotspots && (
            <>
              <Overline className="mt-4 mb-2">Hotspots</Overline>
              <div
                className="h-3"
                style={{ background: 'linear-gradient(to right, #1e1b4b, #7c3aed, #f59e0b, #f97316, #ef4444, #fef08a)' }}
              />
              <p className="text-[11px] text-faint mt-1.5 leading-snug">
                Where high-gap areas cluster together, weighted by residents.
              </p>
            </>
          )}

          {showPopDensity && (
            <>
              <Overline className="mt-4 mb-2">Population density</Overline>
              <div
                className="h-3"
                style={{ background: 'linear-gradient(to right, #eff6ff, #93c5fd, #3b82f6, #1d4ed8, #1e3a8a, #312e81)' }}
              />
              <p className="text-[11px] text-faint mt-1.5">Residents per km²</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
