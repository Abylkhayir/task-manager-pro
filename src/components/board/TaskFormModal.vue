<template>
  <a-modal
    :open="visible"
    :title="isEdit ? $t('common.edit') : $t('board.addTask')"
    :ok-text="$t('common.save')"
    :cancel-text="$t('common.cancel')"
    @ok="handleSubmit"
    @cancel="handleClose"
    width="600px"
  >
    <a-form :model="formState" :rules="rules" layout="vertical" ref="formRef">
      <a-form-item :label="$t('task.title')" name="title">
        <a-input v-model:value="formState.title" />
      </a-form-item>

      <a-form-item :label="$t('task.description')" name="description">
        <a-textarea v-model:value="formState.description" :rows="4" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('task.status')" name="status">
            <a-select v-model:value="formState.status">
              <a-select-option :value="TASK_STATUS.TODO">{{ $t('status.todo') }}</a-select-option>
              <a-select-option :value="TASK_STATUS.inProgress">{{ $t('status.inProgress') }}</a-select-option>
              <a-select-option :value="TASK_STATUS.DONE">{{ $t('status.done') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="$t('task.priority')" name="priority">
            <a-select v-model:value="formState.priority">
              <a-select-option :value="TASK_PRIORITY.LOW">{{ $t('priority.low') }}</a-select-option>
              <a-select-option :value="TASK_PRIORITY.MEDIUM">{{ $t('priority.medium') }}</a-select-option>
              <a-select-option :value="TASK_PRIORITY.HIGH">{{ $t('priority.high') }}</a-select-option>
              <a-select-option :value="TASK_PRIORITY.CRITICAL">{{ $t('priority.critical') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item :label="$t('task.assignee')" name="assignee">
        <a-select 
          v-model:value="formState.assignee" 
          placeholder="Select assignee"
          :loading="loadingUsers"
        >
          <a-select-option 
            v-for="user in users" 
            :key="user.id" 
            :value="String(user.id)"
          >
            {{ user.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :label="$t('task.tags')" name="tags">
        <a-select v-model:value="formState.tags" mode="tags" placeholder="Add tags" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>import { reactive, watch, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usersService } from '../../services/api'
import { TASK_STATUS, TASK_PRIORITY } from '../../constants'
export default {
  name: 'TaskFormModal',
  props: {
    visible: Boolean,
    task: Object,
    isEdit: Boolean
  },
  emits: ['update:visible', 'submit'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const formRef = ref()
    const users = ref([])
    const loadingUsers = ref(false)
    const formState = reactive({
      title: '',
      description: '',
      status: TASK_STATUS.TODO,
      priority: TASK_PRIORITY.MEDIUM,
      assignee: null,
      tags: []
    })
    const rules = {
      title: [
        { required: true, message: 'Please input task title!' },
        { min: 3, message: 'Title must be at least 3 characters' },
        { max: 100, message: 'Title must not exceed 100 characters' }
      ],
      description: [
        { max: 500, message: 'Description must not exceed 500 characters' }
      ],
      status: [
        { required: true, message: 'Please select status!' }
      ],
      priority: [
        { required: true, message: 'Please select priority!' }
      ],
      assignee: [
        { required: true, message: 'Please assign to someone!' }
      ]
    }
    const fetchUsers = async () => {
      try {
        loadingUsers.value = true
        users.value = await usersService.getUsers()
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        loadingUsers.value = false
      }
    }
    watch(() => props.task, (newTask) => {
      if (newTask) {
        Object.assign(formState, {
          title: newTask.title || '',
          description: newTask.description || '',
          status: newTask.status || TASK_STATUS.TODO,
          priority: newTask.priority || TASK_PRIORITY.MEDIUM,
          assignee: newTask.assignee?.id ? String(newTask.assignee.id) : null,
          tags: newTask.tags || []
        })
      }
    }, { immediate: true })
    watch(() => props.visible, (newVal) => {
      if (newVal && users.value.length === 0) {
        fetchUsers()
      } else if (!newVal && !props.isEdit) {
        Object.assign(formState, {
          title: '',
          description: '',
          status: TASK_STATUS.TODO,
          priority: TASK_PRIORITY.MEDIUM,
          assignee: null,
          tags: []
        })
      }
    })
    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          const submitData = { ...formState }
          if (submitData.assignee) {
            const assigneeId = parseInt(submitData.assignee)
            const assigneeUser = users.value.find(u => u.id === assigneeId)
            
            if (assigneeUser) {
              submitData.assignee = {
                id: assigneeUser.id,
                name: assigneeUser.name
              }
            } else {
              const fallbackUser = users.value[0]
              submitData.assignee = {
                id: assigneeId,
                name: fallbackUser ? fallbackUser.name : 'User'
              }
            }
          }
          emit('submit', submitData)
        })
        .catch((error) => {
          console.error('Validation failed:', error)
        })
    }
    const handleClose = () => {
      emit('update:visible', false)
    }
    onMounted(() => {
      fetchUsers()
    })
    return {
      formState,
      formRef,
      rules,
      users,
      loadingUsers,
      handleSubmit,
      handleClose,
      TASK_STATUS,
      TASK_PRIORITY
    }
  }
}</script>
