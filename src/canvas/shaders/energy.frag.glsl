// IOTA — energy mass fragment shader.
// Soft Gaussian sprites. Additive blending does the rest: where the volume is
// dense the contributions stack, and the HDR core set in the vertex stage
// carries past 1.0 into the half-float buffer the composer renders to, which
// is what lets a high bloom threshold pick out the core alone.
//
// Colours arrive as plain sRGB components in a vec3 (not a THREE.Color, which
// would be auto-converted to linear working space) and are written straight
// out — except the core, which is deliberately super-1.0.

varying vec3 vColor;
varying float vAlpha;
// Gaussian exponent, widened by the vertex stage for defocused particles.
varying float vSoftness;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv) * 2.0;

  // Round, never a square sprite.
  if (d > 1.0) discard;

  // A Gaussian, rescaled so it reaches exactly zero at the sprite edge. The
  // subtraction matters: a raw exp() falloff is still ~5% bright where the
  // sprite is cut off, and with this many overlapping sprites that leaves a
  // visible ring on every single particle.
  float k = max(vSoftness, 0.001);
  float edge = exp(-k);
  float gaussian = (exp(-d * d * k) - edge) / (1.0 - edge);

  gl_FragColor = vec4(vColor, max(gaussian, 0.0) * vAlpha);
}
