<template>
  <div class="news-detail" v-if="news">
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
      Quay lại
    </button>

    <!-- Article Card -->
    <article class="article-card">
      <!-- Category Badge -->
      <div class="article-badge">
        <span class="category-badge">{{ news.category?.name || 'N/A' }}</span>
      </div>

      <!-- Title -->
      <h1 class="article-title">{{ news.title }}</h1>

      <!-- Meta Info -->
      <div class="article-meta">
        <div class="meta-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
        <div class="meta-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Content -->
      <div class="article-content">
        <p v-for="(paragraph, index) in formatContent(news.content)" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </article>

    <!-- Related Section -->
    <div class="related-section" v-if="relatedNews.length > 0">
      <h2>📖 Tin tức liên quan</h2>
      <div class="related-grid">
        <div
          v-for="related in relatedNews"
          :key="related._id"
          class="related-card"
          @click="viewNews(related._id)"
        >
          <span class="related-category">{{ related.category?.name }}</span>
          <h3>{{ related.title }}</h3>
          <p>{{ truncateText(related.content, 100) }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="loading">
    <div class="spinner"></div>
    <p>Đang tải...</p>
  </div>

  <!-- Error State -->
  <div v-else class="error-state">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <h2>Không tìm thấy tin tức</h2>
    <button @click="goBack" class="btn-primary">Quay lại</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { newsService } from '@/services/news.service'

const router = useRouter()
const route = useRoute()
const news = ref(null)
const relatedNews = ref([])
const loading = ref(true)

const loadNews = async () => {
  try {
    loading.value = true
    const id = route.params.id
    news.value = await newsService.getNewsById(id)

    // Load related news
    const allNews = await newsService.getAllNews()
    const allNewsList = allNews.news || allNews || []
    relatedNews.value = allNewsList
      .filter(
        (n) =>
          n._id !== news.value._id &&
          (n.category?._id === news.value.category?._id || n.category === news.value.category),
      )
      .slice(0, 3)
  } catch (error) {
    console.error('Error loading news:', error)
    news.value = null
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/')
}

const viewNews = (id) => {
  router.push(`/news/${id}`)
  // Reload for new news
  loadNews()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatContent = (content) => {
  if (!content) return []
  // Split by newlines or periods to create paragraphs
  return content.split(/\n+/).filter((p) => p.trim())
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

onMounted(() => {
  loadNews()
})
</script>

<style scoped>
.news-detail {
  max-width: 900px;
  margin: 0 auto;
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
  margin-bottom: 24px;
  font-size: 14px;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateX(-4px);
}

.article-card {
  background: white;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-badge {
  margin-bottom: 24px;
}

.category-badge {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.article-title {
  margin: 0 0 24px 0;
  font-size: 42px;
  color: #222;
  line-height: 1.3;
  font-weight: 800;
}

.article-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 15px;
}

.meta-item svg {
  color: #667eea;
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, transparent 100%);
  margin: 32px 0;
}

.article-content {
  font-size: 18px;
  line-height: 1.8;
  color: #444;
}

.article-content p {
  margin: 0 0 24px 0;
  text-align: justify;
}

.article-content p:last-child {
  margin-bottom: 0;
}

/* Related Section */
.related-section {
  margin-top: 60px;
  animation: fadeInUp 0.8s ease-out;
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

.related-section h2 {
  margin: 0 0 30px 0;
  font-size: 28px;
  color: #333;
  font-weight: 700;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.related-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.related-category {
  display: inline-block;
  padding: 4px 12px;
  background: #f093fb;
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.related-card h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

/* Loading State */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
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

/* Error State */
.error-state {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.error-state svg {
  color: #f5576c;
  margin-bottom: 24px;
}

.error-state h2 {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 28px;
}

.btn-primary {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .article-card {
    padding: 30px 24px;
  }

  .article-title {
    font-size: 28px;
  }

  .article-content {
    font-size: 16px;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
