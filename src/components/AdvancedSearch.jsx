import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Filter, Star, Calendar, TrendingUp } from 'lucide-react'
import MovieCard from './MovieCard'
import './AdvancedSearch.css'

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

function AdvancedSearch({ onClose, onMovieSelect, onShowDetails }) {
  const [filters, setFilters] = useState({
    query: '',
    genre: '',
    year: '',
    minRating: 0,
    sortBy: 'popularity.desc',
    type: 'all', // all, movie, tv
  })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(true)

  const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (filters.query || filters.genre || filters.year || filters.minRating > 0) {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(debounce)
  }, [filters])

  const handleSearch = async () => {
    setLoading(true)
    try {
      let url = `https://api.themoviedb.org/3/discover/${filters.type === 'tv' ? 'tv' : 'movie'}?api_key=${TMDB_API_KEY}`
      
      if (filters.genre) url += `&with_genres=${filters.genre}`
      if (filters.year) url += `&primary_release_year=${filters.year}`
      if (filters.minRating > 0) url += `&vote_average.gte=${filters.minRating}`
      url += `&sort_by=${filters.sortBy}`

      const response = await fetch(url)
      const data = await response.json()
      
      let movies = data.results || []
      
      // Add media_type
      movies = movies.map(movie => ({
        ...movie,
        media_type: filters.type === 'tv' ? 'tv' : 'movie',
        title: movie.title || movie.name
      }))

      // If searching both types, fetch TV shows too
      if (filters.type === 'all') {
        const tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}${filters.genre ? `&with_genres=${filters.genre}` : ''}${filters.year ? `&first_air_date_year=${filters.year}` : ''}${filters.minRating > 0 ? `&vote_average.gte=${filters.minRating}` : ''}&sort_by=${filters.sortBy}`
        
        const tvResponse = await fetch(tvUrl)
        const tvData = await tvResponse.json()
        const tvShows = (tvData.results || []).map(show => ({
          ...show,
          media_type: 'tv',
          title: show.name
        }))
        
        movies = [...movies, ...tvShows].sort((a, b) => b.vote_average - a.vote_average)
      }

      setResults(movies.slice(0, 20))
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    }
    setLoading(false)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      genre: '',
      year: '',
      minRating: 0,
      sortBy: 'popularity.desc',
      type: 'all',
    })
    setResults([])
  }

  return (
    <motion.div 
      className="advanced-search-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="advanced-search-container"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="search-header">
          <h2>
            <Filter size={28} />
            Advanced Search
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        {/* Filters */}
        <div className={`filters-section ${!showFilters ? 'collapsed' : ''}`}>
          <button 
            className="toggle-filters"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>

          {showFilters && (
            <div className="filters-grid">
              {/* Type Filter */}
              <div className="filter-group">
                <label>Type</label>
                <select 
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="movie">Movies</option>
                  <option value="tv">TV Shows</option>
                </select>
              </div>

              {/* Genre Filter */}
              <div className="filter-group">
                <label>Genre</label>
                <select 
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="filter-group">
                <label>Year</label>
                <select 
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <label>
                  <Star size={16} fill="#ffd700" color="#ffd700" />
                  Min Rating: {filters.minRating}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                  className="rating-slider"
                />
              </div>

              {/* Sort By */}
              <div className="filter-group">
                <label>Sort By</label>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="popularity.desc">Most Popular</option>
                  <option value="vote_average.desc">Highest Rated</option>
                  <option value="release_date.desc">Newest First</option>
                  <option value="release_date.asc">Oldest First</option>
                  <option value="title.asc">A-Z</option>
                  <option value="title.desc">Z-A</option>
                </select>
              </div>

              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="search-results">
          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="no-results">
              <p>No results found. Try adjusting your filters.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="results-header">
                <h3>Found {results.length} results</h3>
              </div>
              <div className="results-grid">
                {results.map((movie, index) => (
                  <MovieCard
                    key={`${movie.id}-${index}`}
                    movie={movie}
                    index={index}
                    onSelect={onMovieSelect}
                    onShowDetails={onShowDetails}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AdvancedSearch
