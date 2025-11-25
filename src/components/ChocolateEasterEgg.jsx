import { useEffect, useState, useMemo, useCallback } from 'react'
import './ChocolateEasterEgg.css'

// Configuración
const CONFIG = {
  animation: {
    chocolatesDelay: 300,
    heartsDelay: 500,
    sparklesDelay: 200
  },
  chocolates: {
    count: 35,
    maxDelay: 8,
    baseDuration: 5,
    durationVariance: 4
  },
  hearts: {
    count: 20,
    maxDelay: 6,
    baseDuration: 4,
    durationVariance: 3
  },
  sparkles: {
    count: 25,
    maxDelay: 5,
    baseDuration: 2,
    durationVariance: 2
  }
}

const CHOCOLATE_EMOJIS = ['🍫', '🍬', '🍩', '🧁', '🎂', '🍪', '🍰']

// Generadores
const generateChocolates = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: CHOCOLATE_EMOJIS[Math.floor(Math.random() * CHOCOLATE_EMOJIS.length)],
    x: Math.random() * 95,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 1.2 + Math.random() * 1.2,
    rotation: -30 + Math.random() * 60,
    swayAmount: 20 + Math.random() * 40
  }))

const generateHearts = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.8 + Math.random() * 0.8
  }))

const generateSparkles = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.5 + Math.random() * 0.5
  }))

function ChocolateEasterEgg() {
  const [showChocolates, setShowChocolates] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  const chocolates = useMemo(() => generateChocolates(CONFIG.chocolates), [])
  const hearts = useMemo(() => generateHearts(CONFIG.hearts), [])
  const sparkles = useMemo(() => generateSparkles(CONFIG.sparkles), [])

  useEffect(() => {
    const sparklesTimer = setTimeout(() => setShowSparkles(true), CONFIG.animation.sparklesDelay)
    const chocolatesTimer = setTimeout(() => setShowChocolates(true), CONFIG.animation.chocolatesDelay)
    const heartsTimer = setTimeout(() => setShowHearts(true), CONFIG.animation.heartsDelay)

    return () => {
      clearTimeout(sparklesTimer)
      clearTimeout(chocolatesTimer)
      clearTimeout(heartsTimer)
    }
  }, [])

  const renderChocolate = useCallback((choco) => (
    <div
      key={choco.id}
      className="falling-chocolate"
      style={{
        left: `${choco.x}%`,
        animationDelay: `${choco.delay}s`,
        animationDuration: `${choco.duration}s`,
        fontSize: `${choco.size}rem`,
        '--sway': `${choco.swayAmount}px`,
        '--rotation': `${choco.rotation}deg`
      }}
      role="img"
      aria-label="chocolate"
    >
      {choco.emoji}
    </div>
  ), [])

  const renderHeart = useCallback((heart) => (
    <div
      key={heart.id}
      className="floating-choco-heart"
      style={{
        left: `${heart.x}%`,
        animationDelay: `${heart.delay}s`,
        animationDuration: `${heart.duration}s`,
        fontSize: `${heart.size}rem`
      }}
      role="img"
      aria-label="corazón"
    >
      💝
    </div>
  ), [])

  const renderSparkle = useCallback((sparkle) => (
    <div
      key={sparkle.id}
      className="sparkle"
      style={{
        left: `${sparkle.x}%`,
        top: `${sparkle.y}%`,
        animationDelay: `${sparkle.delay}s`,
        animationDuration: `${sparkle.duration}s`,
        fontSize: `${sparkle.size}rem`
      }}
      role="img"
      aria-label="brillo"
    >
      ✨
    </div>
  ), [])

  return (
    <div className="chocolate-easter-egg-container" role="article" aria-label="Easter egg de chocolates">
      {showSparkles && (
        <div className="sparkles-container" aria-hidden="true">
          {sparkles.map(renderSparkle)}
        </div>
      )}

      {showChocolates && (
        <div className="chocolates-container" aria-hidden="true">
          {chocolates.map(renderChocolate)}
        </div>
      )}

      {showHearts && (
        <div className="choco-hearts-container" aria-hidden="true">
          {hearts.map(renderHeart)}
        </div>
      )}

      <div className="chocolate-content">
        <header className="chocolate-header">
          <div className="choco-icon-row">
            <span className="choco-icon-large" role="img" aria-label="chocolate">🍫</span>
            <span className="choco-icon-large" role="img" aria-label="chocolate">🍬</span>
            <span className="choco-icon-large" role="img" aria-label="chocolate">🍫</span>
          </div>
          <h1 className="choco-title">1402</h1>
          <p className="choco-subtitle">Sweet moments</p>
        </header>

        <article className="chocolate-box">
          <div className="choco-wrapper">
            <span className="big-chocolate" role="img" aria-label="caja de chocolates">🎁</span>
          </div>
          <p className="choco-message">La vida es como una caja de chocolates...</p>
          <p className="choco-message secondary">dulce contigo 💕</p>
        </article>

        <footer className="chocolate-footer">
          <span className="footer-choco" role="img" aria-label="chocolate">🍫</span>
          <span className="footer-choco" role="img" aria-label="galleta">🍪</span>
          <span className="footer-choco" role="img" aria-label="pastel">🧁</span>
        </footer>
      </div>
    </div>
  )
}

export default ChocolateEasterEgg
