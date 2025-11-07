import { useEffect, useState } from 'react'
import './LetterEasterEgg.css'

function LetterEasterEgg() {
  const [showEnvelopes, setShowEnvelopes] = useState(false)
  const [showInk, setShowInk] = useState(false)
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

  const messages = {
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
  }

  useEffect(() => {
    const envelopesTimer = setTimeout(() => setShowEnvelopes(true), 500)
    const inkTimer = setTimeout(() => setShowInk(true), 300)

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
        }, 40)
      }, startDelay)
    }

    typeText(messages.greeting, 'greeting', 1000)
    typeText(messages.line1, 'line1', 2200)
    typeText(messages.line2, 'line2', 3200)
    typeText(messages.line3, 'line3', 4500)
    typeText(messages.line4, 'line4', 6200)
    typeText(messages.line5, 'line5', 7800)
    typeText(messages.line6, 'line6', 9000)
    typeText(messages.line7, 'line7', 10500)
    typeText(messages.line8, 'line8', 11800)
    typeText(messages.ps, 'ps', 13200)

    return () => {
      clearTimeout(envelopesTimer)
      clearTimeout(inkTimer)
    }
  }, [])

  const envelopes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 8 + Math.random() * 4,
    rotation: Math.random() * 360
  }))

  const inkDrops = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 6 + Math.random() * 4
  }))

  return (
    <div className="letter-easter-egg-container">
      {showEnvelopes && (
        <div className="envelopes-background">
          {envelopes.map(envelope => (
            <div
              key={`envelope-${envelope.id}`}
              className="floating-envelope"
              style={{
                left: `${envelope.left}%`,
                animationDelay: `${envelope.delay}s`,
                animationDuration: `${envelope.duration}s`,
                transform: `rotate(${envelope.rotation}deg)`
              }}
            >
              💌
            </div>
          ))}
        </div>
      )}

      {showInk && (
        <div className="ink-background">
          {inkDrops.map(drop => (
            <div
              key={`ink-${drop.id}`}
              className="ink-drop"
              style={{
                left: `${drop.left}%`,
                animationDelay: `${drop.delay}s`,
                animationDuration: `${drop.duration}s`
              }}
            >
              ✒️
            </div>
          ))}
        </div>
      )}

      <div className="letter-content">
        <div className="letter-header">
          <div className="date-stamp">0710</div>
        </div>

        <div className="letter-paper">
          <div className="paper-texture"></div>
          
          <p className="letter-greeting">{typedText.greeting}</p>
          
          <p className="letter-line">{typedText.line1}</p>
          <p className="letter-line emphasis">{typedText.line2}</p>
          
          <div className="letter-spacer"></div>
          
          <p className="letter-line">{typedText.line3}</p>
          <p className="letter-line">{typedText.line4}</p>
          <p className="letter-line">{typedText.line5}</p>
          
          <div className="letter-spacer"></div>
          
          <p className="letter-line main">{typedText.line6}</p>
          <p className="letter-line main">{typedText.line7}</p>
          <p className="letter-line main">{typedText.line8}</p>
          
          <div className="letter-spacer-large"></div>
          
          <p className="letter-ps">{typedText.ps}</p>
        </div>

        <div className="letter-footer">
          <span className="wax-seal">🖋️</span>
        </div>
      </div>
    </div>
  )
}

export default LetterEasterEgg
