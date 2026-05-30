import { createContext, useState, useCallback, useEffect } from 'react'
import { mockLogin, mockRegister, mockGoogleAuth } from '../lib/mockData'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const result = await mockLogin(email, password)
    setUser(result.user)
    localStorage.setItem('user', JSON.stringify(result.user))
    return result
  }, [])

  const register = useCallback(async (name, email, password) => {
    const result = await mockRegister(name, email, password)
    setUser(result.user)
    localStorage.setItem('user', JSON.stringify(result.user))
    return result
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const result = await mockGoogleAuth()
    return result
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}
