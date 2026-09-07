// IOTA — foreground debris fragment shader.
// Soft round specks, same sprite treatment as the rest of the particle work.

varying vec3 vColor;
varying float vAlpha;
varying float vSoftness;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv) * 2.0;

  if (r > 1.0) discard;

  float falloff = 1.0 - r;
  float halo = pow(falloff, vSoftness);
  float core = pow(falloff, 8.0);

  gl_FragColor = vec4(vColor, (halo * 0.65 + core * 0.9) * vAlpha);
}
