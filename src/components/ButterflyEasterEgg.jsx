import { useEffect, useState, useMemo, useCallback } from 'react'
import './ButterflyEasterEgg.css'

// Configuración
const CONFIG = {
  animation: {
    butterfliesDelay: 500,
    sparklesDelay: 800,
    typingSpeed: 45
  },
  tornado: {
    layers: 5,
    butterfliesPerLayer: 12,
    baseRadius: 30,
    radiusIncrement: 15,
    baseDuration: 8,
    durationVariance: 4,
    baseSize: 2,
    sizeVariance: 1.5,
    baseRotationSpeed: 3,
    rotationVariance: 2
  },
  sparkles: {
    count: 50,
    maxDelay: 5,
    baseDuration: 2,
    durationVariance: 3,
    baseSize: 0.5,
    sizeVariance: 0.8
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
  { lineKey: 'line2', delay: 4000 },
  { lineKey: 'line3', delay: 6800 },
  { lineKey: 'line4', delay: 9500 },
  { lineKey: 'line6', delay: 11500 }
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

// Generador de mariposas optimizado
const generateButterflies = (config) => {
  const butterflies = []
  const { layers, butterfliesPerLayer, baseRadius, radiusIncrement, baseDuration, durationVariance, baseSize, sizeVariance, baseRotationSpeed, rotationVariance } = config
  
  for (let layer = 0; layer < layers; layer++) {
    for (let i = 0; i < butterfliesPerLayer; i++) {
      butterflies.push({
        id: `${layer}-${i}`,
        angle: (i / butterfliesPerLayer) * 360,
        radius: baseRadius + (layer * radiusIncrement),
        delay: (layer * 0.3) + (i * 0.1),
        duration: baseDuration + Math.random() * durationVariance,
        size: baseSize + Math.random() * sizeVariance,
        rotationSpeed: baseRotationSpeed + Math.random() * rotationVariance
      })
    }
  }
  return butterflies
}

// Generador de partículas optimizado
const generateSparkles = ({ count, maxDelay, baseDuration, durationVariance, baseSize, sizeVariance }) => 
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * maxDelay,
    duration: baseDuration + Math.random() * durationVariance,
    size: baseSize + Math.random() * sizeVariance
  }))

function ButterflyEasterEgg() {
  const [showButterflies, setShowButterflies] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  const typedText = useTypingEffect(MESSAGES, TYPING_SCHEDULE, CONFIG.animation.typingSpeed)
  
  const butterflies = useMemo(() => generateButterflies(CONFIG.tornado), [])
  const sparkles = useMemo(() => generateSparkles(CONFIG.sparkles), [])

  useEffect(() => {
    const butterfliesTimer = setTimeout(() => setShowButterflies(true), CONFIG.animation.butterfliesDelay)
    const sparklesTimer = setTimeout(() => setShowSparkles(true), CONFIG.animation.sparklesDelay)

    return () => {
      clearTimeout(butterfliesTimer)
      clearTimeout(sparklesTimer)
    }
  }, [])

  const renderButterfly = useCallback((butterfly) => (
    <div
      key={butterfly.id}
      className="butterfly-orbit"
      style={{
        '--angle': `${butterfly.angle}deg`,
        '--radius': `${butterfly.radius}%`,
        '--delay': `${butterfly.delay}s`,
        '--duration': `${butterfly.duration}s`,
        '--rotation-speed': `${butterfly.rotationSpeed}s`
      }}
    >
      <span 
        className="butterfly"
        style={{
          fontSize: `${butterfly.size}rem`,
          animationDelay: `${butterfly.delay}s`
        }}
        role="img" 
        aria-label="mariposa"
      >
        🦋
      </span>
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
      role="img" 
      aria-label="destello"
    >
      ✨
    </div>
  ), [])

  return (
    <div className="butterfly-easter-egg-container" role="article" aria-label="Easter egg mariposas">
      {showButterflies && (
        <div className="tornado-container" aria-hidden="true">
          {butterflies.map(renderButterfly)}
        </div>
      )}

      {showSparkles && (
        <div className="sparkles-background" aria-hidden="true">
          {sparkles.map(renderSparkle)}
        </div>
      )}

      <div className="butterfly-content">
        <header className="monarch-header">
          <h1 className="date-number">1110</h1>
          <p className="date-subtitle">Día de la Mariposa Monarca</p>
        </header>

        <article className="butterfly-message-box">
          <p className="butterfly-line italic" aria-live="polite">{typedText.line1}</p>
          <p className="butterfly-line italic" aria-live="polite">{typedText.line2}</p>
          <p className="butterfly-line italic" aria-live="polite">{typedText.line3}</p>
          
          <div className="butterfly-spacer" aria-hidden="true"></div>
          
          <p className="butterfly-line main" aria-live="polite">{typedText.line4}</p>
          
          <div className="butterfly-spacer-small" aria-hidden="true"></div>
          
          <p className="butterfly-line emphasis" aria-live="polite">{typedText.line6}</p>
        </article>

        <footer className="chaos-footer">
          <span className="chaos-symbol" role="img" aria-label="tornado">🌪️</span>
          <span className="chaos-text">Efecto Mariposa</span>
          <span className="chaos-symbol" role="img" aria-label="tornado">🌪️</span>
        </footer>
      </div>
    </div>
  )
}

export default ButterflyEasterEgg
