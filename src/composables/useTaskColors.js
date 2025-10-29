import { PRIORITY_COLORS, PRIORITY_BORDER_COLORS } from '../constants'

export function useTaskColors() {
  const STATUS_COLORS = {
    todo: 'blue',
    inProgress: 'orange',
    done: 'green'
  }

  const getPriorityColor = (priority) => {
    return PRIORITY_COLORS[priority] || 'default'
  }

  const getPriorityBorderColor = (priority) => {
    return PRIORITY_BORDER_COLORS[priority] || '#d9d9d9'
  }

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || 'default'
  }

  return {
    getPriorityColor,
    getPriorityBorderColor,
    getStatusColor
  }
}
