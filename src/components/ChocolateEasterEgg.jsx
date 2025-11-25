import { useEffect, useState, useMemo, useCallback } from 'react'
import './ChocolateEasterEgg.css'

// Configuración
const CONFIG = {
  animation: {
    chocolatesDelay: 200,
    heartsDelay: 400,
    sparklesDelay: 100,
    goldenDelay: 600
  },
  chocolates: {
    count: 40,
    maxDelay: 10,
    baseDuration: 6,
    durationVariance: 5
  },
  hearts: {
    count: 15,
    maxDelay: 8,
    baseDuration: 5,
    durationVariance: 3
  },
  sparkles: {
    count: 30,
    maxDelay: 6,
    baseDuration: 2.5,
    durationVariance: 2
  },
  goldenSwirls: {
    count: 12,
    baseDuration: 15,
    durationVariance: 10
  }
}

const CHOCOLATE_EMOJIS = ['🍫', '🍬', '🍩', '🧁', '🎂', '🍪', '🍰', '🍭', '🥧']
const CHOCOLATE_BOX_ITEMS = ['🍫', '🍬', '🍫', '🍩', '🧁', '🍫', '🍪', '🍬', '🍫']

// Generadores
const generateChocolates = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: CHOCOLATE_EMOJIS[Math.floor(Math.random() * CHOCOLATE_EMOJIS.length)],
    x: Math.random() * 95,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 1.0 + Math.random() * 1.5,
    rotation: -45 + Math.random() * 90,
    swayAmount: 30 + Math.random() * 60
  }))

const generateHearts = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.6 + Math.random() * 0.6
  }))

const generateSparkles = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.4 + Math.random() * 0.6
  }))

const generateGoldenSwirls = ({ count, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    duration: baseDuration + Math.random() * durationVariance,
    delay: i * 0.8,
    size: 0.3 + Math.random() * 0.4
  }))

function ChocolateEasterEgg() {
  const [showChocolates, setShowChocolates] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [showGolden, setShowGolden] = useState(false)

  const chocolates = useMemo(() => generateChocolates(CONFIG.chocolates), [])
  const hearts = useMemo(() => generateHearts(CONFIG.hearts), [])
  const sparkles = useMemo(() => generateSparkles(CONFIG.sparkles), [])
  const goldenSwirls = useMemo(() => generateGoldenSwirls(CONFIG.goldenSwirls), [])

  useEffect(() => {
    const sparklesTimer = setTimeout(() => setShowSparkles(true), CONFIG.animation.sparklesDelay)
    const chocolatesTimer = setTimeout(() => setShowChocolates(true), CONFIG.animation.chocolatesDelay)
    const heartsTimer = setTimeout(() => setShowHearts(true), CONFIG.animation.heartsDelay)
    const goldenTimer = setTimeout(() => setShowGolden(true), CONFIG.animation.goldenDelay)

    return () => {
      clearTimeout(sparklesTimer)
      clearTimeout(chocolatesTimer)
      clearTimeout(heartsTimer)
      clearTimeout(goldenTimer)
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

  const renderGoldenSwirl = useCallback((swirl) => (
    <div
      key={swirl.id}
      className="golden-swirl"
      style={{
        left: `${swirl.startX}%`,
        top: `${swirl.startY}%`,
        animationDelay: `${swirl.delay}s`,
        animationDuration: `${swirl.duration}s`,
        fontSize: `${swirl.size}rem`
      }}
      aria-hidden="true"
    />
  ), [])

  return (
    <div className="chocolate-easter-egg-container" role="article" aria-label="Easter egg de chocolates">
      {/* Fondo dorado animado */}
      {showGolden && (
        <div className="golden-swirls-container" aria-hidden="true">
          {goldenSwirls.map(renderGoldenSwirl)}
        </div>
      )}

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
        {/* Ribbon decoration */}
        <div className="ribbon-decoration" aria-hidden="true">
          <span className="ribbon-bow">🎀</span>
        </div>

        <header className="chocolate-header">
          <h1 className="choco-title">2741</h1>
          <div className="title-underline"></div>
          <p className="choco-subtitle">Dulces Momentos</p>
        </header>

        <article className="chocolate-box">
          {/* Caja de chocolates visual */}
          <div className="box-grid">
            {CHOCOLATE_BOX_ITEMS.map((emoji, idx) => (
              <div 
                key={idx} 
                className="box-item"
                style={{ animationDelay: `${0.8 + idx * 0.1}s` }}
              >
                {emoji}
              </div>
            ))}
          </div>
          
          <div className="box-divider"></div>
          
          <p className="choco-message">La vida es más dulce</p>
          <p className="choco-message highlight">cuando la comparto contigo</p>
          <p className="choco-message signature">💕</p>
        </article>

        <footer className="chocolate-footer">
          <div className="footer-trail">
            <span className="trail-item">🍫</span>
            <span className="trail-dot">•</span>
            <span className="trail-item">🍬</span>
            <span className="trail-dot">•</span>
            <span className="trail-item">🧁</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ChocolateEasterEgg
