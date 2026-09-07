/* IOTA - the composed room.
   The static counterpart to the WebGL layer: a deeper base, one soft top
   light, and a faint dot matrix. No particles. The hero is the loud room;
   everything below it is the quiet one, and quiet has to be built deliberately
   rather than left over.

   Quiet is not the same as dead, so the room does two things under you: a very
   faint glow follows the pointer, and the dot matrix drifts and parallaxes
   against the scroll. Both are an order of magnitude below anything on a card.
   The test for either is that you should not be able to point at it - you
   should only notice if it stops.

   It sits at --z-backdrop alongside <Backdrop>, and AFTER it in App's DOM
   order, so at full opacity it paints clean over the hero's vignette. Both are
   below the canvas, which is what lets this room rise up *underneath* the 3D
   as the 3D fades - the handoff reads as one world giving way to another
   rather than a panel sliding across.

   Geometry comes from lib/shift.js; see the note there on why this owns its
   own tween instead of sharing the canvas's. */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { hasFinePointer } from '../hooks/useCardMotion'
import { prefersReducedMotion } from '../lib/quality'
import {
  CONTENT_START,
  SHIFT_CUT,
  SHIFT_END,
  SHIFT_SCRUB,
  SHIFT_TRIGGER,
} from '../lib/shift'
import styles from './ContentAtmosphere.module.css'

export default function ContentAtmosphere() {
  const root = useRef(null)
  const glow = useRef(null)
  const grid = useRef(null)

  // The pointer glow. Damped rather than driven (DESIGN.md 5), and quickTo so
  // a moving pointer retargets two tweens instead of allocating two per event.
  // Skipped on coarse pointers, where it would sit frozen at the last tap.
  useEffect(() => {
    const el = glow.current
    if (!el) return undefined
    if (prefersReducedMotion() || !hasFinePointer()) return undefined

    // Slower than a card's sheen on purpose: the room is large, and a big soft
    // thing that keeps up with the cursor reads as a spotlight rather than as
    // atmosphere.
    const moveX = gsap.quickTo(el, 'x', { duration: 1.1, ease: 'expo.out' })
    const moveY = gsap.quickTo(el, 'y', { duration: 1.1, ease: 'expo.out' })

    // The layer is fixed, so viewport coordinates are already the right frame
    // of reference - no rect to measure, and nothing to invalidate on scroll.
    const handleMove = (event) => {
      moveX(event.clientX)
      moveY(event.clientY)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handleMove)
      gsap.killTweensOf(el)
    }
  }, [])

  // The grid's two movements, on two nested elements so they cannot overwrite
  // each other: the wrapper parallaxes with the scroll, the grid itself drifts
  // on its own slow clock.
  useEffect(() => {
    const gridEl = grid.current
    if (!gridEl) return undefined
    if (prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      gsap.to(gridEl.parentElement, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // Slow enough that it never reads as movement, only as the texture not
      // being quite nailed down.
      gsap.to(gridEl, {
        xPercent: 1.6,
        yPercent: 1.6,
        duration: 26,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    })

    return () => context.revert()
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return undefined

    const context = gsap.context(() => {
      // DESIGN.md 5: reduced motion gets no scrubbed handoff. The composed
      // room is simply present from the boundary on - the same two states, one
      // step instead of a dissolve. global.css already flattens transitions
      // here, so this is an honest cut rather than a disguised animation.
      if (prefersReducedMotion()) {
        const cut = ScrollTrigger.create({
          trigger: SHIFT_TRIGGER,
          start: SHIFT_CUT,
          // To the bottom of the document: the room stays once entered.
          end: 'max',
          onToggle: (self) => gsap.set(el, { opacity: self.isActive ? 1 : 0 }),
        })

        // onToggle only fires on a change, so a deep link landing straight
        // into the content world would never hear about it. Seed it.
        gsap.set(el, { opacity: cut.isActive ? 1 : 0 })
        return
      }

      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          // Linear: the curve belongs to the scroll, not to the tween.
          ease: 'none',
          scrollTrigger: {
            trigger: SHIFT_TRIGGER,
            start: CONTENT_START,
            end: SHIFT_END,
            scrub: SHIFT_SCRUB,
          },
        },
      )
    })

    return () => context.revert()
  }, [])

  return (
    <div ref={root} className={styles.world} aria-hidden="true">
      <span className={styles.glow} />

      <span className={styles.gridWrap}>
        <span ref={grid} className={styles.grid} />
      </span>

      <span ref={glow} className={styles.pointerGlow} />
    </div>
  )
}
