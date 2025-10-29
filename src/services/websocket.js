import { io } from 'socket.io-client'
import { config } from '../config'

class WebSocketService {
  constructor() {
    this.socket = null
    this.connected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 3
    this.disabled = false
  }

  connect(url = 'http://localhost:3002') {
    if (this.disabled) {
      return
    }

    if (!config.isDevelopment || (this.socket && this.connected)) {
      return
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.disabled = true
      return
    }

    try {
      this.socket = io(url, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 3000,
        reconnectionAttempts: this.maxReconnectAttempts,
        timeout: 3000
      })

      this.socket.on('connect', () => {
        this.connected = true
        this.reconnectAttempts = 0
        if (config.isDevelopment) {
          console.log('✓ WebSocket connected')
        }
      })

      this.socket.on('disconnect', () => {
        this.connected = false
      })

      this.socket.on('connect_error', (error) => {
        this.reconnectAttempts++
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.disabled = true
          this.socket?.close()
        }
      })
    } catch (error) {
      this.disabled = true
    }

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.connected = false
    }
  }

  onTaskCreated(callback) {
    if (this.socket && !this.disabled) {
      this.socket.on('task:created', callback)
    }
  }

  onTaskUpdated(callback) {
    if (this.socket && !this.disabled) {
      this.socket.on('task:updated', callback)
    }
  }

  onTaskDeleted(callback) {
    if (this.socket && !this.disabled) {
      this.socket.on('task:deleted', callback)
    }
  }

  onTaskMoved(callback) {
    if (this.socket && !this.disabled) {
      this.socket.on('task:moved', callback)
    }
  }

  onCommentAdded(callback) {
    if (this.socket && !this.disabled) {
      this.socket.on('comment:added', callback)
    }
  }

  onCommentDeleted(callback) {
    if (this.socket && !this.disabled) {
      this.socket.on('comment:deleted', callback)
    }
  }

  emitTaskCreated(task) {
    if (this.socket && this.connected) {
      this.socket.emit('task:created', task)
    }
  }

  emitTaskUpdated(task) {
    if (this.socket && this.connected) {
      this.socket.emit('task:updated', task)
    }
  }

  emitTaskDeleted(taskId) {
    if (this.socket && this.connected) {
      this.socket.emit('task:deleted', { taskId })
    }
  }

  emitTaskMoved(taskId, newStatus) {
    if (this.socket && this.connected) {
      this.socket.emit('task:moved', { taskId, newStatus })
    }
  }

  emitCommentAdded(taskId, comment) {
    if (this.socket && this.connected) {
      this.socket.emit('comment:added', { taskId, comment })
    }
  }

  joinTaskRoom(taskId) {
    if (this.socket && this.connected) {
      this.socket.emit('join:task', { taskId })
    }
  }

  leaveTaskRoom(taskId) {
    if (this.socket && this.connected) {
      this.socket.emit('leave:task', { taskId })
    }
  }

  isConnected() {
    return this.connected && !this.disabled
  }
}

export default new WebSocketService()