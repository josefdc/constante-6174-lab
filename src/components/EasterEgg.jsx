import { useEffect, useState } from 'react'
import './EasterEgg.css'

function EasterEgg() {
  const [showHearts, setShowHearts] = useState(false)

  useEffect(() => {
    // Trigger hearts animation after a short delay
    const timer = setTimeout(() => {
      setShowHearts(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2
  }))

  return (
    <div className="easter-egg-container">
      {showHearts && (
        <div className="hearts-background">
          {hearts.map(heart => (
            <div
              key={heart.id}
              className="floating-heart"
              style={{
                left: `${heart.left}%`,
                animationDelay: `${heart.delay}s`,
                animationDuration: `${heart.duration}s`
              }}
            >
              💕
            </div>
          ))}
        </div>
      )}

      <div className="easter-egg-content">
        <div className="number-display">0716</div>
        
        <div className="message-box">
          <p className="message-line">
            Al igual que todos los números eventualmente
          </p>
          <p className="message-line">
            convergen a <span className="highlight-number">6174</span>...
          </p>
          
          <div className="message-spacer"></div>
          
          <p className="message-main">
            No importa cuántos caminos tome,
          </p>
          <p className="message-main emphasis">
            siempre llegaré a ti, <span className="name">Pau</span> ✨
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
