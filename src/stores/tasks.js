import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasksService } from '../services/api'
import { useAuthStore } from './auth'
import { TASK_STATUS, PAGINATION_DEFAULTS } from '../constants'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const currentTask = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    status: null,
    assignee: null,
    priority: null,
    tags: [],
    search: ''
  })
  const pagination = ref({
    current: PAGINATION_DEFAULTS.CURRENT,
    pageSize: PAGINATION_DEFAULTS.PAGE_SIZE,
    total: 0
  })
  
  const authStore = useAuthStore()

  const addTask = (task) => {
    const exists = tasks.value.find(t => t.id === task.id)
    if (!exists) {
      tasks.value.push(task)
    }
  }

  const replaceTask = (task) => {
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = task
    }
  }

  const removeTask = (taskId) => {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  }

  const updateTaskInList = (taskId, updates) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      Object.assign(task, updates)
    }
  }
  const filteredTasks = computed(() => {
    let result = [...tasks.value]

    if (!authStore.isAdmin) {
      result = result.filter(task => task.assignee?.id === authStore.currentUser?.id)
    }

    if (filters.value.status) {
      result = result.filter(task => task.status === filters.value.status)
    }
    if (filters.value.assignee) {
      result = result.filter(task => task.assignee?.id === filters.value.assignee)
    }
    if (filters.value.priority) {
      result = result.filter(task => task.priority === filters.value.priority)
    }
    if (filters.value.tags.length > 0) {
      result = result.filter(task =>
        filters.value.tags.some(tag => task.tags?.includes(tag))
      )
    }
    if (filters.value.search) {
      const searchLower = filters.value.search.toLowerCase()
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      )
    }
    return result
  })
  const tasksByStatus = computed(() => {
    const grouped = {
      [TASK_STATUS.TODO]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.DONE]: []
    }
    filteredTasks.value.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task)
      }
    })
    return grouped
  })
  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await tasksService.getTasks()
      tasks.value = response
      pagination.value.total = response.length
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  const fetchTaskById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await tasksService.getTaskById(id)
      currentTask.value = response
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const createTask = async (taskData) => {
    loading.value = true
    error.value = null

    const tempId = Date.now()
    const tempTask = {
      ...taskData,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    addTask(tempTask)
    
    try {
      const response = await tasksService.createTask(taskData)
      removeTask(tempId)
      addTask(response)
      return response
    } catch (err) {
      removeTask(tempId)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const updateTask = async (id, updates) => {
    loading.value = true
    error.value = null

    const taskIndex = tasks.value.findIndex(t => t.id === id)
    const oldTask = taskIndex !== -1 ? { ...tasks.value[taskIndex] } : null

    if (taskIndex !== -1) {
      tasks.value[taskIndex] = {
        ...tasks.value[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
    
    try {
      const response = await tasksService.updateTask(id, updates)
      replaceTask(response)
      if (currentTask.value?.id === id) {
        currentTask.value = response
      }
      return response
    } catch (err) {
      if (taskIndex !== -1 && oldTask) {
        tasks.value[taskIndex] = oldTask
      }
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const deleteTask = async (id) => {
    loading.value = true
    error.value = null

    const taskIndex = tasks.value.findIndex(t => t.id === id)
    const deletedTask = taskIndex !== -1 ? { ...tasks.value[taskIndex] } : null

    if (taskIndex !== -1) {
      tasks.value.splice(taskIndex, 1)
    }
    
    try {
      await tasksService.deleteTask(id)
    } catch (err) {
      if (deletedTask) {
        tasks.value.splice(taskIndex, 0, deletedTask)
      }
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const updateTaskStatus = async (taskId, newStatus) => {
    return updateTask(taskId, { status: newStatus })
  }
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }
  const resetFilters = () => {
    filters.value = {
      status: null,
      assignee: null,
      priority: null,
      tags: [],
      search: ''
    }
  }
  return {
    tasks,
    currentTask,
    loading,
    error,
    filters,
    pagination,
    filteredTasks,
    tasksByStatus,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilters,
    resetFilters,
    addTask,
    replaceTask,
    removeTask,
    updateTaskInList
  }
})