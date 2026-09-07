/* IOTA - the hero -> content boundary, as numbers.
   The site is two rooms: a cinematic one the 3D lives in, and a composed one
   every content section lives in. The SHIFT is the doorway between them, and
   this file is the only place its geometry is written down.

   Three things read it, and they must never drift apart:
     - SceneCanvas   fades and pulls the WebGL layer back, then stops rendering
     - ContentAtmosphere  brings the composed room up underneath it
     - ShiftMarker   the hairline label that sits on the threshold

   They own separate tweens rather than sharing one timeline because the canvas
   is lazy-loaded and conditional - it may not exist when the others mount. Two
   scrubbed triggers built from the same constants stay in lockstep anyway:
   ScrollTrigger resolves both against the same scroll position and the same
   element, and gsap.ticker scrubs them on the same clock.

   The two ranges deliberately do NOT match. The room you are leaving holds its
   ground until nearly halfway, while the room you are arriving in starts
   surfacing earlier - so for a stretch in the middle both are partly present.
   That overlap is the dissolve. Matching ranges would read as a crossfade
   between two flat images instead. */

/** The hero is the doorway; every range below is measured against it. */
export const SHIFT_TRIGGER = '#home'

/** Where the composed room starts arriving. */
export const CONTENT_START = '35% top'

/** Where the cinematic room starts leaving - just before EnergyMass's own
    scrollFadeStart (0.55), so the layer fade takes over as the mass dims. */
export const CANVAS_START = '45% top'

/** Both finish together, exactly as the hero clears the top of the frame. */
export const SHIFT_END = 'bottom top'

/** Catch-up on the scrub. Matches useHeroTimeline, so the DOM parallax, the
    3D choreography and the room handoff all lag by the same amount. */
export const SHIFT_SCRUB = 1

/** How far the WebGL layer pulls back as it goes. Small on purpose: the
    camera is pushing IN at the same time, and a big counter-move reads as a
    mistake rather than as depth. */
export const RECEDE_SCALE = 0.94

/**
 * Where the canvas stops rendering altogether.
 * Deliberately past SHIFT_END: the scrub lags by SHIFT_SCRUB seconds, and
 * culling while the fade is still finishing would snap the last few percent
 * of opacity away.
 */
export const CULL_END = 'bottom top-=20%'

/**
 * Reduced motion has no scrub to hide behind, so the rooms swap at one point
 * instead: when the hero is half out of frame. Both layers use this same
 * value, so the swap is a single event rather than two near-misses.
 */
export const SHIFT_CUT = 'bottom center'
