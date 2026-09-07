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

      // The second statement. It is masked shut at rest and slides up on the
      // same scrubbed clock, so it arrives as the first block is leaving —
      // one continuous move rather than two competing ones.
      const secondLines = gsap.utils.toArray(
        scope.querySelectorAll('[data-scroll-reveal]'),
      )

      if (secondLines.length) {
        gsap.set(secondLines, { yPercent: 110, opacity: 0 })

        timeline
          .to(
            secondLines,
            { yPercent: 0, opacity: 1, ease: 'none', stagger: 0.06 },
            0.18,
          )
          // ...and it leaves again before the section does, so it never
          // collides with the Roadmap heading arriving underneath.
          .to(
            secondLines,
            { yPercent: -60, opacity: 0, ease: 'none', stagger: 0.04 },
            0.72,
          )
      }
    }, scopeRef)

    return () => {
      context.revert()
      choreo.heroProgress = 0
    }
  }, [scopeRef])
}
