/* IOTA — application entry point.
   Token variables must load before the reset that consumes them, so the import
   order below is significant. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

// Force manual scroll restoration so the browser does not jump to previous scroll coordinates on reload
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const resetInitialScroll = () => {
  // Always scroll to the top on reload unless navigating directly via URL hash
  if (!window.location.hash) {
    window.scrollTo(0, 0)
  }
}

// Run reset on initialization
resetInitialScroll()
requestAnimationFrame(resetInitialScroll)
window.addEventListener('pageshow', resetInitialScroll)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)