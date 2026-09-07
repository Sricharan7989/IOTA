/* IOTA — application root.
   Composition only: the fixed WebGL layer behind, the navbar, the scrolling DOM
   layer in front, and the intro overlay above all of it.

   The canvas is lazy-loaded. three + R3F + drei is ~940 kB of the bundle, and
   none of it is needed to paint the first frame — the DOM layer and a CSS
   placeholder render immediately while that chunk streams in.

   `introDone` is the one piece of state that crosses layers: the preloader
   raises it when the wipe finishes, and the hero uses it to start its reveal. */
import { Suspense, lazy, useCallback, useState } from 'react'
import Backdrop from './components/Backdrop'
import Cursor from './components/Cursor'
import ContentAtmosphere from './components/ContentAtmosphere'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import ShiftMarker from './components/ShiftMarker'
import CanvasPlaceholder from './components/CanvasPlaceholder'
import Home from './sections/Home'
import Roadmap from './sections/Roadmap'
import Resources from './sections/Resources'
import Academics from './sections/Academics'
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
      {/* Behind everything, including the canvas. Pure CSS, so both paint on
          the first frame while the WebGL chunk is still downloading.

          Two rooms, two backdrops, in this order on purpose: they share
          --z-backdrop, so ContentAtmosphere paints over Backdrop's hero
          vignette once the SHIFT has brought it up to full opacity. */}
      <Backdrop />
      <ContentAtmosphere />

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

        {/* The threshold between the two worlds. Also the boundary divider,
            which is why Roadmap carries no top rule of its own. */}
        <ShiftMarker />

        <Roadmap />
        <Resources />
        <Academics />
        <Team />
      </main>

      <Preloader onComplete={handleIntroComplete} />

      {/* Above everything, including the preloader - it stands in for the
          native cursor. Renders nothing on coarse pointers or under reduced
          motion, where the native cursor is left alone. */}
      <Cursor />
    </>
  )
}
