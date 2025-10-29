import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { notificationService, NOTIFICATION_KEY } from './services/notification'
import 'ant-design-vue/dist/reset.css'
import './assets/styles/main.scss'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Antd)
app.use(i18n)
app.provide(NOTIFICATION_KEY, notificationService)
app.mount('#app')