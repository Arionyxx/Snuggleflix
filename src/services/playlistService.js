// Playlist Management Service

export const playlistService = {
  // Create new playlist
  createPlaylist(profileId, name, description = '', isPublic = false) {
    return {
      id: Date.now().toString(),
      profileId,
      name,
      description,
      isPublic,
      movies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: null,
    }
  },

  // Get all playlists for profile
  getPlaylists(profile) {
    return profile?.playlists || []
  },

  // Get playlist by ID
  getPlaylist(profile, playlistId) {
    return profile?.playlists?.find(p => p.id === playlistId)
  },

  // Add playlist to profile
  addPlaylist(profile, playlist) {
    if (!profile.playlists) profile.playlists = []
    profile.playlists.push(playlist)
    return profile
  },

  // Update playlist
  updatePlaylist(profile, playlistId, updates) {
    const index = profile.playlists?.findIndex(p => p.id === playlistId)
    if (index !== -1) {
      profile.playlists[index] = {
        ...profile.playlists[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
    return profile
  },

  // Delete playlist
  deletePlaylist(profile, playlistId) {
    if (profile.playlists) {
      profile.playlists = profile.playlists.filter(p => p.id !== playlistId)
    }
    return profile
  },

  // Add movie to playlist
  addMovieToPlaylist(profile, playlistId, movie) {
    const playlist = this.getPlaylist(profile, playlistId)
    if (playlist) {
      // Check if already in playlist
      const exists = playlist.movies.some(m => m.id === movie.id && m.media_type === movie.media_type)
      if (!exists) {
        playlist.movies.push({
          id: movie.id,
          media_type: movie.media_type,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date || movie.first_air_date,
          addedAt: new Date().toISOString()
        })
        
        // Update thumbnail to first movie if not set
        if (!playlist.thumbnail && movie.poster_path) {
          playlist.thumbnail = movie.poster_path
        }
        
        this.updatePlaylist(profile, playlistId, playlist)
      }
    }
    return profile
  },

  // Remove movie from playlist
  removeMovieFromPlaylist(profile, playlistId, movieId, mediaType) {
    const playlist = this.getPlaylist(profile, playlistId)
    if (playlist) {
      playlist.movies = playlist.movies.filter(
        m => !(m.id === movieId && m.media_type === mediaType)
      )
      this.updatePlaylist(profile, playlistId, playlist)
    }
    return profile
  },

  // Reorder movies in playlist
  reorderPlaylist(profile, playlistId, fromIndex, toIndex) {
    const playlist = this.getPlaylist(profile, playlistId)
    if (playlist && playlist.movies) {
      const [removed] = playlist.movies.splice(fromIndex, 1)
      playlist.movies.splice(toIndex, 0, removed)
      this.updatePlaylist(profile, playlistId, playlist)
    }
    return profile
  },

  // Get default playlists
  getDefaultPlaylists() {
    return [
      {
        id: 'favorites',
        name: 'Favorites',
        description: 'My favorite movies and shows',
        isPublic: false,
        movies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: null,
        isDefault: true,
      },
      {
        id: 'watch-later',
        name: 'Watch Later',
        description: 'Movies I want to watch',
        isPublic: false,
        movies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: null,
        isDefault: true,
      }
    ]
  },

  // Export playlist (for sharing)
  exportPlaylist(playlist) {
    return {
      name: playlist.name,
      description: playlist.description,
      movies: playlist.movies.map(m => ({
        id: m.id,
        media_type: m.media_type,
        title: m.title
      }))
    }
  },

  // Import playlist
  importPlaylist(profileId, playlistData) {
    const playlist = this.createPlaylist(
      profileId,
      playlistData.name,
      playlistData.description,
      false
    )
    playlist.movies = playlistData.movies.map(m => ({
      ...m,
      addedAt: new Date().toISOString()
    }))
    return playlist
  }
}
