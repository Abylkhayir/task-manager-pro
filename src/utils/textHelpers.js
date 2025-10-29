export const truncateText = (text, maxLength = 80) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const getAvatarColor = (name, colors) => {
  if (!name) return '#ccc'
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}
