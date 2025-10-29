import { ref } from 'vue'

export function useModal(initialState = false) {
  const isVisible = ref(initialState)
  const data = ref(null)

  const open = (modalData = null) => {
    data.value = modalData
    isVisible.value = true
  }

  const close = () => {
    isVisible.value = false
    data.value = null
  }

  const toggle = () => {
    isVisible.value = !isVisible.value
  }

  return {
    isVisible,
    data,
    open,
    close,
    toggle
  }
}
