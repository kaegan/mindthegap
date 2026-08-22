// PostHog, off the critical path: the bundle is dynamically imported after the
// page is idle (or on first capture), and everything no-ops without a key so
// cloned dev environments stay console-clean.
const KEY = import.meta.env.VITE_POSTHOG_KEY
const HOST = import.meta.env.VITE_POSTHOG_HOST

let posthogPromise = null

function load() {
  if (!posthogPromise) {
    posthogPromise = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
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
  if ('requestIdleCallback' in window) requestIdleCallback(start)
  else setTimeout(start, 1)
}

export function capture(event, properties) {
  if (!KEY) return
  load().then(posthog => posthog.capture(event, properties))
}
