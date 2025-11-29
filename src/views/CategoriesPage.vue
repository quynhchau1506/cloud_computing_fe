<template>
  <div class="categories-page">
    <h1 class="page-title">📂 Danh mục tin tức</h1>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải...</p>
    </div>

    <!-- Empty State -->
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
    </div>

    <!-- Categories Grid -->
    <div v-else class="categories-grid">
      <div
        v-for="category in categories"
        :key="category._id"
        class="category-card"
        @click="viewCategory(category._id)"
      >
        <div class="category-icon">📂</div>
        <h2 class="category-name">{{ category.name }}</h2>
        <p class="category-description">
          {{ category.description || 'Khám phá tin tức trong danh mục này' }}
        </p>
        <div class="category-footer">
          <span class="view-link">Xem tin tức →</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoryService } from '@/services/category.service'

const router = useRouter()
const categories = ref([])
const loading = ref(true)

const loadCategories = async () => {
  try {
    loading.value = true
    categories.value = await categoryService.getAllCategories()
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    loading.value = false
  }
}

const viewCategory = (id) => {
  router.push(`/categories/${id}`)
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.categories-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.page-title {
  text-align: center;
  font-size: 42px;
  color: #333;
  margin: 0 0 50px 0;
  font-weight: 700;
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #666;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0f0f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.empty-state svg {
  color: #ccc;
  margin-bottom: 20px;
}

.empty-state p {
  color: #666;
  font-size: 18px;
  margin: 0;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  animation: fadeInUp 0.7s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.category-card:hover::before {
  transform: scaleX(1);
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

.category-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.category-card:hover .category-icon {
  animation: none;
  transform: scale(1.1);
}

.category-name {
  margin: 0 0 16px 0;
  font-size: 26px;
  color: #333;
  font-weight: 700;
}

.category-description {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  min-height: 48px;
}

.category-footer {
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.view-link {
  color: #667eea;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  display: inline-block;
}

.category-card:hover .view-link {
  transform: translateX(8px);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
    margin-bottom: 30px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
