import { useEffect, useState, useMemo, useCallback } from 'react'
import './BunnyEasterEgg.css'

const CONFIG = {
  animation: {
    bunniesDelay: 300,
    heartsDelay: 500,
    cloudsDelay: 100,
    starsDelay: 400,
    typingSpeed: 55
  },
  bunnies: {
    count: 6,
    maxDelay: 8,
    baseDuration: 8,
    durationVariance: 4
  },
  hearts: {
    count: 8,
    maxDelay: 6,
    baseDuration: 7,
    durationVariance: 3
  },
  clouds: {
    count: 4,
    baseDuration: 30,
    durationVariance: 15
  },
  stars: {
    count: 10,
    maxDelay: 5,
    baseDuration: 4,
    durationVariance: 2
  }
}

const MESSAGES = {
  line1: 'Dicen que cada Suspiro elige su dueño...',
  line2: 'Y pues yo creo que yo encontré el mío.',
  line3: '🐰'
}

const TYPING_SCHEDULE = [
  { lineKey: 'line1', delay: 1500 },
  { lineKey: 'line2', delay: 4000 },
  { lineKey: 'line3', delay: 6500 }
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

const generateBunnies = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 90 + 5,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 1 + Math.random() * 0.6,
    drift: -30 + Math.random() * 60
  }))

const generateHearts = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.5 + Math.random() * 0.5,
    drift: -25 + Math.random() * 50
  }))

const generateClouds = ({ count, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    y: 5 + (i * 15) % 70,
    delay: i * 3,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.9 + Math.random() * 0.5,
    opacity: 0.4 + Math.random() * 0.3
  }))

const generateStars = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.3 + Math.random() * 0.4
  }))

function BunnyEasterEgg() {
  const [showBunnies, setShowBunnies] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [showClouds, setShowClouds] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)

  const typedText = useTypingEffect(MESSAGES, TYPING_SCHEDULE, CONFIG.animation.typingSpeed)

  const bunnies = useMemo(() => generateBunnies(CONFIG.bunnies), [])
  const hearts = useMemo(() => generateHearts(CONFIG.hearts), [])
  const clouds = useMemo(() => generateClouds(CONFIG.clouds), [])
  const stars = useMemo(() => generateStars(CONFIG.stars), [])

  useEffect(() => {
    const cloudsTimer = setTimeout(() => setShowClouds(true), CONFIG.animation.cloudsDelay)
    const bunniesTimer = setTimeout(() => setShowBunnies(true), CONFIG.animation.bunniesDelay)
    const heartsTimer = setTimeout(() => setShowHearts(true), CONFIG.animation.heartsDelay)
    const starsTimer = setTimeout(() => setShowStars(true), CONFIG.animation.starsDelay)
    const revealTimer = setTimeout(() => setIsRevealed(true), 200)

    return () => {
      clearTimeout(cloudsTimer)
      clearTimeout(bunniesTimer)
      clearTimeout(heartsTimer)
      clearTimeout(starsTimer)
      clearTimeout(revealTimer)
    }
  }, [])

  const renderBunny = useCallback((bunny) => (
    <div
      key={bunny.id}
      className="floating-bunny"
      style={{
        left: `${bunny.x}%`,
        animationDelay: `${bunny.delay}s`,
        animationDuration: `${bunny.duration}s`,
        '--bunny-drift': `${bunny.drift}px`,
        fontSize: `${bunny.size}rem`
      }}
      aria-hidden="true"
    >
      🐰
    </div>
  ), [])

  const renderHeart = useCallback((heart) => (
    <div
      key={heart.id}
      className="floating-heart"
      style={{
        left: `${heart.x}%`,
        animationDelay: `${heart.delay}s`,
        animationDuration: `${heart.duration}s`,
        '--heart-drift': `${heart.drift}px`,
        fontSize: `${heart.size}rem`
      }}
      aria-hidden="true"
    >
      ♥
    </div>
  ), [])

  const renderCloud = useCallback((cloud) => (
    <div
      key={cloud.id}
      className="drifting-cloud"
      style={{
        top: `${cloud.y}%`,
        animationDelay: `${cloud.delay}s`,
        animationDuration: `${cloud.duration}s`,
        '--cloud-opacity': cloud.opacity,
        fontSize: `${cloud.size}rem`
      }}
      aria-hidden="true"
    >
      ☁
    </div>
  ), [])

  const renderStar = useCallback((star) => (
    <div
      key={star.id}
      className="twinkling-star"
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        animationDelay: `${star.delay}s`,
        animationDuration: `${star.duration}s`,
        fontSize: `${star.size}rem`
      }}
      aria-hidden="true"
    >
      ✦
    </div>
  ), [])

  return (
    <div className="bunny-easter-egg-container" role="article" aria-label="Easter egg conejito">
      {/* Background layers */}
      <div className="bg-layer bg-gradient-soft" />
      <div className="bg-layer bg-glow-pink" />

      {/* Drifting clouds */}
      {showClouds && (
        <div className="clouds-layer" aria-hidden="true">
          {clouds.map(renderCloud)}
        </div>
      )}

      {/* Twinkling stars */}
      {showStars && (
        <div className="stars-layer" aria-hidden="true">
          {stars.map(renderStar)}
        </div>
      )}

      {/* Floating bunnies */}
      {showBunnies && (
        <div className="bunnies-layer" aria-hidden="true">
          {bunnies.map(renderBunny)}
        </div>
      )}

      {/* Floating hearts */}
      {showHearts && (
        <div className="hearts-layer" aria-hidden="true">
          {hearts.map(renderHeart)}
        </div>
      )}

      {/* Main content */}
      <div className={`bunny-content ${isRevealed ? 'revealed' : ''}`}>
        {/* Header */}
        <header className="bunny-header">
          <div className="date-decoration">
            <span className="decoration-bunny">🐰</span>
            <div className="date-pill">
              <span className="date-number">1101</span>
            </div>
            <span className="decoration-bunny decoration-bunny-flip">🐰</span>
          </div>
          <p className="date-subtitle">Suspiro</p>
        </header>

        {/* Message card */}
        <article className="bunny-card">
          <div className="card-glow" />
          <div className="card-inner">
            <div className="message-section">
              <p className="message-line italic" aria-live="polite">
                {typedText.line1}
              </p>

              <div className="message-spacer" />

              <p className="message-line main-text" aria-live="polite">
                {typedText.line2}
              </p>

              <div className="message-spacer-small" />

              <p className="message-line emoji-reveal" aria-live="polite">
                {typedText.line3}
              </p>
            </div>
          </div>
        </article>

        {/* Footer */}
        <footer className="bunny-footer">
          <span className="footer-icon">🥕</span>
          <span className="footer-text">Mi Suspiro</span>
          <span className="footer-icon">🥕</span>
        </footer>
      </div>
    </div>
  )
}

export default BunnyEasterEgg
