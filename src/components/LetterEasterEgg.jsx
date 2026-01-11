import { useEffect, useState, useMemo } from 'react'
import './LetterEasterEgg.css'

function LetterEasterEgg() {
  const [showEnvelopes, setShowEnvelopes] = useState(false)
  const [showPetals, setShowPetals] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [typedText, setTypedText] = useState({
    greeting: '',
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    line5: '',
    line6: '',
    line7: '',
    line8: '',
    ps: ''
  })

  const messages = useMemo(() => ({
    greeting: 'Querida Pau,',
    line1: 'Hoy es 0710 otra vez.',
    line2: 'El día que una carta cambió todo.',
    line3: 'Desde entonces, he pensado en escribirte muchas más.',
    line4: 'Algunas han tomado vida, otras aún están en mi cabeza',
    line5: 'con ganas de salir.',
    line6: 'Me gusta cuando todas mis letras son para ti.',
    line7: 'Me encanta que cada palabra encuentre',
    line8: 'su propósito en tu nombre.',
    ps: 'P.D. Este teorema sigue vigente. Las verdades son difíciles de negar... y la tuya es imposible.'
  }), [])

  const envelopes = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 10 + Math.random() * 6,
    rotation: -30 + Math.random() * 60,
    scale: 0.8 + Math.random() * 0.5
  })), [])

  const petals = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 8 + Math.random() * 6,
    size: 0.6 + Math.random() * 0.6,
    drift: -40 + Math.random() * 80
  })), [])

  const dustParticles = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 4
  })), [])

  useEffect(() => {
    const timers = []
    const intervals = []

    timers.push(setTimeout(() => setShowPetals(true), 200))
    timers.push(setTimeout(() => setShowEnvelopes(true), 600))
    timers.push(setTimeout(() => setIsRevealed(true), 400))

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
        }, 42)
        intervals.push(interval)
      }, startDelay)
      timers.push(timer)
    }

    typeText(messages.greeting, 'greeting', 1000)
    typeText(messages.line1, 'line1', 2000)
    typeText(messages.line2, 'line2', 3000)
    typeText(messages.line3, 'line3', 4300)
    typeText(messages.line4, 'line4', 6000)
    typeText(messages.line5, 'line5', 7600)
    typeText(messages.line6, 'line6', 8800)
    typeText(messages.line7, 'line7', 10300)
    typeText(messages.line8, 'line8', 11600)
    typeText(messages.ps, 'ps', 13000)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [messages])

  return (
    <div className="letter-easter-egg-container">
      {/* Ambient dust particles */}
      <div className="dust-layer">
        {dustParticles.map(particle => (
          <div
            key={`dust-${particle.id}`}
            className="dust-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Floating petals */}
      {showPetals && (
        <div className="petals-layer">
          {petals.map(petal => (
            <div
              key={`petal-${petal.id}`}
              className="falling-petal"
              style={{
                left: `${petal.left}%`,
                animationDelay: `${petal.delay}s`,
                animationDuration: `${petal.duration}s`,
                '--petal-drift': `${petal.drift}px`,
                fontSize: `${petal.size}rem`
              }}
            >
              ❀
            </div>
          ))}
        </div>
      )}

      {/* Floating envelopes */}
      {showEnvelopes && (
        <div className="envelopes-layer">
          {envelopes.map(envelope => (
            <div
              key={`envelope-${envelope.id}`}
              className="floating-envelope"
              style={{
                left: `${envelope.left}%`,
                animationDelay: `${envelope.delay}s`,
                animationDuration: `${envelope.duration}s`,
                '--envelope-rotation': `${envelope.rotation}deg`,
                '--envelope-scale': envelope.scale
              }}
            >
              <span className="envelope-icon">✉</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Letter Content */}
      <div className={`letter-content ${isRevealed ? 'revealed' : ''}`}>
        {/* Date Seal */}
        <div className="letter-seal">
          <div className="seal-outer">
            <div className="seal-inner">
              <span className="seal-date">0710</span>
            </div>
          </div>
        </div>

        {/* Letter Paper */}
        <div className="letter-paper">
          <div className="paper-edge paper-edge-top" />
          <div className="paper-lines" />

          <div className="letter-body">
            <p className="letter-greeting">
              {typedText.greeting}
              {!typedText.line1 && <span className="cursor" />}
            </p>

            <div className="letter-section">
              <p className="letter-line">{typedText.line1}</p>
              <p className="letter-line letter-emphasis">{typedText.line2}</p>
            </div>

            <div className="letter-spacer" />

            <div className="letter-section">
              <p className="letter-line">{typedText.line3}</p>
              <p className="letter-line">{typedText.line4}</p>
              <p className="letter-line">{typedText.line5}</p>
            </div>

            <div className="letter-spacer" />

            <div className="letter-section letter-section-main">
              <p className="letter-line letter-main">{typedText.line6}</p>
              <p className="letter-line letter-main">{typedText.line7}</p>
              <p className="letter-line letter-main letter-final">{typedText.line8}</p>
            </div>

            <div className="letter-divider">
              <span className="divider-flourish">❧</span>
            </div>

            <p className="letter-ps">{typedText.ps}</p>
          </div>

          <div className="paper-edge paper-edge-bottom" />
        </div>

        {/* Decorative wax seal */}
        <div className="wax-seal-container">
          <div className="wax-seal">
            <span className="wax-symbol">♡</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LetterEasterEgg
