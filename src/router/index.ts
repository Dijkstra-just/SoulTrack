import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/info-display',
      name: 'infoDisplay',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/trip-planning',
      name: 'tripPlanning',
      component: () => import('../views/TripPlanningView.vue'),
    },
    {
      path: '/3d-explore',
      name: 'threeDExplore',
      component: () => import('../views/ThreeDExploreView.vue'),
    },
    {
      path: '/forum',
      name: 'forum',
      component: () => import('../views/ForumView.vue'),
    },
    {
      path: '/summary',
      name: 'summary',
      component: () => import('../views/SummaryView.vue'),
      meta: { requiresAuth: true }, // 添加需要认证的元信息
    },
  ],
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 检查该路由是否需要登录权限
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 检查用户是否已登录
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (!token || !user) {
      // 未登录，显示提示并跳转到首页
      alert('请先登录后再访问此页面')
      next({ path: '/' })
    } else {
      // 已登录，允许访问
      next()
    }
  } else {
    // 不需要登录权限的页面直接放行
    next()
  }
})

export default router
