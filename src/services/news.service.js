import api from '@/utils/axios'

export const newsService = {
  // User APIs
  async getAllNews(params = {}) {
    try {
      const response = await api.get('/user/news', { params })
      console.log('📰 News API Response:', response.data)

      // Backend trả về: { data: [...] }
      return response.data.data || []
    } catch (error) {
      console.error('❌ Error fetching news:', error)
      return []
    }
  },

  async getNewsById(id) {
    try {
      const response = await api.get(`/user/news/${id}`)
      console.log('📄 News Detail Response:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ Error fetching news detail:', error)
      throw error
    }
  },

  // Admin APIs
  async createNews(data) {
    try {
      const response = await api.post('/admin/news', data)
      console.log('✅ News Created:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error creating news:', error)
      throw error
    }
  },

  async updateNews(id, data) {
    try {
      const response = await api.put(`/admin/news/${id}`, data)
      console.log('✅ News Updated:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error updating news:', error)
      throw error
    }
  },

  async deleteNews(id) {
    try {
      const response = await api.delete(`/admin/news/${id}`)
      console.log('✅ News Deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error deleting news:', error)
      throw error
    }
  },
}
