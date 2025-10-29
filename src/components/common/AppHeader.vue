<template>
  <a-layout-header class="app-header">
    <div class="header-content">
      <div class="logo">
        <span class="logo-icon">🧩</span>
        <span class="logo-text">Task Manager Pro</span>
      </div>

      <div class="header-actions">
        
        <a-dropdown>
          <a-button type="text" class="action-btn">
            <template #icon>
              <GlobalOutlined />
            </template>
            {{ currentLocale.toUpperCase() }}
          </a-button>
          <template #overlay>
            <a-menu @click="handleLanguageChange">
              <a-menu-item key="ru">
                Русский
              </a-menu-item>
              <a-menu-item key="kz">
                Қазақша
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        
        <a-button type="text" class="action-btn" @click="toggleTheme">
          <template #icon>
            <BulbOutlined v-if="!isDark" />
            <BulbFilled v-else />
          </template>
        </a-button>

        
        <a-dropdown>
          <a-button type="text" class="user-btn">
            <UserOutlined />
            {{ currentUser?.name }}
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item key="role" disabled>
                {{ $t(`roles.${currentUser?.role}`) }}
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <LogoutOutlined />
                {{ $t('common.logout') }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script>import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'
import {
  GlobalOutlined,
  BulbOutlined,
  BulbFilled,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
export default {
  name: 'AppHeader',
  components: {
    GlobalOutlined,
    BulbOutlined,
    BulbFilled,
    UserOutlined,
    LogoutOutlined
  },
  setup() {
    const router = useRouter()
    const { locale } = useI18n()
    const authStore = useAuthStore()
    const themeStore = useThemeStore()
    const currentUser = computed(() => authStore.currentUser)
    const isDark = computed(() => themeStore.isDark)
    const currentLocale = computed(() => locale.value)
    const handleLanguageChange = ({ key }) => {
      locale.value = key
      localStorage.setItem('locale', key)
    }
    const toggleTheme = () => {
      themeStore.toggleTheme()
    }
    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }
    return {
      currentUser,
      isDark,
      currentLocale,
      handleLanguageChange,
      toggleTheme,
      handleLogout
    }
  }
}</script>

<style lang="scss" scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;

  .logo-icon {
    font-size: 28px;
  }

  .logo-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn,
.user-btn {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
