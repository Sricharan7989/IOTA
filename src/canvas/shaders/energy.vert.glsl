// IOTA — energy mass vertex shader.
// Advects a dense volume of particles through two octaves of curl noise so the
// mass roils like plasma with structure at more than one scale. Every
// particle's motion comes from its seed plus uTime, so the CPU writes a
// handful of uniforms per frame and nothing else.
//
// The look rests on three things, in order of importance:
//   1. An HDR core. Colour is pushed well above 1.0 at the centre so the
//      bloom pass (threshold ~1.0) catches ONLY the core and bleeds real
//      light. Without HDR the whole thing is just a blue ball.
//   2. Overlap. Particles are concentrated hard toward the centre and drawn
//      as soft Gaussian sprites, so they blend into continuous light instead
//      of reading as separate dots.
//   3. Two noise scales. One slow swirl carries the mass; one fine, faster
//      octave gives it texture.
//
// Attribute packing:
//   position -> seed position inside the ellipsoid volume
//   aSeed.x  -> normalised radius [0,1], 0 at the core, 1 at the shell
//   aSeed.y  -> size roll (skewed so most particles are tiny)
//   aSeed.z  -> brightness / colour jitter
//   aSeed.w  -> streamer roll — a small fraction become outward filaments

uniform float uTime;

// Octave 1: the large, slow swirl that carries the whole mass.
uniform float uNoiseFreq;
uniform float uNoiseAmp;
// Octave 2: finer and faster, for plasma texture.
uniform float uNoiseFreq2;
uniform float uNoiseAmp2;
uniform float uChurnSpeed;

// Silhouette warp — stops the volume being a perfect sphere.
uniform float uShapeFreq;
uniform float uShapeAmp;
uniform float uShapeSpeed;

// Filaments streaming off the body.
uniform float uStreamerFraction;
uniform float uStreamerAmp;

uniform float uSize;
uniform float uSizeMin;
uniform float uSizeMax;
uniform float uSizeSkew;
uniform float uPixelRatio;
uniform float uAttenuation;
uniform float uBrightness;
uniform float uPulse;
uniform float uColorSpread;
uniform float uFlowTint;

// HDR core.
uniform float uCoreHdr;
uniform float uCoreRadius;

uniform float uFogNear;
uniform float uFogFar;
uniform float uFogStrength;

uniform vec2 uMouse;
uniform float uAspect;
uniform float uMouseRadius;
uniform float uMouseRepel;
uniform float uMouseSwirl;

uniform float uFocusDistance;
uniform float uFocusRange;
uniform float uFocusFalloff;
uniform float uBokehScale;
uniform float uSoftness;

uniform vec3 uColorCore;
uniform vec3 uColorBlue;
uniform vec3 uColorViolet;

attribute vec4 aSeed;

varying vec3 vColor;
varying float vAlpha;
varying float vSoftness;

#include lib/noise.glsl;

// Three decorrelated scalar potential fields. The curl of a vector potential
// is divergence-free by construction, which is why curl noise reads as
// swirling fluid rather than particles drifting apart.
float potA(vec3 p) { return snoise(p); }
float potB(vec3 p) { return snoise(p + vec3(31.416, 47.853, 12.793)); }
float potC(vec3 p) { return snoise(p + vec3(-53.771, 19.482, 71.324)); }

// curl(P) = ( dPz/dy - dPy/dz, dPx/dz - dPz/dx, dPy/dx - dPx/dy )
//
// Twelve noise samples rather than the usual eighteen: each finite difference
// only needs the one component of the potential that appears in the formula.
// Deliberately NOT normalised — variable magnitude is what gives the mass its
// density, and normalising a near-zero curl produces NaNs.
vec3 curlNoise(vec3 p) {
  float e = 0.35;
  float inv = 1.0 / (2.0 * e);

  vec3 ex = vec3(e, 0.0, 0.0);
  vec3 ey = vec3(0.0, e, 0.0);
  vec3 ez = vec3(0.0, 0.0, e);

  float dPz_dy = potC(p + ey) - potC(p - ey);
  float dPy_dz = potB(p + ez) - potB(p - ez);

  float dPx_dz = potA(p + ez) - potA(p - ez);
  float dPz_dx = potC(p + ex) - potC(p - ex);

  float dPy_dx = potB(p + ex) - potB(p - ex);
  float dPx_dy = potA(p + ey) - potA(p - ey);

  return vec3(
    dPz_dy - dPy_dz,
    dPx_dz - dPz_dx,
    dPy_dx - dPx_dy
  ) * inv;
}

// ---- Depth of field, per particle -----------------------------------------
// The composer cannot do this (see the note in Effects.jsx: nothing writes
// depth), so the circle of confusion is computed here instead.
float circleOfConfusion(float viewDepth) {
  float coc = abs(viewDepth - uFocusDistance) / max(uFocusRange, 0.001);
  return pow(clamp(coc, 0.0, 1.0), uFocusFalloff);
}

