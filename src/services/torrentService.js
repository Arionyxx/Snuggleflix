import WebTorrent from 'webtorrent'

class TorrentService {
  constructor() {
    this.client = null
    this.currentTorrent = null
  }

  initialize() {
    if (!this.client) {
      this.client = new WebTorrent()
    }
    return this.client
  }

  async addTorrent(magnetLink, onProgress) {
    this.initialize()

    return new Promise((resolve, reject) => {
      this.currentTorrent = this.client.add(magnetLink, (torrent) => {
        console.log('Torrent added:', torrent.name)

        // Find the largest video file
        const videoFile = torrent.files.find(file => {
          const ext = file.name.split('.').pop().toLowerCase()
          return ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)
        }) || torrent.files.reduce((largest, file) => 
          file.length > largest.length ? file : largest
        )

        torrent.on('download', () => {
          if (onProgress) {
            onProgress({
              progress: torrent.progress,
              downloadSpeed: torrent.downloadSpeed,
              uploadSpeed: torrent.uploadSpeed,
              numPeers: torrent.numPeers,
              downloaded: torrent.downloaded,
              total: torrent.length,
              timeRemaining: torrent.timeRemaining,
            })
          }
        })

        torrent.on('error', (err) => {
          console.error('Torrent error:', err)
          reject(err)
        })

        resolve({
          torrent,
          videoFile,
          magnetLink,
        })
      })
    })
  }

  getStreamUrl(file) {
    if (!file) return null
    
    // Create blob URL for the file
    return new Promise((resolve) => {
      file.getBlobURL((err, url) => {
        if (err) {
          console.error('Error getting blob URL:', err)
          resolve(null)
        } else {
          resolve(url)
        }
      })
    })
  }

  async renderToVideoElement(file, videoElement) {
    if (!file || !videoElement) return

    file.renderTo(videoElement, {
      autoplay: true,
      controls: true,
    })
  }

  stopTorrent() {
    if (this.currentTorrent) {
      this.currentTorrent.destroy()
      this.currentTorrent = null
    }
  }

  destroy() {
    if (this.client) {
      this.client.destroy()
      this.client = null
    }
  }

  // Search for torrents (using external APIs)
  async searchTorrents(query) {
    // This would integrate with torrent search APIs
    // For now, returning empty as it needs external API
    console.log('Searching for:', query)
    return []
  }

  // Get magnet link for a movie/show
  async getMagnetLink(imdbId, title, year) {
    // This would use YTS API or similar
    // Placeholder for now
    console.log('Getting magnet for:', title, year)
    return null
  }
}

export const torrentService = new TorrentService()

// Helper to format bytes
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper to format speed
export function formatSpeed(bytesPerSecond) {
  return formatBytes(bytesPerSecond) + '/s'
}

// Helper to format time
export function formatTime(seconds) {
  if (!seconds || seconds === Infinity) return 'calculating...'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}
