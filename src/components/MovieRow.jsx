import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'
import './MovieRow.css'

function MovieRow({ title, movies, onMovieSelect }) {
  const rowRef = useRef(null)

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!movies || movies.length === 0) return null

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button 
          className="scroll-btn scroll-left"
          onClick={() => scroll('left')}
        >
          <ChevronLeft size={32} />
        </button>
        
        <div className="movies-list" ref={rowRef}>
          {movies.map((movie, index) => (
            <MovieCard 
              key={`${movie.id}-${index}`}
              movie={movie}
              onSelect={onMovieSelect}
            />
          ))}
        </div>

        <button 
          className="scroll-btn scroll-right"
          onClick={() => scroll('right')}
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  )
}

export default MovieRow
