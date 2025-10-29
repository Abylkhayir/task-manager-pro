<template>
  <div class="kanban-column">
    <div class="column-header">
      <h3 class="column-title">
        <span class="column-icon">{{ columnIcon }}</span>
        {{ $t(`board.${status}`) }}
        <a-badge :count="tasks.length" :number-style="{ backgroundColor: columnColor }" />
      </h3>
    </div>

    <div
      class="column-content"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      :class="{ 'drag-over': isDragOver }"
    >
      <task-card
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        draggable="true"
        @dragstart="handleDragStart($event, task)"
        @dragend="handleDragEnd"
        @edit="$emit('edit', task)"
        @delete="$emit('delete', $event)"
      />

      <a-empty
        v-if="tasks.length === 0"
        :description="$t('common.noData')"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      />
    </div>
  </div>
</template>

<script>import { ref, computed } from 'vue'
import { Empty } from 'ant-design-vue'
import TaskCard from './TaskCard.vue'
export default {
  name: 'KanbanColumn',
  components: {
    TaskCard
  },
  props: {
    status: {
      type: String,
      required: true
    },
    tasks: {
      type: Array,
      default: () => []
    }
  },
  emits: ['task-moved', 'edit', 'delete'],
  setup(props, { emit }) {
    const isDragOver = ref(false)
    const draggedTask = ref(null)
    const columnIcon = computed(() => {
      const icons = {
        todo: '📋',
        inProgress: '⚙️',
        done: '✅'
      }
      return icons[props.status] || '📌'
    })
    const columnColor = computed(() => {
      const colors = {
        todo: '#1890ff',
        inProgress: '#fa8c16',
        done: '#52c41a'
      }
      return colors[props.status] || '#d9d9d9'
    })
    const handleDragStart = (event, task) => {
      draggedTask.value = task
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/json', JSON.stringify({
        id: task.id,
        status: task.status
      }))
    }
    const handleDragEnd = () => {
      isDragOver.value = false
      draggedTask.value = null
    }
    const handleDrop = (event) => {
      event.preventDefault()
      isDragOver.value = false
      try {
        const data = JSON.parse(event.dataTransfer.getData('application/json'))
        if (data && data.id && data.status !== props.status) {
          console.log(`Moving task ${data.id} from ${data.status} to ${props.status}`)
          emit('task-moved', data.id, props.status)
        }
      } catch (e) {
        console.error('Drop error:', e)
      }
      draggedTask.value = null
    }
    return {
      isDragOver,
      columnIcon,
      columnColor,
      handleDragStart,
      handleDragEnd,
      handleDrop,
      Empty
    }
  }
}</script>

<style lang="scss" scoped>
.kanban-column {
  flex: 1;
  min-width: 320px;
  background: #f7f8fa;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
}

.column-header {
  margin-bottom: 16px;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: inherit;

  .column-icon {
    font-size: 20px;
  }
}

.column-content {
  flex: 1;
  min-height: 200px;
  transition: background-color 0.3s ease;
  border-radius: 8px;
  padding: 8px;

  &.drag-over {
    background: rgba(24, 144, 255, 0.1);
    border: 2px dashed #1890ff;
  }
}
</style>
