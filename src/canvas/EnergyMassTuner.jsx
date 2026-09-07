/* IOTA — dev-only Leva wrapper around EnergyMass.
   Same arrangement as the other tuners: this is the only file that imports leva
   for the mass, and Scene.jsx loads it exclusively in dev.

   Numbers dialled in here belong back in ENERGY_DEFAULTS — that is what ships. */
import { folder, useControls } from 'leva'
import EnergyMass, { ENERGY_DEFAULTS } from './EnergyMass'
import { energyPalette } from './palette'

export default function EnergyMassTuner({ count, reducedMotion }) {
  const controls = useControls('Energy mass', {
    Volume: folder(
      {
        // Rebuilding the seed buffers is the only genuinely expensive control
        // here, hence the coarse step.
        count: {
          // Seeded from the detected quality tier, then user-controlled.
          value: count ?? ENERGY_DEFAULTS.count,
          min: 5000,
          max: 300000,
          step: 5000,
          label: 'particles',
        },
        radius: { value: ENERGY_DEFAULTS.radius, min: 0.4, max: 4, step: 0.05 },
        shapeY: {
          value: ENERGY_DEFAULTS.shapeY,
          min: 0.3,
          max: 2,
          step: 0.01,
          label: 'height',
        },
        coreBias: {
          // Above 1 concentrates toward the centre; 1/3 would be uniform.
          value: ENERGY_DEFAULTS.coreBias,
          min: 0.3,
          max: 3.5,
          step: 0.05,
          label: 'core density',
        },
        shapeFreq: { value: ENERGY_DEFAULTS.shapeFreq, min: 0.2, max: 6, step: 0.05, label: 'warp freq' },
        shapeAmp: { value: ENERGY_DEFAULTS.shapeAmp, min: 0, max: 1, step: 0.01, label: 'warp amount' },
        shapeSpeed: { value: ENERGY_DEFAULTS.shapeSpeed, min: 0, max: 0.5, step: 0.005, label: 'warp speed' },
        streamerFraction: { value: ENERGY_DEFAULTS.streamerFraction, min: 0, max: 0.5, step: 0.005, label: 'filaments' },
        streamerAmp: { value: ENERGY_DEFAULTS.streamerAmp, min: 1, max: 10, step: 0.1, label: 'filament reach' },
      },
      { collapsed: true },
    ),

    Churn: folder({
      // Octave 1: the large, slow swirl carrying the whole mass.
      noiseFreq: { value: ENERGY_DEFAULTS.noiseFreq, min: 0.05, max: 4, step: 0.01, label: 'freq 1' },
      noiseAmp: { value: ENERGY_DEFAULTS.noiseAmp, min: 0, max: 2, step: 0.01, label: 'amp 1' },
      // Octave 2: fine, faster, for plasma texture.
      noiseFreq2: { value: ENERGY_DEFAULTS.noiseFreq2, min: 0.2, max: 10, step: 0.05, label: 'freq 2' },
      noiseAmp2: { value: ENERGY_DEFAULTS.noiseAmp2, min: 0, max: 1, step: 0.005, label: 'amp 2' },
      churnSpeed: { value: ENERGY_DEFAULTS.churnSpeed, min: 0, max: 1.5, step: 0.005, label: 'speed' },
    }),

    Look: folder({
      size: { value: ENERGY_DEFAULTS.size, min: 0.2, max: 12, step: 0.05 },
      sizeMin: { value: ENERGY_DEFAULTS.sizeMin, min: 0.05, max: 2, step: 0.01, label: 'size min' },
      sizeMax: { value: ENERGY_DEFAULTS.sizeMax, min: 0.5, max: 8, step: 0.05, label: 'size max' },
      // Higher skew = more tiny particles, fewer large ones.
      sizeSkew: { value: ENERGY_DEFAULTS.sizeSkew, min: 1, max: 8, step: 0.1, label: 'size skew' },
      attenuation: { value: ENERGY_DEFAULTS.attenuation, min: 0.5, max: 12, step: 0.1 },
      softness: { value: ENERGY_DEFAULTS.softness, min: 0.5, max: 10, step: 0.05 },
      brightness: { value: ENERGY_DEFAULTS.brightness, min: 0, max: 3, step: 0.01 },
    }),

    Colour: folder({
      colorCore: { value: energyPalette.core(), label: 'core' },
      // THE control for luminosity. Above 1.0 the core becomes genuine HDR
      // and the bloom threshold picks it out; at 1.0 it is a flat blue ball.
      coreHdr: { value: ENERGY_DEFAULTS.coreHdr, min: 1, max: 8, step: 0.05, label: 'core HDR' },
      coreRadius: { value: ENERGY_DEFAULTS.coreRadius, min: 0.05, max: 1, step: 0.01, label: 'core size' },
      colorBlue: { value: energyPalette.blue(), label: 'mid' },
      colorViolet: { value: energyPalette.violet(), label: 'edge' },
      colorSpread: {
        value: ENERGY_DEFAULTS.colorSpread,
        min: 0.1,
        max: 3,
        step: 0.01,
        label: 'ramp spread',
      },
      flowTint: {
        value: ENERGY_DEFAULTS.flowTint,
        min: 0,
        max: 2,
        step: 0.01,
        label: 'churn tint',
      },
    }),

    Cursor: folder({
      mouseRadius: { value: ENERGY_DEFAULTS.mouseRadius, min: 0, max: 1.5, step: 0.01, label: 'radius' },
      mouseRepel: { value: ENERGY_DEFAULTS.mouseRepel, min: 0, max: 0.4, step: 0.005, label: 'repel' },
      mouseSwirl: { value: ENERGY_DEFAULTS.mouseSwirl, min: 0, max: 0.4, step: 0.005, label: 'swirl' },
      cursorParallax: { value: ENERGY_DEFAULTS.cursorParallax, min: 0, max: 1, step: 0.01, label: 'parallax' },
    }),

    Focus: folder({
      focusDistance: { value: ENERGY_DEFAULTS.focusDistance, min: 1, max: 14, step: 0.1 },
      focusRange: { value: ENERGY_DEFAULTS.focusRange, min: 0.2, max: 14, step: 0.1 },
      focusFalloff: { value: ENERGY_DEFAULTS.focusFalloff, min: 0.2, max: 5, step: 0.05 },
      bokehScale: { value: ENERGY_DEFAULTS.bokehScale, min: 0, max: 8, step: 0.05 },
    }),

    'Scroll move': folder({
      scrollExpand: { value: ENERGY_DEFAULTS.scrollExpand, min: 0, max: 1.5, step: 0.01 },
      scrollIntensify: { value: ENERGY_DEFAULTS.scrollIntensify, min: 0, max: 3, step: 0.01 },
      scrollChurn: { value: ENERGY_DEFAULTS.scrollChurn, min: 0, max: 4, step: 0.05 },
    }),

    Motion: folder({
      pulseAmount: { value: ENERGY_DEFAULTS.pulseAmount, min: 0, max: 0.4, step: 0.005 },
      pulseSpeed: { value: ENERGY_DEFAULTS.pulseSpeed, min: 0, max: 3, step: 0.01 },
      rotationSpeed: { value: ENERGY_DEFAULTS.rotationSpeed, min: 0, max: 1, step: 0.005 },
    }),
  })

  return <EnergyMass {...controls} reducedMotion={reducedMotion} />
}
