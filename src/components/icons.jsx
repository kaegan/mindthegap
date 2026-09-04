// Single-weight line icons, drawn in currentColor. One set for the whole site
// so the map chrome and the page chrome read as the same product.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const make = (paths) => ({ size = 16, className = '' }) => (
  <svg {...base} width={size} height={size} className={className}>{paths}</svg>
)

export const IconX = make(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>)
export const IconPlus = make(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>)
export const IconMenu = make(<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)
export const IconLayers = make(<><path d="M12 3 2 8l10 5 10-5-10-5Z" /><path d="m2 13 10 5 10-5" /></>)
export const IconLegend = make(<><rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" /></>)
export const IconList = make(<><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="5" cy="6" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="18" r="1" fill="currentColor" /></>)
export const IconChevron = make(<path d="m9 6 6 6-6 6" />)
export const IconStop = make(<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" /></>)
