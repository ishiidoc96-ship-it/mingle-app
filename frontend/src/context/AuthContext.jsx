import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('mingle_token')
    if (token) {
      api.get('/auth/me').then(res => {
        setUser(res.data.user)
      }).catch(() => {
        localStorage.removeItem('mingle_token')
      }).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password })
    localStorage.setItem('mingle_token', res.data.token)
    if (res.data.user?.id) localStorage.setItem('mingle_userId', res.data.user.id)
    setUser(res.data.user)
    return res.data
  }

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('mingle_token', res.data.token)
    if (res.data.user?.id) localStorage.setItem('mingle_userId', res.data.user.id)
    setUser(res.data.user)
    return res.data
  }

  const updateProfile = async (data) => {
    const res = await api.put('/auth/me', data)
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('mingle_token')
    localStorage.removeItem('mingle_userId')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
