/* IOTA — dev-only Leva wrapper around the atmosphere pieces.
   GlowHalo and Debris are tuned together because they are dialled in against
   each other: glow intensity and debris brightness trade directly, and
   adjusting one in isolation is misleading.

   As with the other tuners, this is the only file that imports leva for these
   components, and Scene.jsx loads it exclusively in dev. Numbers dialled in
   here belong back in GLOW_DEFAULTS / DEBRIS_DEFAULTS — that is what ships. */
import { folder, useControls } from 'leva'
import GlowHalo, { GLOW_DEFAULTS } from './GlowHalo'
import Debris, { DEBRIS_DEFAULTS } from './Debris'

export default function AtmosphereTuner({ reducedMotion }) {
  const glow = useControls('Glow', {
    size: { value: GLOW_DEFAULTS.size, min: 2, max: 26, step: 0.25 },
    positionZ: { value: GLOW_DEFAULTS.positionZ, min: -12, max: 1, step: 0.1, label: 'depth' },
    intensity: { value: GLOW_DEFAULTS.intensity, min: 0, max: 2, step: 0.01 },
    falloff: { value: GLOW_DEFAULTS.falloff, min: 0.5, max: 8, step: 0.05 },
    core: { value: GLOW_DEFAULTS.core, min: 0, max: 2, step: 0.01 },
    pulseFollow: { value: GLOW_DEFAULTS.pulseFollow, min: 0, max: 6, step: 0.05, label: 'pulse follow' },
  })

  const debris = useControls('Debris', {
    Field: folder(
      {
        count: { value: DEBRIS_DEFAULTS.count, min: 0, max: 2000, step: 20 },
        spreadX: { value: DEBRIS_DEFAULTS.spreadX, min: 2, max: 24, step: 0.5 },
        spreadY: { value: DEBRIS_DEFAULTS.spreadY, min: 2, max: 18, step: 0.5 },
        nearZ: { value: DEBRIS_DEFAULTS.nearZ, min: 0, max: 5.6, step: 0.1 },
        farZ: { value: DEBRIS_DEFAULTS.farZ, min: -20, max: 0, step: 0.5 },
      },
      { collapsed: true },
    ),
    Look: folder({
      size: { value: DEBRIS_DEFAULTS.size, min: 0.2, max: 10, step: 0.05 },
      attenuation: { value: DEBRIS_DEFAULTS.attenuation, min: 0.5, max: 10, step: 0.1 },
      softness: { value: DEBRIS_DEFAULTS.softness, min: 0.5, max: 6, step: 0.05 },
      brightness: { value: DEBRIS_DEFAULTS.brightness, min: 0, max: 2, step: 0.01 },
    }),
    Drift: folder({
      drift: { value: DEBRIS_DEFAULTS.drift, min: 0, max: 2, step: 0.01, label: 'amount' },
      driftSpeed: { value: DEBRIS_DEFAULTS.driftSpeed, min: 0, max: 1, step: 0.005, label: 'speed' },
    }),
    Fog: folder({
      fogNear: { value: DEBRIS_DEFAULTS.fogNear, min: 0, max: 20, step: 0.25 },
      fogFar: { value: DEBRIS_DEFAULTS.fogFar, min: 1, max: 40, step: 0.5 },
      fogStrength: { value: DEBRIS_DEFAULTS.fogStrength, min: 0, max: 1, step: 0.01 },
    }),
  })

  return (
    <>
      <GlowHalo {...glow} reducedMotion={reducedMotion} />
      <Debris {...debris} reducedMotion={reducedMotion} />
    </>
  )
}
