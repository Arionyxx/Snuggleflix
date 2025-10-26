import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MovieRow from './components/MovieRow'
import VideoPlayer from './components/VideoPlayer'
import SearchResults from './components/SearchResults'
import Watchlist from './components/Watchlist'
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

  return (
    <div className="app">
      <Navbar onSearch={setSearchQuery} onWatchlistClick={handleWatchlistClick} />
      
      {selectedMovie && (
        <VideoPlayer movie={selectedMovie} onClose={handleClosePlayer} />
      )}

      {showWatchlist && (
        <Watchlist onClose={handleCloseWatchlist} onMovieSelect={handleMovieSelect} />
      )}

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
              />
            )}
            <MovieRow 
              title="Trending Now" 
              movies={trendingMovies}
              onMovieSelect={handleMovieSelect}
            />
            <MovieRow 
              title="Popular TV Shows" 
              movies={trendingShows}
              onMovieSelect={handleMovieSelect}
            />
            <MovieRow 
              title="Popular Movies" 
              movies={popularMovies}
              onMovieSelect={handleMovieSelect}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
