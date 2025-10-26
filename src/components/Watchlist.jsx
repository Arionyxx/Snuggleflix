import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import MovieCard from './MovieCard'
import { userService } from '../services/userService'
import './Watchlist.css'

function Watchlist({ onClose, onMovieSelect }) {
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = () => {
    const list = userService.getWatchlist()
    setWatchlist(list)
  }

  const handleRemove = (movieId, mediaType) => {
    userService.removeFromWatchlist(movieId, mediaType)
    loadWatchlist()
  }

  return (
    <div className="watchlist-overlay">
      <div className="watchlist-container">
        <div className="watchlist-header">
          <h2 className="watchlist-title">My Watchlist</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        {watchlist.length === 0 ? (
          <div className="watchlist-empty">
            <p>Your watchlist is empty</p>
            <p className="watchlist-hint">Click the heart icon on any movie to add it here!</p>
          </div>
        ) : (
          <div className="watchlist-grid">
            {watchlist.map((movie) => (
              <div key={`${movie.id}-${movie.media_type}`} className="watchlist-item">
                <MovieCard 
                  movie={movie} 
                  onSelect={onMovieSelect}
                />
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(movie.id, movie.media_type)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Watchlist
