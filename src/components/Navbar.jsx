import { useState } from 'react'
import { Search, Settings, Heart } from 'lucide-react'
import './Navbar.css'

function Navbar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchInput(value)
    onSearch(value)
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">
          <Heart className="logo-icon" />
          Snuggleflix
        </h1>
      </div>

      <div className="navbar-center">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for cozy movies & shows..."
            value={searchInput}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        <button 
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={24} />
        </button>
      </div>

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <h3>Settings</h3>
            <p className="settings-info">
              Configure your TMDB API key in <code>src/services/api.js</code>
            </p>
            <p className="settings-info">
              Add your Real-Debrid token in the video player for premium links
            </p>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
