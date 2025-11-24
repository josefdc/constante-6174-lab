import { useState, lazy, Suspense } from 'react'
import { kaprekarSequence } from './utils/kaprekar'
import KaprekarVisualizer from './components/KaprekarVisualizer'
import InputPanel from './components/InputPanel'
import './App.css'

// Lazy load Easter Eggs - solo se cargan cuando se necesitan
const EasterEgg = lazy(() => import('./components/EasterEgg'))
const LetterEasterEgg = lazy(() => import('./components/LetterEasterEgg'))
const ButterflyEasterEgg = lazy(() => import('./components/ButterflyEasterEgg'))
const BunnyEasterEgg = lazy(() => import('./components/BunnyEasterEgg'))
const PolytorusEasterEgg = lazy(() => import('./components/PolytorusEasterEgg'))

function App() {
  const [sequence, setSequence] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [easterEggType, setEasterEggType] = useState(null)

  const handleStartSequence = (inputNumber) => {
    const result = kaprekarSequence(inputNumber)
    
    if (result.success) {
      if (result.isEasterEgg) {
        setShowEasterEgg(true)
        setEasterEggType(result.easterEggType)
        setSequence(null)
      } else {
        setShowEasterEgg(false)
        setEasterEggType(null)
        setSequence(result)
        setCurrentStep(0)
        setIsPlaying(false)
      }
    } else {
      alert(result.error)
    }
  }

  const handleReset = () => {
    setSequence(null)
    setCurrentStep(0)
    setIsPlaying(false)
    setShowEasterEgg(false)
    setEasterEggType(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Kaprekar's Constant: 6174</h1>
        <p className="subtitle">
          Watch any 4-digit number converge to the mysterious constant
        </p>
      </header>

      <main className="app-main">
        <InputPanel 
          onStart={handleStartSequence}
          onReset={handleReset}
          disabled={isPlaying}
        />

        <Suspense fallback={<div className="loading-easter-egg" aria-label="Cargando contenido especial"></div>}>
          {showEasterEgg && easterEggType === 'convergence' && <EasterEgg />}
          {showEasterEgg && easterEggType === 'letter' && <LetterEasterEgg />}
          {showEasterEgg && easterEggType === 'butterfly' && <ButterflyEasterEgg />}
          {showEasterEgg && easterEggType === 'bunny' && <BunnyEasterEgg />}
          {showEasterEgg && easterEggType === 'polytorus' && <PolytorusEasterEgg onClose={handleReset} />}
        </Suspense>

        {sequence && !showEasterEgg && (
          <KaprekarVisualizer
            sequence={sequence}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            isPlaying={isPlaying}
            onPlayingChange={setIsPlaying}
          />
        )}

        {!sequence && !showEasterEgg && (
          <div className="welcome-message">
            <div className="info-card">
              <h2>How It Works</h2>
              <ol>
                <li>Take any 4-digit number (digits not all the same)</li>
                <li>Arrange digits in descending order</li>
                <li>Arrange digits in ascending order</li>
                <li>Subtract the smaller from the larger</li>
                <li>Repeat with the result</li>
              </ol>
              <p className="highlight">
                ✨ You will <strong>always</strong> reach 6174!
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Named after Indian mathematician D.R. Kaprekar (1905–1986)
        </p>
      </footer>
    </div>
  )
}

export default App
