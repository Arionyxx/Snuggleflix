import { useState, useEffect } from 'react'
import { X, Copy, Check, ExternalLink } from 'lucide-react'
import { getStreamUrl, getAlternativeStreamUrls } from '../services/api'
import './VideoPlayer.css'

function VideoPlayer({ movie, onClose }) {
  const [currentSource, setCurrentSource] = useState('')
  const [sources, setSources] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Scroll to top when video player opens
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    const defaultUrl = getStreamUrl(movie)
    const altSources = getAlternativeStreamUrls(movie)
    
    setCurrentSource(defaultUrl)
    setSources(altSources)
  }, [movie])

  const copyStreamUrl = () => {
    navigator.clipboard.writeText(currentSource)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openInNewTab = () => {
    window.open(currentSource, '_blank')
  }

  const handleSourceChange = (source) => {
    setCurrentSource(source.url)
  }

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        <div className="player-header">
          <h2 className="player-title">{movie.title || movie.name}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        <div className="player-content">
          <iframe
            src={currentSource}
            className="video-iframe"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            title={movie.title || movie.name}
          />
        </div>

        <div className="player-controls">
          <div className="source-selector">
            <label>Streaming Source:</label>
            <div className="source-buttons">
              {sources.map((source, index) => (
                <button
                  key={index}
                  className={`source-btn ${currentSource === source.url ? 'active' : ''}`}
                  onClick={() => handleSourceChange(source)}
                >
                  {source.name}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn" onClick={copyStreamUrl}>
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy Stream URL'}
            </button>
            
            <button className="action-btn" onClick={openInNewTab}>
              <ExternalLink size={20} />
              Open in New Tab
            </button>
          </div>
        </div>

        <div className="player-info">
          <p className="info-text">
            <strong>Note:</strong> Free streaming sources may have ads or quality limitations. 
            Try different sources if one doesn't work.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
