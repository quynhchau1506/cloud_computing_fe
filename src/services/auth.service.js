import api from '@/utils/axios'

export const authService = {
  async login(username, password) {
    const response = await api.post('/admin/login', { username, password })
    // Backend trả về accessToken
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('admin', JSON.stringify(response.data.admin))
    }
    return response.data
  },

  async register(username, password) {
    const response = await api.post('/admin/register', { username, password })
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getAdmin() {
    const admin = localStorage.getItem('admin')
    return admin ? JSON.parse(admin) : null
  },
}
