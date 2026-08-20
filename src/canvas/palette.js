/* IOTA — bridge from CSS design tokens into GLSL uniforms.
   DESIGN.md §7 says no hardcoded hex outside tokens.css. The shader needs real
   numbers, so rather than duplicating the palette in JS we read it back out of
   the stylesheet at runtime. tokens.css stays the single source of truth. */
import { Vector3 } from 'three'

/**
 * Read a CSS custom property off :root.
 * tokens.css is imported synchronously in main.jsx, so the variables are
 * already applied by the time any canvas component mounts.
 */
export function readToken(name, fallback) {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || fallback
}

/**
 * `#rrggbb` -> THREE.Vector3 of plain sRGB components in 0..1.
 *
 * Deliberately not THREE.Color: with ColorManagement enabled (the default)
 * THREE.Color converts hex to linear working space, which would then need a
 * matching conversion back in the fragment shader. Passing a Vector3 opts out
 * of that pipeline entirely and keeps authored colour == rendered colour.
 */
export function hexToVec3(hex, target = new Vector3()) {
  const clean = hex.replace('#', '').trim()
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const int = parseInt(full, 16)
  if (Number.isNaN(int)) return target.set(1, 1, 1)
  return target.set(
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  )
}

/** Warp palette defaults, pulled from tokens.css. */
export const warpPalette = {
  blue: () => readToken('--c-blue', '#5d86ff'),
  violet: () => readToken('--c-violet', '#9d7bff'),
  white: () => readToken('--c-glow', '#c7d4ff'),
}
