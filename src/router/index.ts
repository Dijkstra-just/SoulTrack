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
    },
  ],
})

export default router
