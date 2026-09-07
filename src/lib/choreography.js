/* IOTA — shared scroll choreography state.
   One ScrollTrigger timeline (see hooks/useHeroTimeline.js) writes heroProgress;
   EnergyMass writes heroPulse. The 3D layer reads both inside useFrame. Same
   reasoning as scrollState in scroll.js: these change every frame, so they must
   never be React state. */

export const choreo = {
  /** 0..1 across the Home -> Roadmap move. */
  heroProgress: 0,

  /**
   * The centerpiece's breathing multiplier, ~0.95..1.05.
   * Published by EnergyMass and consumed by GlowHalo, so the light source
   * swells with the mass instead of running its own drifting rhythm. Two
   * independent sin() calls would beat against each other and read as a fault.
   */
  heroPulse: 1,
}
