/* IOTA — smooth scroll core.
   Owns the single Lenis instance, bridges it to GSAP's ticker and
   ScrollTrigger, and publishes live scroll values into a mutable module object
   that render loops can read without causing React renders.

   Why no ScrollTrigger.scrollerProxy: Lenis in its default configuration
   scrolls `window` and writes the real scroll position, so ScrollTrigger's
   default scroller already sees the truth. A proxy is only needed when Lenis
   drives a custom wrapper element, which we don't do. */
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Expo-out. The curve behind --e-out in tokens.css. */
const easeOutExpo = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

/**
 * Live scroll values, mutated in place every scroll event.
 * PROJECT.md's 60fps contract: this is deliberately NOT React state — it
 * changes many times per second and useFrame reads it directly.
 */
export const scrollState = {
  scroll: 0, // px from top
  progress: 0, // 0..1 through the page
  velocity: 0, // signed, px per frame
  direction: 0, // 1 down, -1 up
}

let lenis = null
let tickerCallback = null
let locked = false

export function getLenis() {
  return lenis
}

/**
 * Lock/unlock page scrolling.
 *
 * These exist rather than callers poking Lenis directly because of effect
 * ordering: React runs child effects before parent effects, so the preloader
 * locks scroll BEFORE App's useSmoothScroll has created the Lenis instance.
 * Holding the intent in a module flag means initSmoothScroll can honour a lock
 * that was requested before it ran, and the `overflow` fallback covers the
 * reduced-motion case where Lenis never exists at all.
 */
export function lockScroll() {
  locked = true
  document.documentElement.style.overflow = 'hidden'
  lenis?.stop()
}

export function unlockScroll() {
  locked = false
  document.documentElement.style.overflow = ''
  lenis?.start()
  // Every ScrollTrigger created during the intro was measured against a
  // document that could not scroll - `overflow: hidden` on <html> means no
  // scroll height, so starts and ends resolve against the wrong distance.
  // Re-measure now that the real page geometry exists, or reveals further
  // down the page can be left holding their hidden state.
  ScrollTrigger.refresh()
}

export function initSmoothScroll() {
  if (typeof window === 'undefined' || lenis) return lenis

  // DESIGN.md §5: reduced motion turns Lenis off entirely. ScrollTrigger keeps
  // working — it falls back to reading native scroll — so the navbar's active
  // state and hairline still behave.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null
  }

  lenis = new Lenis({
    // Weighty rather than floaty: a long duration on an expo curve means the
    // page keeps travelling after the wheel stops, then settles hard.
    duration: 1.15,
    easing: easeOutExpo,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.8,
  })

  const handleScroll = (instance) => {
    scrollState.scroll = instance.scroll
    scrollState.progress = instance.progress
    scrollState.velocity = instance.velocity
    scrollState.direction = instance.direction
    // Keep every ScrollTrigger in step with Lenis's interpolated position
    // rather than the browser's raw one.
    ScrollTrigger.update()
  }

  lenis.on('scroll', handleScroll)

  // One rAF drives everything. GSAP's ticker is already running for tweens, so
  // Lenis rides it instead of starting a second loop.
  tickerCallback = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tickerCallback)
  // GSAP's lag smoothing would freeze the ticker after a stall and desync
  // Lenis from the real scroll position.
  gsap.ticker.lagSmoothing(0)

  // Something locked scroll before we existed — honour it now.
  if (locked) lenis.stop()

  return lenis
}

export function destroySmoothScroll() {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback)
    tickerCallback = null
  }
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
  scrollState.scroll = 0
  scrollState.progress = 0
  scrollState.velocity = 0
  scrollState.direction = 0
}

/** Smooth-scroll to a section by id. Used by the navbar. */
export function scrollToSection(id) {
  const target = document.getElementById(id)
  if (!target) return

  if (lenis) {
    lenis.scrollTo(target, { duration: 1.5, easing: easeOutExpo })
  } else {
    // Reduced motion: jump, don't animate.
    target.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
}
