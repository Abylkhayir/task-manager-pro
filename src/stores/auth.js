import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MOCK_USERS = [
  { id: 1, email: 'admin@demo.com', password: '123456', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@demo.com', password: '123456', name: 'Demo User', role: 'user' }
]
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const currentUser = computed(() => user.value)

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    try {
      console.log('🔐 Mock login attempt:', credentials.email)

      await new Promise(resolve => setTimeout(resolve, 300))

      const foundUser = MOCK_USERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      )
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        user.value = userWithoutPassword
        token.value = `mock-token-${foundUser.id}-${Date.now()}`

        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))
        console.log('✅ Mock login successful:', userWithoutPassword.email)
        return { user: userWithoutPassword, token: token.value }
      } else {
        console.log('❌ Mock login failed: invalid credentials')
        const errorMessage = 'Invalid email or password'
        error.value = errorMessage
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    console.log('✅ Logged out')
  }
  const checkAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      console.log('✅ Auth restored from localStorage:', user.value.email)
    }
  }
  const canEditTask = (task) => {
    if (!user.value) return false
    if (user.value.role === 'admin') return true
    return task.assignee?.id === user.value.id
  }
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    currentUser,
    login,
    logout,
    checkAuth,
    canEditTask
  }
})