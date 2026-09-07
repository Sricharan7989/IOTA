/* IOTA — scene contents.
   Everything that lives inside the <Canvas>, composed in one place. SceneCanvas
   stays a pure canvas host; this file is the scene graph.

   ==========================================================================
   ACTIVE HERO: <EnergyMass /> — the curl-noise particle mass.

   The model hero is NOT deleted, only unmounted. To revert instantly:
     1. swap <EnergyMass/> (and its tuner) below for <HeroModel/>
     2. re-add <HeroLighting /> and the <Environment> block — the model uses
        MeshStandardMaterial and needs both; the particle mass is unlit and
        ignores them entirely, so mounting them now would cost a 1.7 MB HDR
        fetch to light nothing.
   HeroModel.jsx, HeroLighting.jsx and the shader-blob centerpiece all remain in
   the repo and tree-shake out of the bundle while unreferenced.
   ==========================================================================

   Draw order: both particle systems are additive with depthWrite off, so they
   blend into each other rather than occluding — which is what lets the warp
   read as *around* the hero rather than merely behind it (DESIGN.md §6). */
import { Suspense, lazy, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import WarpField from './WarpField'
import EnergyMass, { ENERGY_DEFAULTS } from './EnergyMass'
import GlowHalo from './GlowHalo'
import Debris, { DEBRIS_DEFAULTS } from './Debris'
import CameraRig from './CameraRig'
import Effects from './Effects'
import { SHOW_DEV } from '../lib/devtools'

// Leva tuners, gated by the single SHOW_DEV switch in lib/devtools.js.
//
// `import.meta.env.DEV &&` MUST stay written out literally here. It is not
// redundant with SHOW_DEV: the bundler only dead-code-eliminates a dynamic
// import when the condition is statically false *at this call site*, and a
// constant imported from another module does not give it that. Reduce these
// to `SHOW_DEV ? ...` and leva (184 kB) plus r3f-perf ship to production.
//
// With the flag off in dev these are never rendered, so leva is not even
// fetched — while the tuner files and their useControls hooks stay exactly as
// they were, ready for the flag to be flipped back.
const DEV_UI = import.meta.env.DEV && SHOW_DEV

const WarpFieldTuner = DEV_UI ? lazy(() => import('./WarpFieldTuner')) : null
const EnergyMassTuner = DEV_UI ? lazy(() => import('./EnergyMassTuner')) : null
const AtmosphereTuner = DEV_UI ? lazy(() => import('./AtmosphereTuner')) : null
const EffectsTuner = DEV_UI ? lazy(() => import('./EffectsTuner')) : null

export default function Scene({ quality }) {
  const invalidate = useThree((state) => state.invalidate)

  // Under reduced motion the canvas runs frameloop="demand", so anything that
  // changes the scene outside the render loop has to ask for a frame.
  useEffect(() => {
    invalidate()
  }, [
    invalidate,
    quality.particles,
    quality.heroParticles,
    quality.debrisCount,
    quality.reducedMotion,
  ])

  return (
    <>
      <CameraRig reducedMotion={quality.reducedMotion} />

      {/* Behind the mass: the light source it is silhouetted against. Drawn
          first so the additive particle systems stack on top of it. */}
      {!AtmosphereTuner ? <GlowHalo reducedMotion={quality.reducedMotion} /> : null}

      {WarpFieldTuner ? (
        <Suspense fallback={null}>
          <WarpFieldTuner
            count={quality.particles}
            reducedMotion={quality.reducedMotion}
          />
        </Suspense>
      ) : (
        <WarpField
          count={quality.particles}
          reducedMotion={quality.reducedMotion}
        />
      )}

      {EnergyMassTuner ? (
        <Suspense fallback={null}>
          <EnergyMassTuner
            count={quality.heroParticles}
            reducedMotion={quality.reducedMotion}
          />
        </Suspense>
      ) : (
        <EnergyMass
          count={quality.heroParticles}
          bokehScale={ENERGY_DEFAULTS.bokehScale * quality.bokehScale}
          reducedMotion={quality.reducedMotion}
        />
      )}

      {/* In front of and around the mass: parallax and a sense of scale. */}
      {AtmosphereTuner ? (
        <Suspense fallback={null}>
          <AtmosphereTuner reducedMotion={quality.reducedMotion} />
        </Suspense>
      ) : (
        <Debris
          count={quality.debrisCount}
          bokehScale={DEBRIS_DEFAULTS.bokehScale * quality.bokehScale}
          reducedMotion={quality.reducedMotion}
        />
      )}

      {EffectsTuner ? (
        <Suspense fallback={null}>
          <EffectsTuner
            bloom={quality.bloom}
            chromatic={quality.chromatic}
            vignette={quality.vignette}
          />
        </Suspense>
      ) : (
        <Effects
          bloom={quality.bloom}
          chromatic={quality.chromatic}
          vignette={quality.vignette}
        />
      )}
    </>
  )
}
