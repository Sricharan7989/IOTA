/* IOTA — camera choreography.
   Dollies the camera through the Home -> Roadmap move and adds a small
   pointer parallax. Nothing else in the project touches the camera.

   The warp is unaffected by this on purpose: its shader works in view space,
   so it stays locked to the camera no matter where the camera goes. Only the
   blob, which lives in world space, reacts. */
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { usePointer } from '../hooks/usePointer'
import { choreo } from '../lib/choreography'
import { dampFactor } from '../lib/math'

export default function CameraRig({
  restZ = 6,
  dollyZ = 4.4,
  parallax = 0.18,
  reducedMotion = false,
}) {
  const pointer = usePointer()
  const progress = useRef(0)
  const offset = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const { camera } = state

    // No scroll-scrubbed dolly and no pointer parallax under reduced motion —
    // the camera simply sits at rest.
    if (reducedMotion) {
      camera.position.set(0, 0, restZ)
      camera.lookAt(0, 0, 0)
      return
    }

    progress.current +=
      (choreo.heroProgress - progress.current) * dampFactor(dt, 5)
    const p = progress.current

    const pointerState = pointer.current
    offset.current.x +=
      (pointerState.tx * parallax - offset.current.x) * dampFactor(dt, 2.5)
    offset.current.y +=
      (pointerState.ty * parallax - offset.current.y) * dampFactor(dt, 2.5)

    camera.position.x = offset.current.x
    camera.position.y = offset.current.y
    camera.position.z = restZ + (dollyZ - restZ) * p
    camera.lookAt(0, 0, 0)
  })

  return null
}
