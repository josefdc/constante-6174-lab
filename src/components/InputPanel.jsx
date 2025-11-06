import { useState } from 'react'
import './InputPanel.css'

function InputPanel({ onStart, onReset, disabled }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setInput(value)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!input) {
      setError('Please enter a number')
      return
    }

    if (input.length < 4) {
      setError('Number must be 4 digits')
      return
    }

    onStart(input)
  }

  const handleRandomize = () => {
    // Generate random 4-digit number with at least 2 different digits
    let random
    do {
      random = Math.floor(Math.random() * 9000) + 1000
    } while (new Set(String(random)).size === 1)
    
    setInput(String(random))
    setError('')
  }

  return (
    <div className="input-panel">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <label htmlFor="number-input">Enter a 4-digit number:</label>
          <div className="input-controls">
            <input
              id="number-input"
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="e.g., 3524"
              disabled={disabled}
              className={error ? 'error' : ''}
              maxLength={4}
              autoComplete="off"
            />
            <button 
              type="button" 
              onClick={handleRandomize}
              disabled={disabled}
              className="btn btn-secondary"
              title="Generate random number"
            >
              🎲
            </button>
            <button 
              type="submit" 
              disabled={disabled || !input}
              className="btn btn-primary"
            >
              Start
            </button>
            <button 
              type="button" 
              onClick={onReset}
              className="btn btn-tertiary"
            >
              Reset
            </button>
          </div>
          {error && <span className="error-message">{error}</span>}
        </div>
      </form>
    </div>
  )
}

export default InputPanel
