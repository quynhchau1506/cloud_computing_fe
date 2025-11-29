import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/auth.service'

// User Views
import UserLayout from '@/views/UserLayout.vue'
import UserHome from '@/views/UserHome.vue'
import NewsDetail from '@/views/NewsDetail.vue'
import CategoriesPage from '@/views/CategoriesPage.vue'
import CategoryDetail from '@/views/CategoryDetail.vue'

// Admin Views
import AdminLogin from '@/views/AdminLogin.vue'
import AdminRegister from '@/views/AdminRegister.vue'
import AdminLayout from '@/views/AdminLayout.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import AdminNews from '@/views/AdminNews.vue'
import AdminCategories from '@/views/AdminCategories.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // User Routes
    {
      path: '/',
      component: UserLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: UserHome,
        },
        {
          path: 'news/:id',
          name: 'news-detail',
          component: NewsDetail,
        },
        {
          path: 'categories',
          name: 'categories',
          component: CategoriesPage,
        },
        {
          path: 'categories/:id',
          name: 'category-detail',
          component: CategoryDetail,
        },
      ],
    },

    // Admin Auth Routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin,
    },
    {
      path: '/admin/register',
      name: 'admin-register',
      component: AdminRegister,
    },

    // Admin Protected Routes
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboard,
        },
        {
          path: 'news',
          name: 'admin-news',
          component: AdminNews,
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: AdminCategories,
        },
      ],
    },

    // Redirect /admin to dashboard
    {
      path: '/admin',
      redirect: '/admin/dashboard',
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    next('/admin/login')
  } else if (to.path === '/admin/login' && isAuthenticated) {
    next('/admin/dashboard')
  } else {
    next()
  }
})

export default router
