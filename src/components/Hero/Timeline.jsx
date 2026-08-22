// Beck-style transit line: a thick ink rail with ringed station nodes,
// terminating in a red "you are here" station.
export default function Timeline({ steps }) {
  return (
    <div className="mt-12 pb-2">
      <div className="relative">
        {/* The line — aligned to the centres of the first and last nodes */}
        <div className="absolute left-[10%] right-[10%] top-[13px] h-1.5 bg-ink rounded-full" />

        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div key={step.label} className="flex-1 flex flex-col items-center text-center px-1 min-w-0">
              {step.highlight ? (
                <div className="w-[38px] h-[38px] -mt-[3px] mb-[13px] rounded-full bg-transit border-[6px] border-transit flex items-center justify-center">
                  <span className="w-[11px] h-[11px] rounded-full bg-white" />
                </div>
              ) : (
                <div className="w-8 h-8 mb-4 rounded-full bg-white border-[6px] border-ink" />
              )}
              <div className="text-[13px] sm:text-base font-bold text-ink leading-tight">
                {step.label}
              </div>
              <div className={`text-[11px] sm:text-[13px] mt-1 leading-snug ${step.highlight ? 'text-transit font-semibold' : 'text-faint'}`}>
                {step.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
