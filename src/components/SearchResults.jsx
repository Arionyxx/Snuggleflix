import MovieCard from './MovieCard'
import './SearchResults.css'

function SearchResults({ results, query, onMovieSelect, onShowDetails }) {
  if (!query) return null

  return (
    <div className="search-results">
      <div className="search-header">
        <h2 className="search-title">
          {results.length > 0 
            ? `Found ${results.length} results for "${query}"` 
            : `No results found for "${query}"`
          }
        </h2>
      </div>

      {results.length > 0 && (
        <div className="search-grid">
          {results.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              onSelect={onMovieSelect}
              onShowDetails={onShowDetails}
            />
          ))}
        </div>
      )}

      {results.length === 0 && (
        <div className="no-results">
          <p className="no-results-text">
            Try searching with different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchResults
