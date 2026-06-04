export default function Legend({ showHotspots, showRisk }) {
  if (!showHotspots && !showRisk) return null

  return (
    <div className="absolute bottom-20 left-4 z-[1000] cs-panel p-4">
      {showRisk && (
        <>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-heading">
            Safety Risk
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
            5 years of ICBC crashes per signal, weighted by injury severity. Bigger
            dot = more crashes.
          </p>
        </>
      )}

      {showHotspots && (
        <>
          <h3 className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-heading${showRisk ? ' mt-4' : ''}`}>
            Top 25 Hotspots
          </h3>
          <div className="flex items-center gap-2">
            {[1, 10, 25].map((rank) => {
              const size = Math.round(30 - (rank - 1) * (10 / 24))
              const color = rank <= 5 ? '#dc2626' : rank <= 15 ? '#ef4444' : '#f97316'
              return (
                <div key={rank} className="flex flex-col items-center gap-1">
                  <div
                    style={{
                      width: size, height: size, background: color,
                      borderRadius: '50%', border: '2px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 9,
                    }}
                  >
                    {rank}
                  </div>
                  <span className="text-[10px] text-gray-500">#{rank}</span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-500 mt-1.5 max-w-[180px]">
            Click any badge to open the intersection report.
          </p>
        </>
      )}
    </div>
  )
}
