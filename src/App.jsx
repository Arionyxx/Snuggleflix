import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MovieRow from './components/MovieRow'
import VideoPlayer from './components/VideoPlayer'
import SearchResults from './components/SearchResults'
import { fetchTrendingMovies, fetchTrendingTVShows, fetchPopularMovies, searchMovies } from './services/api'
import './App.css'

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingShows, setTrendingShows] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadContent()
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
  }

  const handleClosePlayer = () => {
    setSelectedMovie(null)
  }

  return (
    <div className="app">
      <Navbar onSearch={setSearchQuery} />
      
      {selectedMovie && (
        <VideoPlayer movie={selectedMovie} onClose={handleClosePlayer} />
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
