import { useEffect, useState, useMemo, useCallback } from 'react'
import './ButterflyEasterEgg.css'

const CONFIG = {
  animation: {
    butterfliesDelay: 400,
    sparklesDelay: 600,
    floralDelay: 200,
    typingSpeed: 48
  },
  butterflies: {
    count: 8,
    baseDuration: 12,
    durationVariance: 6
  },
  sparkles: {
    count: 12,
    maxDelay: 6,
    baseDuration: 4,
    durationVariance: 3
  },
  petals: {
    count: 8,
    maxDelay: 8,
    baseDuration: 14,
    durationVariance: 6
  }
}

const MESSAGES = {
  line1: 'No sé si sean las mariposas amarillas del realismo mágico,',
  line2: 'o las mariposas que me dan en el estómago mientras escribo esto,',
  line3: 'o las mariposas que aletean a nuestro favor...',
  line4: 'Pero cada una de ellas vuela hacia ti, Pau.',
  line6: 'Y yo las sigo.'
}

const TYPING_SCHEDULE = [
  { lineKey: 'line1', delay: 1500 },
  { lineKey: 'line2', delay: 4200 },
  { lineKey: 'line3', delay: 7200 },
  { lineKey: 'line4', delay: 10000 },
  { lineKey: 'line6', delay: 12500 }
]

const useTypingEffect = (messages, schedule, typingSpeed) => {
  const [typedText, setTypedText] = useState(
    Object.keys(messages).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  )

  useEffect(() => {
    const timers = []
    const intervals = []

    schedule.forEach(({ lineKey, delay }) => {
      const text = messages[lineKey]
      if (!text) return

      const timer = setTimeout(() => {
        let currentIndex = 0
        const interval = setInterval(() => {
          if (currentIndex <= text.length) {
            setTypedText(prev => ({
              ...prev,
              [lineKey]: text.substring(0, currentIndex)
            }))
            currentIndex++
          } else {
            clearInterval(interval)
          }
        }, typingSpeed)
        intervals.push(interval)
      }, delay)
      timers.push(timer)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [messages, schedule, typingSpeed])

  return typedText
}

const generateButterflies = (count, baseDuration, durationVariance) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: 100 + Math.random() * 20,
    endX: Math.random() * 100,
    endY: -10 - Math.random() * 20,
    delay: Math.random() * 5,
    duration: baseDuration + Math.random() * durationVariance,
    size: 1.2 + Math.random() * 1,
    wobble: 30 + Math.random() * 40
  }))
}

const generateSparkles = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.4 + Math.random() * 0.5
  }))

const generatePetals = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.6 + Math.random() * 0.5,
    drift: -50 + Math.random() * 100,
    rotation: Math.random() * 360
  }))

