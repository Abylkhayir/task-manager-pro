import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const routes = [
  {
    path: '/',
    redirect: '/board'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('../views/BoardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: () => import('../views/TaskDetailView.vue'),
    meta: { requiresAuth: true }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/board')
  } else {
    next()
  }
})
export default router