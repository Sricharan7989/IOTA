/* IOTA — the single WebGL context for the entire page.
   There is exactly one <Canvas> and it never unmounts. Sections will scroll
   over it rather than owning canvases of their own, so that later phases can
   run one continuous camera journey across the whole page. */
import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import WarpField from './WarpField'
import styles from './SceneCanvas.module.css'

// `import.meta.env.DEV` is statically replaced at build time, so in production
// these collapse to `null` and the dynamic imports are dropped by the bundler.
// That keeps r3f-perf (a devDependency) and leva out of the shipped graph.
const PerfPanel = import.meta.env.DEV ? lazy(() => import('./PerfPanel')) : null
const WarpFieldTuner = import.meta.env.DEV
  ? lazy(() => import('./WarpFieldTuner'))
  : null

export default function SceneCanvas() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <Canvas
        // Uncapped devicePixelRatio is the fastest way to lose 60fps on a
        // high-density display: at 3x we would render 9x the pixels.
        dpr={[1, 2]}
        camera={{ fov: 35, position: [0, 0, 6], near: 0.1, far: 100 }}
        gl={{
          // Transparent: the page background comes from CSS, not from the
          // renderer's clear colour.
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
      >
        {/* The permanent background. In dev the tuner wraps it to drive the
            same component from Leva; in production it mounts bare with the
            defaults baked into WARP_DEFAULTS. */}
        {WarpFieldTuner ? (
          <Suspense fallback={null}>
            <WarpFieldTuner />
          </Suspense>
        ) : (
          <WarpField />
        )}

        {PerfPanel ? (
          <Suspense fallback={null}>
            <PerfPanel />
          </Suspense>
        ) : null}
      </Canvas>
    </div>
  )
}
