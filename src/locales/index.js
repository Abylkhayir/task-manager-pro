import { createI18n } from 'vue-i18n'
import ru from './ru/index.json'
import kz from './kz/index.json'
const messages = {
  ru,
  kz
}
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'ru',
  fallbackLocale: 'ru',
  messages
})
export default i18n