import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with no user', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should login successfully', async () => {
    const store = useAuthStore()
    
    // Mock API response
    vi.mock('../../services/api', () => ({
      authService: {
        login: vi.fn().mockResolvedValue({
          user: { id: 1, email: 'admin@demo.com', role: 'admin', name: 'Admin' },
          token: 'mock-token-123'
        })
      }
    }))

    await store.login({ email: 'admin@demo.com', password: '123456' })

    expect(store.isAuthenticated).toBe(true)
    expect(store.user).not.toBeNull()
    expect(store.token).not.toBeNull()
  })

  it('should check if user is admin', () => {
    const store = useAuthStore()
    store.user = { id: 1, email: 'admin@demo.com', role: 'admin', name: 'Admin' }
    
    expect(store.isAdmin).toBe(true)
  })

  it('should check if user is not admin', () => {
    const store = useAuthStore()
    store.user = { id: 2, email: 'user@demo.com', role: 'user', name: 'User' }
    
    expect(store.isAdmin).toBe(false)
  })

  it('should allow admin to edit any task', () => {
    const store = useAuthStore()
    store.user = { id: 1, email: 'admin@demo.com', role: 'admin', name: 'Admin' }
    
    const task = { id: 1, assignee: { id: 2 } }
    expect(store.canEditTask(task)).toBe(true)
  })

  it('should allow user to edit only their tasks', () => {
    const store = useAuthStore()
    store.user = { id: 2, email: 'user@demo.com', role: 'user', name: 'User' }
    
    const ownTask = { id: 1, assignee: { id: 2 } }
    const otherTask = { id: 2, assignee: { id: 1 } }
    
    expect(store.canEditTask(ownTask)).toBe(true)
    expect(store.canEditTask(otherTask)).toBe(false)
  })

  it('should logout successfully', () => {
    const store = useAuthStore()
    store.user = { id: 1, email: 'admin@demo.com', role: 'admin', name: 'Admin' }
    store.token = 'mock-token-123'
    
    store.logout()
    
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should restore auth from localStorage', () => {
    const mockUser = { id: 1, email: 'admin@demo.com', role: 'admin', name: 'Admin' }
    const mockToken = 'mock-token-123'
    
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('token', mockToken)
    
    const store = useAuthStore()
    store.checkAuth()
    
    expect(store.user).toEqual(mockUser)
    expect(store.token).toBe(mockToken)
    expect(store.isAuthenticated).toBe(true)
  })
})
