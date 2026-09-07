/* IOTA — post-processing stack.
   Tier-gated: the whole composer is skipped when nothing is enabled, so
   low-end devices pay nothing rather than paying for a pass-through.

   ==========================================================================
   WHY THERE IS NO <DepthOfField> HERE
   Every material in this scene is additive with `depthWrite: false`, so the
   depth buffer is never written and stays at the far plane. A composer DoF
   pass reads that depth texture to decide what to blur — given a uniform
   buffer it either blurs everything equally or nothing at all. Neither is
   depth of field.

   Turning depth writes on is not an option either: additive particles depend
   on stacking, and depth-testing them against each other is exactly what
   destroys the white-hot core.

   So the defocus is computed per-particle instead, in the vertex shaders —
   see uFocusDistance / uBokehScale in EnergyMass and Debris. A defocused
   point sprite grows and dims, which is what a real lens does to a point of
   light, and it costs a few instructions instead of a full-screen blur.
   ==========================================================================

   Values here are the tuned, baked-in grade. Passes whose intensity is zero
   are skipped entirely rather than run as no-ops — a full-screen pass that
   changes nothing still costs a full-screen pass. */
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { HalfFloatType } from 'three'

export const EFFECTS_DEFAULTS = {
  // A threshold of 1.0 means ONLY genuinely HDR pixels bloom. The mass pushes
  // its core well above 1.0 (uCoreHdr in EnergyMass), so this picks out the
  // core and nothing else — which is what makes it read as a light source
  // instead of a washed-out white blob.
  //
  // This is also finally in the spirit of DESIGN.md §6: keep the threshold
  // high so bloom never lifts the whole frame. The earlier 0.62 was a
  // workaround for having no HDR content at all to key off.
  bloomThreshold: 1,
  bloomIntensity: 1.05,
  bloomSmoothing: 0.57,
  // Generous radius: the glow should bleed well past the core.
  bloomRadius: 0.59,

  vignetteOffset: 0.28,
  vignetteDarkness: 0.62,

  // Film grain, tuned OFF. The pass is skipped entirely at 0 rather than run
  // as a no-op. Raise it to bring grain back (SCREEN blend, so it lifts the
  // blacks very slightly — that is the price of grain being visible at all on
  // a near-black frame).
  noiseOpacity: 0,

  // Chromatic aberration, tuned OFF. Also skipped entirely at 0. modulation
  // stays set so raising the offset gives an edges-only fringe immediately.
  chromaOffset: 0,
  chromaModulation: 0.24,
}

export default function Effects({
  bloom,
  chromatic,
  vignette,
  noise = true,
  bloomThreshold = EFFECTS_DEFAULTS.bloomThreshold,
  bloomIntensity = EFFECTS_DEFAULTS.bloomIntensity,
  bloomSmoothing = EFFECTS_DEFAULTS.bloomSmoothing,
  bloomRadius = EFFECTS_DEFAULTS.bloomRadius,
  vignetteOffset = EFFECTS_DEFAULTS.vignetteOffset,
  vignetteDarkness = EFFECTS_DEFAULTS.vignetteDarkness,
  noiseOpacity = EFFECTS_DEFAULTS.noiseOpacity,
  chromaOffset = EFFECTS_DEFAULTS.chromaOffset,
  chromaModulation = EFFECTS_DEFAULTS.chromaModulation,
}) {
  const passes = []

  if (bloom) {
    passes.push(
      <Bloom
        key="bloom"
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={bloomSmoothing}
        radius={bloomRadius}
        mipmapBlur
      />,
    )
  }

  if (chromatic && chromaOffset > 0) {
    passes.push(
      <ChromaticAberration
        key="chromatic"
        offset={[chromaOffset, chromaOffset]}
        radialModulation
        modulationOffset={chromaModulation}
      />,
    )
  }

  if (vignette) {
    passes.push(
      <Vignette
        key="vignette"
        offset={vignetteOffset}
        darkness={vignetteDarkness}
      />,
    )
  }

  // Grain goes last so it sits over the graded frame rather than being bloomed.
  if (noise && noiseOpacity > 0) {
    passes.push(
      <Noise
        key="noise"
        opacity={noiseOpacity}
        blendFunction={BlendFunction.SCREEN}
      />,
    )
  }

  if (passes.length === 0) return null

  // multisampling 0 + no normal pass: nothing here needs either, and both cost
  // real milliseconds at full-screen resolution.
  return (
    // HalfFloatType is already the library default, but it is stated
    // explicitly because the entire grade depends on it: an 8-bit buffer would
    // clamp the mass's HDR core at 1.0, and a bloom threshold of 1.0 would
    // then catch nothing at all.
    <EffectComposer
      multisampling={0}
      disableNormalPass
      frameBufferType={HalfFloatType}
    >
      {passes}
    </EffectComposer>
  )
}
