/* IOTA — React lifecycle wrapper around the Lenis singleton.
   Call once, at the app root. Everything else reads the scroll through
   `scrollState` or `scrollToSection` from lib/scroll.js. */
import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll, destroySmoothScroll } from '../lib/scroll'

export function useSmoothScroll() {
  useEffect(() => {
    initSmoothScroll()

    // Sections are already committed to the DOM by the time effects run, but
    // their measured heights are not final until layout settles.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())

    // Chakra Petch loads after first paint and the headings are huge, so the
    // page gets measurably taller when it swaps in. Without this refresh every
    // ScrollTrigger start/end position is computed against the fallback font.
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      destroySmoothScroll()
    }
  }, [])
}
