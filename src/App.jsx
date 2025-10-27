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
  
  // Pagination states
  const [trendingPage, setTrendingPage] = useState(1)
  const [showsPage, setShowsPage] = useState(1)
  const [popularPage, setPopularPage] = useState(1)
  const [trendingHasMore, setTrendingHasMore] = useState(true)
  const [showsHasMore, setShowsHasMore] = useState(true)
  const [popularHasMore, setPopularHasMore] = useState(true)
  const [loadingTrending, setLoadingTrending] = useState(false)
  const [loadingShows, setLoadingShows] = useState(false)
  const [loadingPopular, setLoadingPopular] = useState(false)
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
        fetchTrendingMovies(1),
        fetchTrendingTVShows(1),
        fetchPopularMovies(1)
      ])
      setTrendingMovies(trending.results)
      setTrendingShows(shows.results)
      setPopularMovies(popular.results)
      setTrendingHasMore(trending.page < trending.total_pages)
      setShowsHasMore(shows.page < shows.total_pages)
      setPopularHasMore(popular.page < popular.total_pages)
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
      const data = await searchMovies(query, 1)
      setSearchResults(data.results)
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
  
  // Load more functions
  const loadMoreTrending = async () => {
    if (loadingTrending || !trendingHasMore) return
    
    setLoadingTrending(true)
    try {
      const nextPage = trendingPage + 1
      const data = await fetchTrendingMovies(nextPage)
      setTrendingMovies(prev => [...prev, ...data.results])
      setTrendingPage(nextPage)
      setTrendingHasMore(data.page < data.total_pages)
    } catch (error) {
      console.error('Error loading more trending:', error)
    } finally {
      setLoadingTrending(false)
    }
  }
  
  const loadMoreShows = async () => {
    if (loadingShows || !showsHasMore) return
    
    setLoadingShows(true)
    try {
      const nextPage = showsPage + 1
      const data = await fetchTrendingTVShows(nextPage)
      setTrendingShows(prev => [...prev, ...data.results])
      setShowsPage(nextPage)
      setShowsHasMore(data.page < data.total_pages)
    } catch (error) {
      console.error('Error loading more shows:', error)
    } finally {
      setLoadingShows(false)
    }
  }
  
  const loadMorePopular = async () => {
    if (loadingPopular || !popularHasMore) return
    
    setLoadingPopular(true)
    try {
      const nextPage = popularPage + 1
      const data = await fetchPopularMovies(nextPage)
      setPopularMovies(prev => [...prev, ...data.results])
      setPopularPage(nextPage)
      setPopularHasMore(data.page < data.total_pages)
    } catch (error) {
      console.error('Error loading more popular:', error)
    } finally {
      setLoadingPopular(false)
    }
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
          onShowDetails={handleShowDetails}
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
              onLoadMore={loadMoreTrending}
              hasMore={trendingHasMore}
              isLoading={loadingTrending}
            />
            <MovieRow 
              title="Popular TV Shows" 
              movies={trendingShows}
              onMovieSelect={handleMovieSelect}
              onShowDetails={handleShowDetails}
              onLoadMore={loadMoreShows}
              hasMore={showsHasMore}
              isLoading={loadingShows}
            />
            <MovieRow 
              title="Popular Movies" 
              movies={popularMovies}
              onMovieSelect={handleMovieSelect}
              onShowDetails={handleShowDetails}
              onLoadMore={loadMorePopular}
              hasMore={popularHasMore}
              isLoading={loadingPopular}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
