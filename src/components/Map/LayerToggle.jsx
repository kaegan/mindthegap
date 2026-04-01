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
        <span className="text-sm text-gray-200">Coverage Gaps</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer mb-3">
        <input
          type="checkbox"
          checked={showHotspots}
          onChange={(e) => setShowHotspots(e.target.checked)}
          className="rounded accent-violet-500"
        />
        <span className="text-sm text-gray-200">Hotspots</span>
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
        <span className="flex items-center gap-1.5 text-sm text-gray-200">
          <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: '#22d3ee' }} />
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
        <span className="flex items-center gap-1.5 text-sm text-gray-200">
          <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: '#a78bfa' }} />
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
        <span className="flex items-center gap-1.5 text-sm text-gray-200">
          <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: '#c084fc' }} />
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
        <span className="flex items-center gap-1.5 text-sm text-gray-200">
          <span className="inline-block w-3 h-0.5 rounded" style={{ backgroundColor: '#60a5fa' }} />
          Bus Routes
        </span>
      </label>
    </div>
  )
}
