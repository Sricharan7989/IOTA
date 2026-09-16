/* IOTA — the Home -> Roadmap scroll move.
   ONE ScrollTrigger timeline drives the whole thing. It animates the hero DOM
   directly and publishes its progress into `choreo`, which the blob, the camera
   rig and the warp all read inside useFrame. That keeps the 3D and the DOM on a
   single scrubbed clock instead of three that can drift apart.

   Each parallax layer carries a `data-parallax` depth multiplier, so the
   eyebrow, wordmark, headline and sub travel at different rates. */
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { choreo } from '../lib/choreography'
import { prefersReducedMotion } from '../lib/quality'

export function useHeroTimeline(scopeRef) {
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined

    // No scroll-scrubbed choreography under reduced motion: the hero copy stays
    // put and heroProgress holds at 0, which leaves the blob, camera and warp
    // in their rest pose.
    if (prefersReducedMotion()) {
      choreo.heroProgress = 0
      return undefined
    }

    const context = gsap.context(() => {
      const layers = gsap.utils.toArray(scope.querySelectorAll('[data-parallax]'))

      // Ensure layers start fully visible at 100% opacity on load
      gsap.set(layers, { opacity: 1, yPercent: 0 })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onRefresh: (self) => {
            if (self.progress === 0) {
              gsap.set(layers, { opacity: 1, yPercent: 0 })
            }
          },
          onUpdate: (self) => {
            choreo.heroProgress = self.progress
            if (self.progress === 0) {
              gsap.set(layers, { opacity: 1, yPercent: 0 })
            }
          },
        },
      })

      timeline.fromTo(
        layers,
        { opacity: 1, yPercent: 0 },
        {
          yPercent: (index, element) =>
            -34 * Number(element.dataset.parallax || 1),
          opacity: 0,
          ease: 'power1.in',
        },
        0,
      )
    }, scopeRef)

    return () => {
      context.revert()
      choreo.heroProgress = 0
    }
  }, [scopeRef])
}
