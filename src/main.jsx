/* IOTA — application entry point.
   Token variables must load before the reset that consumes them, so the import
   order below is significant. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

const resetInitialScroll = () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }
}

resetInitialScroll()
requestAnimationFrame(resetInitialScroll)
window.addEventListener('pageshow', resetInitialScroll, { once: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
