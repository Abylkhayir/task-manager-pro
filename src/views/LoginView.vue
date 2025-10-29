<template>
  <div class="login-container">
    <a-card class="login-card" :bordered="false">
      <div class="login-header">
        <div class="logo">🧩</div>
        <h1 class="title">{{ $t('auth.loginTitle') }}</h1>
      </div>

      <a-form
        :model="formState"
        :rules="rules"
        @finish="handleLogin"
        layout="vertical"
        class="login-form"
      >
        <a-form-item name="email" :label="$t('auth.email')">
          <a-input
            v-model:value="formState.email"
            size="large"
            :placeholder="$t('auth.email')"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password" :label="$t('auth.password')">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            :placeholder="$t('auth.password')"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
          >
            {{ $t('auth.login') }}
          </a-button>
        </a-form-item>
      </a-form>

      <a-divider />

      <div class="demo-info">
        <a-alert type="info" show-icon>
          <template #message>
            <div>
              <strong>Demo credentials:</strong><br>
              Admin: admin@demo.com / 123456<br>
              User: user@demo.com / 123456
            </div>
          </template>
        </a-alert>
      </div>
    </a-card>
  </div>
</template>

<script>import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { useAuthStore } from '../stores/auth'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
export default {
  name: 'LoginView',
  components: {
    UserOutlined,
    LockOutlined
  },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const authStore = useAuthStore()
    const formState = reactive({
      email: '',
      password: ''
    })
    const rules = {
      email: [
        { required: true, message: t('auth.emailRequired') },
        { type: 'email', message: 'Invalid email format' }
      ],
      password: [
        { required: true, message: t('auth.passwordRequired') }
      ]
    }
    const loading = computed(() => authStore.loading)
    const handleLogin = async () => {
      try {
        await authStore.login(formState)
        message.success('Login successful!')
        router.push('/board')
      } catch (error) {
        const errorMessage = error.message || t('auth.loginError')
        message.error(errorMessage, 5)
      }
    }
    return {
      formState,
      rules,
      loading,
      handleLogin
    }
  }
}</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  overflow: hidden;

  :deep(.ant-card-body) {
    padding: 40px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .logo {
    font-size: 64px;
    margin-bottom: 16px;
  }

  .title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.login-form {
  margin-bottom: 0;
}

.demo-info {
  margin-top: 16px;
  
  :deep(.ant-alert) {
    border-radius: 8px;
  }
}
</style>
