/* IOTA — volumetric glow behind the mass.
   A large additive quad with a soft radial falloff, standing in for the light
   source the mass appears to be lit by. It is also the seed a god-ray pass
   would sample from if one is added later.

   It breathes off `choreo.heroPulse`, which EnergyMass publishes each frame.
   Giving this its own sin() would look right for a few seconds and then drift
   out of phase with the mass — two close-but-unequal frequencies beat against
   each other, and the result reads as a bug rather than a rhythm. */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Vector3 } from 'three'
import vertexShader from './shaders/glow.vert.glsl'
import fragmentShader from './shaders/glow.frag.glsl'
import { atmospherePalette, hexToVec3 } from './palette'
import { choreo } from '../lib/choreography'

export const GLOW_DEFAULTS = {
  size: 2,
  // Sits behind the mass (which spans roughly z -1.5..1.5) so it reads as a
  // source the mass is silhouetted against.
  positionZ: -3.2,
  intensity: 0.34,
  // Falloff exponent. Higher = tighter, more like a lamp; lower = a broad wash.
  falloff: 2.6,
  core: 0.45,
  // How much of the mass's breathing the glow inherits. 1 = exactly in step.
  pulseFollow: 1.6,
  // The atmosphere darkens as the camera pushes in, so the mass itself becomes
  // the only light left in frame.
  scrollDim: 0.75,
}

export default function GlowHalo({
  size = GLOW_DEFAULTS.size,
  positionZ = GLOW_DEFAULTS.positionZ,
  intensity = GLOW_DEFAULTS.intensity,
  falloff = GLOW_DEFAULTS.falloff,
  core = GLOW_DEFAULTS.core,
  pulseFollow = GLOW_DEFAULTS.pulseFollow,
  scrollDim = GLOW_DEFAULTS.scrollDim,
  color,
  reducedMotion = false,
}) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Vector3(1, 1, 1) },
      uIntensity: { value: intensity },
      uPulse: { value: 1 },
      uFalloff: { value: falloff },
      uCore: { value: core },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    // Cool white-blue. --c-glow is designated "the brightest pixel" in
    // DESIGN.md §2, which is exactly the right temperature for a light source.
    hexToVec3(color ?? atmospherePalette.glow(), uniforms.uColor.value)
  }, [color, uniforms])

  const mesh = useRef(null)

  useFrame(() => {
    // Amplify the mass's pulse a little: a light source visibly swelling reads
    // better than one moving by the same few percent the mass does.
    const pulse = reducedMotion
      ? 1
      : 1 + (choreo.heroPulse - 1) * pulseFollow

    uniforms.uPulse.value = pulse
    uniforms.uIntensity.value =
      intensity * (1 - choreo.heroProgress * scrollDim)
    uniforms.uFalloff.value = falloff
    uniforms.uCore.value = core

    if (mesh.current) mesh.current.scale.setScalar(pulse)
  })

  return (
    <mesh ref={mesh} position={[0, 0, positionZ]}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={AdditiveBlending}
        depthWrite={false}
        // Depth test off: it sits behind everything by construction, and
        // testing it against the additive particle soup in front only risks
        // it punching through.
        depthTest={false}
      />
    </mesh>
  )
}
