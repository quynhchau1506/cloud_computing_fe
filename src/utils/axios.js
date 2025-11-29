import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// Tạo instance axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor: tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      // Kiểm tra token còn hạn không
      try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000

        if (decoded.exp < currentTime) {
          // Token hết hạn
          localStorage.removeItem('token')
          localStorage.removeItem('admin')
          window.location.href = '/admin/login'
          return Promise.reject(new Error('Token expired'))
        }

        config.headers.Authorization = `Bearer ${token}`
      } catch (error) {
        console.error('Invalid token:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('admin')
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor: xử lý response
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - xóa token và redirect
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
