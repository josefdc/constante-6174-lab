import { Settings, RotateCcw } from 'lucide-react'

const PRESETS = [
  { name: 'Índigo', meshColor: '#4f46e5', backgroundColor: '#030712' },
  { name: 'Esmeralda', meshColor: '#10b981', backgroundColor: '#022c22' },
  { name: 'Rosa', meshColor: '#ec4899', backgroundColor: '#1a0a14' },
  { name: 'Dorado', meshColor: '#f59e0b', backgroundColor: '#1c1002' },
  { name: 'Cian', meshColor: '#06b6d4', backgroundColor: '#021a1f' },
]

const DEFAULT_GEOMETRY = {
  radius: 9,
  tube: 3.5,
  radialSegments: 4,
  tubularSegments: 24,
  arc: Math.PI * 2,
  twist: 0.5,
}

const DEFAULT_THEME = {
  meshColor: '#4f46e5',
  backgroundColor: '#030712',
  metalness: 0.8,
  roughness: 0.1,
}

function UIControls({ currentTheme, onThemeChange, currentGeometry, onGeometryChange }) {
  const updateGeometry = (key, value) => {
    onGeometryChange({ ...currentGeometry, [key]: value })
  }

  const handleReset = () => {
    onGeometryChange(DEFAULT_GEOMETRY)
    onThemeChange({ ...currentTheme, ...DEFAULT_THEME })
  }

  const applyPreset = (preset) => {
    onThemeChange({ 
      ...currentTheme, 
      meshColor: preset.meshColor, 
      backgroundColor: preset.backgroundColor 
    })
  }

  return (
    <div className="ui-controls" role="region" aria-label="Controles del visualizador">
      {/* Header */}
      <div className="ui-header">
        <div className="ui-header-title">
          <Settings size={18} aria-hidden="true" />
          <span>Controles</span>
        </div>
        <button 
          onClick={handleReset} 
          className="ui-reset-btn"
          aria-label="Restablecer valores predeterminados"
          title="Restablecer"
        >
          <RotateCcw size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="ui-content">
        {/* Presets de color */}
        <section className="ui-section" aria-labelledby="presets-title">
          <h3 id="presets-title" className="ui-label">Temas</h3>
          <div className="ui-presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="ui-preset-btn"
                style={{ background: preset.meshColor }}
                aria-label={`Aplicar tema ${preset.name}`}
                title={preset.name}
              />
            ))}
          </div>
        </section>

        {/* Colores manuales */}
        <section className="ui-section" aria-labelledby="colors-title">
          <h3 id="colors-title" className="ui-label">Colores</h3>
          <div className="ui-color-grid">
            <div className="ui-color-item">
              <label htmlFor="mesh-color">Objeto</label>
              <input
                id="mesh-color"
                type="color"
                value={currentTheme.meshColor}
                onChange={(e) => onThemeChange({ ...currentTheme, meshColor: e.target.value })}
              />
            </div>
            <div className="ui-color-item">
              <label htmlFor="bg-color">Fondo</label>
              <input
                id="bg-color"
                type="color"
                value={currentTheme.backgroundColor}
                onChange={(e) => onThemeChange({ ...currentTheme, backgroundColor: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Material */}
        <section className="ui-section" aria-labelledby="material-title">
          <h3 id="material-title" className="ui-label">Material</h3>
          
          <div className="ui-slider-group">
            <div className="ui-slider-header">
              <label htmlFor="metalness-slider">Brillo metálico</label>
              <output htmlFor="metalness-slider">{(currentTheme.metalness * 100).toFixed(0)}%</output>
            </div>
            <input
              id="metalness-slider"
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
              <label htmlFor="roughness-slider">Rugosidad</label>
              <output htmlFor="roughness-slider">{(currentTheme.roughness * 100).toFixed(0)}%</output>
            </div>
            <input
              id="roughness-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={currentTheme.roughness}
              onChange={(e) => onThemeChange({ ...currentTheme, roughness: parseFloat(e.target.value) })}
            />
          </div>
        </section>

        <div className="ui-divider" role="separator" />

        {/* Geometría */}
        <section className="ui-section" aria-labelledby="geometry-title">
          <h3 id="geometry-title" className="ui-label">Geometría</h3>

          <div className="ui-slider-group highlight">
            <div className="ui-slider-header">
              <label htmlFor="twist-slider">🔄 Torsión</label>
              <output htmlFor="twist-slider">{currentGeometry.twist.toFixed(1)}</output>
            </div>
            <input
              id="twist-slider"
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={currentGeometry.twist}
              onChange={(e) => updateGeometry('twist', parseFloat(e.target.value))}
            />
          </div>

          <div className="ui-slider-group">
            <div className="ui-slider-header">
              <label htmlFor="radius-slider">Radio mayor</label>
              <output htmlFor="radius-slider">{currentGeometry.radius}</output>
            </div>
            <input
              id="radius-slider"
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
              <label htmlFor="tube-slider">Radio del tubo</label>
              <output htmlFor="tube-slider">{currentGeometry.tube}</output>
            </div>
            <input
              id="tube-slider"
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
              <label htmlFor="radial-slider">Lados</label>
              <output htmlFor="radial-slider">{currentGeometry.radialSegments}</output>
            </div>
            <input
              id="radial-slider"
              type="range"
              min="3"
              max="30"
              step="1"
              value={currentGeometry.radialSegments}
              onChange={(e) => updateGeometry('radialSegments', parseInt(e.target.value))}
            />
            <p className="ui-hint">3 = triángulo, 4 = cuadrado</p>
          </div>

          <div className="ui-slider-group">
            <div className="ui-slider-header">
              <label htmlFor="tubular-slider">Segmentos</label>
              <output htmlFor="tubular-slider">{currentGeometry.tubularSegments}</output>
            </div>
            <input
              id="tubular-slider"
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
              <label htmlFor="arc-slider">Arco</label>
              <output htmlFor="arc-slider">{(currentGeometry.arc * (180 / Math.PI)).toFixed(0)}°</output>
            </div>
            <input
              id="arc-slider"
              type="range"
              min="0.1"
              max={Math.PI * 2}
              step="0.1"
              value={currentGeometry.arc}
              onChange={(e) => updateGeometry('arc', parseFloat(e.target.value))}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default UIControls
