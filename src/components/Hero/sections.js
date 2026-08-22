export const sections = [
  {
    id: 'how-its-built',
    tag: 'Behind the build',
    headline: 'Real data, scored and mapped',
    accentWord: 'scored and mapped',
    body: [
      "Every dissemination area in Metro Vancouver gets a transit gap score, built from two public datasets: TransLink's GTFS feed for stop locations and trip frequency, and Statistics Canada's 2021 Census for population. A small pipeline joins the two, ranks each area by trips-per-capita within its density band, and packages the result as TopoJSON for the map above.",
      "I made the product calls — which data sources to use, how the score should work, what the map needed to show. Claude Code did the implementation, with me reviewing every change along the way.",
    ],
    timeline: [
      { label: 'GTFS feed', sub: 'TransLink stops & trips' },
      { label: 'Census join', sub: 'StatsCan 2021, by area' },
      { label: 'Gap scoring', sub: 'trips per capita, ranked' },
      { label: 'TopoJSON', sub: 'packaged for the map' },
      { label: 'This map', sub: "what you're looking at", highlight: true },
    ],
    techLogos: true,
    bg: 'bg-white',
  },
]

// About-the-maker — rendered after the FAQ, just above the footer.
export const aboutSection = {
  id: 'about',
  headline: 'Who built this',
  body: "I'm Kaegan Donnelly, a product manager based in Vancouver. I built Mind the Gap as a solo product exercise — picking the problem, the data, and the scoring method, then working with Claude Code to ship it end to end.",
  links: [
    { label: 'View source', url: 'https://github.com/kaegan/mindthegap', primary: true },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/kaegandonnelly' },
    { label: 'Email me', url: 'mailto:hello@mindthegap.fyi' },
  ],
  bg: 'bg-white',
}
