import { message, Modal } from 'ant-design-vue'

export const notificationService = {
  success(msg, duration = 3) {
    message.success(msg, duration)
  },

  error(msg, duration = 3) {
    message.error(msg, duration)
  },

  warning(msg, duration = 3) {
    message.warning(msg, duration)
  },

  info(msg, duration = 3) {
    message.info(msg, duration)
  },

  confirm(options) {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        ...options,
        onOk: () => resolve(true),
        onCancel: () => reject(false)
      })
    })
  },

  confirmDelete(title = 'Are you sure?', content = 'This action cannot be undone.') {
    return this.confirm({
      title,
      content,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel'
    })
  }
}

export const NOTIFICATION_KEY = Symbol('notification')
