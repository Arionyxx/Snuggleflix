import { useState, useEffect } from 'react'
import { Play, Info } from 'lucide-react'
import { getBackdropUrl } from '../services/api'
import './Hero.css'

function Hero({ movies, onMovieSelect }) {
  const [currentMovie, setCurrentMovie] = useState(null)

  useEffect(() => {
    if (movies && movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)]
      setCurrentMovie(randomMovie)
    }
  }, [movies])

  if (!currentMovie) return null

  const truncateText = (text, maxLength) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const handlePlay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      onMovieSelect(currentMovie)
    }, 300)
  }

  return (
    <div 
      className="hero"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(26, 26, 46, 0.3), rgba(26, 26, 46, 0.95)), url(${getBackdropUrl(currentMovie.backdrop_path)})`
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title fade-in">
          {currentMovie.title || currentMovie.name}
        </h1>
        <p className="hero-description fade-in">
          {truncateText(currentMovie.overview, 300)}
        </p>
        <div className="hero-buttons fade-in">
          <button 
            className="hero-btn play-btn"
            onClick={handlePlay}
          >
            <Play fill="white" size={24} />
            Play Now
          </button>
        </div>
        <div className="hero-rating fade-in">
          <span className="rating-star">⭐</span>
          <span className="rating-value">{currentMovie.vote_average?.toFixed(1)}</span>
          <span className="rating-separator">•</span>
          <span className="rating-year">
            {currentMovie.release_date?.split('-')[0] || currentMovie.first_air_date?.split('-')[0]}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Hero
