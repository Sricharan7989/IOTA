/* IOTA — the single WebGL context for the entire page.
   There is exactly one <Canvas> and it never unmounts. Sections scroll over it
   rather than owning canvases of their own.

   The 3D belongs to the hero and to nothing else, so this file also owns the
   SHIFT's cinematic half: the layer fades and pulls back across the hero's
   exit, and once the hero is genuinely gone the render loop stops.

   Stopping the loop rather than unmounting the <Canvas> is deliberate. It buys
   the same thing - zero draw calls, zero shader work, an idle GPU for the
   whole content world - without throwing away the WebGL context and the
   ~160k-particle buffers behind it. Unmounting would make every scroll back up
   to the hero pay to re-upload them, which is a visible hitch on exactly the
   move the whole page is built around.

   Canvas host only — the scene graph lives in Scene.jsx. This file owns the
   renderer-level quality decisions: pixel ratio and frameloop. */
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from './Scene'
import { useQuality } from '../hooks/useQuality'
import { SHOW_DEV } from '../lib/devtools'
import {
  CANVAS_START,
  CULL_END,
  RECEDE_SCALE,
  SHIFT_CUT,
  SHIFT_END,
  SHIFT_SCRUB,
  SHIFT_TRIGGER,
} from '../lib/shift'
import styles from './SceneCanvas.module.css'

// The r3f-perf overlay, gated by the same SHOW_DEV switch as the Leva panel
// (lib/devtools.js).
//
// `import.meta.env.DEV &&` MUST stay written out literally — see the longer
// note in Scene.jsx. Without it at this call site the bundler keeps the
// dynamic import and r3f-perf, a devDependency, ends up in the production
// bundle.
const PerfPanel =
  import.meta.env.DEV && SHOW_DEV ? lazy(() => import('./PerfPanel')) : null

export default function SceneCanvas() {
  const quality = useQuality()
  const layer = useRef(null)

  // Whether the hero is on screen at all. This flips twice in a whole page
  // journey, not per frame, so React state is the right home for it - the
  // 60fps contract is about values that change every frame, and this one
  // has to reach a React prop.
  const [heroInView, setHeroInView] = useState(true)
  const { reducedMotion } = quality

  useEffect(() => {
    const el = layer.current
    if (!el) return undefined

    const context = gsap.context(() => {
      const cull = ScrollTrigger.create({
        trigger: SHIFT_TRIGGER,
        start: 'top bottom',
        // Reduced motion has no fade to outlast, so it cuts at the same point
        // the composed room arrives. Otherwise we hang on past the end of the
        // shift - see CULL_END.
        end: reducedMotion ? SHIFT_CUT : CULL_END,
        onToggle: (self) => setHeroInView(self.isActive),
      })

      // onToggle only fires on a change, so a deep link landing below the hero
      // would never hear about it.
      setHeroInView(cull.isActive)

      // DESIGN.md 5: no scrubbed recede under reduced motion. The layer is
      // simply shown over the hero and hidden below it, by .culled.
      if (reducedMotion) return

      gsap.fromTo(
        el,
        { opacity: 1, scale: 1 },
        {
          opacity: 0,
          // Pulling back as it dims is what makes it read as a room being
          // left rather than a light being switched off.
          scale: RECEDE_SCALE,
          // Linear: the curve belongs to the scroll, not to the tween.
          ease: 'none',
          scrollTrigger: {
            trigger: SHIFT_TRIGGER,
            start: CANVAS_START,
            end: SHIFT_END,
            scrub: SHIFT_SCRUB,
          },
        },
      )
    })

    return () => context.revert()
  }, [reducedMotion])

  return (
    <div
      ref={layer}
      className={`${styles.layer} ${heroInView ? '' : styles.culled}`}
      aria-hidden="true"
    >
      <Canvas
        // Uncapped devicePixelRatio is the fastest way to lose 60fps on a
        // high-density display: at 3x we would render 9x the pixels.
        // 1.5 on mobile and weak GPUs, 2 on desktop.
        dpr={[1, quality.maxDpr]}
        // Three states, in priority order:
        //   reduced motion -> 'demand'. A genuinely static scene; re-rendering
        //     identical pixels 60 times a second is pure battery burn, and
        //     Scene.jsx calls invalidate() whenever something does change.
        //     Kept even below the hero: 'never' would need an explicit
        //     advance() to wake up, and 'demand' already costs nothing.
        //   hero on screen -> 'always'. The scene is alive.
        //   hero gone      -> 'never'. Not one frame for the whole content
        //     world. This is the performance half of scoping the 3D to the
        //     hero, and it resumes the moment the hero comes back.
        frameloop={
          quality.reducedMotion ? 'demand' : heroInView ? 'always' : 'never'
        }
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
