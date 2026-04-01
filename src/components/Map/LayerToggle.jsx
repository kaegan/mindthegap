export default function LayerToggle({ showGaps, setShowGaps, showRoutes, setShowRoutes }) {
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
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showRoutes}
          onChange={(e) => setShowRoutes(e.target.checked)}
          className="rounded accent-blue-400"
        />
        <span className="text-sm text-gray-200">Transit Routes</span>
      </label>
    </div>
  )
}
