import api from '@/utils/axios'

export const categoryService = {
  // User APIs
  async getAllCategories() {
    try {
      const response = await api.get('/user/categories')
      console.log('📂 Categories API Response:', response.data)

      // Backend trả về: { data: [...] }
      return response.data.data || []
    } catch (error) {
      console.error('❌ Error fetching categories:', error)
      return []
    }
  },

  async getCategoryById(id) {
    try {
      const response = await api.get(`/user/categories/${id}`)
      console.log('📁 Category Detail Response:', response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error('❌ Error fetching category detail:', error)
      throw error
    }
  },

  // Admin APIs
  async createCategory(data) {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description || '')
      
      // Append image if exists
      if (data.image) {
        formData.append('image', data.image)
      }

      const response = await api.post('/admin/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('✅ Category Created:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error creating category:', error)
      throw error
    }
  },

  async updateCategory(id, data) {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description || '')
      
      // Append image if new image selected
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }

      const response = await api.put(`/admin/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('✅ Category Updated:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error updating category:', error)
      throw error
    }
  },

  async deleteCategory(id) {
    try {
      const response = await api.delete(`/admin/categories/${id}`)
      console.log('✅ Category Deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error deleting category:', error)
      throw error
    }
  },
}
