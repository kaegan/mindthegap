import { useState } from 'react'
import { IconMapPinFillDuo18 as MapPin } from 'nucleo-ui-fill-duo-18'
import { IconHotspotFillDuo18 as Hotspot } from 'nucleo-ui-fill-duo-18'
import { IconSirenFillDuo18 as Siren } from 'nucleo-ui-fill-duo-18'
import { IconPersonWalkingFillDuo18 as Walk } from 'nucleo-ui-fill-duo-18'
import { IconLayers3FillDuo18 as Layers } from 'nucleo-ui-fill-duo-18'

function Toggle({ checked, onChange, accent, icon: Icon, color, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer mb-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`rounded ${accent}`}
      />
      <span className="flex items-center gap-1.5 text-sm text-gray-700">
        {Icon && <Icon size={14} style={{ color }} />}
        {label}
      </span>
    </label>
  )
}

export default function LayerToggle({
  showRisk, setShowRisk,
  showHotspots, setShowHotspots,
  filterInjury, setFilterInjury,
  filterPed, setFilterPed,
}) {
  const [open, setOpen] = useState(() => window.innerWidth >= 640)

  return (
    <div className="absolute top-4 right-4 z-[1000]" data-panel="layers">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="cs-panel p-2 cursor-pointer hover:bg-white/90 transition-colors"
          aria-label="Show layers"
        >
          <Layers size={20} style={{ color: '#6b7280' }} />
        </button>
      )}

      {open && (
        <div className="cs-panel p-4 animate-[layer-panel-in_150ms_ease-out]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-heading">
              Layers
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer -mr-1"
              aria-label="Collapse layers"
            >
              <Layers size={16} style={{ color: 'currentColor' }} />
            </button>
          </div>

          <Toggle
            checked={showRisk} onChange={setShowRisk}
            accent="accent-orange-500" icon={MapPin} color="#f97316"
            label="Risk by intersection"
          />
          <Toggle
            checked={showHotspots} onChange={setShowHotspots}
            accent="accent-violet-500" icon={Hotspot} color="#8b5cf6"
            label="Risk hotspots"
          />

          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-3 font-heading">
            Highlight
          </h3>
          <Toggle
            checked={filterInjury} onChange={setFilterInjury}
            accent="accent-red-500" icon={Siren} color="#ef4444"
            label="High injury rate (≥33%)"
          />
          <Toggle
            checked={filterPed} onChange={setFilterPed}
            accent="accent-cyan-500" icon={Walk} color="#06b6d4"
            label="Pedestrian-actuated signals"
          />
        </div>
      )}
    </div>
  )
}
