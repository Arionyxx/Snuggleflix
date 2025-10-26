import axios from 'axios'

// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '89e7d8dcb8ad45f036d691597c8b11bf'
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OWU3ZDhkY2I4YWQ0NWYwMzZkNjkxNTk3YzhiMTFiZiIsIm5iZiI6MTc1OTU4MzI2Ny44MzcsInN1YiI6IjY4ZTExYzIzMDE1MTM0ZDQ1NjYxNzAyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QzUh1B4BogHaDeHzTM_gPjyKDJDwiyhMnwGfDMqIlc0'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// Configure axios defaults for TMDB
axios.defaults.headers.common['Authorization'] = `Bearer ${TMDB_ACCESS_TOKEN}`

// Free streaming API (vidsrc.to)
export const getStreamUrl = (movie) => {
  const type = movie.media_type === 'tv' ? 'tv' : 'movie'
  const id = movie.id
  return `https://vidsrc.to/embed/${type}/${id}`
}

// Alternative streaming sources
export const getAlternativeStreamUrls = (movie) => {
  const type = movie.media_type === 'tv' ? 'tv' : 'movie'
  const id = movie.id
  
  return [
    {
      name: 'VidSrc',
      url: `https://vidsrc.to/embed/${type}/${id}`
    },
    {
      name: 'VidSrc Pro',
      url: `https://vidsrc.pro/embed/${type}/${id}`
    },
    {
      name: 'SuperEmbed',
      url: `https://multiembed.mov/?video_id=${id}&tmdb=1`
    },
    {
      name: '2Embed',
      url: `https://www.2embed.cc/embed/${id}`
    }
  ]
}

// TMDB API calls
export const fetchTrendingMovies = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`)
    return response.data.results.map(movie => ({ ...movie, media_type: 'movie' }))
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return []
  }
}

export const fetchTrendingTVShows = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/tv/week`)
    return response.data.results.map(show => ({ ...show, media_type: 'tv', title: show.name }))
  } catch (error) {
    console.error('Error fetching trending TV shows:', error)
    return []
  }
}

export const fetchPopularMovies = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`)
    return response.data.results.map(movie => ({ ...movie, media_type: 'movie' }))
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return []
  }
}

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
      params: { query }
    })
    return response.data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(item => ({
        ...item,
        title: item.title || item.name
      }))
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750/1a1a2e/ff6b9d?text=No+Image'
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return 'https://via.placeholder.com/1920x1080/1a1a2e/ff6b9d?text=Snuggleflix'
  return `${IMAGE_BASE_URL}/${size}${path}`
}