function ButterflyEasterEgg() {
  const [showButterflies, setShowButterflies] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [showPetals, setShowPetals] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)

  const typedText = useTypingEffect(MESSAGES, TYPING_SCHEDULE, CONFIG.animation.typingSpeed)

  const butterflies = useMemo(() =>
    generateButterflies(CONFIG.butterflies.count, CONFIG.butterflies.baseDuration, CONFIG.butterflies.durationVariance), [])
  const sparkles = useMemo(() => generateSparkles(CONFIG.sparkles), [])
  const petals = useMemo(() => generatePetals(CONFIG.petals), [])

  useEffect(() => {
    const petalTimer = setTimeout(() => setShowPetals(true), CONFIG.animation.floralDelay)
    const butterflyTimer = setTimeout(() => setShowButterflies(true), CONFIG.animation.butterfliesDelay)
    const sparkleTimer = setTimeout(() => setShowSparkles(true), CONFIG.animation.sparklesDelay)
    const revealTimer = setTimeout(() => setIsRevealed(true), 300)

    return () => {
      clearTimeout(petalTimer)
      clearTimeout(butterflyTimer)
      clearTimeout(sparkleTimer)
      clearTimeout(revealTimer)
    }
  }, [])

  const renderButterfly = useCallback((butterfly) => (
    <div
      key={butterfly.id}
      className="butterfly-flight"
      style={{
        '--start-x': `${butterfly.startX}%`,
        '--start-y': `${butterfly.startY}%`,
        '--end-x': `${butterfly.endX}%`,
        '--end-y': `${butterfly.endY}%`,
        '--delay': `${butterfly.delay}s`,
        '--duration': `${butterfly.duration}s`,
        '--wobble': `${butterfly.wobble}px`
      }}
    >
      <span
        className="butterfly-emoji"
        style={{ fontSize: `${butterfly.size}rem` }}
        role="img"
        aria-hidden="true"
      >
        🦋
      </span>
    </div>
  ), [])

  const renderSparkle = useCallback((sparkle) => (
    <div
      key={sparkle.id}
      className="garden-sparkle"
      style={{
        left: `${sparkle.x}%`,
        top: `${sparkle.y}%`,
        animationDelay: `${sparkle.delay}s`,
        animationDuration: `${sparkle.duration}s`,
        fontSize: `${sparkle.size}rem`
      }}
      aria-hidden="true"
    >
      ✦
    </div>
  ), [])

  const renderPetal = useCallback((petal) => (
    <div
      key={petal.id}
      className="falling-petal"
      style={{
        left: `${petal.left}%`,
        animationDelay: `${petal.delay}s`,
        animationDuration: `${petal.duration}s`,
        '--petal-drift': `${petal.drift}px`,
        '--petal-rotation': `${petal.rotation}deg`,
        fontSize: `${petal.size}rem`
      }}
      aria-hidden="true"
    >
      ❀
    </div>
  ), [])

  return (
    <div className="butterfly-easter-egg-container" role="article" aria-label="Easter egg de mariposas">
      {/* Background gradient layers */}
      <div className="bg-layer bg-gradient" />
      <div className="bg-layer bg-glow" />

      {/* Falling petals */}
      {showPetals && (
        <div className="petals-layer" aria-hidden="true">
          {petals.map(renderPetal)}
        </div>
      )}

      {/* Golden sparkles */}
      {showSparkles && (
        <div className="sparkles-layer" aria-hidden="true">
          {sparkles.map(renderSparkle)}
        </div>
      )}

      {/* Flying butterflies */}
      {showButterflies && (
        <div className="butterflies-layer" aria-hidden="true">
          {butterflies.map(renderButterfly)}
        </div>
      )}

      {/* Main content */}
      <div className={`butterfly-content ${isRevealed ? 'revealed' : ''}`}>
        {/* Header */}
        <header className="butterfly-header">
          <div className="date-decoration">
            <span className="decoration-wing">🦋</span>
            <div className="date-circle">
              <span className="date-number">1110</span>
            </div>
            <span className="decoration-wing decoration-wing-flip">🦋</span>
          </div>
          <p className="date-subtitle">Día de la Mariposa Monarca</p>
        </header>

        {/* Message card */}
        <article className="butterfly-card">
          <div className="card-shimmer" />
          <div className="card-inner">
            <div className="message-section message-intro">
              <p className="message-line italic" aria-live="polite">{typedText.line1}</p>
              <p className="message-line italic" aria-live="polite">{typedText.line2}</p>
              <p className="message-line italic" aria-live="polite">{typedText.line3}</p>
            </div>

            <div className="message-divider">
              <span className="divider-butterfly">🦋</span>
            </div>

            <div className="message-section message-main">
              <p className="message-line main-text" aria-live="polite">{typedText.line4}</p>
              <p className="message-line emphasis-text" aria-live="polite">{typedText.line6}</p>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="butterfly-footer">
          <span className="footer-symbol">✧</span>
          <span className="footer-text">Efecto Mariposa</span>
          <span className="footer-symbol">✧</span>
        </footer>
      </div>
    </div>
  )
}

export default ButterflyEasterEgg
