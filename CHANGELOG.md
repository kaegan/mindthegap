# Changelog

What's new in the Mind the Gap interactive transit coverage map.

---

## Population Density Heatmap

A new heatmap layer visualizes population density across Metro Vancouver's dissemination areas. Toggle it on from the layers panel to see where residents are concentrated, independent of transit coverage. Overlaying this with the coverage gap layer makes it easy to spot high-density neighborhoods that lack adequate service -- exactly the areas where new routes would have the biggest impact.

## Gap Explorer

Browse the 25 most critical transit coverage gaps in Metro Vancouver, ranked by impact. Each entry shows a letter grade, affected population, and gap score. Click any row to fly to that area on the map and open its report card for a closer look.

## Neighborhood Report Cards

Click any neighborhood on the map to open a detailed report card. Each card shows the area's gap score as a letter grade, population density, and the nearest transit stops with walking distances. An expandable methodology section explains how the score is calculated.

## Transit Layer Controls

Toggle individual transit modes on and off directly from the map. Bus, SkyTrain, SeaBus, and West Coast Express routes each render in distinct colors so you can see exactly which modes serve which areas. A collapsible layers panel keeps the UI clean while giving you full control.

## Bus Stop Markers

Every bus stop in Metro Vancouver is now plotted on the map. Zoom in to see stop-level detail alongside the route lines and coverage gap overlay.

## Collapsible Legend

The coverage gap legend now collapses to a single icon so the map isn't cluttered on smaller screens. On mobile, layers default to expanded for easy discovery.

## Faster Map Loading

Route and stop data now lazy-loads as you interact with the map, and all geographic data has been converted to TopoJSON -- cutting payload sizes by roughly 50%. Mobile load times improved significantly.

## Coverage Gap Heatmap

A heatmap layer highlights clusters of underserved areas at a glance. Toggle it on to see hot zones where multiple high-gap neighborhoods overlap, making regional patterns easier to spot than the polygon-by-polygon view alone.

---

## Launch

Mind the Gap launches as an interactive choropleth map of transit coverage gaps across Metro Vancouver's 3,590 dissemination areas. The gap score algorithm combines population pressure with transit access -- measuring how many transit trips are reachable within walking distance (600 m for bus stops, 1,200 m for rail stations) -- to surface the 72 most critical gaps affecting 67,000+ residents.
