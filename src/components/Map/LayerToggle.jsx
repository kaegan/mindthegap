import { capture } from '../../lib/analytics'
import { IconLayers, IconList } from '../icons'

const Overline = ({ children, className = '' }) => (
  <h3 className={`text-[11px] font-semibold tracking-[0.12em] uppercase text-faint ${className}`}>{children}</h3>
)

function Toggle({ checked, onChange, label, swatch }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-transit"
      />
      {swatch && <span className="w-3.5 h-1 shrink-0" style={{ backgroundColor: swatch }} aria-hidden="true" />}
      <span className="text-sm text-ink">{label}</span>
    </label>
  )
}

export default function LayerToggle({
  open, setOpen,
  showGaps, setShowGaps,
  showHotspots, setShowHotspots,
  showPopDensity, setShowPopDensity,
  showBus, setShowBus,
  showSkyTrain, setShowSkyTrain,
  showSeaBus, setShowSeaBus,
  showWCE, setShowWCE,
  showExplorer, setShowExplorer,
}) {
  const track = (layer, enabled) => capture('layer_toggled', { layer, enabled })
  const bind = (setter, name) => (v) => { setter(v); track(name, v) }

  return (
    <div className="absolute top-4 right-4 z-[900]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="cs-panel p-2 cursor-pointer text-ink hover:bg-[#f3f2ef] transition-colors"
          aria-label="Show layers"
        >
          <IconLayers size={18} />
        </button>
      )}

      {open && (
        <div className="cs-panel p-4 panel-in w-[212px]">
          <div className="flex items-center justify-between mb-2">
            <Overline>Layers</Overline>
            <button
              onClick={() => setOpen(false)}
              className="text-faint hover:text-ink transition-colors cursor-pointer -mr-1"
              aria-label="Collapse layers"
            >
              <IconLayers size={14} />
            </button>
          </div>

          <Toggle checked={showGaps} onChange={bind(setShowGaps, 'coverage_gaps')} label="Coverage gaps" />
          <Toggle checked={showHotspots} onChange={bind(setShowHotspots, 'hotspots')} label="Hotspots" />
          <Toggle checked={showPopDensity} onChange={bind(setShowPopDensity, 'pop_density')} label="Population density" />

          <button
            onClick={() => setShowExplorer(v => !v)}
            aria-pressed={showExplorer}
            className={`w-full flex items-center gap-2 px-3 py-2 mt-3 mb-4 rounded-[3px] text-sm font-semibold transition-colors cursor-pointer border ${
              showExplorer
                ? 'bg-ink text-white border-ink'
                : 'bg-white text-ink border-ink hover:bg-[#f3f2ef]'
            }`}
          >
            <IconList size={14} />
            Worst gaps
          </button>

          <Overline className="mb-1">Transit</Overline>
          <Toggle checked={showSkyTrain} onChange={bind(setShowSkyTrain, 'skytrain')} label="SkyTrain" swatch="#1e3a5f" />
          <Toggle checked={showSeaBus} onChange={bind(setShowSeaBus, 'seabus')} label="SeaBus" swatch="#2563eb" />
          <Toggle checked={showWCE} onChange={bind(setShowWCE, 'west_coast_express')} label="West Coast Express" swatch="#2563eb" />
          <Toggle checked={showBus} onChange={bind(setShowBus, 'bus_routes')} label="Bus routes" swatch="#93c5fd" />
        </div>
      )}
    </div>
  )
}
