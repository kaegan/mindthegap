import { IconMapPinFillDuo18 as MapPin } from 'nucleo-ui-fill-duo-18'
import { IconHotspotFillDuo18 as Hotspot } from 'nucleo-ui-fill-duo-18'
import { IconTrainFillDuo18 as Train } from 'nucleo-ui-fill-duo-18'
import { IconShipFillDuo18 as Ship } from 'nucleo-ui-fill-duo-18'
import { IconBusFillDuo18 as Bus } from 'nucleo-ui-fill-duo-18'

export default function LayerToggle({
  showGaps, setShowGaps,
  showHotspots, setShowHotspots,
  showBus, setShowBus,
  showSkyTrain, setShowSkyTrain,
  showSeaBus, setShowSeaBus,
  showWCE, setShowWCE,
}) {
  return (
    <div className="absolute top-20 right-4 z-[1000] cs-panel p-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 font-heading">
        Layers
      </h3>
      <label className="flex items-center gap-2 cursor-pointer mb-2">
        <input
          type="checkbox"
          checked={showGaps}
          onChange={(e) => setShowGaps(e.target.checked)}
          className="rounded accent-orange-500"
        />
        <span className="flex items-center gap-1.5 text-sm text-gray-700">
          <MapPin size={14} style={{ color: '#f97316' }} />
          Coverage Gaps
        </span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer mb-3">
        <input
          type="checkbox"
          checked={showHotspots}
          onChange={(e) => setShowHotspots(e.target.checked)}
          className="rounded accent-violet-500"
        />
        <span className="flex items-center gap-1.5 text-sm text-gray-700">
          <Hotspot size={14} style={{ color: '#8b5cf6' }} />
          Hotspots
        </span>
      </label>

      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 font-heading">
        Transit
      </h3>
      <label className="flex items-center gap-2 cursor-pointer mb-2">
        <input
          type="checkbox"
          checked={showSkyTrain}
          onChange={(e) => setShowSkyTrain(e.target.checked)}
          className="rounded accent-cyan-400"
        />
        <span className="flex items-center gap-1.5 text-sm text-gray-700">
          <Train size={14} style={{ color: '#22d3ee' }} />
          SkyTrain
        </span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer mb-2">
        <input
          type="checkbox"
          checked={showSeaBus}
          onChange={(e) => setShowSeaBus(e.target.checked)}
          className="rounded accent-violet-400"
        />
        <span className="flex items-center gap-1.5 text-sm text-gray-700">
          <Ship size={14} style={{ color: '#a78bfa' }} />
          SeaBus
        </span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer mb-2">
        <input
          type="checkbox"
          checked={showWCE}
          onChange={(e) => setShowWCE(e.target.checked)}
          className="rounded accent-purple-400"
        />
        <span className="flex items-center gap-1.5 text-sm text-gray-700">
          <Train size={14} style={{ color: '#c084fc' }} />
          West Coast Express
        </span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showBus}
          onChange={(e) => setShowBus(e.target.checked)}
          className="rounded accent-blue-400"
        />
        <span className="flex items-center gap-1.5 text-sm text-gray-700">
          <Bus size={14} style={{ color: '#60a5fa' }} />
          Bus Routes
        </span>
      </label>
    </div>
  )
}
