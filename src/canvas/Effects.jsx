/* IOTA — post-processing stack.
   Tier-gated: the whole composer is skipped when nothing is enabled, so
   low-end devices pay nothing at all rather than paying for a pass-through.

   DESIGN.md §6: bloom threshold stays high so only the specular highlight
   blooms. A low threshold lifts the whole frame and destroys the black, which
   is the entire palette.

   No depth-of-field. It is the most expensive effect in the set and it would
   blur the particle warp — the one element whose sharp streaks carry the
   motion. The tier system has a slot for it if that call changes. */
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'

export default function Effects({ bloom, chromatic, vignette }) {
  const passes = []

  if (bloom) {
    passes.push(
      <Bloom
        key="bloom"
        intensity={0.55}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.28}
        mipmapBlur
      />,
    )
  }

  if (chromatic) {
    passes.push(
      <ChromaticAberration
        key="chromatic"
        offset={[0.0006, 0.0006]}
        radialModulation
        modulationOffset={0.35}
      />,
    )
  }

  if (vignette) {
    passes.push(<Vignette key="vignette" offset={0.32} darkness={0.55} />)
  }

  if (passes.length === 0) return null

  // multisampling 0 + no normal pass: nothing here needs either, and both cost
  // real milliseconds at full-screen resolution.
  return (
    <EffectComposer multisampling={0} disableNormalPass>
      {passes}
    </EffectComposer>
  )
}
