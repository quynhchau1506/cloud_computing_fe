<template>
  <div class="user-site">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <router-link to="/" class="logo">
            <span class="logo-icon">📰</span>
            <span class="logo-text">News Portal</span>
          </router-link>

          <nav class="nav">
            <router-link to="/" class="nav-link" active-class="active">Trang chủ</router-link>
            <router-link to="/categories" class="nav-link" active-class="active"
              >Danh mục</router-link
            >
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>📰 News Portal</h3>
            <p>Nền tảng tin tức đáng tin cậy</p>
          </div>
          <div class="footer-section">
            <h4>Liên kết</h4>
            <ul>
              <li><router-link to="/">Trang chủ</router-link></li>
              <li><router-link to="/categories">Danh mục</router-link></li>
              <li><router-link to="/admin/login">Đăng nhập Admin</router-link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Thông tin</h4>
            <p>© 2025 News Portal</p>
            <p>Powered by Vue.js & MongoDB</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Layout component - no logic needed
</script>

<style scoped>
.user-site {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

/* Header */
.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
  font-size: 24px;
  font-weight: 700;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 32px;
}

.nav {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  padding: 10px 20px;
  color: #666;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link:hover {
  background: #f5f7fa;
  color: #333;
}

.nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-link-admin {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.nav-link-admin:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 40px 0;
}

/* Footer */
.footer {
  background: #2c3e50;
  color: white;
  padding: 40px 0 20px;
  margin-top: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 20px;
}

.footer-section h3 {
  margin: 0 0 16px 0;
  font-size: 24px;
}

.footer-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #ecf0f1;
}

.footer-section p {
  margin: 8px 0;
  color: #bdc3c7;
  font-size: 14px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin: 8px 0;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;
}

.footer-section ul li a:hover {
  color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }
}
</style>
