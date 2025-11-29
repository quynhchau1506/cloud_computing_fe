<template>
  <div class="category-detail">
    <!-- Back Button -->
    <button @click="goBack" class="back-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Quay lại danh mục
    </button>

    <!-- Category Header -->
    <div v-if="category" class="category-header">
      <div class="category-icon">📂</div>
      <h1 class="category-title">{{ category.name }}</h1>
      <p class="category-description">
        {{ category.description || 'Khám phá tin tức trong danh mục này' }}
      </p>
    </div>

    <!-- News Grid -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải...</p>
    </div>

    <div v-else-if="filteredNews.length === 0" class="empty-state">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      <p>Chưa có tin tức trong danh mục này</p>
    </div>

    <div v-else class="news-grid">
      <article
        v-for="news in filteredNews"
        :key="news._id"
        class="news-card"
        @click="viewNews(news._id)"
      >
        <h2 class="news-card-title">{{ news.title }}</h2>

        <p class="news-card-excerpt">
          {{ truncateText(news.content, 150) }}
        </p>

        <div class="news-card-footer">
          <div class="author-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>{{ news.author }}</span>
          </div>
          <div class="date-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{{ formatDate(news.publishedDate) }}</span>
          </div>
        </div>

        <div class="news-card-action">
          <span class="read-more">Đọc thêm →</span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { newsService } from '@/services/news.service'
import { categoryService } from '@/services/category.service'

const router = useRouter()
const route = useRoute()
const category = ref(null)
const filteredNews = ref([])
const loading = ref(true)

const loadCategoryNews = async () => {
  try {
    loading.value = true
    const categoryId = route.params.id

    // Load category info
    category.value = await categoryService.getCategoryById(categoryId)

    // Load all news and filter by category
    const allNews = await newsService.getAllNews()
    const allNewsList = allNews.news || allNews || []

    filteredNews.value = allNewsList.filter(
      (news) => news.category?._id === categoryId || news.category === categoryId,
    )
  } catch (error) {
    console.error('Error loading category news:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/categories')
}

const viewNews = (id) => {
  router.push(`/news/${id}`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

onMounted(() => {
  loadCategoryNews()
})
</script>

<style scoped>
.category-detail {
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

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30px;
  font-size: 14px;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateX(-4px);
}

.category-header {
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

.category-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.category-title {
  margin: 0 0 16px 0;
  font-size: 42px;
  color: #333;
  font-weight: 700;
}

.category-description {
  margin: 0;
  font-size: 18px;
  color: #666;
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

/* News Grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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

.news-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.news-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.news-card:hover::before {
  transform: scaleX(1);
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.news-card-title {
  margin: 0 0 16px 0;
  font-size: 22px;
  color: #333;
  line-height: 1.4;
  font-weight: 700;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card-excerpt {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 15px;
  line-height: 1.7;
}

.news-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.author-info,
.date-info {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 13px;
}

.author-info svg,
.date-info svg {
  color: #667eea;
}

.news-card-action {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.news-card:hover .read-more {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .category-header {
    padding: 40px 24px;
  }

  .category-title {
    font-size: 32px;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>
