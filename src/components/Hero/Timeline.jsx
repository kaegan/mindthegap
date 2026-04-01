export default function Timeline({ steps }) {
  return (
    <div className="mt-10 pb-2">
      <div className="relative">
        <div className="absolute top-[7px] left-[10%] right-[10%] h-0.5 bg-gray-200 rounded-full" />

        <div className="flex items-start justify-between w-full">
          {steps.map((step) => (
            <div key={step.label} className="flex flex-col items-center flex-1 min-w-0">
              <div className="relative z-10">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 ${
                    step.highlight
                      ? 'bg-violet-500 border-violet-400'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              <div className="mt-3 text-center px-1">
                <div className={`text-sm font-semibold ${step.highlight ? 'text-gray-900' : 'text-gray-700'}`}>
                  {step.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 leading-snug">{step.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
