import { useEffect, useState, useMemo } from 'react'
import './ButterflyEasterEgg.css'

function ButterflyEasterEgg() {
  const [showButterflies, setShowButterflies] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [typedText, setTypedText] = useState({
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    line5: '',
    line6: ''
  })

  const messages = useMemo(() => ({
    line1: 'No sé si sean las mariposas amarillas del realismo mágico,',
    line2: 'o las mariposas que me dan en el estómago mientras escribo esto,',
    line3: 'o las mariposas que aletean a nuestro favor...',
    line4: 'Pero cada una de ellas vuela hacia ti, Pau.',
    line5: '',
    line6: 'Y yo las sigo.'
  }), [])

  // Mariposas en espiral de tornado
  const butterflies = useMemo(() => {
    const butterfliesArray = []
    const layers = 5
    const perLayer = 12
    
    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < perLayer; i++) {
        const angle = (i / perLayer) * 360
        const radius = 30 + (layer * 15)
        butterfliesArray.push({
          id: `${layer}-${i}`,
          angle,
          radius,
          delay: (layer * 0.3) + (i * 0.1),
          duration: 8 + Math.random() * 4,
          size: 2 + Math.random() * 1.5,
          rotationSpeed: 3 + Math.random() * 2
        })
      }
    }
    return butterfliesArray
  }, [])

  const sparkles = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 3,
    size: 0.5 + Math.random() * 0.8
  })), [])

  useEffect(() => {
    const timers = []
    const intervals = []

    timers.push(setTimeout(() => setShowButterflies(true), 500))
    timers.push(setTimeout(() => setShowSparkles(true), 800))

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
        }, 45)
        intervals.push(interval)
      }, startDelay)
      timers.push(timer)
    }

    typeText(messages.line1, 'line1', 1500)
    typeText(messages.line2, 'line2', 4000)
    typeText(messages.line3, 'line3', 6800)
    typeText(messages.line4, 'line4', 9500)
    typeText(messages.line6, 'line6', 11500)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [messages])

  return (
    <div className="butterfly-easter-egg-container">
      {/* Tornado de mariposas */}
      {showButterflies && (
        <div className="tornado-container">
          {butterflies.map(butterfly => (
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
              >
                🦋
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Partículas doradas */}
      {showSparkles && (
        <div className="sparkles-background">
          {sparkles.map(sparkle => (
            <div
              key={`sparkle-${sparkle.id}`}
              className="golden-sparkle"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: `${sparkle.duration}s`,
                fontSize: `${sparkle.size}rem`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Contenido central */}
      <div className="butterfly-content">
        <div className="monarch-header">
          <div className="date-number">1110</div>
          <div className="date-subtitle">Día de la Mariposa Monarca</div>
        </div>

        <div className="butterfly-message-box">
          <p className="butterfly-line italic">{typedText.line1}</p>
          <p className="butterfly-line italic">{typedText.line2}</p>
          <p className="butterfly-line italic">{typedText.line3}</p>
          
          <div className="butterfly-spacer"></div>
          
          <p className="butterfly-line main">{typedText.line4}</p>
          
          <div className="butterfly-spacer-small"></div>
          
          <p className="butterfly-line emphasis">{typedText.line6}</p>
        </div>

        <div className="chaos-footer">
          <span className="chaos-symbol">🌪️</span>
          <span className="chaos-text">Efecto Mariposa</span>
          <span className="chaos-symbol">🌪️</span>
        </div>
      </div>
    </div>
  )
}

export default ButterflyEasterEgg
