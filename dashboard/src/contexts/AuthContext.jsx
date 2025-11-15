import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('pushbunny_api_key'))
  const [isAuthenticated, setIsAuthenticated] = useState(!!apiKey)

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('pushbunny_api_key', apiKey)
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('pushbunny_api_key')
      setIsAuthenticated(false)
    }
  }, [apiKey])

  const login = (key) => {
    setApiKey(key)
  }

  const logout = () => {
    setApiKey(null)
  }

  return (
    <AuthContext.Provider value={{ apiKey, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
