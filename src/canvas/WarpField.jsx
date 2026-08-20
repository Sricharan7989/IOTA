/* IOTA — the signature background: a GPU particle warp.
   A single THREE.Points draw call of ~100k particles streaking outward from
   the vanishing point. Every particle's motion is computed in the vertex
   shader from its seed plus a handful of uniforms, so the per-frame CPU cost
   is a dozen scalar writes regardless of particle count.

   All tunables arrive as props. The Leva panel that drives them lives in
   WarpFieldTuner.jsx, which is dev-only — this component ships with the
   defaults below and never imports leva. */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Vector2, Vector3 } from 'three'
import vertexShader from './shaders/warp.vert.glsl'
import fragmentShader from './shaders/warp.frag.glsl'
import { hexToVec3, warpPalette } from './palette'
import { usePointer } from '../hooks/usePointer'
import { scrollState } from '../lib/scroll'

/** Frame-rate independent damping factor — DESIGN.md §5. */
const damp = (dt, lambda) => 1 - Math.exp(-lambda * dt)

export const WARP_DEFAULTS = {
  count: 100000,
  radius: 9,
  near: 0.9,
  far: 55,
  baseSpeed: 7,
  boostSpeed: 38,
  size: 2.6,
  maxSize: 26,
  streak: 0.55,
  brightness: 1,
  softness: 1.8,
  repelRadius: 0.42,
  repelStrength: 0.16,
  mixBlue: 0.6,
  mixViolet: 0.3,
  // Lenis velocity that counts as "full throttle" scrolling. Lower = the warp
  // reacts to gentler scrolls.
  scrollScale: 22,
  scrollInfluence: 1,
}

