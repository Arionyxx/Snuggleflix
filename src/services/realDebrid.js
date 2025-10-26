import axios from 'axios'

/**
 * Real-Debrid API Integration
 * Users need to add their Real-Debrid API token in settings
 */

const RD_API_BASE = 'https://api.real-debrid.com/rest/1.0'

export class RealDebridService {
  constructor(apiToken) {
    this.apiToken = apiToken
    this.headers = {
      'Authorization': `Bearer ${apiToken}`
    }
  }

  // Check if user is authenticated
  async checkAuth() {
    try {
      const response = await axios.get(`${RD_API_BASE}/user`, {
        headers: this.headers
      })
      return response.data
    } catch (error) {
      console.error('Real-Debrid auth error:', error)
      return null
    }
  }

  // Unrestrict a link (convert to direct download/stream link)
  async unrestrictLink(link) {
    try {
      const response = await axios.post(
        `${RD_API_BASE}/unrestrict/link`,
        { link },
        { headers: this.headers }
      )
      return response.data
    } catch (error) {
      console.error('Error unrestricting link:', error)
      throw error
    }
  }

  // Add a torrent/magnet
  async addMagnet(magnetLink) {
    try {
      const response = await axios.post(
        `${RD_API_BASE}/torrents/addMagnet`,
        { magnet: magnetLink },
        { headers: this.headers }
      )
      return response.data
    } catch (error) {
      console.error('Error adding magnet:', error)
      throw error
    }
  }

  // Get torrent info
  async getTorrentInfo(torrentId) {
    try {
      const response = await axios.get(
        `${RD_API_BASE}/torrents/info/${torrentId}`,
        { headers: this.headers }
      )
      return response.data
    } catch (error) {
      console.error('Error getting torrent info:', error)
      throw error
    }
  }

  // Select files from torrent
  async selectFiles(torrentId, fileIds = 'all') {
    try {
      const response = await axios.post(
        `${RD_API_BASE}/torrents/selectFiles/${torrentId}`,
        { files: fileIds },
        { headers: this.headers }
      )
      return response.data
    } catch (error) {
      console.error('Error selecting files:', error)
      throw error
    }
  }

  // Get available torrents
  async getTorrents() {
    try {
      const response = await axios.get(`${RD_API_BASE}/torrents`, {
        headers: this.headers
      })
      return response.data
    } catch (error) {
      console.error('Error getting torrents:', error)
      return []
    }
  }
}

// Helper to store/retrieve API token
export const saveRealDebridToken = (token) => {
  localStorage.setItem('rd_api_token', token)
}

export const getRealDebridToken = () => {
  return localStorage.getItem('rd_api_token')
}

export const clearRealDebridToken = () => {
  localStorage.removeItem('rd_api_token')
}

// Initialize service with stored token
export const initRealDebridService = () => {
  const token = getRealDebridToken()
  if (token) {
    return new RealDebridService(token)
  }
  return null
}
