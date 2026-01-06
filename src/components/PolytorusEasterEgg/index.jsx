import { useState, Suspense } from 'react'
import { Loader2, X } from 'lucide-react'
import TorusScene from './TorusScene'
import UIControls from './UIControls'
import './PolytorusEasterEgg.css'
import NostalgiaIntro from '../NostalgiaIntro'

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
  const [showIntro, setShowIntro] = useState(true)
  const [theme, setTheme] = useState(INITIAL_THEME)
  const [geometry, setGeometry] = useState(INITIAL_GEOMETRY)
  const [showControls, setShowControls] = useState(true)

  if (showIntro) {
    return <NostalgiaIntro onContinue={() => setShowIntro(false)} />
  }

  return (
    <div className="polytorus-container">
      {/* Botón cerrar */}
      <button 
        className="polytorus-close-btn"
        onClick={onClose}
        aria-label="Cerrar visualizador"
      >
        <X size={24} />
      </button>

      {/* Botón toggle controles (móvil) */}
      <button 
        className="polytorus-toggle-controls"
        onClick={() => setShowControls(!showControls)}
        aria-label={showControls ? 'Ocultar controles' : 'Mostrar controles'}
      >
        {showControls ? 'Ocultar' : 'Controles'}
      </button>

      {/* Escena 3D */}
      <div className="polytorus-scene">
        <Suspense fallback={
          <div className="polytorus-loading">
            <Loader2 className="polytorus-spinner" size={32} />
            <span>Cargando escena 3D...</span>
          </div>
        }>
          <TorusScene theme={theme} geometry={geometry} />
        </Suspense>
      </div>

      {/* Panel de controles */}
      {showControls && (
        <div className="polytorus-overlay">
          <div className="polytorus-controls-wrapper">
            <UIControls
              currentTheme={theme}
              onThemeChange={setTheme}
              currentGeometry={geometry}
              onGeometryChange={setGeometry}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PolytorusEasterEgg
