export default function Legend() {
  return (
    <div className="absolute bottom-20 left-4 z-[1000] cs-panel p-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-heading">
        Coverage Gap
      </h3>
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
        High population density + low transit access = coverage gap
      </p>
    </div>
  )
}
