import { onMounted, onUnmounted } from 'vue'
import websocketService from '../services/websocket'
import { useTasksStore } from '../stores/tasks'
import { config } from '../config'

export function useWebSocket() {
  const tasksStore = useTasksStore()
  
  const setupWebSocket = () => {
    websocketService.connect()

    websocketService.onTaskCreated((task) => {
      if (config.isDevelopment) {
        console.log('Task created via WebSocket:', task)
      }
      tasksStore.addTask(task)
    })

    websocketService.onTaskUpdated((task) => {
      if (config.isDevelopment) {
        console.log('Task updated via WebSocket:', task)
      }
      tasksStore.replaceTask(task)
    })

    websocketService.onTaskDeleted(({ taskId }) => {
      if (config.isDevelopment) {
        console.log('Task deleted via WebSocket:', taskId)
      }
      tasksStore.removeTask(taskId)
    })

    websocketService.onTaskMoved(({ taskId, newStatus }) => {
      if (config.isDevelopment) {
        console.log('Task moved via WebSocket:', taskId, newStatus)
      }
      tasksStore.updateTaskInList(taskId, { status: newStatus })
    })
  }
  
  const cleanupWebSocket = () => {
    websocketService.disconnect()
  }
  
  return {
    setupWebSocket,
    cleanupWebSocket,
    websocketService
  }
}

export function useTaskWebSocket(taskId) {
  const setupTaskWebSocket = () => {
    websocketService.joinTaskRoom(taskId)

    websocketService.onCommentAdded((data) => {
      if (config.isDevelopment) {
        console.log('Comment added via WebSocket:', data)
      }
    })
  }
  
  const cleanupTaskWebSocket = () => {
    websocketService.leaveTaskRoom(taskId)
  }
  
  onMounted(setupTaskWebSocket)
  onUnmounted(cleanupTaskWebSocket)
  
  return {
    websocketService
  }
}