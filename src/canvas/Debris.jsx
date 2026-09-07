/* IOTA — foreground debris.
   A few hundred slow-drifting specks at varied depths around and in front of
   the mass. Their entire job is to give the scene scale and parallax: without
   something nearby to judge against, a glowing volume on black has no size and
   no distance.

   Deliberately sparse. This is the element most likely to look cheap if
   overdone — a dense field of foreground dust reads as a screensaver, a few
   hundred specks read as depth. */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Vector3 } from 'three'
import vertexShader from './shaders/debris.vert.glsl'
import fragmentShader from './shaders/debris.frag.glsl'
import { atmospherePalette, hexToVec3 } from './palette'
import { choreo } from '../lib/choreography'

export const DEBRIS_DEFAULTS = {
  count: 420,
  // Seeding volume. The near bound stops short of the camera (z=6) so nothing
  // ever fills the frame with a single enormous speck.
  spreadX: 11,
  spreadY: 7,
  nearZ: 4.4,
  farZ: -6,

  size: 2.4,
  attenuation: 2.6,
  softness: 2.4,
  brightness: 0.5,

  drift: 0.17,
  driftSpeed: 0,

  fogNear: 5,
  fogFar: 17,
  fogStrength: 0.9,

  // Same focus plane as the mass, but a tighter range and a bigger bokeh:
  // debris exists to be out of focus, which is what makes it read as
  // foreground rather than as more of the mass.
  focusDistance: 6,
  focusRange: 2.6,
  focusFalloff: 1.2,
  bokehScale: 3.2,

  // Fades out through the Home -> Roadmap move along with the rest of the
  // atmosphere.
  scrollDim: 0.85,
}

export default function Debris({
  count = DEBRIS_DEFAULTS.count,
  spreadX = DEBRIS_DEFAULTS.spreadX,
  spreadY = DEBRIS_DEFAULTS.spreadY,
  nearZ = DEBRIS_DEFAULTS.nearZ,
  farZ = DEBRIS_DEFAULTS.farZ,
  size = DEBRIS_DEFAULTS.size,
  attenuation = DEBRIS_DEFAULTS.attenuation,
  softness = DEBRIS_DEFAULTS.softness,
  brightness = DEBRIS_DEFAULTS.brightness,
  drift = DEBRIS_DEFAULTS.drift,
  driftSpeed = DEBRIS_DEFAULTS.driftSpeed,
  fogNear = DEBRIS_DEFAULTS.fogNear,
  fogFar = DEBRIS_DEFAULTS.fogFar,
  fogStrength = DEBRIS_DEFAULTS.fogStrength,
  focusDistance = DEBRIS_DEFAULTS.focusDistance,
  focusRange = DEBRIS_DEFAULTS.focusRange,
  focusFalloff = DEBRIS_DEFAULTS.focusFalloff,
  bokehScale = DEBRIS_DEFAULTS.bokehScale,
  scrollDim = DEBRIS_DEFAULTS.scrollDim,
  colorA,
  colorB,
  reducedMotion = false,
}) {
  const elapsed = useRef(0)

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3

      positions[i3] = (Math.random() * 2 - 1) * spreadX
      positions[i3 + 1] = (Math.random() * 2 - 1) * spreadY
      // Biased toward the camera so more specks land in front of the mass,
      // where parallax actually reads.
      positions[i3 + 2] = farZ + Math.pow(Math.random(), 0.65) * (nearZ - farZ)

      seeds[i3] = Math.random() // drift phase
      seeds[i3 + 1] = Math.random() // size jitter
      seeds[i3 + 2] = Math.random() // brightness / colour jitter
    }

    return { positions, seeds }
  }, [count, spreadX, spreadY, nearZ, farZ])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDrift: { value: drift },
      uDriftSpeed: { value: driftSpeed },
      uSize: { value: size },
      uPixelRatio: { value: 1 },
      uAttenuation: { value: attenuation },
      uBrightness: { value: brightness },
      uFogNear: { value: fogNear },
      uFogFar: { value: fogFar },
      uFogStrength: { value: fogStrength },
      uFocusDistance: { value: focusDistance },
      uFocusRange: { value: focusRange },
      uFocusFalloff: { value: focusFalloff },
      uBokehScale: { value: bokehScale },
      uColorA: { value: new Vector3(1, 1, 1) },
      uColorB: { value: new Vector3(1, 1, 1) },
      uSoftness: { value: softness },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    hexToVec3(colorA ?? atmospherePalette.debrisDim(), uniforms.uColorA.value)
    hexToVec3(colorB ?? atmospherePalette.debrisLit(), uniforms.uColorB.value)
  }, [colorA, colorB, uniforms])

  useFrame((state, delta) => {
    if (!reducedMotion) elapsed.current += Math.min(delta, 0.05)

    uniforms.uTime.value = elapsed.current
    uniforms.uDrift.value = drift
    uniforms.uDriftSpeed.value = driftSpeed
    uniforms.uSize.value = size
    uniforms.uAttenuation.value = attenuation
    uniforms.uBrightness.value =
      brightness * (1 - choreo.heroProgress * scrollDim)
    uniforms.uFogNear.value = fogNear
    uniforms.uFogFar.value = fogFar
    uniforms.uFogStrength.value = fogStrength
    uniforms.uFocusDistance.value = focusDistance
    uniforms.uFocusRange.value = focusRange
    uniforms.uFocusFalloff.value = focusFalloff
    uniforms.uBokehScale.value = bokehScale
    uniforms.uSoftness.value = softness
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()
  })

  return (
    <points key={count} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aDebris" args={[seeds, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest
      />
    </points>
  )
}
