import { useEffect, useState } from 'react'

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Counts up to `value` once `start` becomes true. Renders the final value on
 * first paint (scrapers, print and reduced-motion all see the real number) and
 * only animates as an enhancement.
 */
export default function AnimatedNumber({ value, start = true, duration = 900, delay = 0, format = (n) => n.toLocaleString() }) {
  const [shown, setShown] = useState(value)

  useEffect(() => {
    if (!start || reduceMotion()) { setShown(value); return }
    let frame
    let begin
    const tick = (now) => {
      if (begin === undefined) begin = now
      const t = Math.min(1, (now - begin - delay) / duration)
      if (t < 0) { frame = requestAnimationFrame(tick); return }
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t) // ease-out-expo
      setShown(Math.round(value * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    setShown(0)
    frame = requestAnimationFrame(tick)
    // rAF pauses in background tabs; never leave the number stuck short.
    const settle = setTimeout(() => { cancelAnimationFrame(frame); setShown(value) }, delay + duration + 250)
    return () => { cancelAnimationFrame(frame); clearTimeout(settle) }
  }, [value, start, duration, delay])

  return <span className="num">{format(shown)}</span>
}
