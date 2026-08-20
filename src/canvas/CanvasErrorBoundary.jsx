/* IOTA — error boundary for optional scene extras.
   useLoader propagates a failed fetch as a thrown error, which without a
   boundary unmounts the entire React tree and white-screens the site. The
   environment HDR is a nice-to-have, so a failure here must stay silent and
   local. */
import { Component } from 'react'

export default class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.warn('[IOTA] optional scene asset failed to load:', error)
    }
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
