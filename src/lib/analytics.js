// PostHog, off the critical path: the bundle is dynamically imported once the
// page goes idle (or on first capture), so it never competes with the map for
// the initial load.
//
// The key is a public, write-only project key. It can capture events but can't
// read anything back, which is why PostHog ships it to the browser by design —
// it's visible in the network tab of every site that uses them. It's inlined
// here as the default rather than left to VITE_POSTHOG_KEY alone because an
// unset env var fails silently: the site builds, deploys, and reports nothing,
// which is exactly what happened between 2026-08-22 and 2026-08-29. The env
// var still wins when set, so a fork can point this at its own project.
const KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_AUrkittVM6MeGMKDPF4sebuniygNnwZoPRsx3CA4QaWA'

// `/ingest` is rewritten to PostHog in vercel.json (and vite.config.js for dev),
// so the requests are same-origin. Analytics served from posthog.com is on every
// blocklist and this site's audience blocks more than most; first-party they
// survive. ui_host is what the toolbar and "view in PostHog" links point at,
// since api_host is no longer a real address.
const HOST = import.meta.env.VITE_POSTHOG_HOST || '/ingest'

let posthogPromise = null

function load() {
  if (!posthogPromise) {
    posthogPromise = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        ui_host: 'https://us.posthog.com',
        person_profiles: 'identified_only',
      })
      return posthog
    })
  }
  return posthogPromise
}

export function initAnalytics() {
  if (!KEY) return
  const start = () => load()
  // The timeout matters: session replay only starts recording once this
  // resolves, and a visitor who reads for thirty seconds and leaves is the
  // whole point. Without it, a busy main thread can defer idle work
  // indefinitely and the visit is never recorded at all.
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2000 })
  else setTimeout(start, 1)
}

export function capture(event, properties) {
  if (!KEY) return
  load().then(posthog => posthog.capture(event, properties))
}
