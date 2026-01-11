import { useEffect, useState, useMemo, useCallback } from 'react'
import './ChocolateEasterEgg.css'

const CONFIG = {
  animation: {
    chocolatesDelay: 200,
    heartsDelay: 400,
    sparklesDelay: 100,
    glowDelay: 300
  },
  chocolates: {
    count: 25,
    maxDelay: 8,
    baseDuration: 7,
    durationVariance: 5
  },
  hearts: {
    count: 12,
    maxDelay: 6,
    baseDuration: 6,
    durationVariance: 3
  },
  sparkles: {
    count: 28,
    maxDelay: 5,
    baseDuration: 3,
    durationVariance: 2
  }
}

const CHOCOLATE_EMOJIS = ['🍫', '🍬', '🍩', '🧁', '🎂', '🍪', '🍰', '🍭', '🥧']
const CHOCOLATE_BOX_ITEMS = [
  { emoji: '🍫', eaten: '😋' },
  { emoji: '🍬', eaten: '😊' },
  { emoji: '🍫', eaten: '🥰' },
  { emoji: '🍩', eaten: '😍' },
  { emoji: '🧁', eaten: '✨' },
  { emoji: '🍫', eaten: '💫' },
  { emoji: '🍪', eaten: '🌟' },
  { emoji: '🍬', eaten: '💕' },
  { emoji: '🍫', eaten: '❤️' }
]
const BURST_EMOJIS = ['💕', '✨', '💖', '🌟', '💝', '⭐']
const SWEET_MESSAGES = ['¡Dulce!', '¡Mmm!', '¡Rico!', '¡Yum!', '♡', '¡Delicia!']

const generateChocolates = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: CHOCOLATE_EMOJIS[Math.floor(Math.random() * CHOCOLATE_EMOJIS.length)],
    x: Math.random() * 95,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 1.0 + Math.random() * 1.2,
    rotation: -45 + Math.random() * 90,
    sway: 30 + Math.random() * 50
  }))

const generateHearts = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.5 + Math.random() * 0.5,
    drift: -30 + Math.random() * 60
  }))

const generateSparkles = ({ count, maxDelay, baseDuration, durationVariance }) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: 0.3 + Math.random() * 0.5
  }))