void main() {
  float normalisedRadius = aSeed.x;

  // ---- Silhouette warp ----------------------------------------------------
  // Push the seed radius in and out with noise sampled on the direction
  // vector, so the volume is an organic blob rather than a sphere. Sampling on
  // direction (not position) means the warp is coherent across the whole
  // radius — it dents the outline instead of shredding the interior.
  vec3 dir = normalize(position + vec3(1e-5));
  float shape = snoise(dir * uShapeFreq + vec3(0.0, uTime * uShapeSpeed, 0.0));
  vec3 basePos = position * (1.0 + shape * uShapeAmp);

  // ---- Octave 1: large, slow swirl ---------------------------------------
  vec3 domain1 = basePos * uNoiseFreq
    + vec3(0.0, uTime * uChurnSpeed, uTime * uChurnSpeed * 0.35);
  vec3 flow1 = curlNoise(domain1);

  // ---- Octave 2: fine, faster detail -------------------------------------
  vec3 domain2 = basePos * uNoiseFreq2
    + vec3(uTime * uChurnSpeed * 2.4, 0.0, uTime * uChurnSpeed * 1.7);
  vec3 flow2 = curlNoise(domain2);

  // The core roils harder than the shell, which keeps the silhouette readable
  // while the inside stays alive.
  float churnMask = mix(1.0, 0.5, normalisedRadius);

  // Streamers: a small fraction of particles ride the large swirl much
  // further, trailing off the body as filaments.
  float streamer = step(1.0 - uStreamerFraction, aSeed.w);
  float amp1 = uNoiseAmp * mix(1.0, uStreamerAmp, streamer);

  vec3 flow = flow1 * amp1 + flow2 * uNoiseAmp2;
  vec3 displaced = basePos + flow * churnMask;

  float flowMagnitude = length(flow1) + length(flow2) * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vec4 clip = projectionMatrix * mvPosition;

  float viewDepth = -mvPosition.z;

  // ---- Cursor disturbance -------------------------------------------------
  // Worked in aspect-corrected NDC so the disturbance is a true circle on
  // screen at every depth. The tangential term is what makes it swirl rather
  // than merely shove particles aside.
  vec2 ndc = clip.xy / clip.w;
  vec2 pAspect = vec2(ndc.x * uAspect, ndc.y);
  vec2 mAspect = vec2(uMouse.x * uAspect, uMouse.y);

  vec2 toParticle = pAspect - mAspect;
  float cursorDist = length(toParticle);
  float influence = 1.0 - smoothstep(0.0, uMouseRadius, cursorDist);

  vec2 outward = cursorDist > 1e-4 ? toParticle / cursorDist : vec2(0.0);
  vec2 tangent = vec2(-outward.y, outward.x);

  float depthWeight = mix(0.35, 1.0, clamp((10.0 - viewDepth) / 10.0, 0.0, 1.0));

  pAspect += (outward * uMouseRepel + tangent * uMouseSwirl)
    * influence * depthWeight;

  ndc = vec2(pAspect.x / uAspect, pAspect.y);
  clip.xy = ndc * clip.w;
  gl_Position = clip;

  float coc = circleOfConfusion(viewDepth);

  // ---- Size ---------------------------------------------------------------
  // Skewed hard toward small: pow() on a uniform roll makes most particles
  // tiny with a rare few large, which is what gives the mass organic texture
  // instead of a uniform stipple.
  float sizeRoll = pow(aSeed.y, uSizeSkew);
  float sizeJitter = mix(uSizeMin, uSizeMax, sizeRoll);

  float spriteSize = uSize * sizeJitter * uPixelRatio
    * (uAttenuation / max(viewDepth, 0.001));
  spriteSize *= 1.0 + coc * uBokehScale;
  gl_PointSize = clamp(spriteSize, 0.5, 64.0);

  // Defocused sprites also get a wider falloff, so they read as soft discs
  // rather than larger hard dots.
  vSoftness = mix(uSoftness, 1.1, coc);

  // ---- Colour: HDR white-hot core -> blue -> violet -----------------------
  float t = clamp(
    normalisedRadius * uColorSpread + flowMagnitude * uFlowTint,
    0.0,
    1.0
  );
  vec3 tint = mix(uColorCore, uColorBlue, smoothstep(0.0, 0.45, t));
  tint = mix(tint, uColorViolet, smoothstep(0.42, 1.0, t));

  // THE important line. Pushing the core above 1.0 is what lets a high bloom
  // threshold pick out the centre and nothing else — the difference between
  // a light source and a flat blue ball.
  float coreHeat = 1.0 - smoothstep(0.0, uCoreRadius, normalisedRadius);
  tint *= mix(1.0, uCoreHdr, coreHeat * coreHeat);

  vColor = tint;

  // ---- Alpha --------------------------------------------------------------
  // Dissolve the outermost shell so the mass fades into black rather than
  // ending on an edge.
  float shellFade = 1.0 - smoothstep(0.7, 1.05, normalisedRadius);

  // Depth fade across the volume. Dimming the far side is what stops a cloud
  // of additive points reading as a flat disc.
  float depthFade = 1.0 - smoothstep(uFogNear, uFogFar, viewDepth);
  depthFade = mix(1.0, depthFade, uFogStrength);

  // Nearer particles read slightly hotter, so rotating the mass reveals real
  // volume rather than a turning texture.
  float nearBoost = mix(0.72, 1.28, clamp((uFocusDistance + 2.0 - viewDepth) / 4.0, 0.0, 1.0));

  vAlpha = uBrightness * uPulse
    * mix(1.0, 0.28, normalisedRadius)
    * shellFade
    * depthFade
    * nearBoost
    * (0.7 + 0.6 * aSeed.z)
    // Spread over a bigger sprite means lower peak intensity.
    * mix(1.0, 0.4, coc)
    // Filaments are wisps, not body.
    * mix(1.0, 0.5, streamer);
}