export default function WarpField({
  count = WARP_DEFAULTS.count,
  radius = WARP_DEFAULTS.radius,
  near = WARP_DEFAULTS.near,
  far = WARP_DEFAULTS.far,
  baseSpeed = WARP_DEFAULTS.baseSpeed,
  boostSpeed = WARP_DEFAULTS.boostSpeed,
  size = WARP_DEFAULTS.size,
  maxSize = WARP_DEFAULTS.maxSize,
  streak = WARP_DEFAULTS.streak,
  brightness = WARP_DEFAULTS.brightness,
  softness = WARP_DEFAULTS.softness,
  repelRadius = WARP_DEFAULTS.repelRadius,
  repelStrength = WARP_DEFAULTS.repelStrength,
  mixBlue = WARP_DEFAULTS.mixBlue,
  mixViolet = WARP_DEFAULTS.mixViolet,
  scrollScale = WARP_DEFAULTS.scrollScale,
  scrollInfluence = WARP_DEFAULTS.scrollInfluence,
  colorBlue,
  colorViolet,
  colorWhite,
}) {
  // Returns a ref rather than state — see the note in usePointer.js.
  const pointer = usePointer()

  // Accumulated travel distance and smoothed boost. Refs, not state: these
  // change every frame and must never trigger a React render.
  const travel = useRef(0)
  const boost = useRef(0)
  const reduced = useRef(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      reduced.current = query.matches
    }
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  // ---- Seeds -------------------------------------------------------------
  // Only depends on count. Radius, speed and colour are all uniforms, so
  // dragging those sliders never touches this buffer.
  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3
      const angle = Math.random() * Math.PI * 2
      // sqrt() keeps the disc uniform by area; without it particles bunch up
      // against the tunnel axis and the field looks like a dense cord.
      const r = Math.sqrt(Math.random())

      positions[i3] = Math.cos(angle) * r
      positions[i3 + 1] = Math.sin(angle) * r
      positions[i3 + 2] = Math.random() // start phase along the tunnel

      randoms[i3] = Math.random() // speed jitter
      randoms[i3 + 1] = Math.random() // size jitter
      randoms[i3 + 2] = Math.random() // colour lottery
    }

    return { positions, randoms }
  }, [count])

  // ---- Uniforms ----------------------------------------------------------
  // Built once and mutated in place. Rebuilding this object would recompile
  // the shader program.
  const uniforms = useMemo(
    () => ({
      uTravel: { value: 0 },
      uTime: { value: 0 },
      uNear: { value: near },
      uFar: { value: far },
      uRadius: { value: radius },
      uSize: { value: size },
      uMaxSize: { value: maxSize },
      uPixelRatio: { value: 1 },
      uBrightness: { value: brightness },
      uMouse: { value: new Vector2(0, 0) },
      uRepelRadius: { value: repelRadius },
      uRepelStrength: { value: repelStrength },
      uAspect: { value: 1 },
      uSpeed: { value: baseSpeed },
      uStreak: { value: streak },
      uColorBlue: { value: new Vector3(1, 1, 1) },
      uColorViolet: { value: new Vector3(1, 1, 1) },
      uColorWhite: { value: new Vector3(1, 1, 1) },
      uMixBlue: { value: mixBlue },
      uMixViolet: { value: mixViolet },
      uSoftness: { value: softness },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Colours are hex strings, so parse them only when they actually change
  // rather than once per frame.
  useEffect(() => {
    hexToVec3(colorBlue ?? warpPalette.blue(), uniforms.uColorBlue.value)
    hexToVec3(colorViolet ?? warpPalette.violet(), uniforms.uColorViolet.value)
    hexToVec3(colorWhite ?? warpPalette.white(), uniforms.uColorWhite.value)
  }, [colorBlue, colorViolet, colorWhite, uniforms])

  useFrame((state, delta) => {
    // A backgrounded tab returns one enormous delta; clamping stops the field
    // from jumping half a tunnel on the first frame back.
    const dt = Math.min(delta, 0.05)
    const isReduced = reduced.current

    // ---- Pointer ---------------------------------------------------------
    const p = pointer.current
    p.x += (p.tx - p.x) * damp(dt, 12)
    p.y += (p.ty - p.y) * damp(dt, 12)
    uniforms.uMouse.value.set(p.x, p.y)

    // ---- Boost -----------------------------------------------------------
    // Two energy sources feed one boost: holding the pointer, and scrolling.
    // Lenis publishes an already-smoothed velocity, so it needs normalising
    // but no extra filtering of its own.
    const scrollNorm = Math.min(
      1,
      Math.abs(scrollState.velocity) / Math.max(scrollScale, 0.001),
    )
    const target = Math.min(1, (p.down ? 1 : 0) + scrollNorm * scrollInfluence)
    // Accelerating harder than it decays makes the hold feel responsive while
    // the release still eases out.
    boost.current += (target - boost.current) * damp(dt, target > boost.current ? 6 : 2.2)

    const speed = baseSpeed + boost.current * boostSpeed

    // DESIGN.md §5: reduced motion freezes the field. Cursor repulsion stays,
    // since that is direct user input rather than ambient motion.
    if (!isReduced) {
      travel.current += dt * speed
      uniforms.uTime.value += dt
    }

    // ---- Sync tunables ---------------------------------------------------
    uniforms.uTravel.value = travel.current
    uniforms.uSpeed.value = isReduced ? 0 : speed
    uniforms.uNear.value = near
    uniforms.uFar.value = far
    uniforms.uRadius.value = radius
    uniforms.uSize.value = size
    uniforms.uMaxSize.value = maxSize
    uniforms.uBrightness.value = brightness
    uniforms.uStreak.value = isReduced ? 0 : streak
    uniforms.uSoftness.value = softness
    uniforms.uRepelRadius.value = repelRadius
    uniforms.uRepelStrength.value = repelStrength
    uniforms.uMixBlue.value = mixBlue
    uniforms.uMixViolet.value = mixViolet
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    uniforms.uAspect.value = state.size.width / state.size.height
  })

  return (
    <points
      // The shader works in view space and ignores the model matrix, so the
      // geometry's bounding sphere is meaningless — culling would pop the
      // whole field out of existence.
      frustumCulled={false}
      renderOrder={-1}
      // Recreate the buffers outright when the particle count changes.
      key={count}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        // Additive so overlapping particles bloom into each other, and
        // depth-write off so they never occlude one another. depthTest stays
        // on so the Phase 3 centerpiece can occlude the field (DESIGN.md §6).
        blending={AdditiveBlending}
        depthWrite={false}
        depthTest
      />
    </points>
  )
}
