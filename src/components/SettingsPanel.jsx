import { motion } from 'framer-motion'
import { X, Palette, Zap, Layout, Film, Info } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import './SettingsPanel.css'

function SettingsPanel({ onClose }) {
  const { 
    currentTheme, 
    setCurrentTheme, 
    themes,
    animationsEnabled,
    setAnimationsEnabled,
    cardStyle,
    setCardStyle
  } = useTheme()

  return (
    <motion.div 
      className="settings-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="settings-panel"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="settings-content">
          {/* Theme Selection */}
          <section className="settings-section">
            <div className="section-header">
              <Palette size={24} />
              <h3>Color Theme</h3>
            </div>
            <div className="theme-grid">
              {Object.entries(themes).map(([key, theme]) => (
                <motion.button
                  key={key}
                  className={`theme-card ${currentTheme === key ? 'active' : ''}`}
                  onClick={() => setCurrentTheme(key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="theme-preview">
                    <div style={{ background: theme.primary }} />
                    <div style={{ background: theme.secondary }} />
                    <div style={{ background: theme.accent }} />
                  </div>
                  <span className="theme-name">{theme.name}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Animations Toggle */}
          <section className="settings-section">
            <div className="section-header">
              <Zap size={24} />
              <h3>Animations</h3>
            </div>
            <div className="toggle-container">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={animationsEnabled}
                  onChange={(e) => setAnimationsEnabled(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">
                {animationsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="setting-description">
              Disable animations for better performance on slower devices
            </p>
          </section>

          {/* Card Style */}
          <section className="settings-section">
            <div className="section-header">
              <Layout size={24} />
              <h3>Card Style</h3>
            </div>
            <div className="card-style-options">
              {['modern', 'classic', 'minimal'].map((style) => (
                <motion.button
                  key={style}
                  className={`style-btn ${cardStyle === style ? 'active' : ''}`}
                  onClick={() => setCardStyle(style)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </motion.button>
              ))}
            </div>
            <div className="card-preview">
              <div className={`preview-card ${cardStyle}`}>
                <div className="preview-image"></div>
                <div className="preview-info">
                  <div className="preview-title"></div>
                  <div className="preview-meta"></div>
                </div>
              </div>
            </div>
          </section>

          {/* API Status */}
          <section className="settings-section">
            <div className="section-header">
              <Film size={24} />
              <h3>API Status</h3>
            </div>
            <div className="api-status-card">
              <div className="status-item">
                <span className="status-label">TMDB API</span>
                <span className="status-badge connected">✓ Connected</span>
              </div>
              <p className="setting-description">
                Movies and TV shows loading from The Movie Database
              </p>
            </div>
            <div className="api-status-card">
              <div className="status-item">
                <span className="status-label">Streaming</span>
                <span className="status-badge connected">✓ Active</span>
              </div>
              <p className="setting-description">
                4 streaming sources available: VidSrc, VidSrc Pro, SuperEmbed, 2Embed
              </p>
            </div>
          </section>

          {/* Real-Debrid */}
          <section className="settings-section">
            <div className="section-header">
              <Info size={24} />
              <h3>Premium Features</h3>
            </div>
            <p className="setting-description">
              Add your Real-Debrid token in the video player for premium, ad-free streaming
            </p>
            <p className="setting-description">
              Get Real-Debrid at: <a href="https://real-debrid.com" target="_blank" rel="noopener noreferrer">real-debrid.com</a>
            </p>
          </section>

          {/* About */}
          <section className="settings-section">
            <h3>About Snuggleflix</h3>
            <div className="about-grid">
              <div className="about-item">
                <strong>Version</strong>
                <span>3.0 - Netflix Edition</span>
              </div>
              <div className="about-item">
                <strong>Themes</strong>
                <span>6 Professional Themes</span>
              </div>
              <div className="about-item">
                <strong>Profiles</strong>
                <span>Up to 5 Profiles</span>
              </div>
              <div className="about-item">
                <strong>Content</strong>
                <span>Unlimited Movies & TV</span>
              </div>
            </div>
            <p className="setting-description" style={{marginTop: '20px', textAlign: 'center'}}>
              Built with ❤️ for cozy movie nights
            </p>
          </section>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SettingsPanel
