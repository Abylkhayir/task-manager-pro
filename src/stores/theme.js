import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')
  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light')
  })
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  return {
    isDark,
    toggleTheme
  }
})