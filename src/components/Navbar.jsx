import { useState } from 'react'
import { Search, Settings, Heart, Bookmark } from 'lucide-react'
import './Navbar.css'

function Navbar({ onSearch, onWatchlistClick, onSettingsClick }) {
  const [searchInput, setSearchInput] = useState('')

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
          className="watchlist-btn"
          onClick={onWatchlistClick}
          title="My Watchlist"
        >
          <Bookmark size={24} />
        </button>
        <button 
          className="settings-btn"
          onClick={onSettingsClick}
        >
          <Settings size={24} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
