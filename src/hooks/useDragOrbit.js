/* IOTA — drag-to-orbit for a 3D object.
   Returns a mutable ref of { yaw, pitch } that the render loop applies to a
   group's rotation, plus inertia and a slow drift back toward rest.

   Why not drei's <OrbitControls>: it attaches its listeners to the canvas DOM
   element, and our canvas layer is `pointer-events: none` so that the DOM above
   it stays clickable (the layer model set in Phase 0). OrbitControls would
   therefore receive no pointer events at all. Making the canvas interactive
   instead would swallow clicks meant for the navbar and the page copy, because
   the full-height sections cover the viewport.

   OrbitControls also owns the camera, which would fight the scroll-scrubbed
   dolly in CameraRig. Rotating the model rather than the camera keeps that
   choreography intact and gives the same feel: grab the object, spin it. */
import { useEffect, useRef } from 'react'

const HALF_PI = Math.PI / 2

export function useDragOrbit({
  sensitivity = 0.006,
  // How far the model can be tipped up/down before it starts to look broken.
  maxPitch = HALF_PI * 0.55,
  enabled = true,
} = {}) {
  const orbit = useRef({
    yaw: 0,
    pitch: 0,
    velocityYaw: 0,
    velocityPitch: 0,
    dragging: false,
  })

  useEffect(() => {
    if (!enabled) return undefined

    const state = orbit.current
    let lastX = 0
    let lastY = 0
    let pointerId = null

    const handleDown = (event) => {
      // Ignore drags that start on real UI — nav links, buttons, anything
      // focusable. Only empty page area grabs the model.
      if (event.target.closest('a, button, input, [role="button"]')) return
      state.dragging = true
      pointerId = event.pointerId
      lastX = event.clientX
      lastY = event.clientY
      document.body.style.cursor = 'grabbing'
    }

    const handleMove = (event) => {
      if (!state.dragging || event.pointerId !== pointerId) return
      const dx = event.clientX - lastX
      const dy = event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY

      state.yaw += dx * sensitivity
      state.pitch = Math.max(
        -maxPitch,
        Math.min(maxPitch, state.pitch + dy * sensitivity),
      )

      // Remember the throw so releasing keeps a little spin.
      state.velocityYaw = dx * sensitivity
      state.velocityPitch = dy * sensitivity
    }

    const handleUp = () => {
      if (!state.dragging) return
      state.dragging = false
      pointerId = null
      document.body.style.cursor = ''
    }

    window.addEventListener('pointerdown', handleDown, { passive: true })
    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerup', handleUp, { passive: true })
    window.addEventListener('pointercancel', handleUp, { passive: true })
    window.addEventListener('blur', handleUp)

    return () => {
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
      window.removeEventListener('blur', handleUp)
      document.body.style.cursor = ''
    }
  }, [sensitivity, maxPitch, enabled])

  return orbit
}
