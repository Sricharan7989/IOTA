// IOTA — volumetric glow vertex shader.
// A plain billboarded quad; all the shaping happens in the fragment stage.

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
