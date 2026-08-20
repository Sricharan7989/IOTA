/* IOTA — scene contents.
   Everything that lives inside the <Canvas>, composed in one place. SceneCanvas
   stays a pure canvas host; this file is the scene graph.

   This is also where the quality tier is applied: particle count, blob
   subdivision, which post-processing passes run, and whether the HDR
   environment is fetched at all.

   Draw order matters: the blob is opaque and writes depth, the warp is additive
   and does not. three renders opaque before transparent, so warp particles
   behind the blob are correctly occluded while the ones nearer the camera still
   streak across in front of it (DESIGN.md §6). */
import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import WarpField from './WarpField'
import Blob from './Blob'
import CameraRig from './CameraRig'
import Effects from './Effects'
import EnvironmentProbe from './EnvironmentProbe'
import CanvasErrorBoundary from './CanvasErrorBoundary'

// Dev-only Leva tuners. `import.meta.env.DEV` folds to false in production, so
// the bundler drops these dynamic imports and leva never enters the graph.
const WarpFieldTuner = import.meta.env.DEV
  ? lazy(() => import('./WarpFieldTuner'))
  : null
const BlobTuner = import.meta.env.DEV ? lazy(() => import('./BlobTuner')) : null

export default function Scene({ quality }) {
  const [envMap, setEnvMap] = useState(null)
  const invalidate = useThree((state) => state.invalidate)

  // Stable identity so EnvironmentProbe's effect doesn't re-run every render.
  const handleEnvReady = useCallback((texture) => setEnvMap(texture), [])

  // Under reduced motion the canvas runs frameloop="demand", so anything that
  // changes the scene outside the render loop has to ask for a frame.
  useEffect(() => {
    invalidate()
  }, [invalidate, envMap, quality.particles, quality.blobDetail, quality.reducedMotion])

  return (
    <>
      <CameraRig reducedMotion={quality.reducedMotion} />

      {/* Skipped entirely below the top tier — it is a 1.7 MB download and the
          shader has a perfectly good analytic environment to fall back on. */}
      {quality.hdrEnvironment ? (
        <CanvasErrorBoundary>
          <Suspense fallback={null}>
            <EnvironmentProbe preset="night" onReady={handleEnvReady} />
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

      {BlobTuner ? (
        <Suspense fallback={null}>
          <BlobTuner
            envMap={envMap}
            detail={quality.blobDetail}
            reducedMotion={quality.reducedMotion}
          />
        </Suspense>
      ) : (
        <Blob
          envMap={envMap}
          detail={quality.blobDetail}
          reducedMotion={quality.reducedMotion}
        />
      )}

      <Effects
        bloom={quality.bloom}
        chromatic={quality.chromatic}
        vignette={quality.vignette}
      />
    </>
  )
}
