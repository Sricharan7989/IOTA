// IOTA — centerpiece vertex shader.
// Displaces an icosahedron along its own normal by fbm noise, producing a
// slowly morphing organic form.
//
// Normals are RE-DERIVED, not inherited. Displacing positions without
// recomputing normals leaves the lighting describing the original sphere, and
// the whole glass/chrome read collapses. We sample the displaced surface at two
// small tangent offsets and take the cross product of the resulting edges —
// three fbm evaluations per vertex, which is the real cost of this shader.

uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseSpeed;
uniform float uDistort;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDisplace;

#include lib/noise.glsl;

/** Signed surface offset at a point on the base sphere. */
float surface(vec3 p) {
  // Drifting the sample point rather than scaling by time keeps the form
  // evolving instead of pulsing in place.
  vec3 q = p * uNoiseScale + vec3(0.0, uTime * uNoiseSpeed, uTime * uNoiseSpeed * 0.6);
  return fbm3(q);
}

vec3 displaced(vec3 p) {
  return p + normalize(p) * surface(p) * uDistort;
}

/** Any unit vector perpendicular to v. */
vec3 orthogonal(vec3 v) {
  return normalize(
    abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y)
  );
}

void main() {
  vec3 base = normalize(position);

  float offset = surface(position);
  vDisplace = offset;

  vec3 p0 = position + base * offset * uDistort;

  // Neighbours on the displaced surface, for the rebuilt normal.
  vec3 t1 = orthogonal(base);
  vec3 t2 = normalize(cross(base, t1));
  const float eps = 0.035;
  vec3 p1 = displaced(position + t1 * eps);
  vec3 p2 = displaced(position + t2 * eps);

  vec3 rebuilt = normalize(cross(p1 - p0, p2 - p0));
  // The winding of the cross product flips depending on which tangent frame
  // orthogonal() picked, so force it outward.
  if (dot(rebuilt, base) < 0.0) rebuilt = -rebuilt;

  vec4 worldPos = modelMatrix * vec4(p0, 1.0);
  vWorldPos = worldPos.xyz;
  // mat3(modelMatrix) is only a correct normal transform under uniform scale.
  // The blob is only ever scaled uniformly, so this holds.
  vNormal = normalize(mat3(modelMatrix) * rebuilt);

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
