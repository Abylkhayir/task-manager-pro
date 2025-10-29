import { message } from 'ant-design-vue'
export const handleApiError = (error, customMessage = null) => {
  let errorMessage = customMessage || 'An error occurred'
  if (error.response) {

    const status = error.response.status
    switch (status) {
      case 400:
        errorMessage = 'Invalid request. Please check your input.'
        break
      case 401:
        errorMessage = 'Unauthorized. Please log in again.'
        break
      case 403:
        errorMessage = 'Access denied. You do not have permission.'
        break
      case 404:
        errorMessage = 'Resource not found.'
        break
      case 409:
        errorMessage = 'Conflict. This resource already exists or has been modified.'
        break
      case 422:
        errorMessage = 'Validation error. Please check your input.'
        if (error.response.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat()
          errorMessage = errors.join(', ')
        }
        break
      case 500:
        errorMessage = 'Server error. Please try again later.'
        break
      case 503:
        errorMessage = 'Service unavailable. Please try again later.'
        break
      default:
        errorMessage = error.response.data?.message || `Error: ${status}`
    }
  } else if (error.request) {

    errorMessage = 'Network error. Please check your connection.'
  } else {

    errorMessage = error.message || 'Unknown error occurred'
  }
  message.error(errorMessage)
  console.error('API Error:', error)
  return errorMessage
}
export const handleSuccess = (successMessage) => {
  message.success(successMessage)
}
export const handleWarning = (warningMessage) => {
  message.warning(warningMessage)
}
export const handleInfo = (infoMessage) => {
  message.info(infoMessage)
}

export const handleTaskError = (error, action = 'perform action') => {
  const customMessages = {
    create: 'Failed to create task',
    update: 'Failed to update task',
    delete: 'Failed to delete task',
    fetch: 'Failed to load tasks',
    move: 'Failed to move task'
  }
  return handleApiError(error, customMessages[action])
}

export const handleCommentError = (error, action = 'perform action') => {
  const customMessages = {
    create: 'Failed to add comment',
    delete: 'Failed to delete comment',
    fetch: 'Failed to load comments'
  }
  return handleApiError(error, customMessages[action])
}

export const handleAttachmentError = (error, action = 'perform action') => {
  const customMessages = {
    upload: 'Failed to upload file. Please check file size and format.',
    delete: 'Failed to delete attachment',
    fetch: 'Failed to load attachments'
  }
  return handleApiError(error, customMessages[action])
}