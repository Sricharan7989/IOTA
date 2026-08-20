/* IOTA — the single WebGL context for the entire page.
   There is exactly one <Canvas> and it never unmounts. Sections scroll over it
   rather than owning canvases of their own, which is what lets one continuous
   camera journey run across the whole page.

   Canvas host only — the scene graph lives in Scene.jsx. This file owns the
   two renderer-level quality decisions: pixel ratio and frameloop. */
import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import { useQuality } from '../hooks/useQuality'
import styles from './SceneCanvas.module.css'

// `import.meta.env.DEV` is statically replaced at build time, so in production
// this collapses to `null` and the dynamic import is dropped by the bundler.
// That keeps r3f-perf (a devDependency) out of the shipped graph.
const PerfPanel = import.meta.env.DEV ? lazy(() => import('./PerfPanel')) : null

export default function SceneCanvas() {
  const quality = useQuality()

  return (
    <div className={styles.layer} aria-hidden="true">
      <Canvas
        // Uncapped devicePixelRatio is the fastest way to lose 60fps on a
        // high-density display: at 3x we would render 9x the pixels.
        // 1.5 on mobile and weak GPUs, 2 on desktop.
        dpr={[1, quality.maxDpr]}
        // Reduced motion produces a genuinely static scene — nothing animates,
        // so re-rendering identical pixels 60 times a second is pure battery
        // burn. Scene.jsx calls invalidate() whenever something does change.
        frameloop={quality.reducedMotion ? 'demand' : 'always'}
        camera={{ fov: 35, position: [0, 0, 6], near: 0.1, far: 100 }}
        gl={{
          // Transparent: the page background comes from CSS, not from the
          // renderer's clear colour.
          alpha: true,
          // The post-processing stack does its own AA where it matters, and
          // MSAA on a full-screen particle field is expensive for very little.
          antialias: !quality.bloom,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <Scene quality={quality} />

        {PerfPanel ? (
          <Suspense fallback={null}>
            <PerfPanel />
          </Suspense>
        ) : null}
      </Canvas>
    </div>
  )
}
