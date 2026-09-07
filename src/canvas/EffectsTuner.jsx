/* IOTA — dev-only Leva wrapper around the post-processing stack.
   The grade is the last thing dialled in and the easiest to overdo, so every
   intensity is exposed here.

   Depth of field is NOT in this panel: it is computed per particle rather than
   as a composer pass (see the note at the top of Effects.jsx). Its controls
   live in the "Energy mass" and "Debris" panels under `Focus`. */
import { folder, useControls } from 'leva'
import Effects, { EFFECTS_DEFAULTS } from './Effects'

export default function EffectsTuner({ bloom, chromatic, vignette }) {
  const controls = useControls('Grade', {
    Bloom: folder({
      bloomThreshold: {
        value: EFFECTS_DEFAULTS.bloomThreshold,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'threshold',
      },
      bloomIntensity: {
        value: EFFECTS_DEFAULTS.bloomIntensity,
        min: 0,
        max: 4,
        step: 0.01,
        label: 'intensity',
      },
      bloomSmoothing: {
        value: EFFECTS_DEFAULTS.bloomSmoothing,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'smoothing',
      },
      bloomRadius: {
        value: EFFECTS_DEFAULTS.bloomRadius,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'radius',
      },
    }),

    Vignette: folder({
      vignetteOffset: { value: EFFECTS_DEFAULTS.vignetteOffset, min: 0, max: 1, step: 0.01, label: 'offset' },
      vignetteDarkness: { value: EFFECTS_DEFAULTS.vignetteDarkness, min: 0, max: 2, step: 0.01, label: 'darkness' },
    }),

    Grain: folder({
      noiseOpacity: {
        value: EFFECTS_DEFAULTS.noiseOpacity,
        min: 0,
        max: 0.2,
        step: 0.001,
        label: 'opacity',
      },
    }),

    Chromatic: folder({
      chromaOffset: {
        value: EFFECTS_DEFAULTS.chromaOffset,
        min: 0,
        max: 0.006,
        step: 0.0001,
        label: 'offset',
      },
      chromaModulation: {
        value: EFFECTS_DEFAULTS.chromaModulation,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'edge only',
      },
    }),
  })

  return (
    <Effects bloom={bloom} chromatic={chromatic} vignette={vignette} {...controls} />
  )
}
