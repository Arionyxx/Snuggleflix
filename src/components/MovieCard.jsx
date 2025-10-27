import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Star, Calendar, Heart, Info } from 'lucide-react'
import { getImageUrl } from '../services/api'
import { userService } from '../services/userService'
import { useTheme } from '../contexts/ThemeContext'
import './MovieCard.css'

function MovieCard({ movie, onSelect, onShowDetails, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const { animationsEnabled } = useTheme()

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

  const handleShowDetails = (e) => {
    e.stopPropagation()
    if (onShowDetails) {
      onShowDetails(movie)
    }
  }

  const handlePlay = (e) => {
    e.stopPropagation()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      onSelect(movie)
    }, 300)
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    hover: {
      scale: 1.08,
      y: -10,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  }

  const MotionDiv = animationsEnabled ? motion.div : 'div'
  const motionProps = animationsEnabled ? {
    variants: cardVariants,
    initial: 'hidden',
    animate: 'visible',
    whileHover: 'hover'
  } : {}

  const handleCardClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      onSelect(movie)
    }, 300)
  }

  return (
    <MotionDiv 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      {...motionProps}
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
          <button className="play-icon" onClick={handlePlay}>
            <Play fill="white" size={32} />
          </button>
          {onShowDetails && (
            <button className="info-icon" onClick={handleShowDetails}>
              <Info size={24} />
            </button>
          )}
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
    </MotionDiv>
  )
}

export default MovieCard
