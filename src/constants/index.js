export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'inProgress',
  DONE: 'done'
}

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

export const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: 'default',
  [TASK_PRIORITY.MEDIUM]: 'blue',
  [TASK_PRIORITY.HIGH]: 'orange',
  [TASK_PRIORITY.CRITICAL]: 'red'
}

export const PRIORITY_BORDER_COLORS = {
  [TASK_PRIORITY.LOW]: '#d9d9d9',
  [TASK_PRIORITY.MEDIUM]: '#1890ff',
  [TASK_PRIORITY.HIGH]: '#fa8c16',
  [TASK_PRIORITY.CRITICAL]: '#ff4d4f'
}

export const AVATAR_COLORS = [
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
  '#87d068'
]

export const PAGINATION_DEFAULTS = {
  CURRENT: 1,
  PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: ['6', '12', '24', '48']
}

export const API_ENDPOINTS = {
  TASKS: '/tasks',
  COMMENTS: '/comments',
  ATTACHMENTS: '/attachments',
  ACTIVITY: '/activity',
  USERS: '/users'
}

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}
