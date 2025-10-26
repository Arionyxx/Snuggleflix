import { useState, useEffect } from 'react'
import { X, Copy, Check, ExternalLink, Settings } from 'lucide-react'
import { getStreamUrl, getAlternativeStreamUrls } from '../services/api'
import { initRealDebridService, saveRealDebridToken, getRealDebridToken } from '../services/realDebrid'
import './VideoPlayer.css'

function VideoPlayer({ movie, onClose }) {
  const [currentSource, setCurrentSource] = useState('')
  const [sources, setSources] = useState([])
  const [copied, setCopied] = useState(false)
  const [showRdSetup, setShowRdSetup] = useState(false)
  const [rdToken, setRdToken] = useState('')
  const [rdConnected, setRdConnected] = useState(false)

  useEffect(() => {
    const defaultUrl = getStreamUrl(movie)
    const altSources = getAlternativeStreamUrls(movie)
    
    setCurrentSource(defaultUrl)
    setSources(altSources)

    // Check if Real-Debrid is connected
    const token = getRealDebridToken()
    if (token) {
      setRdToken(token)
      setRdConnected(true)
    }
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

  const handleRdSetup = () => {
    if (rdToken.trim()) {
      saveRealDebridToken(rdToken)
      setRdConnected(true)
      setShowRdSetup(false)
      // You can add additional verification here
    }
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

            <button 
              className={`action-btn rd-btn ${rdConnected ? 'connected' : ''}`}
              onClick={() => setShowRdSetup(!showRdSetup)}
            >
              <Settings size={20} />
              {rdConnected ? 'Real-Debrid Connected' : 'Setup Real-Debrid'}
            </button>
          </div>

          {showRdSetup && (
            <div className="rd-setup">
              <h3>Real-Debrid Setup</h3>
              <p>Enter your Real-Debrid API token to access premium links</p>
              <input
                type="text"
                placeholder="Enter your Real-Debrid API token"
                value={rdToken}
                onChange={(e) => setRdToken(e.target.value)}
                className="rd-input"
              />
              <div className="rd-buttons">
                <button onClick={handleRdSetup} className="rd-save-btn">
                  Save Token
                </button>
                <button onClick={() => setShowRdSetup(false)} className="rd-cancel-btn">
                  Cancel
                </button>
              </div>
              <p className="rd-help">
                Get your API token from: <a href="https://real-debrid.com/apitoken" target="_blank" rel="noopener noreferrer">real-debrid.com/apitoken</a>
              </p>
            </div>
          )}
        </div>

        <div className="player-info">
          <p className="info-text">
            <strong>Note:</strong> Free streaming sources may have ads or quality limitations. 
            Use Real-Debrid for premium, ad-free streaming.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
