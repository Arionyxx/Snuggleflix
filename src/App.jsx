import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MovieRow from './components/MovieRow'
import VideoPlayer from './components/VideoPlayer'
import SearchResults from './components/SearchResults'
import Watchlist from './components/Watchlist'
import MovieDetails from './components/MovieDetails'
import SettingsPanel from './components/SettingsPanel'
import { fetchTrendingMovies, fetchTrendingTVShows, fetchPopularMovies, searchMovies } from './services/api'
import { userService } from './services/userService'
import './App.css'

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingShows, setTrendingShows] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [continueWatching, setContinueWatching] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [detailsMovie, setDetailsMovie] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadContent()
    loadContinueWatching()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }, [searchQuery])

  const loadContent = async () => {
    try {
      const [trending, shows, popular] = await Promise.all([
        fetchTrendingMovies(),
        fetchTrendingTVShows(),
        fetchPopularMovies()
      ])
      setTrendingMovies(trending)
      setTrendingShows(shows)
      setPopularMovies(popular)
    } catch (error) {
      console.error('Error loading content:', error)
    }
  }

  const loadContinueWatching = () => {
    const watching = userService.getContinueWatching()
    setContinueWatching(watching)
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await searchMovies(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults([])
    }
  }

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie)
    // Add to watch history
    userService.addToHistory(movie, 0)
    loadContinueWatching()
  }

  const handleClosePlayer = () => {
    setSelectedMovie(null)
    loadContinueWatching()
  }

  const handleWatchlistClick = () => {
    setShowWatchlist(true)
  }

  const handleCloseWatchlist = () => {
    setShowWatchlist(false)
  }

  const handleShowDetails = useCallback((movie) => {
    setDetailsMovie(movie)
    setShowDetails(true)
  }, [])

  const handleCloseDetails = () => {
    setShowDetails(false)
    setDetailsMovie(null)
  }

  const handleShowSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  const handlePlayFromDetails = (movie) => {
    handleCloseDetails()
    handleMovieSelect(movie)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // ESC to close overlays
      if (e.key === 'Escape') {
        if (showSettings) handleCloseSettings()
        else if (showDetails) handleCloseDetails()
        else if (showWatchlist) handleCloseWatchlist()
        else if (selectedMovie) handleClosePlayer()
      }
      // S for settings
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        if (!selectedMovie && !showDetails && !showWatchlist) {
          handleShowSettings()
        }
      }
      // W for watchlist
      if (e.key === 'w' && !e.ctrlKey && !e.metaKey) {
        if (!selectedMovie && !showDetails && !showSettings) {
          setShowWatchlist(prev => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showSettings, showDetails, showWatchlist, selectedMovie])

  return (
    <div className="app">
      <Navbar 
        onSearch={setSearchQuery} 
        onWatchlistClick={handleWatchlistClick}
        onSettingsClick={handleShowSettings}
      />
      
      {selectedMovie && (
        <VideoPlayer movie={selectedMovie} onClose={handleClosePlayer} />
      )}

      <AnimatePresence>
        {showWatchlist && (
          <Watchlist onClose={handleCloseWatchlist} onMovieSelect={handleMovieSelect} />
        )}

        {showDetails && detailsMovie && (
          <MovieDetails 
            movie={detailsMovie} 
            onClose={handleCloseDetails}
            onPlay={handlePlayFromDetails}
          />
        )}

        {showSettings && (
          <SettingsPanel onClose={handleCloseSettings} />
        )}
      </AnimatePresence>

      {isSearching ? (
        <SearchResults 
          results={searchResults} 
          query={searchQuery}
          onMovieSelect={handleMovieSelect}
        />
      ) : (
        <>
          <Hero movies={trendingMovies} onMovieSelect={handleMovieSelect} />
          
          <div className="content-container">
            {continueWatching.length > 0 && (
              <MovieRow 
                title="Continue Watching" 
                movies={continueWatching}
                onMovieSelect={handleMovieSelect}
                onShowDetails={handleShowDetails}
              />
            )}
            <MovieRow 
              title="Trending Now" 
              movies={trendingMovies}
              onMovieSelect={handleMovieSelect}
              onShowDetails={handleShowDetails}
            />
            <MovieRow 
              title="Popular TV Shows" 
              movies={trendingShows}
              onMovieSelect={handleMovieSelect}
              onShowDetails={handleShowDetails}
            />
            <MovieRow 
              title="Popular Movies" 
              movies={popularMovies}
              onMovieSelect={handleMovieSelect}
              onShowDetails={handleShowDetails}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
