/* IOTA — shared scroll choreography state.
   One ScrollTrigger timeline (see hooks/useHeroTimeline.js) writes here; the
   3D layer reads it inside useFrame. Same reasoning as scrollState in
   scroll.js: this changes every frame, so it must never be React state. */

export const choreo = {
  /** 0..1 across the Home -> Roadmap move. */
  heroProgress: 0,
}
