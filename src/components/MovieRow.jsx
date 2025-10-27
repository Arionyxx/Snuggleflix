import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'
import './MovieRow.css'

function MovieRow({ title, movies, onMovieSelect, onShowDetails }) {
  const rowRef = useRef(null)
  const [showLeftBtn, setShowLeftBtn] = useState(false)
  const [showRightBtn, setShowRightBtn] = useState(true)

  const checkScrollButtons = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
      setShowLeftBtn(scrollLeft > 0)
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const handleResize = () => checkScrollButtons()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [movies])

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      setTimeout(checkScrollButtons, 300)
    }
  }

  if (!movies || movies.length === 0) return null

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        {showLeftBtn && (
          <button 
            className="scroll-btn scroll-left"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={32} />
          </button>
        )}
        
        <div 
          className="movies-list" 
          ref={rowRef}
          onScroll={checkScrollButtons}
        >
          {movies.map((movie, index) => (
            <MovieCard 
              key={`${movie.id}-${index}`}
              movie={movie}
              index={index}
              onSelect={onMovieSelect}
              onShowDetails={onShowDetails}
            />
          ))}
        </div>

        {showRightBtn && (
          <button 
            className="scroll-btn scroll-right"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </div>
  )
}

export default MovieRow
