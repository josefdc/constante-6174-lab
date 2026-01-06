import { useEffect, useState, useMemo, useCallback } from 'react'
import './BunnyEasterEgg.css'
import NostalgiaIntro from './NostalgiaIntro'

// Configuración
const CONFIG = {
  animation: {
    bunniesDelay: 400,
    heartsDelay: 600,
    cloudsDelay: 300,
    typingSpeed: 50
  },
  bunnies: {
    count: 20,
    maxDelay: 6,
    baseDuration: 4,
    durationVariance: 3
  },
  hearts: {
    count: 30,
    maxDelay: 5,
    baseDuration: 3,
    durationVariance: 2
  },
  clouds: {
    count: 8,
    baseDuration: 20,
    durationVariance: 10
  }
}

const MESSAGES = {
  line1: 'Dicen que cada Suspiro elige su dueño...',
  line2: 'Y pues yo creo que yo encontré el mío.',
  line3: '🐰'
}

const TYPING_SCHEDULE = [
  { lineKey: 'line1', delay: 1800 },
  { lineKey: 'line2', delay: 4500 },
  { lineKey: 'line3', delay: 7000 }
]

// Custom hook para efecto de escritura
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

// Generadores optimizados
const generateBunnies = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 90,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.8 + Math.random() * 0.7,
    rotation: -15 + Math.random() * 30
  }))

const generateHearts = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.6 + Math.random() * 0.6
  }))

const generateClouds = ({ count, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    y: 10 + (i * 12) % 80,
    delay: i * 2,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.8 + Math.random() * 0.5
  }))

function BunnyEasterEgg() {
  const [showIntro, setShowIntro] = useState(true)
  const [showBunnies, setShowBunnies] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [showClouds, setShowClouds] = useState(false)

  const typedText = useTypingEffect(MESSAGES, TYPING_SCHEDULE, CONFIG.animation.typingSpeed)
  
  const bunnies = useMemo(() => generateBunnies(CONFIG.bunnies), [])
  const hearts = useMemo(() => generateHearts(CONFIG.hearts), [])
  const clouds = useMemo(() => generateClouds(CONFIG.clouds), [])

  useEffect(() => {
    const cloudsTimer = setTimeout(() => setShowClouds(true), CONFIG.animation.cloudsDelay)
    const bunniesTimer = setTimeout(() => setShowBunnies(true), CONFIG.animation.bunniesDelay)
    const heartsTimer = setTimeout(() => setShowHearts(true), CONFIG.animation.heartsDelay)

    return () => {
      clearTimeout(cloudsTimer)
      clearTimeout(bunniesTimer)
      clearTimeout(heartsTimer)
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
        fontSize: `${bunny.size}rem`,
        transform: `rotate(${bunny.rotation}deg)`
      }}
      role="img"
      aria-label="conejito"
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
        fontSize: `${heart.size}rem`
      }}
      role="img"
      aria-label="corazón"
    >
      💕
    </div>
  ), [])

  const renderCloud = useCallback((cloud) => (
    <div
      key={cloud.id}
      className="floating-cloud"
      style={{
        top: `${cloud.y}%`,
        animationDelay: `${cloud.delay}s`,
        animationDuration: `${cloud.duration}s`,
        fontSize: `${cloud.size}rem`
      }}
      role="img"
      aria-label="nube"
    >
      ☁️
    </div>
  ), [])

  if (showIntro) {
    return <NostalgiaIntro onContinue={() => setShowIntro(false)} />
  }

  return (
    <div className="bunny-easter-egg-container" role="article" aria-label="Easter egg conejito">
      {showClouds && (
        <div className="clouds-background" aria-hidden="true">
          {clouds.map(renderCloud)}
        </div>
      )}

      {showBunnies && (
        <div className="bunnies-container" aria-hidden="true">
          {bunnies.map(renderBunny)}
        </div>
      )}

      {showHearts && (
        <div className="hearts-container" aria-hidden="true">
          {hearts.map(renderHeart)}
        </div>
      )}

      <div className="bunny-content">
        <header className="bunny-header">
          <div className="date-bunny-container">
            <span className="bunny-icon-large" role="img" aria-label="conejito">🐰</span>
            <h1 className="date-number">1101</h1>
            <span className="bunny-icon-large" role="img" aria-label="conejito">🐰</span>
          </div>
          <p className="date-subtitle">Suspiro</p>
        </header>

        <article className="bunny-message-box">
          <p className="bunny-line italic" aria-live="polite">{typedText.line1}</p>
          
          <div className="bunny-spacer"></div>
          
          <p className="bunny-line main" aria-live="polite">{typedText.line2}</p>
          
          <div className="bunny-spacer-small"></div>
          
          <p className="bunny-line emoji-large" aria-live="polite">{typedText.line3}</p>
        </article>

        <footer className="bunny-footer">
          <span className="footer-icon" role="img" aria-label="zanahoria">🥕</span>
          <span className="footer-text">Mi Suspiro</span>
          <span className="footer-icon" role="img" aria-label="zanahoria">🥕</span>
        </footer>
      </div>
    </div>
  )
}

export default BunnyEasterEgg
