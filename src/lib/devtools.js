/* IOTA - dev tooling switch.
   One flag gates BOTH on-screen tuning overlays: the Leva panel and the
   r3f-perf stats. Flip ENABLE_DEV_UI to true to bring them back and re-tune.

   The wiring underneath is untouched. The tuner components (WarpFieldTuner,
   EnergyMassTuner, AtmosphereTuner, EffectsTuner) and their useControls hooks
   all still exist exactly as they were; they simply are not mounted while this
   is false, so leva is never even fetched.

   The `import.meta.env.DEV &&` is not redundant - it is the guarantee. Even if
   ENABLE_DEV_UI is left true by accident, this folds to false at build time,
   the bundler drops the dynamic imports, and neither leva nor r3f-perf can
   reach production. */

/** Set to true to show the Leva panel and the perf overlay while developing. */
const ENABLE_DEV_UI = false

export const SHOW_DEV = import.meta.env.DEV && ENABLE_DEV_UI
