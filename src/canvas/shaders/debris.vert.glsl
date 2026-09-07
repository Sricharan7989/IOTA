// IOTA — foreground debris vertex shader.
// A few hundred specks drifting at varied depths around and in front of the
// mass. Their only job is parallax and scale: without something nearby to
// judge against, the mass has no size.
//
// Attribute packing:
//   position  -> seed position in the surrounding volume
//   aDebris.x -> drift phase
//   aDebris.y -> size jitter
//   aDebris.z -> brightness / colour jitter

uniform float uTime;
uniform float uDrift;
uniform float uDriftSpeed;
uniform float uSize;
uniform float uPixelRatio;
uniform float uAttenuation;
uniform float uBrightness;

uniform float uFogNear;
uniform float uFogFar;
uniform float uFogStrength;

uniform float uFocusDistance;
uniform float uFocusRange;
uniform float uFocusFalloff;
uniform float uBokehScale;
uniform float uSoftness;

uniform vec3 uColorA;
uniform vec3 uColorB;

attribute vec3 aDebris;

varying vec3 vColor;
varying float vAlpha;
varying float vSoftness;


// ---- Depth of field, per particle -----------------------------------------
// The composer cannot do this (see the note in Effects.jsx: nothing writes
// depth), so the circle of confusion is computed here instead.
//
// A real lens turns an out-of-focus point of light into a wider, dimmer disc.
// That is exactly what a point sprite can do for free: grow it, dim it, and
// widen its falloff. The total energy is roughly preserved, so defocusing
// softens rather than brightens.
float circleOfConfusion(float viewDepth) {
  float coc = abs(viewDepth - uFocusDistance) / max(uFocusRange, 0.001);
  return pow(clamp(coc, 0.0, 1.0), uFocusFalloff);
}

void main() {
  float phase = aDebris.x * 6.2831853;

  // Sinusoidal drift rather than linear travel: no wrap seam to hide, and the
  // motion stays gentle no matter how long the page is open.
  vec3 drifted = position;
  drifted.x += sin(uTime * uDriftSpeed + phase) * uDrift;
  drifted.y += cos(uTime * uDriftSpeed * 0.8 + phase * 1.7) * uDrift * 0.8;
  drifted.z += sin(uTime * uDriftSpeed * 0.55 + phase * 0.6) * uDrift * 0.6;

  vec4 mvPosition = modelViewMatrix * vec4(drifted, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float viewDepth = -mvPosition.z;
  // Debris is the element this matters most for: specks drifting near the
  // camera are far outside the focus plane, and blurring them is what sells
  // the foreground as foreground.
  float coc = circleOfConfusion(viewDepth);

  float sizeJitter = 0.5 + 1.1 * aDebris.y;
  float spriteSize = uSize * sizeJitter * uPixelRatio
    * (uAttenuation / max(-mvPosition.z, 0.001));
  spriteSize *= 1.0 + coc * uBokehScale;
  gl_PointSize = clamp(spriteSize, 0.8, 48.0);

  vSoftness = mix(uSoftness, 0.9, coc);

  vColor = mix(uColorA, uColorB, aDebris.z);

  // Depth fade — distant specks dissolve into the black instead of hanging
  // there at full strength and flattening the scene.
  float depthFade = 1.0 - smoothstep(uFogNear, uFogFar, viewDepth);
  depthFade = mix(1.0, depthFade, uFogStrength);

  // Nearer specks catch a little more light.
  float nearBoost = mix(0.45, 1.0, clamp((14.0 - viewDepth) / 14.0, 0.0, 1.0));

  vAlpha = uBrightness * (0.3 + 0.7 * aDebris.z) * depthFade * nearBoost
    * mix(1.0, 0.45, coc);
}
