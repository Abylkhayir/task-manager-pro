<template>
  <a-card 
    :class="['task-card', `priority-${task.priority}`]"
    :hoverable="true"
    @click="handleCardClick"
  >
    <template #extra>
      <a-dropdown v-if="canEdit" :trigger="['click']" @click.stop>
        <a-button type="text" size="small">
          <MoreOutlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item key="edit" @click="$emit('edit', task)">
              <EditOutlined />
              {{ $t('common.edit') }}
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="delete" danger @click="$emit('delete', task.id)">
              <DeleteOutlined />
              {{ $t('common.delete') }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>

    <div class="task-header">
      <h4 class="task-title">{{ task.title }}</h4>
      <a-tag :color="getPriorityColor(task.priority)" class="priority-tag">
        {{ $t(`priority.${task.priority}`) }}
      </a-tag>
    </div>

    <p v-if="task.description" class="task-description">
      {{ truncateText(task.description, 80) }}
    </p>

    <div class="task-tags" v-if="task.tags && task.tags.length > 0">
      <a-tag v-for="tag in task.tags" :key="tag" class="task-tag">
        {{ tag }}
      </a-tag>
    </div>

    <div class="task-footer">
      <div class="task-assignee">
        <a-avatar :size="24" :style="{ backgroundColor: getAvatarColor(assigneeName) }">
          {{ getInitials(assigneeName) }}
        </a-avatar>
        <span class="assignee-name">{{ assigneeName }}</span>
      </div>

      <div class="task-meta">
        <span class="meta-item" v-if="task.comments?.length">
          <CommentOutlined />
          {{ task.comments.length }}
        </span>
        <span class="meta-item" v-if="task.attachments?.length">
          <PaperClipOutlined />
          {{ task.attachments.length }}
        </span>
      </div>
    </div>
  </a-card>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { AVATAR_COLORS } from '../../constants'
import { truncateText, getInitials, getAvatarColor } from '../../utils/textHelpers'
import { useTaskColors } from '../../composables/useTaskColors'
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  CommentOutlined,
  PaperClipOutlined
} from '@ant-design/icons-vue'

export default {
  name: 'TaskCard',
  components: {
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    CommentOutlined,
    PaperClipOutlined
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  setup(props) {
    const router = useRouter()
    const authStore = useAuthStore()
    const { getPriorityColor } = useTaskColors()
    
    const canEdit = computed(() => authStore.canEditTask(props.task))
    
    const assigneeName = computed(() => {
      const assignee = props.task.assignee
      
      if (!assignee) return 'Unassigned'
      
      if (typeof assignee === 'object') {
        if (assignee.name && assignee.name.trim()) {
          return assignee.name
        }
        if (assignee.id) {
          return `User #${assignee.id}`
        }
        return 'Unknown User'
      }
      
      return `User #${assignee}`
    })
    
    const handleCardClick = () => {
      router.push(`/tasks/${props.task.id}`)
    }
    
    return {
      canEdit,
      assigneeName,
      handleCardClick,
      getPriorityColor,
      getAvatarColor: (name) => getAvatarColor(name, AVATAR_COLORS),
      getInitials,
      truncateText
    }
  }
}</script>

<style lang="scss" scoped>
.task-card {
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.priority-critical {
    border-left-color: #ff4d4f;
  }

  &.priority-high {
    border-left-color: #fa8c16;
  }

  &.priority-medium {
    border-left-color: #1890ff;
  }

  &.priority-low {
    border-left-color: #d9d9d9;
  }

  :deep(.ant-card-head) {
    padding: 12px 16px;
    min-height: auto;
  }

  :deep(.ant-card-body) {
    padding: 16px;
  }
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.priority-tag {
  margin-left: 8px;
  flex-shrink: 0;
}

.task-description {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin: 8px 0;
  line-height: 1.5;
}

.task-tags {
  margin: 12px 0;
}

.task-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 8px;

  .assignee-name {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.65);
  }
}

.task-meta {
  display: flex;
  gap: 12px;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
