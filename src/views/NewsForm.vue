<template>
  <div class="news-form-page">
    <div class="page-header">
      <div class="header-left">
        <button @click="goBack" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Quay lại
        </button>
        <div>
          <h2>{{ isEdit ? '✏️ Chỉnh sửa tin tức' : '➕ Thêm tin tức mới' }}</h2>
          <p>{{ isEdit ? 'Cập nhật thông tin tin tức' : 'Tạo tin tức mới cho website' }}</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <form @submit.prevent="handleSubmit" class="news-form">
      <div class="form-section">
        <h3>Thông tin cơ bản</h3>
        
        <div class="form-group">
          <label>Tiêu đề *</label>
          <input
            type="text"
            v-model="formData.title"
            placeholder="Nhập tiêu đề tin tức"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Tác giả *</label>
            <input type="text" v-model="formData.author" placeholder="Tên tác giả" required />
          </div>

          <div class="form-group">
            <label>Danh mục *</label>
            <select v-model="formData.category" required>
              <option value="">Chọn danh mục</option>
              <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Nội dung *</h3>
        <CkEditorComponent
          v-model="formData.content"
          :data="formData.content"
        />
      </div>

      <div class="form-actions">
        <button type="button" @click="goBack" class="btn-secondary">Hủy</button>
        <button type="submit" class="btn-primary" :disabled="submitting">
          <span v-if="submitting">Đang lưu...</span>
          <span v-else>{{ isEdit ? 'Cập nhật' : 'Tạo mới' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { newsService } from '@/services/news.service'
import { categoryService } from '@/services/category.service'
import CkEditorComponent from '@/components/ckeditor/CkEditorComponent.vue'

const router = useRouter()
const route = useRoute()

const categories = ref([])
const submitting = ref(false)
const error = ref('')

const formData = ref({
  title: '',
  content: '',
  author: '',
  category: '',
})

const isEdit = computed(() => !!route.params.id)

const loadCategories = async () => {
  try {
    categories.value = await categoryService.getAllCategories()
  } catch (err) {
    console.error('Error loading categories:', err)
  }
}

const loadNews = async () => {
  if (!isEdit.value) return
  
  try {
    const news = await newsService.getNewsById(route.params.id)
    formData.value = {
      title: news.title,
      content: news.content,
      author: news.author,
      category: news.category?._id || news.category,
    }
  } catch (err) {
    error.value = 'Không thể tải thông tin tin tức'
    console.error('Error loading news:', err)
  }
}

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  try {
    if (isEdit.value) {
      await newsService.updateNews(route.params.id, formData.value)
    } else {
      await newsService.createNews(formData.value)
    }
    router.push('/admin/news')
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra'
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push('/admin/news')
}

onMounted(() => {
  loadCategories()
  loadNews()
})
</script>

<style scoped>
.news-form-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 30px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f5f7fa;
  color: #333;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-back:hover {
  background: #e0e0e0;
  transform: translateX(-4px);
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  border: 1px solid #fcc;
}

.news-form {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.form-section {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 12px 32px;
  background: #f5f7fa;
  color: #333;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

@media (max-width: 768px) {
  .news-form-page {
    padding: 16px;
  }

  .header-left {
    flex-direction: column;
    gap: 12px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-section {
    padding: 16px;
  }

  .form-actions {
    padding: 16px;
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>

