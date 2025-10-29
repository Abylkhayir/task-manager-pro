import { ref } from 'vue'
import { message } from 'ant-design-vue'

export function useAsyncAction() {
  const loading = ref(false)
  const error = ref(null)

  const execute = async (action, options = {}) => {
    const {
      successMessage = null,
      errorMessage = null,
      onSuccess = null,
      onError = null,
      showNotification = true
    } = options

    loading.value = true
    error.value = null

    try {
      const result = await action()
      
      if (showNotification && successMessage) {
        message.success(successMessage)
      }
      
      if (onSuccess) {
        await onSuccess(result)
      }
      
      return result
    } catch (err) {
      error.value = err
      
      if (showNotification) {
        const errMsg = errorMessage || err.message || 'Operation failed'
        message.error(errMsg)
      }
      
      if (onError) {
        await onError(err)
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    execute
  }
}
