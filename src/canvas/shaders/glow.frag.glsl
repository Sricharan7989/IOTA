// IOTA — volumetric glow fragment shader.
// A soft radial falloff standing in for a light source behind the mass, and
// the seed any god-ray pass would sample from later.
//
// Computed rather than sampled from a gradient texture: it stays sharp at any
// size, costs no texture memory, and the falloff curve becomes a tunable
// instead of a baked asset.

uniform vec3 uColor;
uniform float uIntensity;
uniform float uPulse;
uniform float uFalloff;
uniform float uCore;

varying vec2 vUv;

void main() {
  float d = length(vUv - 0.5) * 2.0;

  // Wide, very soft halo.
  float halo = 1.0 - smoothstep(0.0, 1.0, d);
  halo = pow(max(halo, 0.0), uFalloff);

  // Tighter bright centre so it reads as a source, not a flat wash.
  float core = 1.0 - smoothstep(0.0, 0.45, d);
  core = pow(max(core, 0.0), 3.0);

  float alpha = (halo + core * uCore) * uIntensity * uPulse;

  // Additive blending is SrcAlpha * src + dst, so intensity rides in alpha.
  gl_FragColor = vec4(uColor, alpha);
}
