/* IOTA — the energy mass centerpiece.
   A dense volume of particles advected through two octaves of curl noise in
   the vertex shader, so the mass roils like plasma with structure at more than
   one scale. One THREE.Points draw call; the CPU writes uniforms and never
   touches a particle.

   Three things carry the look, in order of importance:
     1. The HDR core. Colour is pushed above 1.0 at the centre, survives into
        the composer's half-float buffer, and is the only thing a ~1.0 bloom
        threshold picks up. That is the difference between a light source and
        a flat blue ball.
     2. Overlap. Particles concentrate hard toward the centre (coreBias > 1)
        and draw as soft Gaussian sprites, so they blend into continuous light
        instead of reading as separate dots.
     3. Two noise scales. A slow swirl carries the mass; a fine, faster octave
        gives it texture.

   All tunables arrive as props. The Leva panel lives in EnergyMassTuner.jsx,
   which is dev-only — this component ships with the defaults below and never
   imports leva. */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Vector2, Vector3 } from 'three'
import vertexShader from './shaders/energy.vert.glsl'
import fragmentShader from './shaders/energy.frag.glsl'
import { energyPalette, hexToVec3 } from './palette'
import { choreo } from '../lib/choreography'
import { usePointer } from '../hooks/usePointer'
import { dampFactor, smoothstep } from '../lib/math'

export const ENERGY_DEFAULTS = {
  // Each particle costs 24 noise samples (two 12-sample curl octaves), so this
  // is roughly 2.7x the per-frame shader work of the previous single-octave
  // build at 120k. Push it in Leva and watch the r3f-perf GPU figure.
  count: 160000,
  radius: 1.55,
  shapeX: 1,
  shapeY: 0.86,
  shapeZ: 1,
  // Radial distribution exponent. 1/3 would be uniform density through the
  // volume; above 1 concentrates hard toward the centre, which is what makes
  // the core dense enough for sprites to overlap into continuous light.
  coreBias: 1.6,

  // Octave 1 — the large, slow swirl that carries the whole mass.
  noiseFreq: 0.62,
  noiseAmp: 0.5,
  // Octave 2 — fine and faster, for plasma texture.
  noiseFreq2: 2.35,
  noiseAmp2: 0.14,
  churnSpeed: 0.01,

  // Silhouette warp, so the volume is not a perfect sphere.
  shapeFreq: 1.5,
  shapeAmp: 0.3,
  shapeSpeed: 0.05,

  // Filaments trailing off the body.
  streamerFraction: 0.1,
  streamerAmp: 3.4,

  size: 3.4,
  // Skewed hard toward small: most particles tiny, a rare few large.
  sizeMin: 0.45,
  sizeMax: 2.6,
  sizeSkew: 3,
  attenuation: 3.4,
  // Gaussian exponent. Higher is tighter; lower is softer and more blended.
  softness: 3.4,
  brightness: 1,

  colorSpread: 1.25,
  flowTint: 0.22,

  // HDR core. Anything above 1.0 survives into the composer's half-float
  // buffer, which is what a ~1.0 bloom threshold keys off.
  coreHdr: 2.8,
  coreRadius: 0.42,

  pulseAmount: 0.04,
  pulseSpeed: 0.5,
  rotationSpeed: 0.06,

  fogNear: 3.6,
  fogFar: 12,
  fogStrength: 0.55,

  focusDistance: 5.5,
  focusRange: 4.5,
  focusFalloff: 1.6,
  bokehScale: 1.5,

  mouseRadius: 0.36,
  mouseRepel: 0.06,
  mouseSwirl: 0.07,
  cursorParallax: 0.16,

  scrollExpand: 0.22,
  scrollIntensify: 0.45,
  scrollChurn: 0.9,
  // The mass is the HERO's centerpiece and nothing else's. It intensifies
  // through the push-in, then fades out over the tail of the move so the
  // sections below scroll onto clean black. Without this it stays lit under
  // the Roadmap and fights the copy for attention.
  scrollFadeStart: 0.55,
}

