import { useState, Suspense } from 'react'
import { Loader2, X, CloudLightning } from 'lucide-react'
import TorusScene from './TorusScene'
import UIControls from './UIControls'
import './PolytorusEasterEgg.css'

const INITIAL_THEME = {
  meshColor: '#4f46e5',
  wireframeColor: '#ffffff',
  backgroundColor: '#030712',
  roughness: 0.1,
  metalness: 0.8,
  emissive: '#000000',
  animationSpeed: 1.0,
}

const INITIAL_GEOMETRY = {
  radius: 9,
  tube: 3.5,
  radialSegments: 4,
  tubularSegments: 24,
  arc: Math.PI * 2,
  twist: 0.5,
}

function PolytorusEasterEgg({ onClose }) {
  const [theme, setTheme] = useState(INITIAL_THEME)
  const [geometry, setGeometry] = useState(INITIAL_GEOMETRY)
  const [showControls, setShowControls] = useState(true)

  return (
    <div className="polytorus-container">
      {/* Close button */}
      <button 
        className="polytorus-close-btn"
        onClick={onClose}
        aria-label="Cerrar visualizador"
      >
        <X size={24} />
      </button>

      {/* Toggle controls button (mobile) */}
      <button 
        className="polytorus-toggle-controls"
        onClick={() => setShowControls(!showControls)}
        aria-label={showControls ? 'Ocultar controles' : 'Mostrar controles'}
      >
        {showControls ? 'Ocultar' : 'Controles'}
      </button>

      {/* 3D Scene */}
      <div className="polytorus-scene">
        <Suspense fallback={
          <div className="polytorus-loading">
            <Loader2 className="polytorus-spinner" size={32} />
            <span>Inicializando entorno 3D...</span>
          </div>
        }>
          <TorusScene theme={theme} geometry={geometry} />
        </Suspense>
      </div>

      {/* UI Overlay */}
      <div className="polytorus-overlay">
        {/* Header */}
        <div className="polytorus-header">
          <div className="polytorus-header-icon">
            <CloudLightning size={24} />
          </div>
          <div className="polytorus-header-text">
            <h1 className="polytorus-title">PolyTorus AI</h1>
            <p className="polytorus-subtitle">
              Easter Egg π (3141) — Visualizador de poliedros toroidales
            </p>
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="polytorus-controls-wrapper">
            <UIControls
              currentTheme={theme}
              onThemeChange={setTheme}
              currentGeometry={geometry}
              onGeometryChange={setGeometry}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PolytorusEasterEgg
