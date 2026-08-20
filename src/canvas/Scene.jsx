/* IOTA — scene contents.
   Everything that lives inside the <Canvas>, composed in one place. SceneCanvas
   stays a pure canvas host; this file is the scene graph.

   This is also where the quality tier is applied: particle count, which
   post-processing passes run, and whether the HDR environment is fetched.

   Draw order: the model is opaque and writes depth, the warp is additive and
   does not. three renders opaque before transparent, so warp particles behind
   the model are correctly occluded while the ones nearer the camera still
   streak across in front of it — which is what keeps the warp reading as
   *around* the hero rather than merely behind it (DESIGN.md §6). */
import { Suspense, lazy, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import WarpField from './WarpField'
import HeroModel from './HeroModel'
import HeroLighting from './HeroLighting'
import CameraRig from './CameraRig'
import Effects from './Effects'
import CanvasErrorBoundary from './CanvasErrorBoundary'

// Dev-only Leva tuner. `import.meta.env.DEV` folds to false in production, so
// the bundler drops this dynamic import and leva never enters the graph.
const WarpFieldTuner = import.meta.env.DEV
  ? lazy(() => import('./WarpFieldTuner'))
  : null

export default function Scene({ quality }) {
  const invalidate = useThree((state) => state.invalidate)

  // Under reduced motion the canvas runs frameloop="demand", so anything that
  // changes the scene outside the render loop has to ask for a frame.
  useEffect(() => {
    invalidate()
  }, [invalidate, quality.particles, quality.reducedMotion])

  return (
    <>
      <CameraRig reducedMotion={quality.reducedMotion} />

      <HeroLighting />

      {/* Real reflections for the model's standard material. Unlike the old
          custom-shader centerpiece, MeshStandardMaterial consumes
          scene.environment directly, so <Environment> is the right API here.
          Top tier only — it is a ~1.7 MB CDN fetch, and the light rig already
          carries the look without it. */}
      {quality.hdrEnvironment ? (
        <CanvasErrorBoundary>
          <Suspense fallback={null}>
            <Environment preset="night" background={false} />
          </Suspense>
        </CanvasErrorBoundary>
      ) : null}

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

      {/* Suspends on the GLB. The preloader covers this on a normal load; the
          warp keeps rendering behind the fallback either way. */}
      <Suspense fallback={null}>
        <HeroModel reducedMotion={quality.reducedMotion} />
      </Suspense>

      <Effects
        bloom={quality.bloom}
        chromatic={quality.chromatic}
        vignette={quality.vignette}
      />
    </>
  )
}
