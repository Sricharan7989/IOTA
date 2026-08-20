/* IOTA — the hero lighting rig.
   Three lights, deliberately unbalanced. The whole point is that a large part
   of the model stays unlit: cinematic contrast is what makes an auto-generated
   mesh read as premium, and a flat, evenly-lit model reads as an asset preview.

   No shadow maps. DESIGN.md §6 — depth comes from falloff, scale and parallax,
   not from cast shadows, and a shadow map on a full-screen scene is real cost
   for something the black background would swallow anyway. */
import { heroPalette } from './palette'

export default function HeroLighting({ intensityScale = 1 }) {
  const blue = heroPalette.key()
  const violet = heroPalette.fill()
  const glow = heroPalette.kicker()

  return (
    <>
      {/* Barely there — just enough to keep the shadow side from going pure
          black and losing the silhouette against the warp. */}
      <ambientLight color={blue} intensity={0.16 * intensityScale} />

      {/* Key: strong blue rim from behind and to the side. Placed behind the
          model on Z so it catches the edge rather than the face. */}
      <directionalLight
        color={blue}
        position={[-3.4, 2.6, -3.2]}
        intensity={3.6 * intensityScale}
      />

      {/* Fill: softer violet from the opposite side, front-ish, to recover a
          little form in the shadow half without flattening it. */}
      <directionalLight
        color={violet}
        position={[3.2, -0.6, 2.4]}
        intensity={1.15 * intensityScale}
      />

      {/* A tight specular kicker on the visor side so the glow has a hard
          highlight to sit against. */}
      <pointLight
        color={glow}
        position={[1.6, 1.4, 2.6]}
        intensity={6 * intensityScale}
        distance={12}
        decay={2}
      />
    </>
  )
}
