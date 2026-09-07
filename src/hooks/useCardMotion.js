/* IOTA - pointer motion for a card.
   Tilt toward the cursor, a sheen that tracks it across the surface, and a
   lift on hover. Returns two refs: one for the card, one for the sheen.

   Four things here are load-bearing for the 60fps contract:

   - Nothing is React state. Pointer position changes hundreds of times a
     second; routing it through a re-render would cost the whole page.
   - gsap.quickTo, not gsap.to. A moving cursor retargets four existing tweens
     instead of allocating four new ones per pointermove.
   - Damped, never driven (DESIGN.md 5). The card eases toward the pointer
     rather than being nailed to it, which is the entire difference between
     this feeling expensive and feeling twitchy.
   - The rect is measured on enter, not per move - getBoundingClientRect()
     forces layout. It IS re-measured on scroll, because wheeling over a card
     is the common case and a stale rect makes the tilt drift the wrong way.
     That listener only exists while a pointer is actually inside a card.

   Skipped entirely on coarse pointers (there is no hover to respond to, so it
   would only fire on tap) and under prefers-reduced-motion, where the card
   keeps its static CSS hover states and nothing moves. */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/quality'

/** True when the device actually has a hovering, precise pointer. */
export function hasFinePointer() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function useCardMotion({ tilt = 7, lift = 6 } = {}) {
  const card = useRef(null)
  const sheen = useRef(null)

  useEffect(() => {
    const el = card.current
    if (!el) return undefined
    if (prefersReducedMotion() || !hasFinePointer()) return undefined

    const glow = sheen.current

    // Perspective on the element itself rather than on the grid, so a card's
    // tilt is measured from its own centre and cards near the edge of a wide
    // row do not shear.
    gsap.set(el, { transformPerspective: 900, transformOrigin: '50% 50%' })

    const rotateX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'expo.out' })
    const rotateY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'expo.out' })
    const moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'expo.out' })
    const sheenX = glow && gsap.quickTo(glow, 'x', { duration: 0.55, ease: 'expo.out' })
    const sheenY = glow && gsap.quickTo(glow, 'y', { duration: 0.55, ease: 'expo.out' })

    let bounds = null

    const measure = () => {
      bounds = el.getBoundingClientRect()
    }

    const handleEnter = () => {
      measure()
      moveY(-lift)
      if (glow) gsap.to(glow, { opacity: 1, duration: 0.4, ease: 'expo.out' })
      // Only while the pointer is actually in here - see the header note.
      window.addEventListener('scroll', measure, { passive: true })
    }

    const handleMove = (event) => {
      if (!bounds) return
      // 0..1 across the card, then re-centred to -1..1.
      const x = (event.clientX - bounds.left) / bounds.width
      const y = (event.clientY - bounds.top) / bounds.height

      rotateY((x - 0.5) * 2 * tilt)
      // Negated: pushing the pointer down should tip the far edge up.
      rotateX((y - 0.5) * -2 * tilt)

      if (sheenX) {
        sheenX(x * bounds.width)
        sheenY(y * bounds.height)
      }
    }

    const handleLeave = () => {
      bounds = null
      window.removeEventListener('scroll', measure)
      rotateX(0)
      rotateY(0)
      moveY(0)
      if (glow) gsap.to(glow, { opacity: 0, duration: 0.5, ease: 'expo.out' })
    }

    el.addEventListener('pointerenter', handleEnter)
    el.addEventListener('pointermove', handleMove)
    el.addEventListener('pointerleave', handleLeave)

    return () => {
      el.removeEventListener('pointerenter', handleEnter)
      el.removeEventListener('pointermove', handleMove)
      el.removeEventListener('pointerleave', handleLeave)
      window.removeEventListener('scroll', measure)
      gsap.killTweensOf(el)
      if (glow) gsap.killTweensOf(glow)
      // The reveal owns this element's transform once we let go of it.
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [tilt, lift])

  return { card, sheen }
}
