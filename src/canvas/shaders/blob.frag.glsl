// IOTA — centerpiece fragment shader.
// Iridescent glass/chrome: environment reflection tinted by a blue→violet
// interference band, a fresnel edge, and a hot specular rim.
//
// The environment arrives as a plain EQUIRECTANGULAR texture, sampled by hand
// below. drei's <Environment> publishes scene.environment as a PMREM/CubeUV
// texture, which only three's built-in materials can decode — a custom
// ShaderMaterial would have to reimplement that lookup. useEnvironment hands
// back the same HDR as an equirect map instead, which is two lines of GLSL.
//
// uHasEnv blends between a cheap analytic environment and the real one, so the
// blob still looks right on the first frames, or if the HDR never arrives.

uniform vec3 uColorBlue;
uniform vec3 uColorViolet;
uniform vec3 uColorGlow;
uniform vec3 uEnvLow;
uniform vec3 uEnvHigh;

uniform sampler2D uEnvMap;
uniform float uHasEnv;
uniform float uEnvIntensity;

uniform float uFresnelPower;
uniform float uFresnelStrength;
uniform float uRimStrength;
uniform float uIridescence;
uniform float uExposure;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDisplace;

const float INV_PI = 0.31830988618;
const float INV_2PI = 0.15915494309;

vec2 dirToEquirect(vec3 d) {
  return vec2(
    atan(d.z, d.x) * INV_2PI + 0.5,
    asin(clamp(d.y, -1.0, 1.0)) * INV_PI + 0.5
  );
}

/** Analytic stand-in: a dark gradient with one key and one fill light. */
vec3 proceduralEnv(vec3 r) {
  float y = smoothstep(-1.0, 1.0, r.y);
  vec3 sky = mix(uEnvLow, uEnvHigh, y);
  float key = pow(max(dot(r, normalize(vec3(0.35, 0.75, 0.4))), 0.0), 32.0);
  float fill = pow(max(dot(r, normalize(vec3(-0.6, -0.2, 0.5))), 0.0), 12.0);
  return sky + key * 1.5 + fill * 0.22;
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 R = reflect(-V, N);

  vec3 env = mix(
    proceduralEnv(R),
    texture2D(uEnvMap, dirToEquirect(R)).rgb,
    uHasEnv
  );

  float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), uFresnelPower);

  // Thin-film style interference: a triangle wave rather than fract() alone,
  // which would leave a hard seam everywhere the band wraps.
  float band = fresnel * 0.9 + vDisplace * uIridescence + uTime * 0.04;
  float wave = abs(fract(band) * 2.0 - 1.0);
  vec3 tint = mix(uColorBlue, uColorViolet, wave);

  vec3 color = env * tint * uEnvIntensity;
  color += tint * fresnel * uFresnelStrength;
  color += uColorGlow * pow(fresnel, 5.0) * uRimStrength;

  // The HDR environment carries values above 1. Reinhard keeps the highlights
  // from clipping to flat white while leaving the blacks alone.
  color *= uExposure;
  color = color / (1.0 + color);

  gl_FragColor = vec4(color, 1.0);
}
