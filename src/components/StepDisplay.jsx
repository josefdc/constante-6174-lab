import { getDigits } from '../utils/kaprekar'
import './StepDisplay.css'

function StepDisplay({ step, stepNumber }) {
  const inputDigits = getDigits(step.input)
  const largestDigits = getDigits(step.largest)
  const smallestDigits = getDigits(step.smallest)
  const resultDigits = getDigits(step.result)

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

      <div className="operation-symbol">−</div>

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

      <div className="step-section result-section">
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
}

export default StepDisplay
