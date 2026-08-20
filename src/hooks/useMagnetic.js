/* IOTA — magnetic hover.
   Returns a ref; attach it to any element and it will lean toward the cursor
   while hovered, then spring back on leave.

   Two details that matter:
   - The element's bounding rect is measured once on pointerenter, not on every
     pointermove. getBoundingClientRect() forces layout, and doing that per
     mouse event is exactly the kind of work DESIGN.md §5 rules out.
   - gsap.quickTo is used instead of gsap.to, so a moving cursor retargets one
     existing tween rather than allocating a new one every event. */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useMagnetic({ strength = 0.38, duration = 0.6 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    // A magnetic control that chases the pointer is precisely the sort of
    // motion prefers-reduced-motion exists to suppress.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const moveX = gsap.quickTo(element, 'x', { duration, ease: 'expo.out' })
    const moveY = gsap.quickTo(element, 'y', { duration, ease: 'expo.out' })

    let bounds = null

    const handleEnter = () => {
      bounds = element.getBoundingClientRect()
    }

    const handleMove = (event) => {
      if (!bounds) return
      const centreX = bounds.left + bounds.width / 2
      const centreY = bounds.top + bounds.height / 2
      moveX((event.clientX - centreX) * strength)
      moveY((event.clientY - centreY) * strength)
    }

    const handleLeave = () => {
      bounds = null
      moveX(0)
      moveY(0)
    }

    element.addEventListener('pointerenter', handleEnter)
    element.addEventListener('pointermove', handleMove)
    element.addEventListener('pointerleave', handleLeave)

    return () => {
      element.removeEventListener('pointerenter', handleEnter)
      element.removeEventListener('pointermove', handleMove)
      element.removeEventListener('pointerleave', handleLeave)
      gsap.killTweensOf(element)
      gsap.set(element, { x: 0, y: 0 })
    }
  }, [strength, duration])

  return ref
}
