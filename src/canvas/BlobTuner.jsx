/* IOTA — dev-only Leva wrapper around Blob.
   Same arrangement as WarpFieldTuner: this is the only file that imports leva
   for the blob, and Scene.jsx loads it exclusively in dev.

   Numbers dialled in here belong back in BLOB_DEFAULTS — that is what ships. */
import { folder, useControls } from 'leva'
import Blob, { BLOB_DEFAULTS } from './Blob'

export default function BlobTuner({ envMap }) {
  const controls = useControls('Blob', {
    Form: folder({
      radius: { value: BLOB_DEFAULTS.radius, min: 0.4, max: 2.5, step: 0.05 },
      // Rebuilds the geometry, so this is the expensive control here.
      detail: { value: BLOB_DEFAULTS.detail, min: 4, max: 64, step: 4 },
      distort: { value: BLOB_DEFAULTS.distort, min: 0, max: 1.5, step: 0.01 },
      noiseScale: { value: BLOB_DEFAULTS.noiseScale, min: 0.1, max: 4, step: 0.05 },
      noiseSpeed: { value: BLOB_DEFAULTS.noiseSpeed, min: 0, max: 1.5, step: 0.01 },
    }),

    Material: folder({
      envIntensity: { value: BLOB_DEFAULTS.envIntensity, min: 0, max: 4, step: 0.05 },
      exposure: { value: BLOB_DEFAULTS.exposure, min: 0.1, max: 4, step: 0.05 },
      iridescence: { value: BLOB_DEFAULTS.iridescence, min: 0, max: 6, step: 0.05 },
      fresnelPower: { value: BLOB_DEFAULTS.fresnelPower, min: 0.5, max: 8, step: 0.1 },
      fresnelStrength: { value: BLOB_DEFAULTS.fresnelStrength, min: 0, max: 3, step: 0.05 },
      rimStrength: { value: BLOB_DEFAULTS.rimStrength, min: 0, max: 5, step: 0.05 },
    }),

    Motion: folder({
      rotationSpeed: { value: BLOB_DEFAULTS.rotationSpeed, min: 0, max: 1, step: 0.01 },
      cursorDrift: { value: BLOB_DEFAULTS.cursorDrift, min: 0, max: 1.5, step: 0.01 },
    }),

    'Scroll move': folder({
      scrollScale: { value: BLOB_DEFAULTS.scrollScale, min: 0.2, max: 1.6, step: 0.01 },
      scrollSpin: { value: BLOB_DEFAULTS.scrollSpin, min: 0, max: 6, step: 0.05 },
      scrollDistort: { value: BLOB_DEFAULTS.scrollDistort, min: 0, max: 3, step: 0.05 },
    }),
  })

  return <Blob {...controls} envMap={envMap} />
}
