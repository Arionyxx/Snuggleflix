// User Profile Management Service

const PROFILES_KEY = 'snuggleflix_profiles'
const ACTIVE_PROFILE_KEY = 'snuggleflix_active_profile'

export const avatars = [
  { id: 1, emoji: '🎬', name: 'Movie Lover' },
  { id: 2, emoji: '🍿', name: 'Popcorn' },
  { id: 3, emoji: '🎭', name: 'Drama' },
  { id: 4, emoji: '🎪', name: 'Fun' },
  { id: 5, emoji: '🌟', name: 'Star' },
  { id: 6, emoji: '💖', name: 'Heart' },
  { id: 7, emoji: '🎨', name: 'Artistic' },
  { id: 8, emoji: '🎮', name: 'Gamer' },
  { id: 9, emoji: '🐱', name: 'Cat' },
  { id: 10, emoji: '🐶', name: 'Dog' },
  { id: 11, emoji: '🦄', name: 'Unicorn' },
  { id: 12, emoji: '🚀', name: 'Space' },
  { id: 13, emoji: '🌈', name: 'Rainbow' },
  { id: 14, emoji: '⚡', name: 'Electric' },
  { id: 15, emoji: '🔥', name: 'Fire' },
  { id: 16, emoji: '❄️', name: 'Ice' },
  { id: 17, emoji: '🌙', name: 'Moon' },
  { id: 18, emoji: '☀️', name: 'Sun' },
]

export const profileService = {
  // Get all profiles
  getProfiles() {
    const profiles = localStorage.getItem(PROFILES_KEY)
    if (!profiles) {
      // Create default profile
      const defaultProfile = this.createDefaultProfile()
      this.saveProfiles([defaultProfile])
      return [defaultProfile]
    }
    return JSON.parse(profiles)
  },

  // Get active profile
  getActiveProfile() {
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY)
    const profiles = this.getProfiles()
    
    if (!activeId) {
      const profile = profiles[0]
      this.setActiveProfile(profile.id)
      return profile
    }
    
    return profiles.find(p => p.id === activeId) || profiles[0]
  },

  // Set active profile
  setActiveProfile(profileId) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId)
  },

  // Create new profile
  createProfile(name, avatar, isKid = false) {
    const profiles = this.getProfiles()
    const newProfile = {
      id: Date.now().toString(),
      name,
      avatar,
      isKid,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'cozy',
        cardStyle: 'modern',
        animationsEnabled: true,
        autoplay: true,
        quality: 'auto',
        language: 'en',
      },
      watchlist: [],
      history: [],
      playlists: [],
    }
    
    profiles.push(newProfile)
    this.saveProfiles(profiles)
    return newProfile
  },

  // Update profile
  updateProfile(profileId, updates) {
    const profiles = this.getProfiles()
    const index = profiles.findIndex(p => p.id === profileId)
    
    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...updates }
      this.saveProfiles(profiles)
      return profiles[index]
    }
    return null
  },

  // Delete profile
  deleteProfile(profileId) {
    const profiles = this.getProfiles()
    const filtered = profiles.filter(p => p.id !== profileId)
    
    if (filtered.length === 0) {
      // Don't allow deleting last profile
      return false
    }
    
    this.saveProfiles(filtered)
    
    // If deleted profile was active, switch to first profile
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY)
    if (activeId === profileId) {
      this.setActiveProfile(filtered[0].id)
    }
    
    return true
  },

  // Save profiles
  saveProfiles(profiles) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  },

  // Create default profile
  createDefaultProfile() {
    return {
      id: 'default',
      name: 'Me',
      avatar: avatars[0],
      isKid: false,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'cozy',
        cardStyle: 'modern',
        animationsEnabled: true,
        autoplay: true,
        quality: 'auto',
        language: 'en',
      },
      watchlist: [],
      history: [],
      playlists: [],
    }
  },

  // Get profile preferences
  getPreferences(profileId) {
    const profile = this.getProfiles().find(p => p.id === profileId)
    return profile?.preferences || this.createDefaultProfile().preferences
  },

  // Update profile preferences
  updatePreferences(profileId, preferences) {
    const profiles = this.getProfiles()
    const index = profiles.findIndex(p => p.id === profileId)
    
    if (index !== -1) {
      profiles[index].preferences = { ...profiles[index].preferences, ...preferences }
      this.saveProfiles(profiles)
      return profiles[index].preferences
    }
    return null
  },

  // Merge with existing user service data
  migrateFromUserService() {
    const watchlist = localStorage.getItem('snuggleflix_watchlist')
    const history = localStorage.getItem('snuggleflix_history')
    
    if (watchlist || history) {
      const profile = this.getActiveProfile()
      if (watchlist) profile.watchlist = JSON.parse(watchlist)
      if (history) profile.history = JSON.parse(history)
      this.updateProfile(profile.id, profile)
    }
  }
}
