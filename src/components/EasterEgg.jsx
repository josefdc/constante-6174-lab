import { useEffect, useState } from 'react'
import './EasterEgg.css'

function EasterEgg() {
  const [showHearts, setShowHearts] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const [typedText, setTypedText] = useState({ line1: '', line2: '', line3: '', line4: '', line5: '' })
  
  const messages = {
    line1: 'Al igual que todos los números',
    line2: 'convergen a 6174...',
    line3: 'Todos mis caminos,',
    line4: 'todas mis pensamientos, todos mis detalles',
    line5: 'siempre me llevan a ti, Pau ✨'
  }

  useEffect(() => {
    // Trigger hearts animation
    const heartsTimer = setTimeout(() => setShowHearts(true), 500)
    
    // Trigger stars animation
    const starsTimer = setTimeout(() => setShowStars(true), 300)

    // Typing effect for each line
    const typeText = (text, lineKey, startDelay) => {
      setTimeout(() => {
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
        }, 50)
      }, startDelay)
    }

    // Stagger the typing animations
    typeText(messages.line1, 'line1', 1000)
    typeText(messages.line2, 'line2', 2500)
    typeText(messages.line3, 'line3', 4000)
    typeText(messages.line4, 'line4', 5000)
    typeText(messages.line5, 'line5', 7000)

    return () => {
      clearTimeout(heartsTimer)
      clearTimeout(starsTimer)
    }
  }, [])

  const hearts = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 3,
    size: 1 + Math.random() * 1.5
  }))

  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 5 + Math.random() * 5,
    size: 0.5 + Math.random()
  }))

  return (
    <div className="easter-egg-container">
      {showStars && (
        <div className="stars-background">
          {stars.map(star => (
            <div
              key={`star-${star.id}`}
              className="falling-star"
              style={{
                left: `${star.left}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
                fontSize: `${star.size}rem`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}
      
      {showHearts && (
        <div className="hearts-background">
          {hearts.map(heart => (
            <div
              key={`heart-${heart.id}`}
              className="floating-heart"
              style={{
                left: `${heart.left}%`,
                animationDelay: `${heart.delay}s`,
                animationDuration: `${heart.duration}s`,
                fontSize: `${heart.size}rem`
              }}
            >
              💕
            </div>
          ))}
        </div>
      )}

      <div className="easter-egg-content">
        <div className="number-display magic-glow">0826</div>
        
        <div className="message-box">
          <p className="message-line typing-text">
            {typedText.line1}
          </p>
          <p className="message-line typing-text">
            {typedText.line2.includes('6174') ? (
              <>
                convergen a <span className="highlight-number">6174</span>...
              </>
            ) : (
              typedText.line2
            )}
          </p>
          
          <div className="message-spacer"></div>
          
          <p className="message-main typing-text">
            {typedText.line3}
          </p>
          <p className="message-main typing-text">
            {typedText.line4}
          </p>
          <p className="message-main emphasis typing-text">
            {typedText.line5.includes('Pau') ? (
              <>
                siempre me llevan a ti, <span className="name">Pau</span> ✨
              </>
            ) : (
              typedText.line5
            )}
          </p>
        </div>

        <div className="sparkle-container">
          <span className="sparkle">✨</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">✨</span>
        </div>
      </div>
    </div>
  )
}

export default EasterEgg