function ChocolateEasterEgg() {
  const [showChocolates, setShowChocolates] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [clickedItems, setClickedItems] = useState(new Set())
  const [bursts, setBursts] = useState([])
  const [floatingMessages, setFloatingMessages] = useState([])

  const chocolates = useMemo(() => generateChocolates(CONFIG.chocolates), [])
  const hearts = useMemo(() => generateHearts(CONFIG.hearts), [])
  const sparkles = useMemo(() => generateSparkles(CONFIG.sparkles), [])

  useEffect(() => {
    const sparklesTimer = setTimeout(() => setShowSparkles(true), CONFIG.animation.sparklesDelay)
    const chocolatesTimer = setTimeout(() => setShowChocolates(true), CONFIG.animation.chocolatesDelay)
    const heartsTimer = setTimeout(() => setShowHearts(true), CONFIG.animation.heartsDelay)
    const revealTimer = setTimeout(() => setIsRevealed(true), CONFIG.animation.glowDelay)

    return () => {
      clearTimeout(sparklesTimer)
      clearTimeout(chocolatesTimer)
      clearTimeout(heartsTimer)
      clearTimeout(revealTimer)
    }
  }, [])

  const handleBombonClick = useCallback((idx) => {
    if (clickedItems.has(idx)) return

    setClickedItems(prev => new Set([...prev, idx]))

    const newBursts = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      emoji: BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
      angle: (360 / 6) * i + Math.random() * 30,
      distance: 35 + Math.random() * 25
    }))

    setBursts(prev => [...prev, { idx, bursts: newBursts }])

    const message = SWEET_MESSAGES[Math.floor(Math.random() * SWEET_MESSAGES.length)]
    setFloatingMessages(prev => [...prev, { idx, text: message }])

    setTimeout(() => {
      setBursts(prev => prev.filter(b => b.idx !== idx))
      setFloatingMessages(prev => prev.filter(m => m.idx !== idx))
    }, 1500)
  }, [clickedItems])

  const renderChocolate = useCallback((choco) => (
    <div
      key={choco.id}
      className="falling-chocolate"
      style={{
        left: `${choco.x}%`,
        animationDelay: `${choco.delay}s`,
        animationDuration: `${choco.duration}s`,
        fontSize: `${choco.size}rem`,
        '--choco-sway': `${choco.sway}px`,
        '--choco-rotation': `${choco.rotation}deg`
      }}
      aria-hidden="true"
    >
      {choco.emoji}
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
      💝
    </div>
  ), [])

  const renderSparkle = useCallback((sparkle) => (
    <div
      key={sparkle.id}
      className="golden-sparkle"
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

  return (
    <div className="chocolate-easter-egg-container" role="article" aria-label="Easter egg de chocolates">
      {/* Background layers */}
      <div className="bg-layer bg-chocolate" />
      <div className="bg-layer bg-gold-shimmer" />

      {/* Particles */}
      {showSparkles && (
        <div className="sparkles-layer" aria-hidden="true">
          {sparkles.map(renderSparkle)}
        </div>
      )}

      {showChocolates && (
        <div className="chocolates-layer" aria-hidden="true">
          {chocolates.map(renderChocolate)}
        </div>
      )}

      {showHearts && (
        <div className="hearts-layer" aria-hidden="true">
          {hearts.map(renderHeart)}
        </div>
      )}

      {/* Main content */}
      <div className={`chocolate-content ${isRevealed ? 'revealed' : ''}`}>
        {/* Ribbon decoration */}
        <div className="ribbon-decoration" aria-hidden="true">
          <span className="ribbon-bow">🎀</span>
        </div>

        <header className="chocolate-header">
          <h1 className="chocolate-title">2741</h1>
          <div className="title-underline" />
          <p className="chocolate-subtitle">Caja de Dulces</p>
        </header>

        <article className="chocolate-box">
          <div className="box-glow" />
          <div className="box-inner">
            {/* Chocolate grid */}
            <div className="box-grid">
              {CHOCOLATE_BOX_ITEMS.map((item, idx) => (
                <button
                  key={idx}
                  className={`box-item ${clickedItems.has(idx) ? 'eaten' : ''}`}
                  style={{ animationDelay: `${0.6 + idx * 0.08}s` }}
                  onClick={() => handleBombonClick(idx)}
                  aria-label={clickedItems.has(idx) ? 'Chocolate comido' : `Chocolate ${idx + 1}`}
                >
                  <span className="box-item-emoji">
                    {clickedItems.has(idx) ? item.eaten : item.emoji}
                  </span>

                  {/* Burst effect */}
                  {bursts.find(b => b.idx === idx)?.bursts.map(burst => (
                    <span
                      key={burst.id}
                      className="burst-emoji"
                      style={{
                        '--burst-angle': `${burst.angle}deg`,
                        '--burst-distance': `${burst.distance}px`
                      }}
                    >
                      {burst.emoji}
                    </span>
                  ))}

                  {/* Floating message */}
                  {floatingMessages.find(m => m.idx === idx) && (
                    <span className="floating-message">
                      {floatingMessages.find(m => m.idx === idx).text}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="box-divider">
              <span className="divider-gem">💎</span>
            </div>

            <div className="message-section">
              <p className="choco-message">La vida es más dulce</p>
              <p className="choco-message highlight">cuando la comparto contigo</p>
              <p className="choco-message signature">💝</p>
            </div>
          </div>
        </article>

        <footer className="chocolate-footer">
          <div className="footer-trail">
            <span className="trail-item">🍫</span>
            <span className="trail-dot">•</span>
            <span className="trail-item">💕</span>
            <span className="trail-dot">•</span>
            <span className="trail-item">🍫</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ChocolateEasterEgg
