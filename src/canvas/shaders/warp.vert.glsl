// IOTA — warp field vertex shader.
// All motion happens here, on the GPU. The CPU never touches a particle
// position; it only advances a handful of uniforms per frame.
//
// Coordinate frame: this shader works entirely in VIEW SPACE and ignores
// modelViewMatrix. The camera sits at the origin looking down -Z, so the
// particle tunnel is permanently locked to the camera. That means the camera
// journey in a later phase cannot drag the background out of frame.
// (Requires frustumCulled={false} on the points object.)
//
// Attribute packing:
//   position.xy -> fixed offset from the tunnel axis, on a UNIT disc; scaled by
//                  uRadius here so that tuning the tunnel width is a uniform
//                  update rather than a 100k-vertex rebuild. Held constant over
//                  the particle's life; this is what makes it sweep radially
//                  outward on screen as it approaches.
//   position.z  -> normalised start phase [0,1), staggers the tunnel.
//   aRandom.x   -> per-particle speed jitter
//   aRandom.y   -> per-particle size jitter
//   aRandom.z   -> colour lottery ticket [0,1)

uniform float uTravel; // accumulated distance, NOT time * speed (see WarpField.jsx)
uniform float uTime;
uniform float uNear;
uniform float uFar;
uniform float uRadius;
uniform float uSize;
uniform float uMaxSize;
uniform float uPixelRatio;
uniform float uBrightness;

uniform vec2 uMouse; // NDC, -1..1
uniform float uRepelRadius;
uniform float uRepelStrength;
uniform float uAspect;

uniform float uSpeed; // current world speed, drives streak length
uniform float uStreak;

uniform vec3 uColorBlue;
uniform vec3 uColorViolet;
uniform vec3 uColorWhite;
uniform float uMixBlue;
uniform float uMixViolet;

attribute vec3 aRandom;

varying vec3 vColor;
varying float vAlpha;
varying vec2 vStreakDir;
varying float vStreakK;

void main() {
  float depth = uFar - uNear;

  // ---- Travel down the tunnel -------------------------------------------
  // uTravel is an accumulated distance rather than uTime * uSpeed. If speed
  // multiplied time here, every change to speed would retroactively rewrite
  // the whole field's history and the particles would visibly teleport.
  float jitter = 0.55 + 0.9 * aRandom.x;
  float travelled = uTravel * jitter + position.z * depth;
  float dist = uFar - mod(travelled, depth); // uNear .. uFar, decreasing

  vec3 viewPos = vec3(position.xy * uRadius, -dist);
  vec4 clip = projectionMatrix * vec4(viewPos, 1.0);

  // ---- Cursor repulsion --------------------------------------------------
  // Done after projection, in aspect-corrected NDC, so the void reads as a
  // true circle on screen at every depth instead of an ellipse.
  vec2 ndc = clip.xy / clip.w;
  vec2 pAspect = vec2(ndc.x * uAspect, ndc.y);
  vec2 mAspect = vec2(uMouse.x * uAspect, uMouse.y);

  vec2 delta = pAspect - mAspect;
  float d = length(delta);
  float influence = 1.0 - smoothstep(0.0, uRepelRadius, d);
  // Near particles shoulder more of the push, which keeps the void feeling
  // like a volume rather than a flat decal.
  float depthWeight = mix(0.35, 1.0, 1.0 - clamp(dist / uFar, 0.0, 1.0));
  vec2 pushDir = d > 1e-4 ? delta / d : vec2(0.0);
  pAspect += pushDir * influence * uRepelStrength * depthWeight;

  ndc = vec2(pAspect.x / uAspect, pAspect.y);
  clip.xy = ndc * clip.w;
  gl_Position = clip;

  // ---- Streak orientation ------------------------------------------------
  // Particles streak along the screen-radial direction (away from the
  // vanishing point). gl_PointCoord is y-down while NDC is y-up, hence the
  // flip; the aspect term converts an NDC direction into a pixel direction.
  float radius = length(ndc);
  vStreakDir = radius > 1e-4
    ? normalize(vec2(ndc.x * uAspect, -ndc.y))
    : vec2(1.0, 0.0);

  // Apparent on-screen speed rises with world speed and falls with distance.
  // The radius term keeps particles near the vanishing point round — they
  // genuinely are barely moving on screen.
  float apparent = (uSpeed / max(dist, 0.6)) * (0.25 + 0.75 * min(radius, 1.5));
  float k = 1.0 + uStreak * clamp(apparent, 0.0, 8.0);
  vStreakK = k;

  // ---- Size --------------------------------------------------------------
  float ps = uSize * (0.6 + 0.8 * aRandom.y) * uPixelRatio * (12.0 / dist);
  ps = clamp(ps, 0.75 * uPixelRatio, uMaxSize * uPixelRatio);
  ps *= k; // the sprite quad has to grow to hold the streak
  gl_PointSize = min(ps, 64.0); // fill-rate ceiling; some drivers clip past this

  // ---- Colour ------------------------------------------------------------
  // Picked in the shader from uniform thresholds rather than baked into a
  // buffer, so the Leva colour-mix sliders cost a uniform update instead of
  // regenerating 100k vertices on every drag.
  float ticket = aRandom.z;
  vec3 col = uColorBlue;
  col = mix(col, uColorViolet, step(uMixBlue, ticket));
  float isWhite = step(uMixBlue + uMixViolet, ticket);
  col = mix(col, uColorWhite, isWhite);
  vColor = col;

  // ---- Alpha -------------------------------------------------------------
  // Fade in at the far plane and out at the near plane so the tunnel wrap is
  // invisible; without this, particles pop in and out at the seams.
  float fadeIn = smoothstep(uFar, uFar - 14.0, dist);
  float fadeOut = smoothstep(uNear, uNear + 3.5, dist);

  // Phase derived from the seed position so twinkle stays decorrelated from
  // the colour lottery.
  float phase = dot(position.xy, vec2(12.9898, 78.233));
  float twinkle = 0.72 + 0.28 * sin(uTime * 1.7 + phase);

  float alpha = fadeIn * fadeOut * twinkle * uBrightness;
  alpha *= 1.0 + isWhite * 0.6; // white ones are "sparks", not just dots
  // A stretched sprite covers more pixels; without this the screen blows out
  // under boost.
  alpha /= sqrt(k);

  vAlpha = alpha;
}
