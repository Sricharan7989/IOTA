/* IOTA — dev-only Leva wrapper around WarpField.
   This is the file that imports leva; WarpField itself never does. SceneCanvas
   loads this module only when import.meta.env.DEV is true, so the tuning UI is
   dropped from the production bundle along with the leva dependency.

   Numbers dialled in here should be copied back into WARP_DEFAULTS in
   WarpField.jsx — that is what actually ships. */
import { folder, useControls } from 'leva'
import WarpField, { WARP_DEFAULTS } from './WarpField'
import { warpPalette } from './palette'

export default function WarpFieldTuner() {
  const controls = useControls('Warp', {
    Field: folder(
      {
        // Regenerating the seed buffers is the only genuinely expensive
        // control here, hence the coarse step.
        count: {
          value: WARP_DEFAULTS.count,
          min: 5000,
          max: 300000,
          step: 5000,
          label: 'particles',
        },
        radius: { value: WARP_DEFAULTS.radius, min: 2, max: 25, step: 0.5 },
        near: { value: WARP_DEFAULTS.near, min: 0.3, max: 6, step: 0.1 },
        far: { value: WARP_DEFAULTS.far, min: 15, max: 120, step: 1 },
      },
      { collapsed: true },
    ),

    Motion: folder({
      baseSpeed: { value: WARP_DEFAULTS.baseSpeed, min: 0, max: 40, step: 0.1 },
      boostSpeed: { value: WARP_DEFAULTS.boostSpeed, min: 0, max: 140, step: 1 },
      streak: { value: WARP_DEFAULTS.streak, min: 0, max: 3, step: 0.01 },
    }),

    Scroll: folder({
      // Lenis velocity that counts as full throttle. Lower = twitchier.
      scrollScale: {
        value: WARP_DEFAULTS.scrollScale,
        min: 2,
        max: 90,
        step: 1,
        label: 'velocity scale',
      },
      scrollInfluence: {
        value: WARP_DEFAULTS.scrollInfluence,
        min: 0,
        max: 1,
        step: 0.01,
        label: 'influence',
      },
    }),

    Look: folder({
      size: { value: WARP_DEFAULTS.size, min: 0.2, max: 12, step: 0.1 },
      maxSize: { value: WARP_DEFAULTS.maxSize, min: 4, max: 64, step: 1 },
      brightness: { value: WARP_DEFAULTS.brightness, min: 0, max: 3, step: 0.01 },
      softness: { value: WARP_DEFAULTS.softness, min: 0.5, max: 6, step: 0.1 },
    }),

    Cursor: folder({
      repelRadius: {
        value: WARP_DEFAULTS.repelRadius,
        min: 0,
        max: 1.5,
        step: 0.01,
      },
      repelStrength: {
        value: WARP_DEFAULTS.repelStrength,
        min: 0,
        max: 0.8,
        step: 0.01,
      },
    }),

    Colour: folder({
      colorBlue: { value: warpPalette.blue(), label: 'blue' },
      colorViolet: { value: warpPalette.violet(), label: 'violet' },
      colorWhite: { value: warpPalette.white(), label: 'spark' },
      // Shares of the particle population. Whatever is left over after blue
      // and violet becomes a white spark.
      mixBlue: { value: WARP_DEFAULTS.mixBlue, min: 0, max: 1, step: 0.01 },
      mixViolet: { value: WARP_DEFAULTS.mixViolet, min: 0, max: 1, step: 0.01 },
    }),
  })

  return <WarpField {...controls} />
}
