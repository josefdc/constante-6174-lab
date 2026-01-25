import { memo, useMemo } from 'react'
import { getDigits } from '../utils/kaprekar'
import './StepDisplay.css'

const StepDisplay = memo(function StepDisplay({ step, stepNumber }) {
  const { inputDigits, largestDigits, smallestDigits, resultDigits } = useMemo(() => ({
    inputDigits: getDigits(step.input),
    largestDigits: getDigits(step.largest),
    smallestDigits: getDigits(step.smallest),
    resultDigits: getDigits(step.result)
  }), [step.input, step.largest, step.smallest, step.result])

  return (
    <div className="step-display">
      <div className="step-section">
        <h3 className="step-label">Starting Number</h3>
        <div className="digit-container">
          {inputDigits.map((digit, idx) => (
            <span key={digit.id} className="digit digit-input">
              {digit.value}
            </span>
          ))}
        </div>
      </div>

      <div className="arrow-down">↓</div>

      <div className="step-section">
        <h3 className="step-label">Sort Descending (Largest)</h3>
        <div className="digit-container">
          {largestDigits.map((digit, idx) => (
            <span key={digit.id} className="digit digit-largest">
              {digit.value}
            </span>
          ))}
        </div>
        <div className="number-value">{step.largestNum}</div>
      </div>

      <div className="operation-symbol" aria-label="minus">
        <span className="operation-line"></span>
      </div>

      <div className="step-section">
        <h3 className="step-label">Sort Ascending (Smallest)</h3>
        <div className="digit-container">
          {smallestDigits.map((digit, idx) => (
            <span key={digit.id} className="digit digit-smallest">
              {digit.value}
            </span>
          ))}
        </div>
        <div className="number-value">{step.smallestNum}</div>
      </div>

      <div className="arrow-down">↓</div>

      <div className={`step-section result-section ${step.result === '6174' ? 'final-result' : ''}`}>
        <h3 className="step-label">Result</h3>
        <div className="digit-container">
          {resultDigits.map((digit, idx) => (
            <span 
              key={digit.id} 
              className={`digit digit-result ${step.result === '6174' ? 'digit-final' : ''}`}
            >
              {digit.value}
            </span>
          ))}
        </div>
        <div className="calculation">
          {step.largestNum} − {step.smallestNum} = {step.resultNum}
        </div>
      </div>
    </div>
  )
})

export default StepDisplay
