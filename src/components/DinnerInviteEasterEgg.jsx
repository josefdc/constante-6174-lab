import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import emailjs from '@emailjs/browser'
import './DinnerInviteEasterEgg.css'

// ============================================
// CONFIGURACIÓN EMAILJS - REEMPLAZAR CON TUS VALORES
// ============================================
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'
// ============================================

const CONFETTI_COLORS = ['#ffd700', '#ffb6c1', '#ffa07a', '#f8a488', '#dda0dd']

const COMFORT_FOOD_OPTIONS = [
  { id: 'ramen', label: 'Sopita Ramen', emoji: '🍜' },
  { id: 'pasta', label: 'Cremas/Pasta suave', emoji: '🍝' },
  { id: 'tu-eliges', label: 'Lo que tú elijas', emoji: '🫵' }
]

const OPEN_FOOD_OPTIONS = [
  { id: 'asiatico', label: 'Asiático', emoji: '🍣' },
  { id: 'variado', label: 'Variado/Fusión', emoji: '🥘' },
  { id: 'sorpresa', label: 'Sorpréndeme', emoji: '✨' }
]

const EXCITEMENT_OPTIONS = [
  { id: 'low', label: 'Pocas', emoji: '😐' },
  { id: 'medium', label: 'Maso', emoji: '🙂' },
  { id: 'high', label: 'Muchísimas', emoji: '😋' }
]

// Opciones de la ruleta (la última siempre gana)
const WHEEL_OPTIONS = [
  { label: 'Netflix en casa', emoji: '📺', color: '#a8d5ba' },
  { label: 'Pedimos algo', emoji: '🛵', color: '#f9c74f' },
  { label: 'Mañana mejor', emoji: '📅', color: '#90be6d' },
  { label: 'Cena romántica', emoji: '🍷', color: '#ff6b6b' },
  { label: 'Solo snacks', emoji: '🍿', color: '#4ecdc4' },
  { label: '¡CENA CONTIGO!', emoji: '💝', color: '#ff9a9e' }
]

// Argumentos graciosos para convencer
const CONVINCE_ARGUMENTS = [
  { emoji: '🥺', text: '¿Ni siquiera por mí?' },
  { emoji: '🍕', text: 'Hay comida rica esperándote...' },
  { emoji: '😢', text: 'Pero ya me bañé y todo...' }
]

