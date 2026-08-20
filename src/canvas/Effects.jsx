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

export default function Effects({
  bloom,
  chromatic,
  vignette,
  // DESIGN.md §6 specifies a ~0.9 bloom threshold to protect the blacks. The
  // hero visor does not reach it: emissive white x base-colour texture at
  // intensity 0.5 lands around 0.26 luminance, so at 0.9 nothing would bloom
  // at all. 0.62 catches the visor and the hottest particle cores while still
  // leaving the dark 90% of the frame untouched. Retune alongside the
  // emissive intensity if the hero gets brighter.
  bloomThreshold = 0.62,
  bloomIntensity = 0.7,
}) {
  const passes = []

  if (bloom) {
    passes.push(
      <Bloom
        key="bloom"
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.3}
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
