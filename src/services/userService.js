// Simple user service for storing user data locally
// Can be upgraded to use Clerk or other auth providers later

const USER_KEY = 'snuggleflix_user'
const WATCHLIST_KEY = 'snuggleflix_watchlist'
const HISTORY_KEY = 'snuggleflix_history'

export const userService = {
  // Get or create a simple guest user
  getUser() {
    let user = localStorage.getItem(USER_KEY)
    if (!user) {
      user = {
        id: 'guest_' + Date.now(),
        name: 'Guest User',
        isGuest: true,
        createdAt: new Date().toISOString()
      }
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      user = JSON.parse(user)
    }
    return user
  },

  // Watchlist operations
  getWatchlist() {
    const watchlist = localStorage.getItem(WATCHLIST_KEY)
    return watchlist ? JSON.parse(watchlist) : []
  },

  addToWatchlist(movie) {
    const watchlist = this.getWatchlist()
    const exists = watchlist.find(
      item => item.id === movie.id && item.media_type === movie.media_type
    )
    
    if (!exists) {
      watchlist.unshift({
        ...movie,
        addedAt: new Date().toISOString()
      })
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
      return true
    }
    return false
  },

  removeFromWatchlist(movieId, mediaType) {
    let watchlist = this.getWatchlist()
    watchlist = watchlist.filter(
      item => !(item.id === movieId && item.media_type === mediaType)
    )
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
  },

  isInWatchlist(movieId, mediaType) {
    const watchlist = this.getWatchlist()
    return watchlist.some(
      item => item.id === movieId && item.media_type === mediaType
    )
  },

  // Watch history operations
  getWatchHistory() {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  },

  addToHistory(movie, progress = 0) {
    let history = this.getWatchHistory()
    
    // Remove if exists
    history = history.filter(
      item => !(item.id === movie.id && item.media_type === movie.media_type)
    )
    
    // Add to beginning
    history.unshift({
      ...movie,
      progress,
      watchedAt: new Date().toISOString()
    })
    
    // Keep only last 50
    history = history.slice(0, 50)
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  },

  getContinueWatching() {
    const history = this.getWatchHistory()
    return history.filter(item => item.progress > 0 && item.progress < 90)
  },

  updateProgress(movieId, mediaType, progress) {
    let history = this.getWatchHistory()
    const index = history.findIndex(
      item => item.id === movieId && item.media_type === mediaType
    )
    
    if (index !== -1) {
      history[index].progress = progress
      history[index].watchedAt = new Date().toISOString()
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    }
  }
}
