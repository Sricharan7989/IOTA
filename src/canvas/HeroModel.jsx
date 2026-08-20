/* IOTA — the hero centerpiece.
   Loads the neon figure and makes an auto-generated mesh read as premium
   through lighting and material treatment rather than geometry detail
   (it is ~8k triangles with a single baked material).

   The visor glow: the GLB ships a base-colour texture and no emissive at all,
   so the same texture is reused as an emissive map with a white emissive
   colour. Bright texels — the neon visor — then self-illuminate, while the
   dark body contributes almost nothing and stays in shadow. Bloom picks the
   visor up from there.

   Motion: idle float + slow spin, damped cursor parallax, and drag-to-orbit.
   All of it reads the scroll choreography so the Home -> Roadmap move scales
   and turns the model as one continuous scripted gesture. */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Color } from 'three'
import { usePointer } from '../hooks/usePointer'
import { useDragOrbit } from '../hooks/useDragOrbit'
import { choreo } from '../lib/choreography'
import { dampFactor } from '../lib/math'

/* ------------------------------------------------------------------------
   The brief named /models/iota-helmet.glb, which is not in the repo. This is
   the Meshy "Neon Iota" export that is — and it matches the description. If a
   different mesh is meant, change this one line.
   ------------------------------------------------------------------------ */
export const MODEL_URL = '/models/iota-neon.glb'

// Start fetching as soon as this module is evaluated rather than waiting for
// the component to mount — the model is the single heaviest asset on the page.
useGLTF.preload(MODEL_URL)

export const HERO_MODEL_DEFAULTS = {
  // Source mesh is ~1 unit tall and already centred on the origin, so framing
  // is a straight scale.
  scale: 2.6,
  positionX: 1.15,
  positionY: -0.1,
  emissiveIntensity: 0.5,
  envMapIntensity: 0.55,
  floatAmplitude: 0.09,
  floatSpeed: 0.55,
  spinSpeed: 0.12,
  cursorParallax: 0.22,
  // Home -> Roadmap move.
  scrollScale: 0.74,
  scrollSpin: 1.4,
  scrollLift: 0.55,
}

export default function HeroModel({
  scale = HERO_MODEL_DEFAULTS.scale,
  positionX = HERO_MODEL_DEFAULTS.positionX,
  positionY = HERO_MODEL_DEFAULTS.positionY,
  emissiveIntensity = HERO_MODEL_DEFAULTS.emissiveIntensity,
  envMapIntensity = HERO_MODEL_DEFAULTS.envMapIntensity,
  floatAmplitude = HERO_MODEL_DEFAULTS.floatAmplitude,
  floatSpeed = HERO_MODEL_DEFAULTS.floatSpeed,
  spinSpeed = HERO_MODEL_DEFAULTS.spinSpeed,
  cursorParallax = HERO_MODEL_DEFAULTS.cursorParallax,
  scrollScale = HERO_MODEL_DEFAULTS.scrollScale,
  scrollSpin = HERO_MODEL_DEFAULTS.scrollSpin,
  scrollLift = HERO_MODEL_DEFAULTS.scrollLift,
  reducedMotion = false,
}) {
  const group = useRef(null)
  const pointer = usePointer()
  // Dragging is a pointer-chasing interaction, so it goes away with reduced
  // motion along with everything else.
  const orbit = useDragOrbit({ enabled: !reducedMotion })

  const { scene } = useGLTF(MODEL_URL)

  const progress = useRef(0)
  const drift = useRef({ x: 0, y: 0 })
  const elapsed = useRef(0)

  // Give the loaded materials their emissive treatment. useGLTF caches the
  // parsed scene, so this runs against a shared object — it is written to be
  // idempotent, which also makes StrictMode's double-mount harmless.
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      materials.forEach((material) => {
        if (material.map) {
          // The base colour texture doubles as the emissive map — this is what
          // makes the visor glow without any authored emissive channel.
          material.emissiveMap = material.map
          material.emissive = new Color(0xffffff)
          material.emissiveIntensity = emissiveIntensity
        }
        material.envMapIntensity = envMapIntensity
        // Changing emissiveMap alters the shader program, so the material has
        // to be recompiled — without this the glow silently never appears.
        material.needsUpdate = true
      })

      child.castShadow = false
      child.receiveShadow = false
    })
  }, [scene, emissiveIntensity, envMapIntensity])

  // Rest pose, so reduced motion still frames the model deliberately.
  const restRotation = useMemo(() => [0, -0.35, 0], [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const object = group.current
    if (!object) return

    if (reducedMotion) {
      object.position.set(positionX, positionY, 0)
      object.rotation.set(restRotation[0], restRotation[1], restRotation[2])
      object.scale.setScalar(scale)
      return
    }

    elapsed.current += dt

    // Damped, not driven — DESIGN.md §5.
    progress.current +=
      (choreo.heroProgress - progress.current) * dampFactor(dt, 6)
    const p = progress.current

    // ---- Cursor parallax ---------------------------------------------------
    const pointerState = pointer.current
    drift.current.x +=
      (pointerState.tx * cursorParallax - drift.current.x) * dampFactor(dt, 3)
    drift.current.y +=
      (pointerState.ty * cursorParallax - drift.current.y) * dampFactor(dt, 3)

    // ---- Drag orbit --------------------------------------------------------
    const orbitState = orbit.current
    if (!orbitState.dragging) {
      // Carry the throw, then bleed it off.
      orbitState.yaw += orbitState.velocityYaw
      orbitState.pitch += orbitState.velocityPitch
      const decay = Math.exp(-dt * 3.2)
      orbitState.velocityYaw *= decay
      orbitState.velocityPitch *= decay
      // Ease the tip back to level so it never rests at an odd angle. Yaw is
      // left free — spinning it and letting it stay is the point.
      orbitState.pitch += (0 - orbitState.pitch) * dampFactor(dt, 0.9)
    }

    // ---- Compose -----------------------------------------------------------
    const float = Math.sin(elapsed.current * floatSpeed) * floatAmplitude

    object.position.x = positionX + drift.current.x
    object.position.y = positionY + float + drift.current.y * 0.5 + p * scrollLift

    object.rotation.y =
      restRotation[1] +
      orbitState.yaw +
      elapsed.current * spinSpeed +
      drift.current.x * 0.35 +
      p * scrollSpin
    object.rotation.x = orbitState.pitch + drift.current.y * -0.18 + p * 0.25
    object.rotation.z = p * 0.12

    object.scale.setScalar(scale * (1 - p * (1 - scrollScale)))
  })

  return (
    <group ref={group} position={[positionX, positionY, 0]}>
      <primitive object={scene} />
    </group>
  )
}
