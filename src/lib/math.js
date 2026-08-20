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
