export const sections = [
  {
    id: 'how-its-built',
    tag: 'Behind the build',
    headline: 'Real data, scored and mapped',
    body: [
      'I chose the data, defined the score, and decided what the map had to show. Claude Code wrote the code; I reviewed every PR.',
    ],
    timeline: [
      { label: 'GTFS feed', sub: 'TransLink stops & trips' },
      { label: 'Census join', sub: 'StatsCan 2021, by area' },
      { label: 'Gap scoring', sub: 'trips per capita, ranked' },
      { label: 'TopoJSON', sub: 'packaged for the browser' },
      { label: 'The map', sub: '3,590 areas, coloured', highlight: true },
    ],
    stack: ['React', 'Vite', 'Leaflet', 'Turf', 'Tailwind', 'Claude Code', 'Vercel'],
    bg: 'bg-white',
  },
]

// About-the-maker — rendered after the FAQ, just above the footer.
export const aboutSection = {
  id: 'about',
  headline: 'Who built this',
  body: "I'm Kaegan Donnelly, a product manager in Vancouver. Mind the Gap is a solo build: my problem, my data choices, my scoring method, shipped with Claude Code.",
  links: [
    { label: 'Email me', url: 'mailto:hello@mindthegap.fyi', primary: true },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/kaegandonnelly' },
  ],
  bg: 'bg-white',
}
