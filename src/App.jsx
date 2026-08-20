/* IOTA — application root.
   Composition only: a fixed WebGL layer behind, the navbar, and the scrolling
   DOM layer in front. Keep this file a list of what the page is made of, never
   a place where logic lives. */
import SceneCanvas from './canvas/SceneCanvas'
import Navbar from './components/Navbar'
import Home from './sections/Home'
import Roadmap from './sections/Roadmap'
import Resources from './sections/Resources'
import Team from './sections/Team'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import styles from './App.module.css'

export default function App() {
  // Starts Lenis and bridges it to GSAP/ScrollTrigger. Everything else reads
  // the scroll through lib/scroll.js.
  useSmoothScroll()

  return (
    <>
      <SceneCanvas />
      <Navbar />

      <main className={styles.content}>
        <Home />
        <Roadmap />
        <Resources />
        <Team />
      </main>
    </>
  )
}
