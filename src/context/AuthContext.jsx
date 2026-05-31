import { createContext, useState, useCallback, useEffect } from 'react'
import * as authService from '../lib/services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored && token) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const result = await authService.login(email, password)
      setUser(result.user)
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('token', result.token)
      return result
    } catch (err) {
      throw err.response?.data || err
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    const result = await authService.register(name, email, password)
    setUser(result.user)
    localStorage.setItem('user', JSON.stringify(result.user))
    if (result.token) localStorage.setItem('token', result.token)
    return result
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const result = await authService.loginWithGoogle()
    if (result?.url) {
      window.location.href = result.url
    }
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
