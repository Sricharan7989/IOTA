/* IOTA — application root.
   Composition only: the fixed WebGL layer behind, the navbar, the scrolling DOM
   layer in front, and the intro overlay above all of it.

   `introDone` is the one piece of state that crosses layers: the preloader
   raises it when the wipe finishes, and the hero uses it to start its reveal. */
import { useCallback, useState } from 'react'
import SceneCanvas from './canvas/SceneCanvas'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import Home from './sections/Home'
import Roadmap from './sections/Roadmap'
import Resources from './sections/Resources'
import Team from './sections/Team'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import styles from './App.module.css'

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  // Starts Lenis and bridges it to GSAP/ScrollTrigger. Everything else reads
  // the scroll through lib/scroll.js.
  useSmoothScroll()

  const handleIntroComplete = useCallback(() => setIntroDone(true), [])

  return (
    <>
      <SceneCanvas />
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
