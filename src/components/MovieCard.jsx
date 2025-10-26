import { useState, useEffect } from 'react'
import { Play, Star, Calendar, Heart } from 'lucide-react'
import { getImageUrl } from '../services/api'
import { userService } from '../services/userService'
import './MovieCard.css'

function MovieCard({ movie, onSelect }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    setIsInWatchlist(userService.isInWatchlist(movie.id, movie.media_type))
  }, [movie.id, movie.media_type])

  const toggleWatchlist = (e) => {
    e.stopPropagation()
    if (isInWatchlist) {
      userService.removeFromWatchlist(movie.id, movie.media_type)
      setIsInWatchlist(false)
    } else {
      userService.addToWatchlist(movie)
      setIsInWatchlist(true)
    }
  }

  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(movie)}
    >
      <div className="card-image-container">
        <img 
          src={getImageUrl(movie.poster_path)} 
          alt={movie.title || movie.name}
          className="card-image"
        />
        <button 
          className={`watchlist-heart ${isInWatchlist ? 'active' : ''}`}
          onClick={toggleWatchlist}
        >
          <Heart size={24} fill={isInWatchlist ? '#ff6b9d' : 'none'} />
        </button>
        <div className={`card-overlay ${isHovered ? 'show' : ''}`}>
          <button className="play-icon">
            <Play fill="white" size={32} />
          </button>
        </div>
      </div>
      
      <div className="card-info">
        <h3 className="card-title">{movie.title || movie.name}</h3>
        <div className="card-details">
          <span className="card-rating">
            <Star size={14} fill="#ffd700" color="#ffd700" />
            {movie.vote_average?.toFixed(1)}
          </span>
          <span className="card-year">
            <Calendar size={14} />
            {movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
