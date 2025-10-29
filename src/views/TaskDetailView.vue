<template>
  <div class="task-detail-view">
    <a-spin :spinning="loading">
      <div v-if="task" class="task-detail-container">
        <div class="task-header">
          <a-breadcrumb>
            <a-breadcrumb-item @click="$router.push('/board')">
              <ArrowLeftOutlined /> Back to Board
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <a-card>
          <div class="task-main">
            <div class="task-content">
              <h1 class="task-title">{{ task.title }}</h1>
              
              <div class="task-meta">
                <a-tag :color="getPriorityColor(task.priority)">
                  {{ $t(`priority.${task.priority}`) }}
                </a-tag>
                <a-tag :color="getStatusColor(task.status)">
                  {{ $t(`status.${task.status}`) }}
                </a-tag>
              </div>

              <p class="task-description">{{ task.description }}</p>

              <div class="task-tags" v-if="task.tags && task.tags.length">
                <a-tag v-for="tag in task.tags" :key="tag">{{ tag }}</a-tag>
              </div>

              <a-tabs v-model:active-key="activeTab">
                <a-tab-pane key="comments" :tab="$t('task.comments')">
                  <comment-section :task-id="task.id" />
                </a-tab-pane>

                <a-tab-pane key="attachments" :tab="$t('task.attachments')">
                  <attachment-section :task-id="task.id" />
                </a-tab-pane>

                <a-tab-pane key="activity" :tab="$t('task.activity')">
                  <activity-section :task-id="task.id" />
                </a-tab-pane>
              </a-tabs>
            </div>

            <div class="task-sidebar">
              <div class="sidebar-section">
                <h4>{{ $t('task.assignee') }}</h4>
                <div class="assignee-info">
                  <a-avatar :size="40" :style="{ backgroundColor: '#1890ff' }">
                    {{ getInitials(task.assignee?.name) }}
                  </a-avatar>
                  <span>{{ task.assignee?.name }}</span>
                </div>
              </div>

              <div class="sidebar-section">
                <h4>Details</h4>
                <div class="detail-item">
                  <span class="label">Created:</span>
                  <span>{{ formatDate(task.createdAt) }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Updated:</span>
                  <span>{{ formatDate(task.updatedAt) }}</span>
                </div>
              </div>

              <a-button v-if="canEdit" type="primary" block @click="handleEdit">
                {{ $t('common.edit') }}
              </a-button>
            </div>
          </div>
        </a-card>
      </div>
    </a-spin>

    <task-form-modal
      v-model:visible="showEditModal"
      :task="task"
      :is-edit="true"
      @submit="handleUpdateTask"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import CommentSection from '../components/task/CommentSection.vue'
import AttachmentSection from '../components/task/AttachmentSection.vue'
import ActivitySection from '../components/task/ActivitySection.vue'
import TaskFormModal from '../components/board/TaskFormModal.vue'
import { useTaskColors } from '../composables/useTaskColors'
import { useModal } from '../composables/useModal'
import { useAsyncAction } from '../composables/useAsyncAction'
import { getInitials } from '../utils/textHelpers'
import { formatDate } from '../utils/textHelpers'

export default {
  name: 'TaskDetailView',
  components: {
    ArrowLeftOutlined,
    CommentSection,
    AttachmentSection,
    ActivitySection,
    TaskFormModal
  },
  setup() {
    const route = useRoute()
    const tasksStore = useTasksStore()
    const authStore = useAuthStore()
    const { getPriorityColor, getStatusColor } = useTaskColors()
    const editModal = useModal()
    const { execute } = useAsyncAction()
    
    const activeTab = ref('comments')
    const task = computed(() => tasksStore.currentTask)
    const loading = computed(() => tasksStore.loading)
    const canEdit = computed(() => task.value ? authStore.canEditTask(task.value) : false)
    
    const handleEdit = () => {
      editModal.open()
    }
    
    const handleUpdateTask = async (taskData) => {
      await execute(
        () => tasksStore.updateTask(task.value.id, taskData),
        {
          successMessage: 'Task updated successfully',
          onSuccess: async () => {
            editModal.close()
            await tasksStore.fetchTaskById(route.params.id)
          }
        }
      )
    }
    
    onMounted(() => {
      tasksStore.fetchTaskById(route.params.id)
    })
    
    return {
      task,
      loading,
      canEdit,
      activeTab,
      showEditModal: editModal.isVisible,
      getPriorityColor,
      getStatusColor,
      getInitials,
      formatDate,
      handleEdit,
      handleUpdateTask
    }
  }
}
</script>

<style lang="scss" scoped>
.task-detail-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.task-header {
  margin-bottom: 24px;
}

.task-main {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

.task-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

.task-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.task-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.sidebar-section {
  margin-bottom: 24px;

  h4 {
    font-weight: 600;
    margin-bottom: 12px;
  }
}

.assignee-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  .label {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
