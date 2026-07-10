import axios from 'axios'

const apiBase = import.meta.env.VITE_API_URL
const isLocal = import.meta.env.DEV

const api = axios.create({
  baseURL: isLocal ? 'http://localhost:3001/api' : (apiBase || '/api'),
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('mingle_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mingle_token')
      if (!isLocal) window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
