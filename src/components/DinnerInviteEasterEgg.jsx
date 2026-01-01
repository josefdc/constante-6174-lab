import { useState, useEffect, useMemo, useCallback } from 'react'
import emailjs from '@emailjs/browser'
import './DinnerInviteEasterEgg.css'

// ============================================
// CONFIGURACIÓN EMAILJS - REEMPLAZAR CON TUS VALORES
// ============================================
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'
// ============================================

const COMFORT_FOOD_OPTIONS = [
  { id: 'ramen', label: 'Sopita Ramen', emoji: '🍜' },
  { id: 'pasta', label: 'Cremas/Pasta suave', emoji: '🍝' },
  { id: 'tu-eliges', label: 'Lo que tú elijas', emoji: '💝' }
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

function DinnerInviteEasterEgg({ onClose }) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    hasThroatPain: null,
    excitement: null,
    foodPreference: null
  })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Generar corazones flotantes
  const hearts = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 0.8 + Math.random() * 0.8,
      opacity: 0.3 + Math.random() * 0.4
    })), []
  )

  useEffect(() => {
    const timer = setTimeout(() => setShowHearts(true), 300)
    return () => clearTimeout(timer)
  }, [])

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
                      finalAnswers.excitement === 'medium' ? 'Maso' : 'Pocas ganas',
          food_preference: finalAnswers.foodPreference,
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
      // Silently fail - UX no debe verse afectada
    }
  }, [emailSent])

  const goToNextStep = useCallback((newAnswers) => {
    setIsTransitioning(true)
    setAnswers(newAnswers)

    setTimeout(() => {
      setStep(prev => prev + 1)
      setIsTransitioning(false)

      // Si llegamos al paso 4, enviar email
      if (step === 3) {
        sendResponse(newAnswers)
      }
    }, 400)
  }, [step, sendResponse])

  const handleThroatPainAnswer = useCallback((hasPain) => {
    goToNextStep({ ...answers, hasThroatPain: hasPain })
  }, [answers, goToNextStep])

  const handleExcitementAnswer = useCallback((level) => {
    goToNextStep({ ...answers, excitement: level })
  }, [answers, goToNextStep])

  const handleFoodAnswer = useCallback((food) => {
    goToNextStep({ ...answers, foodPreference: food })
  }, [answers, goToNextStep])

  const handleClose = useCallback(() => {
    if (onClose) onClose()
  }, [onClose])

  const renderHearts = useCallback(() => (
    <div className="dinner-hearts-container" aria-hidden="true">
      {hearts.map(heart => (
        <span
          key={heart.id}
          className="dinner-floating-heart"
          style={{
            left: `${heart.x}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}rem`,
            opacity: heart.opacity
          }}
        >
          💕
        </span>
      ))}
    </div>
  ), [hearts])

  const renderStep1 = () => (
    <div className={`dinner-step ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <div className="dinner-emoji-header">🥺</div>
      <h2 className="dinner-question">
        ¿Aún tienes dolor de amígdalas, mi Pau?
      </h2>
      <div className="dinner-options">
        <button
          className="dinner-btn dinner-btn-soft"
          onClick={() => handleThroatPainAnswer(true)}
        >
          <span className="btn-emoji">😿</span>
          <span className="btn-text">Sí, un poquito</span>
        </button>
        <button
          className="dinner-btn dinner-btn-happy"
          onClick={() => handleThroatPainAnswer(false)}
        >
          <span className="btn-emoji">🎉</span>
          <span className="btn-text">Ya no, estoy súper!</span>
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
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

  const renderStep3 = () => {
    const options = answers.hasThroatPain ? COMFORT_FOOD_OPTIONS : OPEN_FOOD_OPTIONS
    const subtitle = answers.hasThroatPain
      ? 'Te preparo algo suavecito...'
      : '¿Qué se te antoja?'

    return (
      <div className={`dinner-step ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <div className="dinner-emoji-header">
          {answers.hasThroatPain ? '🤗' : '🤔'}
        </div>
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

  const renderStep4 = () => (
    <div className={`dinner-step dinner-step-final ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <div className="dinner-final-hearts">💕✨💕</div>
      <div className="dinner-final-message">
        <p className="dinner-final-text">
          Pau, paso por ti a las <strong>6:30pm</strong>.
        </p>
        <p className="dinner-final-text dinner-final-subtext">
          Vístete normal y tranqui, como sea estás divina ❤️
        </p>
      </div>
      <button
        className="dinner-btn dinner-btn-final"
        onClick={handleClose}
      >
        <span className="btn-emoji">💌</span>
        <span className="btn-text">¡Listo, nos vemos!</span>
      </button>
    </div>
  )

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      default: return null
    }
  }

  return (
    <div className="dinner-easter-egg-container" role="dialog" aria-label="Invitación a cenar">
      {/* Botón cerrar discreto */}
      <button
        className="dinner-close-btn"
        onClick={handleClose}
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* Corazones flotantes de fondo */}
      {showHearts && renderHearts()}

      {/* Indicador de progreso */}
      <div className="dinner-progress" aria-label={`Paso ${step} de 4`}>
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`dinner-progress-dot ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
          />
        ))}
      </div>

      {/* Contenido del paso actual */}
      <div className="dinner-content">
        {renderCurrentStep()}
      </div>
    </div>
  )
}

export default DinnerInviteEasterEgg
