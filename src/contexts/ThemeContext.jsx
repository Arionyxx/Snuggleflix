import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const themes = {
  cozy: {
    name: 'Cozy Pink',
    primary: '#ff6b9d',
    secondary: '#c06cff',
    accent: '#6cd8ff',
    bgStart: '#1a1a2e',
    bgMid: '#16213e',
    bgEnd: '#0f3460',
  },
  midnight: {
    name: 'Midnight Blue',
    primary: '#4a9eff',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    bgStart: '#0a0e27',
    bgMid: '#1a1f3a',
    bgEnd: '#0f1729',
  },
  sunset: {
    name: 'Sunset Orange',
    primary: '#ff6b35',
    secondary: '#f72585',
    accent: '#ffd60a',
    bgStart: '#2b2d42',
    bgMid: '#1a1b2e',
    bgEnd: '#0d0e1a',
  },
  forest: {
    name: 'Forest Green',
    primary: '#2ecc71',
    secondary: '#1abc9c',
    accent: '#3498db',
    bgStart: '#1a2a2e',
    bgMid: '#0f1b1f',
    bgEnd: '#0a1215',
  },
  lavender: {
    name: 'Lavender Dream',
    primary: '#b794f6',
    secondary: '#f093fb',
    accent: '#4facfe',
    bgStart: '#2d2a4a',
    bgMid: '#1e1b3a',
    bgEnd: '#13112a',
  },
  crimson: {
    name: 'Crimson Night',
    primary: '#e63946',
    secondary: '#a8dadc',
    accent: '#457b9d',
    bgStart: '#1d3557',
    bgMid: '#1a2b3f',
    bgEnd: '#0d1b2a',
  }
}

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('cozy')
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [cardStyle, setCardStyle] = useState('modern') // modern, classic, minimal

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('snuggleflix_theme')
    const savedAnimations = localStorage.getItem('snuggleflix_animations')
    const savedCardStyle = localStorage.getItem('snuggleflix_card_style')

    if (savedTheme) setCurrentTheme(savedTheme)
    if (savedAnimations !== null) setAnimationsEnabled(savedAnimations === 'true')
    if (savedCardStyle) setCardStyle(savedCardStyle)
  }, [])

  useEffect(() => {
    // Apply theme CSS variables
    const theme = themes[currentTheme]
    const root = document.documentElement

    root.style.setProperty('--primary-color', theme.primary)
    root.style.setProperty('--secondary-color', theme.secondary)
    root.style.setProperty('--accent-color', theme.accent)
    root.style.setProperty('--bg-start', theme.bgStart)
    root.style.setProperty('--bg-mid', theme.bgMid)
    root.style.setProperty('--bg-end', theme.bgEnd)
    root.style.setProperty('--animations-enabled', animationsEnabled ? '1' : '0')

    // Save to localStorage
    localStorage.setItem('snuggleflix_theme', currentTheme)
  }, [currentTheme])

  useEffect(() => {
    localStorage.setItem('snuggleflix_animations', animationsEnabled.toString())
    document.body.classList.toggle('no-animations', !animationsEnabled)
  }, [animationsEnabled])

  useEffect(() => {
    localStorage.setItem('snuggleflix_card_style', cardStyle)
    document.body.setAttribute('data-card-style', cardStyle)
  }, [cardStyle])

  const value = {
    currentTheme,
    setCurrentTheme,
    theme: themes[currentTheme],
    themes,
    animationsEnabled,
    setAnimationsEnabled,
    cardStyle,
    setCardStyle,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
