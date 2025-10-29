import { inject } from 'vue'
import { NOTIFICATION_KEY } from '../services/notification'

export function useNotification() {
  const notification = inject(NOTIFICATION_KEY)
  
  if (!notification) {
    console.warn('Notification service not provided')
    return {
      success: console.log,
      error: console.error,
      warning: console.warn,
      info: console.info,
      confirm: () => Promise.resolve(true),
      confirmDelete: () => Promise.resolve(true)
    }
  }
  
  return notification
}