function DinnerInviteEasterEgg({ onClose }) {
  // Estados del wizard - ahora con strings para más flexibilidad
  const [currentView, setCurrentView] = useState('health') // health, excitement, convince, wheel, food, final
  const [answers, setAnswers] = useState({
    hasThroatPain: null,
    excitement: null,
    foodPreference: null,
    wasConvinced: false
  })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Estados para el mini-juego
  const [convinceIndex, setConvinceIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [wheelResult, setWheelResult] = useState(null)

  const wheelRef = useRef(null)

  // Generar confeti
  const confetti = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      rotation: Math.random() * 720 - 360,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
    })), []
  )

  // Confeti en paso final
  useEffect(() => {
    if (currentView === 'final') {
      const timer = setTimeout(() => setShowConfetti(true), 200)
      return () => clearTimeout(timer)
    }
  }, [currentView])

  // Calcular progreso para los dots
  const getProgress = () => {
    const order = ['health', 'excitement', 'convince', 'wheel', 'food', 'final']
    const currentIndex = order.indexOf(currentView)
    // Mapear a 4 pasos visuales
    if (currentView === 'health') return 1
    if (currentView === 'excitement') return 2
    if (currentView === 'convince' || currentView === 'wheel') return 2 // Se mantiene en 2 durante el mini-juego
    if (currentView === 'food') return 3
    if (currentView === 'final') return 4
    return 1
  }

  // Enviar respuestas por email
  const sendResponse = useCallback(async (finalAnswers) => {
    if (emailSent) return
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          throat_pain: finalAnswers.hasThroatPain ? 'Sí, le dolía' : 'No, estaba bien',
          excitement: finalAnswers.excitement === 'high' ? 'Muchísimas ganas' :
                      finalAnswers.excitement === 'medium' ? 'Maso' : 'Pocas ganas (pero la convencí 😏)',
          food_preference: finalAnswers.foodPreference,
          was_convinced: finalAnswers.wasConvinced ? 'Sí, tuve que usar la ruleta' : 'No',
          timestamp: new Date().toLocaleString('es-CO', {
            dateStyle: 'full',
            timeStyle: 'short'
          })
        },
        EMAILJS_PUBLIC_KEY
      )
      setEmailSent(true)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }, [emailSent])

  const goToView = useCallback((view, newAnswers = answers) => {
    setIsTransitioning(true)
    setAnswers(newAnswers)
    setTimeout(() => {
      setCurrentView(view)
      setIsTransitioning(false)
      if (view === 'final') {
        sendResponse(newAnswers)
      }
    }, 400)
  }, [answers, sendResponse])

  const handleThroatPainAnswer = useCallback((hasPain) => {
    goToView('excitement', { ...answers, hasThroatPain: hasPain })
  }, [answers, goToView])

  const handleExcitementAnswer = useCallback((level) => {
    const newAnswers = { ...answers, excitement: level }
    if (level === 'low') {
      // Pocas ganas → Modo convencer
      goToView('convince', newAnswers)
    } else {
      // Maso o Muchísimas → Directo a comida
      goToView('food', newAnswers)
    }
  }, [answers, goToView])

  const handleConvinceResponse = useCallback((convinced) => {
    if (convinced) {
      goToView('food', { ...answers, wasConvinced: true })
    } else {
      // Siguiente argumento o ir a la ruleta
      if (convinceIndex < CONVINCE_ARGUMENTS.length - 1) {
        setConvinceIndex(prev => prev + 1)
      } else {
        // Ya usamos todos los argumentos → Ruleta
        goToView('wheel', { ...answers, wasConvinced: true })
      }
    }
  }, [answers, convinceIndex, goToView])

  const spinWheel = useCallback(() => {
    if (isSpinning) return

    setIsSpinning(true)
    setWheelResult(null)

    // Siempre cae en el último segmento (¡CENA CONTIGO!)
    const segments = WHEEL_OPTIONS.length
    const targetIndex = segments - 1 // Último segmento
    const degreesPerSegment = 360 / segments

    // Calcular rotación: varias vueltas + posición del segmento ganador
    const extraSpins = 5 // Vueltas completas
    const targetDegree = 360 - (targetIndex * degreesPerSegment) - (degreesPerSegment / 2)
    const totalRotation = (extraSpins * 360) + targetDegree + Math.random() * 10 - 5

    setWheelRotation(prev => prev + totalRotation)

    // Después de la animación, mostrar resultado
    setTimeout(() => {
      setIsSpinning(false)
      setWheelResult(WHEEL_OPTIONS[targetIndex])
    }, 4000)
  }, [isSpinning])

  const handleWheelComplete = useCallback(() => {
    goToView('food', { ...answers, wasConvinced: true })
  }, [answers, goToView])

  const handleFoodAnswer = useCallback((food) => {
    goToView('final', { ...answers, foodPreference: food })
  }, [answers, goToView])

  const handleClose = useCallback(() => {
    if (onClose) onClose()
  }, [onClose])

  // Render functions
  const renderConfetti = () => (
    <div className="dinner-confetti-container" aria-hidden="true">
      {confetti.map(piece => (
        <span
          key={piece.id}
          className="dinner-confetti"
          style={{
            left: `${piece.x}%`,
            animationDelay: `${piece.delay}s`,
            backgroundColor: piece.color,
            '--rotation': `${piece.rotation}deg`
          }}
        />
      ))}
    </div>
  )

  const renderHealth = () => (
    <div className={`dinner-step ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <div className="dinner-emoji-header">🥺</div>
      <h2 className="dinner-question">
        ¿Aún tienes dolor de amígdalas, Pau?
      </h2>
      <div className="dinner-options">
        <button className="dinner-btn dinner-btn-soft" onClick={() => handleThroatPainAnswer(true)}>
          <span className="btn-emoji">😿</span>
          <span className="btn-text">Sí, un poquito</span>
        </button>
        <button className="dinner-btn dinner-btn-happy" onClick={() => handleThroatPainAnswer(false)}>
          <span className="btn-emoji">🎉</span>
          <span className="btn-text">Ya no, estoy súper!</span>
        </button>
      </div>
    </div>
  )

  const renderExcitement = () => (
    <div className={`dinner-step ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <div className="dinner-emoji-header">🍽️</div>
      <h2 className="dinner-question">
        ¿Qué tantas ganas tienes de salir a comer rico hoy?
      </h2>
      <div className="dinner-options dinner-options-excitement">
        {EXCITEMENT_OPTIONS.map(option => (
          <button
            key={option.id}
            className="dinner-btn dinner-btn-excitement"
            onClick={() => handleExcitementAnswer(option.id)}
          >
            <span className="btn-emoji-large">{option.emoji}</span>
            <span className="btn-text">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderConvince = () => {
    const currentArg = CONVINCE_ARGUMENTS[convinceIndex]
    return (
      <div className={`dinner-step dinner-step-convince ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <div className="dinner-emoji-header dinner-emoji-bounce">{currentArg.emoji}</div>
        <h2 className="dinner-question">{currentArg.text}</h2>
        <div className="dinner-options">
          <button className="dinner-btn dinner-btn-happy" onClick={() => handleConvinceResponse(true)}>
            <span className="btn-emoji">😊</span>
            <span className="btn-text">Bueno, ya me convenciste</span>
          </button>
          <button className="dinner-btn dinner-btn-soft" onClick={() => handleConvinceResponse(false)}>
            <span className="btn-emoji">😅</span>
            <span className="btn-text">Sigo sin ganas...</span>
          </button>
        </div>
        <div className="convince-counter">
          {CONVINCE_ARGUMENTS.map((_, i) => (
            <span key={i} className={`convince-dot ${i <= convinceIndex ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    )
  }

  const renderWheel = () => (
    <div className={`dinner-step dinner-step-wheel ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <div className="dinner-emoji-header">🎰</div>
      <h2 className="dinner-question">
        {wheelResult ? '¡Y el destino ha hablado!' : 'Ok, dejemos que el destino decida...'}
      </h2>

      <div className="wheel-container">
        <div className="wheel-pointer">▼</div>
        <div
          ref={wheelRef}
          className={`wheel ${isSpinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${wheelRotation}deg)` }}
        >
          {WHEEL_OPTIONS.map((option, i) => {
            const rotation = (360 / WHEEL_OPTIONS.length) * i
            return (
              <div
                key={i}
                className="wheel-segment"
                style={{
                  '--rotation': `${rotation}deg`,
                  '--color': option.color
                }}
              >
                <span className="wheel-segment-content">
                  <span className="wheel-emoji">{option.emoji}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {!wheelResult ? (
        <button
          className="dinner-btn dinner-btn-spin"
          onClick={spinWheel}
          disabled={isSpinning}
        >
          <span className="btn-emoji">{isSpinning ? '🎲' : '🎯'}</span>
          <span className="btn-text">{isSpinning ? 'Girando...' : '¡Girar la ruleta!'}</span>
        </button>
      ) : (
        <div className="wheel-result">
          <div className="wheel-result-content">
            <span className="wheel-result-emoji">{wheelResult.emoji}</span>
            <span className="wheel-result-text">{wheelResult.label}</span>
          </div>
          <button className="dinner-btn dinner-btn-happy" onClick={handleWheelComplete}>
            <span className="btn-emoji">🎉</span>
            <span className="btn-text">¡Acepto mi destino!</span>
          </button>
        </div>
      )}
    </div>
  )

  const renderFood = () => {
    const options = answers.hasThroatPain ? COMFORT_FOOD_OPTIONS : OPEN_FOOD_OPTIONS
    const subtitle = answers.hasThroatPain ? 'Vamos por algo suavecito...' : '¿Qué se te antoja?'

    return (
      <div className={`dinner-step ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <div className="dinner-emoji-header">{answers.hasThroatPain ? '🤗' : '🤔'}</div>
        <h2 className="dinner-question">{subtitle}</h2>
        <div className="dinner-options dinner-options-food">
          {options.map(option => (
            <button
              key={option.id}
              className="dinner-btn dinner-btn-food"
              onClick={() => handleFoodAnswer(option.label)}
            >
              <span className="btn-emoji-large">{option.emoji}</span>
              <span className="btn-text">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderFinal = () => (
    <div className={`dinner-step dinner-step-final ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <div className="dinner-final-icon">✨🍽️✨</div>
      <div className="dinner-final-message">
        <p className="dinner-final-text">
          Pau, paso por ti a las <strong>6:30pm</strong>.
        </p>
        <p className="dinner-final-text dinner-final-subtext">
          Vístete normal y tranqui, como sea estás divina
        </p>
      </div>
      <button className="dinner-btn dinner-btn-final" onClick={handleClose}>
        <span className="btn-emoji">💌</span>
        <span className="btn-text">¡Listo, nos vemos!</span>
      </button>
    </div>
  )

  const renderCurrentView = () => {
    switch (currentView) {
      case 'health': return renderHealth()
      case 'excitement': return renderExcitement()
      case 'convince': return renderConvince()
      case 'wheel': return renderWheel()
      case 'food': return renderFood()
      case 'final': return renderFinal()
      default: return null
    }
  }

  const progress = getProgress()

  return (
    <div className="dinner-easter-egg-container" role="dialog" aria-label="Invitación a cenar">
      <button className="dinner-close-btn" onClick={handleClose} aria-label="Cerrar">
        ✕
      </button>

      {showConfetti && renderConfetti()}

      <div className="dinner-progress" aria-label={`Paso ${progress} de 4`}>
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`dinner-progress-dot ${s === progress ? 'active' : ''} ${s < progress ? 'completed' : ''}`}
          />
        ))}
      </div>

      <div className="dinner-content">
        {renderCurrentView()}
      </div>
    </div>
  )
}

export default DinnerInviteEasterEgg
