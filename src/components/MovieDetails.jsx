import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Heart, Star, Calendar, Clock, Users, Film, Tv, Download } from 'lucide-react'
import { getBackdropUrl, getImageUrl } from '../services/api'
import { userService } from '../services/userService'
import YouTube from 'react-youtube'
import './MovieDetails.css'

function MovieDetails({ movie, onClose, onPlay }) {
  const [details, setDetails] = useState(null)
  const [cast, setCast] = useState([])
  const [trailerKey, setTrailerKey] = useState(null)
  const [similar, setSimilar] = useState([])
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [episodes, setEpisodes] = useState([])

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY'

  useEffect(() => {
    loadMovieDetails()
    setIsInWatchlist(userService.isInWatchlist(movie.id, movie.media_type))
  }, [movie])

  const loadMovieDetails = async () => {
    const type = movie.media_type === 'tv' ? 'tv' : 'movie'
    
    try {
      // Get movie/show details
      const detailsRes = await fetch(
        `https://api.themoviedb.org/3/${type}/${movie.id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits,similar`
      )
      
      if (!detailsRes.ok) {
        throw new Error('Failed to fetch movie details')
      }
      
      const data = await detailsRes.json()
      
      if (!data || data.success === false) {
        throw new Error('Invalid movie data')
      }
      
      setDetails(data)

      // Get cast
      if (data.credits?.cast) {
        setCast(data.credits.cast.slice(0, 10))
      }

      // Get trailer
      if (data.videos?.results) {
        const trailer = data.videos.results.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        )
        if (trailer) setTrailerKey(trailer.key)
      }

      // Get similar content
      if (data.similar?.results) {
        setSimilar(data.similar.results.slice(0, 6))
      }

      // For TV shows, load first season episodes
      if (type === 'tv' && data.number_of_seasons > 0) {
        loadEpisodes(1)
      }
    } catch (error) {
      console.error('Error loading movie details:', error)
      // Set minimal details to prevent broken UI
      setDetails({
        title: movie.title || movie.name,
        overview: movie.overview || 'No description available.',
        vote_average: movie.vote_average,
        release_date: movie.release_date || movie.first_air_date,
        backdrop_path: movie.backdrop_path,
        poster_path: movie.poster_path
      })
    }
  }

  const loadEpisodes = async (season) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${movie.id}/season/${season}?api_key=${TMDB_API_KEY}`
      )
      const data = await res.json()
      setEpisodes(data.episodes || [])
      setSelectedSeason(season)
    } catch (error) {
      console.error('Error loading episodes:', error)
    }
  }

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      userService.removeFromWatchlist(movie.id, movie.media_type)
      setIsInWatchlist(false)
    } else {
      userService.addToWatchlist(movie)
      setIsInWatchlist(true)
    }
  }

  if (!details) {
    return (
      <motion.div 
        className="movie-details-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="loading-spinner">
          <div className="spinner-animation"></div>
          <p>Loading details...</p>
        </div>
      </motion.div>
    )
  }

  const runtime = details.runtime || (details.episode_run_time?.[0])
  const genres = details.genres?.map(g => g.name).join(', ')

  return (
    <AnimatePresence>
      <motion.div 
        className="movie-details-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="movie-details-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button className="details-close-btn" onClick={onClose}>
            <X size={28} />
          </button>

          {/* Hero Section */}
          <div 
            className="details-hero"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(26, 26, 46, 0.3), rgba(26, 26, 46, 0.95)), url(${getBackdropUrl(details.backdrop_path)})`
            }}
          >
            <div className="details-hero-content">
              <h1 className="details-title">
                {details.title || details.name}
              </h1>
              
              <div className="details-meta">
                <span className="meta-item">
                  <Star fill="#ffd700" color="#ffd700" size={18} />
                  {details.vote_average?.toFixed(1)}
                </span>
                <span className="meta-item">
                  <Calendar size={18} />
                  {details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0]}
                </span>
                {runtime && (
                  <span className="meta-item">
                    <Clock size={18} />
                    {runtime} min
                  </span>
                )}
                {details.number_of_seasons && (
                  <span className="meta-item">
                    <Tv size={18} />
                    {details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="details-actions">
                <button className="action-btn primary" onClick={() => onPlay(movie)}>
                  <Play fill="white" size={20} />
                  Play Now
                </button>
                {trailerKey && (
                  <button className="action-btn" onClick={() => setShowTrailer(!showTrailer)}>
                    <Film size={20} />
                    {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
                  </button>
                )}
                <button 
                  className={`action-btn ${isInWatchlist ? 'active' : ''}`}
                  onClick={toggleWatchlist}
                >
                  <Heart fill={isInWatchlist ? 'currentColor' : 'none'} size={20} />
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>

          {/* Trailer */}
          {showTrailer && trailerKey && (
            <motion.div 
              className="trailer-container"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <YouTube
                videoId={trailerKey}
                opts={{
                  width: '100%',
                  height: '500',
                  playerVars: {
                    autoplay: 1,
                  }
                }}
              />
            </motion.div>
          )}

          {/* Content Sections */}
          <div className="details-content">
            {/* Overview */}
            <section className="details-section">
              <h2>Overview</h2>
              <p className="overview-text">{details.overview}</p>
              {genres && (
                <div className="genre-tags">
                  {details.genres.map(genre => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>
              )}
            </section>

            {/* TV Show Episodes */}
            {movie.media_type === 'tv' && details.number_of_seasons > 0 && (
              <section className="details-section">
                <h2>Episodes</h2>
                <div className="season-selector">
                  {Array.from({ length: details.number_of_seasons }, (_, i) => i + 1).map(season => (
                    <button
                      key={season}
                      className={`season-btn ${selectedSeason === season ? 'active' : ''}`}
                      onClick={() => loadEpisodes(season)}
                    >
                      Season {season}
                    </button>
                  ))}
                </div>
                <div className="episodes-list">
                  {episodes.map((episode) => (
                    <motion.div
                      key={episode.id}
                      className="episode-card"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onPlay({...movie, season: selectedSeason, episode: episode.episode_number})}
                    >
                      <img 
                        src={getImageUrl(episode.still_path, 'w300')}
                        alt={episode.name}
                        className="episode-image"
                      />
                      <div className="episode-info">
                        <h4>{episode.episode_number}. {episode.name}</h4>
                        <p className="episode-overview">{episode.overview}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <section className="details-section">
                <h2>Cast</h2>
                <div className="cast-grid">
                  {cast.map((person) => (
                    <motion.div
                      key={person.id}
                      className="cast-card"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        className="cast-image"
                      />
                      <div className="cast-info">
                        <p className="cast-name">{person.name}</p>
                        <p className="cast-character">{person.character}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Similar Content */}
            {similar.length > 0 && (
              <section className="details-section">
                <h2>Similar {movie.media_type === 'tv' ? 'Shows' : 'Movies'}</h2>
                <div className="similar-grid">
                  {similar.map((item) => (
                    <motion.div
                      key={item.id}
                      className="similar-card"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        onClose()
                        // This would open details for the similar item
                      }}
                    >
                      <img
                        src={getImageUrl(item.poster_path, 'w342')}
                        alt={item.title || item.name}
                        className="similar-image"
                      />
                      <p className="similar-title">{item.title || item.name}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MovieDetails
