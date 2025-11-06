import { useState } from 'react'
import { kaprekarSequence } from './utils/kaprekar'
import KaprekarVisualizer from './components/KaprekarVisualizer'
import InputPanel from './components/InputPanel'
import './App.css'

function App() {
  const [sequence, setSequence] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleStartSequence = (inputNumber) => {
    const result = kaprekarSequence(inputNumber)
    
    if (result.success) {
      setSequence(result)
      setCurrentStep(0)
      setIsPlaying(false)
    } else {
      alert(result.error)
    }
  }

  const handleReset = () => {
    setSequence(null)
    setCurrentStep(0)
    setIsPlaying(false)
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

        {sequence && (
          <KaprekarVisualizer
            sequence={sequence}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            isPlaying={isPlaying}
            onPlayingChange={setIsPlaying}
          />
        )}

        {!sequence && (
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
