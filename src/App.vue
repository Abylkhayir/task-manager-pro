<template>
  <a-config-provider :theme="themeConfig">
    <div :class="['app-container', { 'dark-theme': isDarkTheme }]">
      <AppHeader v-if="isAuthenticated" />
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import { computed, onMounted } from 'vue'
import { theme } from 'ant-design-vue'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import AppHeader from './components/common/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  },
  setup() {
    const authStore = useAuthStore()
    const themeStore = useThemeStore()
    
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isDarkTheme = computed(() => themeStore.isDark)
    
    const themeConfig = computed(() => ({
      algorithm: isDarkTheme.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: isDarkTheme.value ? '#4a7ba7' : '#1890ff',
        colorBgContainer: isDarkTheme.value ? '#2a2a2a' : '#ffffff',
        colorBorder: isDarkTheme.value ? '#3a3a3a' : '#d9d9d9',
        colorText: isDarkTheme.value ? '#e8e8e8' : 'rgba(0, 0, 0, 0.88)',
        colorBgElevated: isDarkTheme.value ? '#2a2a2a' : '#ffffff',
        colorBgLayout: isDarkTheme.value ? '#1a1a1a' : '#f5f5f5'
      }
    }))

    onMounted(() => {
      authStore.checkAuth()
    })
    
    return {
      isAuthenticated,
      isDarkTheme,
      themeConfig
    }
  }
}
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: #f5f5f5;

  &.dark-theme {
    background-color: #1a1a1a;
    color: #e8e8e8;
  }
}
</style>
