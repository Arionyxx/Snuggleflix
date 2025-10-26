import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const themes = {
  netflix: {
    name: 'Netflix Classic',
    primary: '#e50914',
    secondary: '#b20710',
    accent: '#ffffff',
    bgStart: '#141414',
    bgMid: '#1a1a1a',
    bgEnd: '#0a0a0a',
  },
  cozy: {
    name: 'Cozy Soft',
    primary: '#e91e63',
    secondary: '#9c27b0',
    accent: '#03a9f4',
    bgStart: '#1a1a1a',
    bgMid: '#212121',
    bgEnd: '#121212',
  },
  dark: {
    name: 'Pure Dark',
    primary: '#ffffff',
    secondary: '#e0e0e0',
    accent: '#bb86fc',
    bgStart: '#000000',
    bgMid: '#121212',
    bgEnd: '#000000',
  },
  prime: {
    name: 'Prime Video',
    primary: '#00a8e1',
    secondary: '#1a98ff',
    accent: '#232f3e',
    bgStart: '#0f171e',
    bgMid: '#1a242f',
    bgEnd: '#0a0e13',
  },
  hulu: {
    name: 'Hulu Green',
    primary: '#1ce783',
    secondary: '#0b4a2a',
    accent: '#ffffff',
    bgStart: '#0b0f0e',
    bgMid: '#151d19',
    bgEnd: '#0a0e0c',
  },
  disney: {
    name: 'Disney Plus',
    primary: '#0063e5',
    secondary: '#0483ee',
    accent: '#f9f9f9',
    bgStart: '#040714',
    bgMid: '#0d1117',
    bgEnd: '#020408',
  },

}

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('netflix')
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
