/* IOTA — the single WebGL context for the entire page.
   There is exactly one <Canvas> and it never unmounts. Sections scroll over it
   rather than owning canvases of their own, which is what lets one continuous
   camera journey run across the whole page.

   Canvas host only — the scene graph lives in Scene.jsx. */
import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import styles from './SceneCanvas.module.css'

// `import.meta.env.DEV` is statically replaced at build time, so in production
// this collapses to `null` and the dynamic import is dropped by the bundler.
// That keeps r3f-perf (a devDependency) out of the shipped graph.
const PerfPanel = import.meta.env.DEV ? lazy(() => import('./PerfPanel')) : null

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
        <Scene />

        {PerfPanel ? (
          <Suspense fallback={null}>
            <PerfPanel />
          </Suspense>
        ) : null}
      </Canvas>
    </div>
  )
}
