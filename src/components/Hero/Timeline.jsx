import useInView from '../../hooks/useInView'

// Beck-style transit line: a thick ink rail with ringed station nodes,
// terminating in a blue "you are here" station. Draws in once on scroll;
// vertical below `sm` so labels keep a readable size.
export default function Timeline({ steps }) {
  const [ref, inView] = useInView(0.4)

  return (
    <div ref={ref} className={`mt-12 pb-2 ${inView ? 'tl-in' : ''}`}>
      <div className="relative">
        {/* The rail — between the first and last node centres */}
        <div
          className="tl-rail absolute bg-ink rounded-full
                     max-sm:left-[13px] max-sm:top-4 max-sm:bottom-4 max-sm:w-1.5
                     sm:left-[10%] sm:right-[10%] sm:top-[13px] sm:h-1.5"
          aria-hidden="true"
        />

        <ol className="relative flex flex-col gap-6 sm:flex-row sm:justify-between sm:gap-0">
          {steps.map((step, i) => (
            <li
              key={step.label}
              className="flex-1 flex items-center gap-4 sm:flex-col sm:items-center sm:text-center sm:px-1 min-w-0"
            >
              <span className="tl-node shrink-0 sm:mb-4" style={{ '--i': i }}>
                {step.highlight ? (
                  <span className="block w-8 h-8 rounded-full bg-transit border-[6px] border-transit">
                    <span className="block w-full h-full rounded-full bg-white scale-[0.55]" />
                  </span>
                ) : (
                  <span className="block w-8 h-8 rounded-full bg-white border-[6px] border-ink" />
                )}
              </span>
              <span>
                <span className="block text-[15px] sm:text-base font-bold text-ink leading-tight">
                  {step.label}
                </span>
                <span className={`block text-[12px] sm:text-[13px] mt-0.5 sm:mt-1 leading-snug ${step.highlight ? 'text-transit font-semibold' : 'text-faint'}`}>
                  {step.sub}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
