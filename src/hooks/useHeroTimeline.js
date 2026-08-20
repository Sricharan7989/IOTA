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

export function useHeroTimeline(scopeRef) {
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined

    const context = gsap.context(() => {
      const layers = gsap.utils.toArray(scope.querySelectorAll('[data-parallax]'))

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom top',
          // A touch of catch-up rather than a hard bind — this is the
          // difference between a scripted move and a jittery one.
          scrub: 1,
          onUpdate: (self) => {
            choreo.heroProgress = self.progress
          },
        },
      })

      timeline.to(
        layers,
        {
          yPercent: (index, element) =>
            -34 * Number(element.dataset.parallax || 1),
          opacity: 0,
          ease: 'none',
          stagger: 0.04,
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
