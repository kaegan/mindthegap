import { useState } from 'react'
import { IconMapPinFillDuo18 as MapPin } from 'nucleo-ui-fill-duo-18'

export default function Legend({ showHotspots }) {
  const [open, setOpen] = useState(() => window.innerWidth >= 640)

  return (
    <div className="absolute bottom-20 left-4 z-[900]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="cs-panel p-2 cursor-pointer hover:bg-white/90 transition-colors"
          aria-label="Show coverage gap legend"
        >
          <MapPin size={20} style={{ color: '#f97316' }} />
        </button>
      )}

      {open && (
        <div className="cs-panel p-4 animate-[legend-panel-in_150ms_ease-out]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-400 tracking-wider font-heading">
              Coverage Gap
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer -mr-1"
              aria-label="Collapse legend"
            >
              <MapPin size={16} style={{ color: 'currentColor' }} />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Low</span>
            <div className="flex h-3 rounded overflow-hidden">
              {['#fef3c7', '#fde68a', '#fbbf24', '#f59e0b', '#f97316', '#ef4444', '#dc2626'].map(
                (color) => (
                  <div key={color} className="w-5 h-full" style={{ backgroundColor: color }} />
                )
              )}
            </div>
            <span className="text-xs text-gray-500">High</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 max-w-[180px]">
            Fewer transit trips per resident = larger coverage gap
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: '#d1d5db' }} />
            <span className="text-xs text-gray-500">Low density (ungraded)</span>
          </div>

          {showHotspots && (
            <>
              <h3 className="text-xs font-semibold text-gray-400 tracking-wider mt-4 mb-2">
                Hotspot Clusters
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Low</span>
                <div
                  className="h-3 w-[140px] rounded"
                  style={{
                    background: 'linear-gradient(to right, #1e1b4b, #7c3aed, #f59e0b, #f97316, #ef4444, #fef08a)',
                  }}
                />
                <span className="text-xs text-gray-500">High</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
