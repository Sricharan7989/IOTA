// IOTA — warp field fragment shader.
// Shapes each point sprite into a soft round spark that elongates into a
// streak along the direction of travel.
//
// Colour-space note: colours arrive as plain sRGB components in a vec3 (not a
// THREE.Color, which would be auto-converted to linear working space) and are
// written straight out. No tone-mapping or colour-space chunk is included, so
// what is authored in tokens.css is what lands on screen.

uniform float uSoftness;

varying vec3 vColor;
varying float vAlpha;
varying vec2 vStreakDir;
varying float vStreakK;

void main() {
  vec2 uv = gl_PointCoord - 0.5;

  // Rotate into the streak's own frame, then scale the perpendicular axis by
  // the same factor the sprite was stretched by in the vertex shader. The
  // result stays exactly as thick as an unstretched sprite while extending
  // along the direction of travel — a streak, not a fat blob.
  vec2 along = vStreakDir;
  vec2 across = vec2(-along.y, along.x);
  vec2 local = vec2(dot(uv, along), dot(uv, across) * vStreakK);

  float r = length(local) * 2.0; // 0 at centre, 1 at the sprite edge
  if (r > 1.0) discard; // round, never a square

  float falloff = 1.0 - r;
  float halo = pow(falloff, uSoftness);
  float core = pow(falloff, 12.0); // tight hot centre — this is the "shiny"

  float intensity = (halo * 0.75 + core * 0.9) * vAlpha;

  // Additive blending is SrcAlpha * src + dst, so intensity rides in alpha and
  // the colour stays unmultiplied.
  gl_FragColor = vec4(vColor, intensity);
}
