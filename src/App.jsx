/* IOTA — application root.
   Composition only: a fixed WebGL layer behind, a DOM layer in front. Keep
   this file a list of what the page is made of, never a place where logic
   lives. */
import SceneCanvas from './canvas/SceneCanvas'
import BootLabel from './components/BootLabel'
import styles from './App.module.css'

export default function App() {
  return (
    <>
      <SceneCanvas />

      <main className={styles.content}>
        <BootLabel />
      </main>
    </>
  )
}
