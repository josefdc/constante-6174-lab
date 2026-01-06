import { useEffect, useState, useMemo, useRef } from 'react'
import './NostalgiaIntro.css'

const MESSAGES = [
  '3:25 de la mañana.',
  '',
  'La nostalgia llegó sin avisar, como siempre lo hace.',
  '',
  'Tengo unas ganas inmensas de escribirte y ver si contestas.',
  'Sé que no debo hacerlo.',
  'Sé que debería mostrarme orgulloso.',
  'Sé que debería respetar la decisión de quien me pidió que me alejara.',
  '',
  'Pero debato constantemente.',
  'En buscarte.',
  'En querer hablarte.',
  'En ver tu cumbamba de nuevo.',
  'En sentir tu olor.',
  'En pensar detalles contigo.',
  'En compartir tiempo contigo.',
  '',
  'El orgullo y el ego deberían dejarse de lado',
  'cuando alguien ya vio la parte más vulnerable de uno.',
  'Cuando le mostraste tu corazón.',
  '',
  'No sé si alguna vez mires esto.',
  'No sé si te entre la curiosidad de buscar algo en esta página.',
  '',
  'Pero si lo haces...',
  'quiero al menos que nos veamos y hablemos un rato.'
]

function NostalgiaIntro({ onContinue }) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [showButton, setShowButton] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const lineIndexRef = useRef(0)
  const isTypingRef = useRef(false)

  const stars = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 6 + Math.random() * 6,
    size: 0.4 + Math.random() * 0.8
  })), [])

  useEffect(() => {
    const timer = setTimeout(() => setShowStars(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isTypingRef.current) return

    const typeNextLine = () => {
      if (lineIndexRef.current >= MESSAGES.length) {
        setTimeout(() => setShowButton(true), 800)
        return
      }

      const currentMessage = MESSAGES[lineIndexRef.current]

      if (currentMessage === '') {
        setDisplayedLines(prev => [...prev, ''])
        lineIndexRef.current += 1
        setTimeout(typeNextLine, 400)
        return
      }

      isTypingRef.current = true
      let charIndex = 0

      const typeChar = () => {
        if (charIndex <= currentMessage.length) {
          setCurrentText(currentMessage.substring(0, charIndex))
          charIndex++
          setTimeout(typeChar, 35)
        } else {
          setDisplayedLines(prev => [...prev, currentMessage])
          setCurrentText('')
          lineIndexRef.current += 1
          isTypingRef.current = false
          setTimeout(typeNextLine, 300)
        }
      }

      typeChar()
    }

    typeNextLine()
  }, [])

  const currentLineIndex = lineIndexRef.current

  return (
    <div className="nostalgia-overlay">
      {showStars && (
        <div className="nostalgia-stars">
          {stars.map(star => (
            <div
              key={`star-${star.id}`}
              className="nostalgia-star"
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

      <div className="nostalgia-content">
        <div className="nostalgia-text-container">
          {displayedLines.map((line, index) => (
            <p
              key={index}
              className={`nostalgia-line ${line === '' ? 'nostalgia-spacer' : ''} ${
                index === 0 ? 'nostalgia-time' : ''
              } ${
                line.includes('Pero si lo haces') || line.includes('quiero al menos')
                  ? 'nostalgia-emphasis'
                  : ''
              }`}
            >
              {line}
            </p>
          ))}
          {currentText && (
            <p className={`nostalgia-line typing ${
              currentLineIndex === 0 ? 'nostalgia-time' : ''
            }`}>
              {currentText}
              <span className="cursor">|</span>
            </p>
          )}
        </div>

        {showButton && (
          <button
            className="nostalgia-continue-btn"
            onClick={onContinue}
          >
            Continuar →
          </button>
        )}
      </div>
    </div>
  )
}

export default NostalgiaIntro
