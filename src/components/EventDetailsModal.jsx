import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getLenis } from '../lib/scroll'
import styles from './EventDetailsModal.module.css'

function CloseIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 3 10 10M13 3 3 13" /></svg>
}

export default function EventDetailsModal({ event, onClose }) {
  const closeButton = useRef(null)
  const { details, images = [] } = event
  const [activeImage, setActiveImage] = useState(0)
  const showImage = images[activeImage]

  const changeImage = (offset) => {
    setActiveImage((current) => (current + offset + images.length) % images.length)
  }

  useEffect(() => {
    // Do not toggle document overflow here: it can reset the browser's scroll
    // anchor and make ScrollTrigger cull the hero canvas on modal close.
    const lenis = getLenis()
    lenis?.stop()
    closeButton.current?.focus()
    const handleKeyDown = (keyEvent) => {
      if (keyEvent.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      lenis?.start()
    }
  }, [onClose])

  return createPortal(
    <div className={styles.backdrop} role="presentation" onWheel={(wheelEvent) => wheelEvent.preventDefault()} onMouseDown={(mouseEvent) => {
      if (mouseEvent.target === mouseEvent.currentTarget) onClose()
    }}>
      <section className={styles.modal} data-lenis-prevent data-lenis-prevent-wheel onWheel={(wheelEvent) => wheelEvent.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby={`${event.id}-title`} aria-describedby={`${event.id}-summary`}>
        <button ref={closeButton} className={styles.close} onClick={onClose} aria-label="Close event recap"><CloseIcon /></button>
        <div className={styles.hero}>
          <img src={images[1] ?? event.image} alt="" />
          <div className={styles.heroShade} />
          <p className={styles.kicker}>{details.kicker}</p>
          <h3 id={`${event.id}-title`}>{event.title}</h3>
          <p className={styles.date}>{event.date} · {event.location}</p>
        </div>
        <div className={styles.body}>
          <p id={`${event.id}-summary`} className={styles.summary}>{details.summary}</p>
          <dl className={styles.highlights}>
            {details.highlights.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
          </dl>
          <div className={styles.copyBlock}>
            <p className={styles.label}>{details.featureTitle ?? 'Grand Finale qualifiers'}</p>
            <p>{details.featureText ?? <><strong>Build N Pray</strong> and <strong>Bumblebees</strong> earned the two places to represent IIIT Sri City at the International Grand Finale in Mumbai.</>}</p>
          </div>
          <div className={styles.copyBlock}><p className={styles.label}>{details.secondaryTitle ?? 'Judging panel'}</p><p>{details.secondaryText ?? details.judges.join(' · ')}</p></div>
          {details.acknowledgements ? <div className={styles.copyBlock}><p className={styles.label}>{details.acknowledgementsTitle ?? 'Made possible by'}</p><p>{details.acknowledgements}</p></div> : null}
          {details.crew ? <div className={styles.copyBlock}><p className={styles.label}>{details.crewTitle ?? 'The team behind the day'}</p><p>{details.crew}</p></div> : null}
          <div className={styles.photoViewer} aria-label="BIT N BUILD 26 photo gallery">
            <img key={showImage} src={showImage} alt={`BIT N BUILD 26, moment ${activeImage + 1}`} loading="lazy" decoding="async" />
            <div className={styles.photoControls}>
              <button onClick={() => changeImage(-1)} aria-label="Previous event photo">Previous</button>
              <span>{activeImage + 1} / {images.length}</span>
              <button onClick={() => changeImage(1)} aria-label="Next event photo">Next</button>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}
