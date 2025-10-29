import axios from 'axios'
import { config } from '../config'
import { API_ENDPOINTS, HTTP_STATUS } from '../constants'

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const handleResponse = (response) => response.data

const handleError = (error) => {
  throw error
}

export const tasksService = {
  getTasks: (params = {}) => 
    apiClient.get(API_ENDPOINTS.TASKS, { params }).then(handleResponse).catch(handleError),
  
  getTaskById: (id) => 
    apiClient.get(`${API_ENDPOINTS.TASKS}/${id}`).then(handleResponse).catch(handleError),
  
  createTask: (taskData) => 
    apiClient.post(API_ENDPOINTS.TASKS, taskData).then(handleResponse).catch(handleError),
  
  updateTask: (id, updates) => 
    apiClient.patch(`${API_ENDPOINTS.TASKS}/${id}`, updates).then(handleResponse).catch(handleError),
  
  deleteTask: (id) => 
    apiClient.delete(`${API_ENDPOINTS.TASKS}/${id}`).then(handleResponse).catch(handleError)
}

export const commentsService = {
  getComments: (taskId) => 
    apiClient.get(`${API_ENDPOINTS.COMMENTS}?taskId=${taskId}`).then(handleResponse).catch(handleError),
  
  createComment: (taskId, commentData) => {
    const newComment = {
      ...commentData,
      taskId: parseInt(taskId),
      id: Date.now()
    }
    return apiClient.post(API_ENDPOINTS.COMMENTS, newComment).then(handleResponse).catch(handleError)
  },
  
  deleteComment: (commentId) => 
    apiClient.delete(`${API_ENDPOINTS.COMMENTS}/${commentId}`).then(handleResponse).catch(handleError)
}

export const attachmentsService = {
  getAttachments: (taskId) => 
    apiClient.get(`${API_ENDPOINTS.ATTACHMENTS}?taskId=${taskId}`).then(handleResponse).catch(handleError),
  
  uploadAttachment: (taskId, file, onProgress) => {
    if (onProgress) {
      let progress = 0
      const interval = setInterval(() => {
        progress += 20
        onProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
        }
      }, 100)
    }

    const attachment = {
      taskId: parseInt(taskId),
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      id: Date.now()
    }
    return apiClient.post(API_ENDPOINTS.ATTACHMENTS, attachment).then(handleResponse).catch(handleError)
  },
  
  deleteAttachment: (attachmentId) => 
    apiClient.delete(`${API_ENDPOINTS.ATTACHMENTS}/${attachmentId}`).then(handleResponse).catch(handleError)
}

export const activityService = {
  getActivity: (taskId) => 
    apiClient.get(`${API_ENDPOINTS.ACTIVITY}?taskId=${taskId}`).then(handleResponse).catch(handleError)
}

export const usersService = {
  getUsers: () => 
    apiClient.get(API_ENDPOINTS.USERS).then(handleResponse).catch(handleError)
}

export default apiClient