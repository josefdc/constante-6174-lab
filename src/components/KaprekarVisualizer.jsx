import { useState, useEffect } from 'react'
import StepDisplay from './StepDisplay'
import './KaprekarVisualizer.css'

function KaprekarVisualizer({ sequence, currentStep, onStepChange, isPlaying, onPlayingChange }) {
  const totalSteps = sequence.steps.length

  useEffect(() => {
    if (!isPlaying) return

    if (currentStep >= totalSteps - 1) {
      onPlayingChange(false)
      return
    }

    const timer = setTimeout(() => {
      onStepChange(currentStep + 1)
    }, 2000) // 2 seconds per step

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, totalSteps, onStepChange, onPlayingChange])

  const handlePlay = () => {
    if (currentStep >= totalSteps - 1) {
      onStepChange(0)
    }
    onPlayingChange(true)
  }

  const handlePause = () => {
    onPlayingChange(false)
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1)
    }
  }

  const currentStepData = sequence.steps[currentStep]
  const isLastStep = currentStepData.result === '6174'

  return (
    <div className="kaprekar-visualizer">
      <div className="progress-indicator">
        <span className="step-counter">
          Step {currentStep + 1} of {totalSteps}
        </span>
        {isLastStep && (
          <span className="convergence-badge">
            🎯 Converged to 6174!
          </span>
        )}
      </div>

      <StepDisplay step={currentStepData} stepNumber={currentStep + 1} />

      <div className="controls">
        <button 
          onClick={handlePrev} 
          disabled={currentStep === 0 || isPlaying}
          className="btn btn-control"
          title="Previous step"
        >
          ⏮ Prev
        </button>
        
        {!isPlaying ? (
          <button 
            onClick={handlePlay}
            className="btn btn-control btn-play"
            title="Play animation"
          >
            ▶ Play
          </button>
        ) : (
          <button 
            onClick={handlePause}
            className="btn btn-control btn-pause"
            title="Pause animation"
          >
            ⏸ Pause
          </button>
        )}
        
        <button 
          onClick={handleNext} 
          disabled={currentStep >= totalSteps - 1 || isPlaying}
          className="btn btn-control"
          title="Next step"
        >
          Next ⏭
        </button>
      </div>

      <div className="step-timeline">
        {sequence.steps.map((step, index) => (
          <div
            key={index}
            className={`timeline-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            onClick={() => !isPlaying && onStepChange(index)}
            title={`Step ${index + 1}: ${step.result}`}
          >
            {step.result === '6174' ? '🎯' : index + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

export default KaprekarVisualizer
