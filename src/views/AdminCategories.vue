<template>
  <div class="admin-categories">
    <div class="page-header">
      <div>
        <h2>📂 Quản lý Danh mục</h2>
        <p>Tạo và quản lý các danh mục tin tức</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Thêm danh mục mới
      </button>
    </div>

    <!-- Categories List -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải...</p>
    </div>

    <div v-else-if="categories.length === 0" class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
      >
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
      </svg>
      <p>Chưa có danh mục nào</p>
      <button @click="showCreateModal = true" class="btn-secondary">Tạo danh mục đầu tiên</button>
    </div>

    <div v-else class="categories-grid">
      <div v-for="category in categories" :key="category._id" class="category-card">
        <div class="category-header">
          <div class="category-icon">📂</div>
          <div class="category-actions">
            <button @click="editCategory(category)" class="btn-icon" title="Chỉnh sửa">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
            <button @click="confirmDelete(category)" class="btn-icon btn-danger" title="Xóa">
              🗑️
            </button>
          </div>
        </div>
        <h3 class="category-name">{{ category.name }}</h3>
        <p class="category-description">{{ category.description || 'Không có mô tả' }}</p>
        <div class="category-footer">
          <span class="category-date"> 📅 {{ formatDate(category.createdAt) }} </span>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingCategory" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingCategory ? '✏️ Chỉnh sửa danh mục' : '➕ Thêm danh mục mới' }}</h3>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>

        <form @submit.prevent="handleSubmit" class="modal-body">
          <div v-if="error" class="error-message">{{ error }}</div>

          <div class="form-group">
            <label>Tên danh mục *</label>
            <input type="text" v-model="formData.name" placeholder="Nhập tên danh mục" required />
          </div>

          <div class="form-group">
            <label>Mô tả</label>
            <textarea
              v-model="formData.description"
              placeholder="Nhập mô tả cho danh mục (tùy chọn)"
              rows="4"
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn-secondary">Hủy</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Đang lưu...' : editingCategory ? 'Cập nhật' : 'Tạo mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deletingCategory" class="modal-overlay" @click.self="deletingCategory = null">
      <div class="modal modal-small">
        <div class="modal-header">
          <h3>⚠️ Xác nhận xóa</h3>
        </div>
        <div class="modal-body">
          <p>
            Bạn có chắc chắn muốn xóa danh mục "<strong>{{ deletingCategory.name }}</strong
            >"?
          </p>
          <p style="color: #f5576c; font-size: 14px">
            Lưu ý: Các tin tức thuộc danh mục này sẽ không bị xóa.
          </p>
        </div>
        <div class="modal-footer">
          <button @click="deletingCategory = null" class="btn-secondary">Hủy</button>
          <button @click="handleDelete" class="btn-danger" :disabled="submitting">
            {{ submitting ? 'Đang xóa...' : 'Xóa' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoryService } from '@/services/category.service'

const categories = ref([])
const loading = ref(true)
const showCreateModal = ref(false)
const editingCategory = ref(null)
const deletingCategory = ref(null)
const submitting = ref(false)
const error = ref('')

const formData = ref({
  name: '',
  description: '',
})

const loadCategories = async () => {
  try {
    loading.value = true
    categories.value = await categoryService.getAllCategories()
  } finally {
    loading.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  formData.value = {
    name: category.name,
    description: category.description || '',
  }
}

const confirmDelete = (category) => {
  deletingCategory.value = category
}

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  try {
    if (editingCategory.value) {
      await categoryService.updateCategory(editingCategory.value._id, formData.value)
    } else {
      await categoryService.createCategory(formData.value)
    }
    closeModal()
    loadCategories()
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra'
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  submitting.value = true
  try {
    await categoryService.deleteCategory(deletingCategory.value._id)
    deletingCategory.value = null
    loadCategories()
  } catch {
    alert('Có lỗi xảy ra khi xóa danh mục')
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingCategory.value = null
  formData.value = {
    name: '',
    description: '',
  }
  error.value = ''
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.admin-categories {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
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

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
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
  padding: 12px 24px;
  background: #f5f7fa;
  color: #333;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-danger {
  padding: 12px 24px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-state svg {
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state p {
  color: #666;
  margin: 16px 0 24px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.category-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-icon {
  font-size: 32px;
}

.category-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.btn-icon:hover {
  background: #e0e0e0;
  transform: scale(1.1);
  color: #333;
}

.btn-icon.btn-danger {
  color: #f5576c;
}

.btn-icon.btn-danger:hover {
  background: #ffe0e0;
  color: #dc3545;
}

.category-name {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.category-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  min-height: 42px;
}

.category-footer {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.category-date {
  font-size: 13px;
  color: #999;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUpModal 0.3s ease-out;
}

.modal-small {
  max-width: 450px;
}

@keyframes slideUpModal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.btn-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border: none;
  border-radius: 8px;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #e0e0e0;
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  border: 1px solid #fcc;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
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
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
