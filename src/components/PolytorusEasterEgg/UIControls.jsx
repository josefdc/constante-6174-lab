import { useState } from 'react'
import { Sparkles, Box, AlertCircle, RefreshCw } from 'lucide-react'
import { generateThemeFromPrompt } from '../../services/geminiService'

const GenerationStatus = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
}

function UIControls({ currentTheme, onThemeChange, currentGeometry, onGeometryChange }) {
  const [activeTab, setActiveTab] = useState('style')
  const [prompt, setPrompt] = useState('')
  const [genStatus, setGenStatus] = useState(GenerationStatus.IDLE)
  const [errorMsg, setErrorMsg] = useState('')

  const apiKeyAvailable = Boolean(import.meta.env.VITE_GEMINI_API_KEY)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setGenStatus(GenerationStatus.LOADING)
    setErrorMsg('')

    try {
      const newTheme = await generateThemeFromPrompt(prompt)
      if (newTheme) {
        onThemeChange({ ...currentTheme, ...newTheme })
        setGenStatus(GenerationStatus.SUCCESS)
      } else {
        setErrorMsg('Failed to generate theme. Check API key?')
        setGenStatus(GenerationStatus.ERROR)
      }
    } catch (e) {
      setErrorMsg('An error occurred.')
      setGenStatus(GenerationStatus.ERROR)
    }
  }

  const updateGeometry = (key, value) => {
    onGeometryChange({ ...currentGeometry, [key]: value })
  }

  return (
    <div className="ui-controls">
      {/* Tabs */}
      <div className="ui-tabs">
        <button
          onClick={() => setActiveTab('style')}
          className={`ui-tab ${activeTab === 'style' ? 'active' : ''}`}
        >
          <Sparkles size={16} />
          AI Theme
        </button>
        <button
          onClick={() => setActiveTab('geometry')}
          className={`ui-tab ${activeTab === 'geometry' ? 'active' : ''}`}
        >
          <Box size={16} />
          Geometry
        </button>
      </div>

      {/* Content */}
      <div className="ui-content">
        {activeTab === 'style' && (
          <div className="ui-section">
            {/* AI Generation */}
            <div className="ui-group">
              <label className="ui-label">Ask Gemini AI</label>
              <textarea
                className="ui-textarea"
                rows={3}
                placeholder="e.g. 'Cyberpunk neon city' or 'Soft pastel marshmallows'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                disabled={genStatus === GenerationStatus.LOADING || !apiKeyAvailable}
                className={`ui-btn-primary ${genStatus === GenerationStatus.LOADING ? 'loading' : ''}`}
              >
                {genStatus === GenerationStatus.LOADING ? (
                  'Generating...'
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Theme
                  </>
                )}
              </button>

              {!apiKeyAvailable && (
                <div className="ui-warning">
                  <AlertCircle size={14} />
                  No API key configured. AI features disabled.
                </div>
              )}

              {errorMsg && (
                <div className="ui-error">{errorMsg}</div>
              )}
            </div>

            <div className="ui-divider" />

            {/* Manual controls */}
            <div className="ui-group">
              <label className="ui-label">Manual Override</label>
              
              <div className="ui-color-grid">
                <div className="ui-color-item">
                  <span>Mesh Color</span>
                  <input
                    type="color"
                    value={currentTheme.meshColor}
                    onChange={(e) => onThemeChange({ ...currentTheme, meshColor: e.target.value })}
                  />
                </div>
                <div className="ui-color-item">
                  <span>Background</span>
                  <input
                    type="color"
                    value={currentTheme.backgroundColor}
                    onChange={(e) => onThemeChange({ ...currentTheme, backgroundColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="ui-slider-group">
                <div className="ui-slider-header">
                  <span>Metalness</span>
                  <span>{currentTheme.metalness.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={currentTheme.metalness}
                  onChange={(e) => onThemeChange({ ...currentTheme, metalness: parseFloat(e.target.value) })}
                />
              </div>

              <div className="ui-slider-group">
                <div className="ui-slider-header">
                  <span>Roughness</span>
                  <span>{currentTheme.roughness.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={currentTheme.roughness}
                  onChange={(e) => onThemeChange({ ...currentTheme, roughness: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geometry' && (
          <div className="ui-section">
            <div className="ui-info-box">
              Low segment counts plus high Twist creates the Toroidal Polyhedron look.
            </div>

            <div className="ui-slider-group highlight">
              <div className="ui-slider-header">
                <span><RefreshCw size={14} /> Twist (Torsion)</span>
                <span>{currentGeometry.twist.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={currentGeometry.twist}
                onChange={(e) => updateGeometry('twist', parseFloat(e.target.value))}
                className="slider-highlight"
              />
            </div>

            <div className="ui-divider" />

            <div className="ui-slider-group">
              <div className="ui-slider-header">
                <span>Radius (Major)</span>
                <span>{currentGeometry.radius}</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="0.5"
                value={currentGeometry.radius}
                onChange={(e) => updateGeometry('radius', parseFloat(e.target.value))}
              />
            </div>

            <div className="ui-slider-group">
              <div className="ui-slider-header">
                <span>Tube Radius (Minor)</span>
                <span>{currentGeometry.tube}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={currentGeometry.tube}
                onChange={(e) => updateGeometry('tube', parseFloat(e.target.value))}
              />
            </div>

            <div className="ui-slider-group">
              <div className="ui-slider-header">
                <span>Radial Segments (Sides)</span>
                <span>{currentGeometry.radialSegments}</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={currentGeometry.radialSegments}
                onChange={(e) => updateGeometry('radialSegments', parseInt(e.target.value))}
              />
              <p className="ui-hint">4 = square, 3 = triangle</p>
            </div>

            <div className="ui-slider-group">
              <div className="ui-slider-header">
                <span>Tubular Segments (Steps)</span>
                <span>{currentGeometry.tubularSegments}</span>
              </div>
              <input
                type="range"
                min="3"
                max="100"
                step="1"
                value={currentGeometry.tubularSegments}
                onChange={(e) => updateGeometry('tubularSegments', parseInt(e.target.value))}
              />
            </div>

            <div className="ui-slider-group">
              <div className="ui-slider-header">
                <span>Arc (Incomplete Ring)</span>
                <span>{(currentGeometry.arc * (180 / Math.PI)).toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min="0.1"
                max={Math.PI * 2}
                step="0.1"
                value={currentGeometry.arc}
                onChange={(e) => updateGeometry('arc', parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UIControls
