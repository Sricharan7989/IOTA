/* IOTA — device capability detection and quality tiers.
   One place decides how heavy the scene is allowed to be. Everything else
   reads the result; nothing else sniffs the device.

   Detected once per session and cached. Core count and GPU don't change, and
   re-tiering mid-session would rebuild the particle buffers on every resize.
   prefers-reduced-motion is the exception — users toggle it live — so it is
   read separately by useQuality(). */

export const TIER = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
}

/**
 * Per-tier scene budget.
 * Particle counts follow the brief: 100k on desktop, cut hard to ~18k on
 * low-end. Blob subdivision matters just as much — the vertex shader runs
 * three fbm evaluations per vertex, so halving detail roughly halves that cost.
 */
const BUDGET = {
  [TIER.HIGH]: {
    particles: 100000,
    // The hero mass runs 12 noise samples per particle for its curl field, so
    // it is far more expensive per-particle than the warp.
    heroParticles: 160000,
    debrisCount: 420,
    // Multiplier on the per-particle depth-of-field bokeh. 0 disables it.
    bokehScale: 1,
    blobDetail: 32,
    bloom: true,
    chromatic: true,
    vignette: true,
    hdrEnvironment: true,
  },
  [TIER.MEDIUM]: {
    particles: 45000,
    heroParticles: 45000,
    debrisCount: 220,
    bokehScale: 0.5,
    blobDetail: 20,
    bloom: true,
    chromatic: false,
    vignette: true,
    hdrEnvironment: false,
  },
  [TIER.LOW]: {
    particles: 18000,
    heroParticles: 20000,
    debrisCount: 110,
    // No defocus at all on the floor tier — oversized sprites are pure
    // fill-rate, which is exactly what a weak GPU has least of.
    bokehScale: 0,
    blobDetail: 12,
    bloom: false,
    chromatic: false,
    vignette: false,
    hdrEnvironment: false,
  },
}

/**
 * Probe WebGL support and the renderer string.
 * The probe context is explicitly released — browsers cap the number of live
 * WebGL contexts (~16), and leaking one here could starve the real canvas.
 */
function probeGpu() {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')

    if (!gl) return { supported: false, renderer: '', maxTextureSize: 0 }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '')
      : ''
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0

    gl.getExtension('WEBGL_lose_context')?.loseContext()

    return { supported: true, renderer, maxTextureSize }
  } catch {
    return { supported: false, renderer: '', maxTextureSize: 0 }
  }
}

/** Software renderers report themselves; they cannot run this scene. */
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|basic render|microsoft basic/i

function detect() {
  // SSR / non-browser guard — fall back to the safe tier.
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      tier: TIER.LOW,
      isMobile: false,
      webglSupported: false,
      maxDpr: 1,
      ...BUDGET[TIER.LOW],
    }
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const smallScreen = window.matchMedia('(max-width: 820px)').matches
  const isMobile = coarsePointer || smallScreen

  // Both of these are advisory and absent on some browsers, so default to a
  // middling value rather than assuming the worst.
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = navigator.deviceMemory ?? 4

  const gpu = probeGpu()

  let tier = TIER.HIGH

  if (isMobile || cores <= 4 || memory <= 4 || gpu.maxTextureSize < 8192) {
    tier = TIER.MEDIUM
  }

  if (
    !gpu.supported ||
    cores <= 2 ||
    memory <= 2 ||
    SOFTWARE_RENDERER.test(gpu.renderer) ||
    // A phone that is also short on cores or memory gets the floor.
    (isMobile && (cores <= 4 || memory <= 4))
  ) {
    tier = TIER.LOW
  }

  return {
    tier,
    isMobile,
    webglSupported: gpu.supported,
    renderer: gpu.renderer,
    cores,
    memory,
    // Brief: [1, 1.5] on mobile, [1, 2] on desktop. A weak desktop GPU gets the
    // mobile cap too — resolution is the cheapest thing to give up.
    maxDpr: isMobile || tier === TIER.LOW ? 1.5 : 2,
    ...BUDGET[tier],
  }
}

let cached = null

/** Detected capabilities for this session. */
export function getQuality() {
  if (!cached) cached = detect()
  return cached
}

/** Live check — users toggle this one mid-session. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
