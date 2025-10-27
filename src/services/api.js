import axios from 'axios'

// TMDB API for movie data
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// Check if API key is configured
if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
  console.warn('⚠️ TMDB API Key not configured! Please add VITE_TMDB_API_KEY to your .env file')
  console.warn('Get your key at: https://www.themoviedb.org/settings/api')
}

// Free streaming API (vidsrc.to)
export const getStreamUrl = (movie) => {
  const type = movie.media_type === 'tv' ? 'tv' : 'movie'
  const id = movie.id
  const season = movie.season || 1
  const episode = movie.episode || 1
  
  if (type === 'tv') {
    return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
  }
  return `https://vidsrc.to/embed/movie/${id}`
}

// Alternative streaming sources
export const getAlternativeStreamUrls = (movie) => {
  const type = movie.media_type === 'tv' ? 'tv' : 'movie'
  const id = movie.id
  const season = movie.season || 1
  const episode = movie.episode || 1
  
  const sources = [
    {
      name: 'VidSrc',
      url: type === 'tv' 
        ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.to/embed/movie/${id}`
    },
    {
      name: 'VidSrc Pro',
      url: type === 'tv'
        ? `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`
        : `https://vidsrc.pro/embed/movie/${id}`
    },
    {
      name: 'SuperEmbed',
      url: `https://multiembed.mov/?video_id=${id}&tmdb=1${type === 'tv' ? `&s=${season}&e=${episode}` : ''}`
    },
    {
      name: '2Embed',
      url: type === 'tv'
        ? `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`
        : `https://www.2embed.cc/embed/${id}`
    },
    {
      name: 'Embed.su',
      url: type === 'tv'
        ? `https://embed.su/embed/tv/${id}/${season}/${episode}`
        : `https://embed.su/embed/movie/${id}`
    }
  ]
  
  return sources
}

// TMDB API calls
export const fetchTrendingMovies = async (page = 1) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/movie/week`,
      {
        params: {
          api_key: TMDB_API_KEY,
          page: page
        }
      }
    )
    return {
      results: response.data.results.map(movie => ({ ...movie, media_type: 'movie' })),
      page: response.data.page,
      total_pages: response.data.total_pages
    }
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return { results: [], page: 1, total_pages: 1 }
  }
}

export const fetchTrendingTVShows = async (page = 1) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/tv/week`,
      {
        params: {
          api_key: TMDB_API_KEY,
          page: page
        }
      }
    )
    return {
      results: response.data.results.map(show => ({ ...show, media_type: 'tv', title: show.name })),
      page: response.data.page,
      total_pages: response.data.total_pages
    }
  } catch (error) {
    console.error('Error fetching trending TV shows:', error)
    return { results: [], page: 1, total_pages: 1 }
  }
}

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular`,
      {
        params: {
          api_key: TMDB_API_KEY,
          page: page
        }
      }
    )
    return {
      results: response.data.results.map(movie => ({ ...movie, media_type: 'movie' })),
      page: response.data.page,
      total_pages: response.data.total_pages
    }
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    return { results: [], page: 1, total_pages: 1 }
  }
}

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/multi`,
      {
        params: {
          api_key: TMDB_API_KEY,
          query: query,
          page: page
        }
      }
    )
    const results = response.data.results
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
      .map(item => ({
        ...item,
        title: item.title || item.name
      }))
    return {
      results: results,
      page: response.data.page,
      total_pages: response.data.total_pages
    }
  } catch (error) {
    console.error('Error searching movies:', error)
    return { results: [], page: 1, total_pages: 1 }
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