export default function EnergyMass({
  count = ENERGY_DEFAULTS.count,
  radius = ENERGY_DEFAULTS.radius,
  shapeX = ENERGY_DEFAULTS.shapeX,
  shapeY = ENERGY_DEFAULTS.shapeY,
  shapeZ = ENERGY_DEFAULTS.shapeZ,
  coreBias = ENERGY_DEFAULTS.coreBias,
  noiseFreq = ENERGY_DEFAULTS.noiseFreq,
  noiseAmp = ENERGY_DEFAULTS.noiseAmp,
  noiseFreq2 = ENERGY_DEFAULTS.noiseFreq2,
  noiseAmp2 = ENERGY_DEFAULTS.noiseAmp2,
  churnSpeed = ENERGY_DEFAULTS.churnSpeed,
  shapeFreq = ENERGY_DEFAULTS.shapeFreq,
  shapeAmp = ENERGY_DEFAULTS.shapeAmp,
  shapeSpeed = ENERGY_DEFAULTS.shapeSpeed,
  streamerFraction = ENERGY_DEFAULTS.streamerFraction,
  streamerAmp = ENERGY_DEFAULTS.streamerAmp,
  size = ENERGY_DEFAULTS.size,
  sizeMin = ENERGY_DEFAULTS.sizeMin,
  sizeMax = ENERGY_DEFAULTS.sizeMax,
  sizeSkew = ENERGY_DEFAULTS.sizeSkew,
  attenuation = ENERGY_DEFAULTS.attenuation,
  softness = ENERGY_DEFAULTS.softness,
  brightness = ENERGY_DEFAULTS.brightness,
  colorSpread = ENERGY_DEFAULTS.colorSpread,
  flowTint = ENERGY_DEFAULTS.flowTint,
  coreHdr = ENERGY_DEFAULTS.coreHdr,
  coreRadius = ENERGY_DEFAULTS.coreRadius,
  pulseAmount = ENERGY_DEFAULTS.pulseAmount,
  pulseSpeed = ENERGY_DEFAULTS.pulseSpeed,
  rotationSpeed = ENERGY_DEFAULTS.rotationSpeed,
  fogNear = ENERGY_DEFAULTS.fogNear,
  fogFar = ENERGY_DEFAULTS.fogFar,
  fogStrength = ENERGY_DEFAULTS.fogStrength,
  focusDistance = ENERGY_DEFAULTS.focusDistance,
  focusRange = ENERGY_DEFAULTS.focusRange,
  focusFalloff = ENERGY_DEFAULTS.focusFalloff,
  bokehScale = ENERGY_DEFAULTS.bokehScale,
  mouseRadius = ENERGY_DEFAULTS.mouseRadius,
  mouseRepel = ENERGY_DEFAULTS.mouseRepel,
  mouseSwirl = ENERGY_DEFAULTS.mouseSwirl,
  cursorParallax = ENERGY_DEFAULTS.cursorParallax,
  scrollExpand = ENERGY_DEFAULTS.scrollExpand,
  scrollIntensify = ENERGY_DEFAULTS.scrollIntensify,
  scrollChurn = ENERGY_DEFAULTS.scrollChurn,
  scrollFadeStart = ENERGY_DEFAULTS.scrollFadeStart,
  colorCore,
  colorBlue,
  colorViolet,
  reducedMotion = false,
}) {
  const group = useRef(null)
  const elapsed = useRef(0)
  const pointer = usePointer()
  // Damped copies of the scroll and cursor targets. DESIGN.md §5: scroll-linked
  // 3D is damped, never bound 1:1.
  const progress = useRef(0)
  const drift = useRef({ x: 0, y: 0 })

  // ---- Seeds -------------------------------------------------------------
  // Depends only on the volume parameters. Noise, colour and size are all
  // uniforms, so dragging those sliders never rebuilds this.
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    // vec4: normalised radius, size roll, brightness jitter, streamer roll.
    const seeds = new Float32Array(count * 4)

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3
      const i4 = i * 4

      // Uniform direction on the unit sphere. Sampling cos(theta) flat is what
      // keeps particles from bunching at the poles.
      const cosTheta = Math.random() * 2 - 1
      const phi = Math.random() * Math.PI * 2
      const sinTheta = Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta))

      const dirX = sinTheta * Math.cos(phi)
      const dirY = cosTheta
      const dirZ = sinTheta * Math.sin(phi)

      // pow(random, coreBias) with coreBias above 1 pulls the distribution
      // toward the centre. At 1/3 this is uniform density through the volume;
      // at 1.6 the core is dense enough for sprites to overlap into continuous
      // light, which is the entire point of the change.
      const normalisedRadius = Math.pow(Math.random(), coreBias)
      const r = radius * normalisedRadius

      positions[i3] = dirX * r * shapeX
      positions[i3 + 1] = dirY * r * shapeY
      positions[i3 + 2] = dirZ * r * shapeZ

      seeds[i4] = normalisedRadius
      seeds[i4 + 1] = Math.random()
      seeds[i4 + 2] = Math.random()
      seeds[i4 + 3] = Math.random()
    }

    return { positions, seeds }
  }, [count, radius, shapeX, shapeY, shapeZ, coreBias])

  // ---- Uniforms ----------------------------------------------------------
  // Built once and mutated in place. Rebuilding this object would recompile
  // the shader program every frame.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseFreq: { value: noiseFreq },
      uNoiseAmp: { value: noiseAmp },
      uNoiseFreq2: { value: noiseFreq2 },
      uNoiseAmp2: { value: noiseAmp2 },
      uChurnSpeed: { value: churnSpeed },
      uShapeFreq: { value: shapeFreq },
      uShapeAmp: { value: shapeAmp },
      uShapeSpeed: { value: shapeSpeed },
      uStreamerFraction: { value: streamerFraction },
      uStreamerAmp: { value: streamerAmp },
      uSize: { value: size },
      uSizeMin: { value: sizeMin },
      uSizeMax: { value: sizeMax },
      uSizeSkew: { value: sizeSkew },
      uPixelRatio: { value: 1 },
      uAttenuation: { value: attenuation },
      uBrightness: { value: brightness },
      uPulse: { value: 1 },
      uColorSpread: { value: colorSpread },
      uFlowTint: { value: flowTint },
      uCoreHdr: { value: coreHdr },
      uCoreRadius: { value: coreRadius },
      uColorCore: { value: new Vector3(1, 1, 1) },
      uColorBlue: { value: new Vector3(1, 1, 1) },
      uColorViolet: { value: new Vector3(1, 1, 1) },
      uSoftness: { value: softness },
      uFogNear: { value: fogNear },
      uFogFar: { value: fogFar },
      uFogStrength: { value: fogStrength },
      uFocusDistance: { value: focusDistance },
      uFocusRange: { value: focusRange },
      uFocusFalloff: { value: focusFalloff },
      uBokehScale: { value: bokehScale },
      uMouse: { value: new Vector2(0, 0) },
      uAspect: { value: 1 },
      uMouseRadius: { value: mouseRadius },
      uMouseRepel: { value: mouseRepel },
      uMouseSwirl: { value: mouseSwirl },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Colours are hex strings, so parse them only when they actually change
  // rather than once per frame.
  useEffect(() => {
    hexToVec3(colorCore ?? energyPalette.core(), uniforms.uColorCore.value)
    hexToVec3(colorBlue ?? energyPalette.blue(), uniforms.uColorBlue.value)
    hexToVec3(colorViolet ?? energyPalette.violet(), uniforms.uColorViolet.value)
  }, [colorCore, colorBlue, colorViolet, uniforms])

  useFrame((state, delta) => {
    // A backgrounded tab returns one enormous delta; clamping stops the mass
    // from lurching on the first frame back.
    const dt = Math.min(delta, 0.05)
    const object = group.current

    if (!reducedMotion) {
      elapsed.current += dt
    }

    // ---- Scroll + cursor targets, both damped -----------------------------
    const p = reducedMotion
      ? 0
      : (progress.current +=
          (choreo.heroProgress - progress.current) * dampFactor(dt, 5))

    const pointerState = pointer.current
    if (reducedMotion) {
      uniforms.uMouse.value.set(0, 0)
      drift.current.x = 0
      drift.current.y = 0
    } else {
      pointerState.x += (pointerState.tx - pointerState.x) * dampFactor(dt, 10)
      pointerState.y += (pointerState.ty - pointerState.y) * dampFactor(dt, 10)
      uniforms.uMouse.value.set(pointerState.x, pointerState.y)

      drift.current.x +=
        (pointerState.tx * cursorParallax - drift.current.x) * dampFactor(dt, 2.5)
      drift.current.y +=
        (pointerState.ty * cursorParallax - drift.current.y) * dampFactor(dt, 2.5)
    }

    // Breathing: one sine drives both the scale and the brightness, so the
    // mass swells and glows together rather than in two separate rhythms.
    const pulse = reducedMotion
      ? 1
      : 1 + Math.sin(elapsed.current * pulseSpeed * Math.PI * 2) * pulseAmount

    if (object) {
      object.rotation.y = reducedMotion ? 0 : elapsed.current * rotationSpeed
      object.rotation.x = reducedMotion
        ? 0
        : Math.sin(elapsed.current * rotationSpeed * 0.45) * 0.12
      // Breathing, plus the scripted expansion as the camera pushes in.
      object.scale.setScalar(pulse * (1 + p * scrollExpand))
      object.position.x = drift.current.x
      object.position.y = drift.current.y
    }

    // Publish the breathing so GlowHalo can swell in lockstep rather than
    // running its own sine, which would slowly beat against this one.
    choreo.heroPulse = pulse

    uniforms.uTime.value = elapsed.current
    uniforms.uPulse.value = pulse

    uniforms.uNoiseFreq.value = noiseFreq
    uniforms.uNoiseAmp.value = noiseAmp
    uniforms.uNoiseFreq2.value = noiseFreq2
    uniforms.uNoiseAmp2.value = noiseAmp2
    // Intensify and speed up through the scripted move.
    uniforms.uChurnSpeed.value = churnSpeed * (1 + p * scrollChurn)
    // Intensify through the move, then fade to nothing by the end of it.
    const heroFade = 1 - smoothstep(scrollFadeStart, 1, p)
    uniforms.uBrightness.value =
      brightness * (1 + p * scrollIntensify) * heroFade

    uniforms.uShapeFreq.value = shapeFreq
    uniforms.uShapeAmp.value = shapeAmp
    uniforms.uShapeSpeed.value = shapeSpeed
    uniforms.uStreamerFraction.value = streamerFraction
    uniforms.uStreamerAmp.value = streamerAmp

    uniforms.uSize.value = size
    uniforms.uSizeMin.value = sizeMin
    uniforms.uSizeMax.value = sizeMax
    uniforms.uSizeSkew.value = sizeSkew
    uniforms.uAttenuation.value = attenuation
    uniforms.uSoftness.value = softness

    uniforms.uColorSpread.value = colorSpread
    uniforms.uFlowTint.value = flowTint
    uniforms.uCoreHdr.value = coreHdr
    uniforms.uCoreRadius.value = coreRadius

    uniforms.uFogNear.value = fogNear
    uniforms.uFogFar.value = fogFar
    uniforms.uFogStrength.value = fogStrength
    uniforms.uFocusDistance.value = focusDistance
    uniforms.uFocusRange.value = focusRange
    uniforms.uFocusFalloff.value = focusFalloff
    uniforms.uBokehScale.value = bokehScale

    uniforms.uMouseRadius.value = mouseRadius
    uniforms.uMouseRepel.value = reducedMotion ? 0 : mouseRepel
    uniforms.uMouseSwirl.value = reducedMotion ? 0 : mouseSwirl
    uniforms.uAspect.value = state.size.width / state.size.height
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()
  })

  return (
    <group ref={group}>
      {/* Recreate the buffers outright when the seed parameters change. */}
      <points key={`${count}-${coreBias}-${radius}`} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 4]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          // Additive so overlapping particles stack into a hot core, and
          // depth-write off so they never occlude one another.
          blending={AdditiveBlending}
          depthWrite={false}
          depthTest
        />
      </points>
    </group>
  )
}
