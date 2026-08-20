/* IOTA — the centerpiece.
   A high-subdivision icosahedron displaced by fbm noise in the vertex shader
   and shaded as iridescent glass/chrome in the fragment shader. Abstract by
   design: this is the emotional anchor of the page, not a model of anything.

   Reads three inputs every frame — time, the hero scroll progress, and the
   pointer — and damps toward all of them rather than tracking them directly
   (DESIGN.md §5). */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DataTexture, RGBAFormat } from 'three'
import vertexShader from './shaders/blob.vert.glsl'
import fragmentShader from './shaders/blob.frag.glsl'
import { blobPalette, hexToVec3 } from './palette'
import { usePointer } from '../hooks/usePointer'
import { choreo } from '../lib/choreography'
import { dampFactor } from '../lib/math'

export const BLOB_DEFAULTS = {
  radius: 1.15,
  // Subdivision. IcosahedronGeometry is non-indexed, so vertex count grows as
  // 60 * (detail + 1)^2 — 32 is already ~65k vertices.
  detail: 32,
  distort: 0.42,
  noiseScale: 0.9,
  noiseSpeed: 0.18,
  fresnelPower: 2.6,
  fresnelStrength: 0.55,
  rimStrength: 1.2,
  iridescence: 1.6,
  envIntensity: 1.15,
  exposure: 1.1,
  rotationSpeed: 0.08,
  cursorDrift: 0.28,
  // How far the Home -> Roadmap move pushes each property.
  scrollScale: 0.72,
  scrollSpin: 1.8,
  scrollDistort: 0.9,
}

export default function Blob({
  radius = BLOB_DEFAULTS.radius,
  detail = BLOB_DEFAULTS.detail,
  distort = BLOB_DEFAULTS.distort,
  noiseScale = BLOB_DEFAULTS.noiseScale,
  noiseSpeed = BLOB_DEFAULTS.noiseSpeed,
  fresnelPower = BLOB_DEFAULTS.fresnelPower,
  fresnelStrength = BLOB_DEFAULTS.fresnelStrength,
  rimStrength = BLOB_DEFAULTS.rimStrength,
  iridescence = BLOB_DEFAULTS.iridescence,
  envIntensity = BLOB_DEFAULTS.envIntensity,
  exposure = BLOB_DEFAULTS.exposure,
  rotationSpeed = BLOB_DEFAULTS.rotationSpeed,
  cursorDrift = BLOB_DEFAULTS.cursorDrift,
  scrollScale = BLOB_DEFAULTS.scrollScale,
  scrollSpin = BLOB_DEFAULTS.scrollSpin,
  scrollDistort = BLOB_DEFAULTS.scrollDistort,
  envMap = null,
  reducedMotion = false,
}) {
  const mesh = useRef(null)
  const pointer = usePointer()
  const progress = useRef(0)
  const drift = useRef({ x: 0, y: 0 })

  // A sampler uniform must always have a texture bound, even before the HDR
  // arrives. uHasEnv keeps the shader on its analytic environment until then.
  const blankTexture = useMemo(() => {
    const texture = new DataTexture(
      new Uint8Array([255, 255, 255, 255]),
      1,
      1,
      RGBAFormat,
    )
    texture.needsUpdate = true
    return texture
  }, [])

  useEffect(() => () => blankTexture.dispose(), [blankTexture])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseScale: { value: noiseScale },
      uNoiseSpeed: { value: noiseSpeed },
      uDistort: { value: distort },

      uColorBlue: { value: hexToVec3(blobPalette.blue()) },
      uColorViolet: { value: hexToVec3(blobPalette.violet()) },
      uColorGlow: { value: hexToVec3(blobPalette.glow()) },
      uEnvLow: { value: hexToVec3(blobPalette.envLow()) },
      uEnvHigh: { value: hexToVec3(blobPalette.envHigh()) },

      uEnvMap: { value: blankTexture },
      uHasEnv: { value: 0 },
      uEnvIntensity: { value: envIntensity },

      uFresnelPower: { value: fresnelPower },
      uFresnelStrength: { value: fresnelStrength },
      uRimStrength: { value: rimStrength },
      uIridescence: { value: iridescence },
      uExposure: { value: exposure },
    }),
    // Built once; every value below is mutated in place each frame. Rebuilding
    // this object would recompile the shader program.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blankTexture],
  )

  // The HDR is ~1.7 MB, so it lands well after first paint. Bind it as soon as
  // it exists but let useFrame cross-fade uHasEnv, otherwise the reflections
  // visibly snap the moment the download finishes.
  const envBlend = useRef(0)
  useEffect(() => {
    uniforms.uEnvMap.value = envMap ?? blankTexture
    if (!envMap) {
      envBlend.current = 0
      uniforms.uHasEnv.value = 0
    }
  }, [envMap, blankTexture, uniforms])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const object = mesh.current
    if (!object) return

    // Material settings are synced first, so they stay correct on the single
    // frame the reduced-motion path renders.
    uniforms.uNoiseScale.value = noiseScale
    uniforms.uNoiseSpeed.value = noiseSpeed
    uniforms.uEnvIntensity.value = envIntensity
    uniforms.uFresnelPower.value = fresnelPower
    uniforms.uFresnelStrength.value = fresnelStrength
    uniforms.uRimStrength.value = rimStrength
    uniforms.uIridescence.value = iridescence
    uniforms.uExposure.value = exposure

    // Reduced motion: no auto-morph, no idle spin, no scroll scrub, no cursor
    // drift. The blob holds one still pose — which is the point.
    if (reducedMotion) {
      object.position.set(0, 0, 0)
      object.scale.setScalar(1)
      uniforms.uDistort.value = distort
      return
    }

    // Damp toward the scroll target rather than binding to it 1:1 — the
    // difference between "premium" and "twitchy" (DESIGN.md §5).
    progress.current +=
      (choreo.heroProgress - progress.current) * dampFactor(dt, 6)
    const p = progress.current

    // Cursor drift: the blob leans toward the pointer, it does not chase it.
    const pointerState = pointer.current
    drift.current.x +=
      (pointerState.tx * cursorDrift - drift.current.x) * dampFactor(dt, 3)
    drift.current.y +=
      (pointerState.ty * cursorDrift - drift.current.y) * dampFactor(dt, 3)

    object.position.x = drift.current.x
    object.position.y = drift.current.y + p * 0.5

    // Constant idle spin, plus an extra turn scrubbed by the scroll move.
    object.rotation.y += dt * rotationSpeed
    object.rotation.x = p * scrollSpin * 0.35
    object.rotation.z = p * scrollSpin * 0.2

    const scale = 1 - p * (1 - scrollScale)
    object.scale.setScalar(scale)

    // Cross-fade in the real environment once it has arrived.
    if (envMap) {
      envBlend.current += (1 - envBlend.current) * dampFactor(dt, 2.5)
      uniforms.uHasEnv.value = envBlend.current
    }

    uniforms.uTime.value += dt
    uniforms.uDistort.value = distort * (1 + p * scrollDistort)
  })

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      {/* key forces a fresh geometry when the subdivision changes. */}
      <icosahedronGeometry key={`${radius}-${detail}`} args={[radius, detail]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
