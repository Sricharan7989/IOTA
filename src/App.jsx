/* IOTA — application root.
   Composition only: the fixed WebGL layer behind, the navbar, the scrolling DOM
   layer in front, and the intro overlay above all of it.

   The canvas is lazy-loaded. three + R3F + drei is ~940 kB of the bundle, and
   none of it is needed to paint the first frame — the DOM layer and a CSS
   placeholder render immediately while that chunk streams in.

   `introDone` is the one piece of state that crosses layers: the preloader
   raises it when the wipe finishes, and the hero uses it to start its reveal. */
import { Suspense, lazy, useCallback, useState } from 'react'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import CanvasPlaceholder from './components/CanvasPlaceholder'
import Home from './sections/Home'
import Roadmap from './sections/Roadmap'
import Resources from './sections/Resources'
import Team from './sections/Team'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { getQuality } from './lib/quality'
import styles from './App.module.css'

const SceneCanvas = lazy(() => import('./canvas/SceneCanvas'))

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  // Read once at module level rather than via the hook: this only decides
  // whether to mount the canvas at all, and must not re-render the tree.
  const { webglSupported } = getQuality()

  // Starts Lenis and bridges it to GSAP/ScrollTrigger. Everything else reads
  // the scroll through lib/scroll.js.
  useSmoothScroll()

  const handleIntroComplete = useCallback(() => setIntroDone(true), [])

  return (
    <>
      {webglSupported ? (
        <Suspense fallback={<CanvasPlaceholder />}>
          <SceneCanvas />
        </Suspense>
      ) : (
        // No WebGL at all: the gradient backdrop is the whole visual, and the
        // rest of the page carries on working normally.
        <CanvasPlaceholder />
      )}

      <Navbar />

      <main className={styles.content}>
        <Home revealed={introDone} />
        <Roadmap />
        <Resources />
        <Team />
      </main>

      <Preloader onComplete={handleIntroComplete} />
    </>
  )
}
