<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card">
        <div
          class="stat-icon"
          style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3>Tổng tin tức</h3>
          <p class="stat-number">{{ stats.totalNews }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div
          class="stat-icon"
          style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
          >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </div>
        <div class="stat-content">
          <h3>Danh mục</h3>
          <p class="stat-number">{{ stats.totalCategories }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div
          class="stat-icon"
          style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3>Tin mới hôm nay</h3>
          <p class="stat-number">{{ stats.todayNews }}</p>
        </div>
      </div>
    </div>

    <div class="recent-section">
      <div class="section-header">
        <h2>📄 Tin tức gần đây</h2>
        <router-link to="/admin/news" class="view-all-btn">Xem tất cả →</router-link>
      </div>

      <div v-if="loading" class="loading">Đang tải...</div>

      <div v-else-if="recentNews.length === 0" class="empty-state">
        <p>Chưa có tin tức nào</p>
      </div>

      <div v-else class="news-table">
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Tác giả</th>
              <th>Ngày đăng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="news in recentNews" :key="news._id">
              <td class="title-cell">{{ news.title }}</td>
              <td>
                <span class="category-badge">{{ news.category?.name || 'N/A' }}</span>
              </td>
              <td>{{ news.author }}</td>
              <td>{{ formatDate(news.publishedDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { newsService } from '@/services/news.service'
import { categoryService } from '@/services/category.service'

const stats = ref({
  totalNews: 0,
  totalCategories: 0,
  todayNews: 0,
})

const recentNews = ref([])
const loading = ref(true)

const loadDashboardData = async () => {
  try {
    loading.value = true

    const [newsData, categoriesData] = await Promise.all([
      newsService.getAllNews({ limit: 5 }),
      categoryService.getAllCategories(),
    ])

    console.log('📊 Dashboard - News:', newsData)
    console.log('📂 Dashboard - Categories:', categoriesData)

    // Service đã trả về array
    recentNews.value = Array.isArray(newsData) ? newsData : []
    stats.value.totalNews = recentNews.value.length
    stats.value.totalCategories = Array.isArray(categoriesData) ? categoriesData.length : 0

    // Count today's news
    const today = new Date().toDateString()
    stats.value.todayNews = recentNews.value.filter(
      (news) => new Date(news.publishedDate).toDateString() === today,
    ).length

    console.log('✅ Dashboard stats:', stats.value)
  } catch (error) {
    console.error('❌ Error loading dashboard:', error)
    recentNews.value = []
    stats.value = { totalNews: 0, totalCategories: 0, todayNews: 0 }
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
}

.stat-card:hover {
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

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-number {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.recent-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.6s ease-out;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.view-all-btn {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.3s ease;
}

.view-all-btn:hover {
  color: #764ba2;
}

.loading,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.news-table {
  overflow-x: auto;
}

.news-table table {
  width: 100%;
  border-collapse: collapse;
}

.news-table thead {
  background: #f8f9fa;
}

.news-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.news-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
}

.news-table tbody tr {
  transition: background 0.2s ease;
}

.news-table tbody tr:hover {
  background: #f8f9fa;
}

.title-cell {
  font-weight: 500;
  color: #333;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}
</style>
