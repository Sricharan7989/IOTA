/* IOTA — shared frame-loop maths. */

/**
 * Frame-rate independent damping factor (DESIGN.md §5).
 * Use as: value += (target - value) * dampFactor(dt, lambda)
 *
 * The naive `value += (target - value) * 0.1` converges at different speeds on
 * a 60Hz and a 144Hz display, which is why it is banned in this project.
 */
export function dampFactor(dt, lambda) {
  return 1 - Math.exp(-lambda * dt)
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Hermite smoothstep. Returns 0 below `edge0`, 1 above `edge1`, and an
 * ease-in-out ramp between. The JS twin of GLSL's smoothstep, used where a
 * fade has to start and finish somewhere specific rather than run linearly.
 */
export function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0 || 1e-6)))
  return t * t * (3 - 2 * t)
}
