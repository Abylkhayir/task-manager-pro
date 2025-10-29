import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TaskCard from '../../components/board/TaskCard.vue'
import { useAuthStore } from '../../stores/auth'

describe('TaskCard Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders task title', () => {
    const task = {
      id: 1,
      title: 'Test Task',
      status: 'todo',
      priority: 'high',
      assignee: { id: 1, name: 'John Doe' }
    }

    const wrapper = mount(TaskCard, {
      props: { task },
      global: {
        plugins: [createPinia()],
        stubs: {
          'a-card': true,
          'a-tag': true,
          'a-avatar': true,
          'a-dropdown': true,
          'a-button': true,
          'a-menu': true,
          'a-menu-item': true,
          'a-menu-divider': true
        }
      }
    })

    expect(wrapper.text()).toContain('Test Task')
  })

  it('shows edit button for admin', () => {
    const authStore = useAuthStore()
    authStore.user = { id: 1, role: 'admin' }

    const task = {
      id: 1,
      title: 'Test Task',
      status: 'todo',
      priority: 'high',
      assignee: { id: 2, name: 'Jane Doe' }
    }

    const wrapper = mount(TaskCard, {
      props: { task },
      global: {
        plugins: [createPinia()],
        stubs: {
          'a-card': true,
          'a-tag': true,
          'a-avatar': true,
          'a-dropdown': true,
          'a-button': true,
          'a-menu': true,
          'a-menu-item': true,
          'a-menu-divider': true
        }
      }
    })

    const canEdit = wrapper.vm.canEdit
    expect(canEdit).toBe(true)
  })

  it('hides edit button for non-owner user', () => {
    const authStore = useAuthStore()
    authStore.user = { id: 2, role: 'user' }

    const task = {
      id: 1,
      title: 'Test Task',
      status: 'todo',
      priority: 'high',
      assignee: { id: 1, name: 'John Doe' }
    }

    const wrapper = mount(TaskCard, {
      props: { task },
      global: {
        plugins: [createPinia()],
        stubs: {
          'a-card': true,
          'a-tag': true,
          'a-avatar': true,
          'a-dropdown': true,
          'a-button': true,
          'a-menu': true,
          'a-menu-item': true,
          'a-menu-divider': true
        }
      }
    })

    const canEdit = wrapper.vm.canEdit
    expect(canEdit).toBe(false)
  })

  it('applies correct priority class', () => {
    const task = {
      id: 1,
      title: 'Critical Task',
      status: 'todo',
      priority: 'critical',
      assignee: { id: 1, name: 'John Doe' }
    }

    const wrapper = mount(TaskCard, {
      props: { task },
      global: {
        plugins: [createPinia()],
        stubs: {
          'a-card': true,
          'a-tag': true,
          'a-avatar': true,
          'a-dropdown': true,
          'a-button': true
        }
      }
    })

    expect(wrapper.classes()).toContain('priority-critical')
  })

  it('truncates long description', () => {
    const longDescription = 'a'.repeat(100)
    const task = {
      id: 1,
      title: 'Test Task',
      description: longDescription,
      status: 'todo',
      priority: 'high',
      assignee: { id: 1, name: 'John Doe' }
    }

    const wrapper = mount(TaskCard, {
      props: { task },
      global: {
        plugins: [createPinia()],
        stubs: {
          'a-card': true,
          'a-tag': true,
          'a-avatar': true,
          'a-dropdown': true,
          'a-button': true
        }
      }
    })

    const truncated = wrapper.vm.truncateText(longDescription, 80)
    expect(truncated.length).toBeLessThanOrEqual(83) // 80 + '...'
  })

  it('displays tags when present', () => {
    const task = {
      id: 1,
      title: 'Test Task',
      status: 'todo',
      priority: 'high',
      tags: ['frontend', 'urgent'],
      assignee: { id: 1, name: 'John Doe' }
    }

    const wrapper = mount(TaskCard, {
      props: { task },
      global: {
        plugins: [createPinia()],
        stubs: {
          'a-card': true,
          'a-tag': true,
          'a-avatar': true,
          'a-dropdown': true,
          'a-button': true
        }
      }
    })

    expect(wrapper.html()).toContain('frontend')
    expect(wrapper.html()).toContain('urgent')
  })
})
