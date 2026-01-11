import { useEffect, useState, useMemo, useCallback } from 'react'
import './EasterEgg.css'

function EasterEgg() {
  const [showHearts, setShowHearts] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const [showAurora, setShowAurora] = useState(false)
  const [typedText, setTypedText] = useState({ line1: '', line2: '', line3: '', line4: '', line5: '' })

  const messages = useMemo(() => ({
    line1: 'Al igual que todos los números',
    line2: 'convergen a 6174...',
    line3: 'Todos mis caminos,',
    line4: 'todas mis pensamientos, todos mis detalles',
    line5: 'siempre me llevan a ti, Pau ✨'
  }), [])

  const hearts = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 6 + Math.random() * 4,
    size: 0.8 + Math.random() * 1.2,
    drift: -20 + Math.random() * 40,
    opacity: 0.4 + Math.random() * 0.4
  })), [])

  const stars = useMemo(() => Array.from({ length: 35 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 6,
    size: 0.4 + Math.random() * 0.8,
    twinkleDelay: Math.random() * 2
  })), [])

  const constellationDots = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 3
  })), [])

  useEffect(() => {
    const timers = []
    const intervals = []

    timers.push(setTimeout(() => setShowAurora(true), 100))
    timers.push(setTimeout(() => setShowStars(true), 400))
    timers.push(setTimeout(() => setShowHearts(true), 800))

    const typeText = (text, lineKey, startDelay) => {
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
        }, 55)
        intervals.push(interval)
      }, startDelay)
      timers.push(timer)
    }

    typeText(messages.line1, 'line1', 1200)
    typeText(messages.line2, 'line2', 2800)
    typeText(messages.line3, 'line3', 4500)
    typeText(messages.line4, 'line4', 5800)
    typeText(messages.line5, 'line5', 8000)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [messages])

  const renderTypedLine = useCallback((text, highlightWord, highlightClass) => {
    if (!highlightWord || !text.includes(highlightWord)) return text
    const parts = text.split(highlightWord)
    return (
      <>
        {parts[0]}
        <span className={highlightClass}>{highlightWord}</span>
        {parts[1]}
      </>
    )
  }, [])

  return (
    <div className="easter-egg-container">
      {/* Aurora Background Layers */}
      <div className={`aurora-layer aurora-1 ${showAurora ? 'visible' : ''}`} />
      <div className={`aurora-layer aurora-2 ${showAurora ? 'visible' : ''}`} />
      <div className={`aurora-layer aurora-3 ${showAurora ? 'visible' : ''}`} />

      {/* Constellation dots */}
      <div className="constellation-layer">
        {constellationDots.map(dot => (
          <div
            key={`constellation-${dot.id}`}
            className="constellation-dot"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              animationDelay: `${dot.delay}s`
            }}
          />
        ))}
      </div>

      {/* Falling Stars */}
      {showStars && (
        <div className="stars-layer">
          {stars.map(star => (
            <div
              key={`star-${star.id}`}
              className="falling-star"
              style={{
                left: `${star.left}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
                '--twinkle-delay': `${star.twinkleDelay}s`,
                '--star-size': `${star.size}rem`
              }}
            >
              <span className="star-icon">✦</span>
            </div>
          ))}
        </div>
      )}

      {/* Floating Hearts */}
      {showHearts && (
        <div className="hearts-layer">
          {hearts.map(heart => (
            <div
              key={`heart-${heart.id}`}
              className="floating-heart"
              style={{
                left: `${heart.left}%`,
                animationDelay: `${heart.delay}s`,
                animationDuration: `${heart.duration}s`,
                '--drift': `${heart.drift}px`,
                '--heart-opacity': heart.opacity,
                fontSize: `${heart.size}rem`
              }}
            >
              ♥
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="easter-egg-content">
        {/* Number Display */}
        <div className="number-wrapper">
          <span className="number-prefix">∞</span>
          <div className="number-display">0826</div>
          <span className="number-suffix">∞</span>
        </div>

        {/* Message Card */}
        <div className="message-card">
          <div className="card-glow" />
          <div className="card-content">
            <div className="message-section message-intro">
              <p className="message-line">
                {typedText.line1}
                <span className="cursor" />
              </p>
              <p className="message-line highlight-line">
                {typedText.line2.includes('6174')
                  ? renderTypedLine(typedText.line2, '6174', 'number-highlight')
                  : typedText.line2
                }
              </p>
            </div>

            <div className="message-divider">
              <span className="divider-star">✧</span>
            </div>

            <div className="message-section message-main">
              <p className="message-line">{typedText.line3}</p>
              <p className="message-line">{typedText.line4}</p>
              <p className="message-line message-emphasis">
                {typedText.line5.includes('Pau')
                  ? renderTypedLine(typedText.line5, 'Pau', 'name-highlight')
                  : typedText.line5
                }
              </p>
            </div>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="footer-sparkles">
          <span className="sparkle sparkle-1">✧</span>
          <span className="sparkle sparkle-2">✦</span>
          <span className="sparkle sparkle-3">✧</span>
        </div>
      </div>
    </div>
  )
}

export default EasterEgg
