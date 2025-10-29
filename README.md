# 🧩 Task Manager Pro

Тестовое задание для Middle Frontend Developer - Kanban-доска для управления задачами.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск приложения
npm start
npm run server 
```

**Откроется на:** http://localhost:5173

## 👤 Тестовые учетные данные

**Admin (полный доступ):**
- Email: `admin@demo.com`
- Пароль: `123456`

**User (только свои задачи):**
- Email: `user@demo.com`
- Пароль: `123456`

## 🛠 Технологический стек

✅ **Framework:** Vue 3 + Vite  
✅ **Язык:** JavaScript  
✅ **Состояние:** Pinia  
✅ **Роутинг:** Vue Router  
✅ **UI:** Ant Design Vue  
✅ **Стили:** SCSS  
✅ **HTTP:** Axios  
✅ **Локализация:** Vue I18n (ru, kz)  
✅ **Mock API:** json-server  
✅ **WebSocket:** Socket.io (real-time)  
✅ **Тестирование:** Vitest  

## ✨ Реализованный функционал

### ✅ Авторизация
- Страница `/login`
- Mock авторизация (без реального API)
- Токен сохраняется в `localStorage`
- Router guards для защиты роутов

### ✅ Канбан-доска (`/board`)
- 3 колонки: `todo`, `inProgress`, `done`
- **Drag & Drop** с оптимистичными обновлениями
- **Пагинация** (6/12/24/48 задач на страницу)
- Фильтрация:
  - По статусу
  - По исполнителю
  - По приоритету
  - По тегам (множественный выбор)
- Текстовый поиск
- Создание/редактирование/удаление задач

### ✅ Детальная страница задачи (`/tasks/:id`)
- Просмотр и редактирование всех полей
- 3 вкладки:
  - **Comments** - добавление и удаление комментариев
  - **Attachments** - загрузка файлов с прогрессом
  - **Activity** - Timeline истории действий

### ✅ RBAC (Role-Based Access Control)
- **Admin** - полный доступ ко всем задачам
- **User** - доступ только к своим задачам
- Проверка прав на уровне UI и stores

### ✅ Локализация (i18n)
- Русский язык (ru)
- Казахский язык (kz)
- Переключатель в хедере
- Хранение во внешних JSON файлах
- Сохранение выбора в `localStorage`

### ✅ Дополнительно
- Темная тема с плавными переходами
- **WebSocket** для real-time синхронизации
- **Расширенная валидация** форм
- **Детальная обработка ошибок**
- **Unit тесты** (25+ тестов)
- Адаптивный дизайн

## 📦 Команды

```bash
npm install          # Установка зависимостей
npm start            # Запуск всех сервисов (frontend + API + WebSocket)
npm run server       # Запуск сервера
npm run build        # Production сборка
npm test             # Запуск unit тестов
npm run test:ui      # UI для тестов
npm run test:coverage # Coverage тестов
```

## 📁 Структура проекта

```
src/
├── components/
│   ├── common/          # Общие компоненты (Header)
│   ├── board/           # Компоненты Kanban-доски
│   └── task/            # Компоненты задач
├── composables/         # useWebSocket
├── stores/
│   ├── auth.js          # Mock авторизация + RBAC
│   ├── tasks.js         # Управление задачами
│   └── theme.js         # Темная тема
├── services/
│   ├── api.js           # HTTP клиент (Axios)
│   └── websocket.js     # WebSocket клиент
├── router/              # Vue Router + guards
├── locales/             # i18n (ru, kz)
├── views/               # Страницы
├── utils/
│   └── errorHandler.js  # Обработка ошибок
└── __tests__/           # Unit тесты
    ├── stores/
    └── components/

db.json                  # Mock данные для json-server
websocket-server.js      # WebSocket сервер
```

## 🎯 Архитектурные решения

### 1. Mock авторизация (без API)
По заданию требуется "вход через mock API", поэтому реализована простая проверка в auth store без реальных HTTP запросов:

```javascript
const MOCK_USERS = [
  { id: 1, email: 'admin@demo.com', password: '123456', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@demo.com', password: '123456', name: 'Demo User', role: 'user' }
]
```

Токен генерируется и сохраняется в `localStorage`, как требуется в задании.

### 2. Оптимистичные обновления (Drag & Drop)
При перемещении задачи UI обновляется мгновенно, затем отправляется запрос на сервер. При ошибке изменения откатываются:

```javascript
task.status = newStatus

try {
  await tasksService.updateTask(task.id, { status: newStatus })
} catch (error) {
  task.status = oldStatus
}
```

### 3. WebSocket для real-time синхронизации
Открыв приложение в двух вкладках, изменения в одной сразу видны в другой:
- Создание задачи
- Обновление задачи
- Удаление задачи
- Drag & Drop
- Комментарии
