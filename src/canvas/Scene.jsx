/* IOTA — scene contents.
   Everything that lives inside the <Canvas>, composed in one place. SceneCanvas
   stays a pure canvas host; this file is the scene graph.

   Draw order matters: the blob is opaque and writes depth, the warp is additive
   and does not. three renders opaque before transparent, so warp particles
   behind the blob are correctly occluded while the ones nearer the camera still
   streak across in front of it (DESIGN.md §6). */
import { Suspense, lazy, useCallback, useState } from 'react'
import WarpField from './WarpField'
import Blob from './Blob'
import CameraRig from './CameraRig'
import EnvironmentProbe from './EnvironmentProbe'
import CanvasErrorBoundary from './CanvasErrorBoundary'

// Dev-only Leva tuners. `import.meta.env.DEV` folds to false in production, so
// the bundler drops these dynamic imports and leva never enters the graph.
const WarpFieldTuner = import.meta.env.DEV
  ? lazy(() => import('./WarpFieldTuner'))
  : null
const BlobTuner = import.meta.env.DEV ? lazy(() => import('./BlobTuner')) : null

export default function Scene() {
  const [envMap, setEnvMap] = useState(null)

  // Stable identity so EnvironmentProbe's effect doesn't re-run every render.
  const handleEnvReady = useCallback((texture) => setEnvMap(texture), [])

  return (
    <>
      <CameraRig />

      {/* Optional: the blob falls back to its analytic environment without it. */}
      <CanvasErrorBoundary>
        <Suspense fallback={null}>
          <EnvironmentProbe preset="night" onReady={handleEnvReady} />
        </Suspense>
      </CanvasErrorBoundary>

      {WarpFieldTuner ? (
        <Suspense fallback={null}>
          <WarpFieldTuner />
        </Suspense>
      ) : (
        <WarpField />
      )}

      {BlobTuner ? (
        <Suspense fallback={null}>
          <BlobTuner envMap={envMap} />
        </Suspense>
      ) : (
        <Blob envMap={envMap} />
      )}
    </>
  )
}
