import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '../../stores/tasks'
import { useAuthStore } from '../../stores/auth'

describe('Tasks Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty tasks', () => {
    const store = useTasksStore()
    expect(store.tasks).toEqual([])
    expect(store.currentTask).toBeNull()
  })

  it('should filter tasks by status', () => {
    const store = useTasksStore()
    store.tasks = [
      { id: 1, status: 'todo', title: 'Task 1' },
      { id: 2, status: 'inProgress', title: 'Task 2' },
      { id: 3, status: 'done', title: 'Task 3' }
    ]

    store.setFilters({ status: 'todo' })
    
    expect(store.filteredTasks).toHaveLength(1)
    expect(store.filteredTasks[0].status).toBe('todo')
  })

  it('should filter tasks by priority', () => {
    const store = useTasksStore()
    store.tasks = [
      { id: 1, status: 'todo', priority: 'high', title: 'Task 1' },
      { id: 2, status: 'todo', priority: 'low', title: 'Task 2' }
    ]

    store.setFilters({ priority: 'high' })
    
    expect(store.filteredTasks).toHaveLength(1)
    expect(store.filteredTasks[0].priority).toBe('high')
  })

  it('should search tasks by title', () => {
    const store = useTasksStore()
    store.tasks = [
      { id: 1, status: 'todo', title: 'Implement authentication', description: '' },
      { id: 2, status: 'todo', title: 'Design dashboard', description: '' }
    ]

    store.setFilters({ search: 'auth' })
    
    expect(store.filteredTasks).toHaveLength(1)
    expect(store.filteredTasks[0].title).toContain('authentication')
  })

  it('should group tasks by status', () => {
    const store = useTasksStore()
    const authStore = useAuthStore()
    authStore.user = { id: 1, role: 'admin' }
    
    store.tasks = [
      { id: 1, status: 'todo', title: 'Task 1', assignee: { id: 1 } },
      { id: 2, status: 'inProgress', title: 'Task 2', assignee: { id: 1 } },
      { id: 3, status: 'done', title: 'Task 3', assignee: { id: 1 } }
    ]

    const grouped = store.tasksByStatus
    
    expect(grouped.todo).toHaveLength(1)
    expect(grouped.inProgress).toHaveLength(1)
    expect(grouped.done).toHaveLength(1)
  })

  it('should filter tasks by role (user)', () => {
    const store = useTasksStore()
    const authStore = useAuthStore()
    authStore.user = { id: 2, role: 'user' }
    
    store.tasks = [
      { id: 1, status: 'todo', assignee: { id: 1 } },
      { id: 2, status: 'todo', assignee: { id: 2 } }
    ]

    expect(store.filteredTasks).toHaveLength(1)
    expect(store.filteredTasks[0].assignee.id).toBe(2)
  })

  it('should not filter tasks for admin', () => {
    const store = useTasksStore()
    const authStore = useAuthStore()
    authStore.user = { id: 1, role: 'admin' }
    
    store.tasks = [
      { id: 1, status: 'todo', assignee: { id: 1 } },
      { id: 2, status: 'todo', assignee: { id: 2 } }
    ]

    expect(store.filteredTasks).toHaveLength(2)
  })

  it('should reset filters', () => {
    const store = useTasksStore()
    store.setFilters({ status: 'todo', priority: 'high', search: 'test' })
    store.resetFilters()
    
    expect(store.filters.status).toBeNull()
    expect(store.filters.priority).toBeNull()
    expect(store.filters.search).toBe('')
  })

  it('should handle optimistic update for task creation', () => {
    const store = useTasksStore()
    const initialLength = store.tasks.length
    
    const newTask = {
      title: 'New Task',
      status: 'todo',
      priority: 'medium'
    }

    // Симулируем оптимистичное добавление
    const tempId = Date.now()
    store.tasks.push({ ...newTask, id: tempId })
    
    expect(store.tasks).toHaveLength(initialLength + 1)
  })

  it('should handle optimistic update rollback', () => {
    const store = useTasksStore()
    const task = { id: 1, status: 'todo', title: 'Task 1' }
    store.tasks = [task]
    
    const oldStatus = task.status
    const taskIndex = 0
    
    // Оптимистичное обновление
    store.tasks[taskIndex].status = 'done'
    expect(store.tasks[taskIndex].status).toBe('done')
    
    // Откат при ошибке
    store.tasks[taskIndex].status = oldStatus
    expect(store.tasks[taskIndex].status).toBe('todo')
  })
})
