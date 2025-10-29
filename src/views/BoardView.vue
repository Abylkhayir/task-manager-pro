<template>
  <div class="board-view">
    <div class="board-header">
      <h1 class="board-title">{{ $t('board.title') }}</h1>
      <a-button type="primary" size="large" @click="createModal.open()">
        <template #icon><PlusOutlined /></template>
        {{ $t('board.addTask') }}
      </a-button>
    </div>

    <div class="board-filters">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input
            v-model:value="filters.search"
            :placeholder="$t('common.search')"
            allow-clear
            @change="handleFilterChange"
          >
            <template #prefix><SearchOutlined /></template>
          </a-input>
        </a-col>

        <a-col :span="4">
          <a-select
            v-model:value="filters.status"
            :placeholder="$t('board.filterByStatus')"
            allow-clear
            style="width: 100%"
            @change="handleFilterChange"
          >
            <a-select-option value="">{{ $t('board.allStatuses') }}</a-select-option>
            <a-select-option :value="TASK_STATUS.TODO">{{ $t('status.todo') }}</a-select-option>
            <a-select-option :value="TASK_STATUS.IN_PROGRESS">{{ $t('status.inProgress') }}</a-select-option>
            <a-select-option :value="TASK_STATUS.DONE">{{ $t('status.done') }}</a-select-option>
          </a-select>
        </a-col>

        <a-col :span="4">
          <a-select
            v-model:value="filters.priority"
            :placeholder="$t('board.filterByPriority')"
            allow-clear
            style="width: 100%"
            @change="handleFilterChange"
          >
            <a-select-option value="">{{ $t('board.allPriorities') }}</a-select-option>
            <a-select-option :value="TASK_PRIORITY.LOW">{{ $t('priority.low') }}</a-select-option>
            <a-select-option :value="TASK_PRIORITY.MEDIUM">{{ $t('priority.medium') }}</a-select-option>
            <a-select-option :value="TASK_PRIORITY.HIGH">{{ $t('priority.high') }}</a-select-option>
            <a-select-option :value="TASK_PRIORITY.CRITICAL">{{ $t('priority.critical') }}</a-select-option>
          </a-select>
        </a-col>

        <a-col :span="6">
          <a-select
            v-model:value="filters.tags"
            mode="multiple"
            :placeholder="$t('board.filterByTags')"
            allow-clear
            style="width: 100%"
            @change="handleFilterChange"
          >
            <a-select-option v-for="tag in availableTags" :key="tag" :value="tag">
              {{ tag }}
            </a-select-option>
          </a-select>
        </a-col>

        <a-col :span="4">
          <a-button block @click="resetFilters">
            {{ $t('common.filter') }}
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-spin :spinning="loading">
      <div class="board-columns">
        <kanban-column
          v-for="status in [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE]"
          :key="status"
          :status="status"
          :tasks="paginatedTasksByStatus[status]"
          @task-moved="handleTaskMoved"
          @edit="handleEditTask"
          @delete="handleDeleteTask"
        />
      </div>

      <div class="board-pagination">
        <a-pagination
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :total="totalTasks"
          :show-size-changer="true"
          :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} tasks`"
          :page-size-options="PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS"
          @change="handlePageChange"
        />
      </div>
    </a-spin>

    <task-form-modal
      v-model:visible="showCreateModal"
      @submit="handleCreateTask"
    />

    <task-form-modal
      v-model:visible="showEditModal"
      :task="editingTask"
      :is-edit="true"
      @submit="handleUpdateTask"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import KanbanColumn from '../components/board/KanbanColumn.vue'
import TaskFormModal from '../components/board/TaskFormModal.vue'
import { useWebSocket } from '../composables/useWebSocket'
import { useModal } from '../composables/useModal'
import { useAsyncAction } from '../composables/useAsyncAction'
import { TASK_STATUS, TASK_PRIORITY, PAGINATION_DEFAULTS } from '../constants'

export default {
  name: 'BoardView',
  components: {
    KanbanColumn,
    TaskFormModal,
    PlusOutlined,
    SearchOutlined
  },
  setup() {
    const tasksStore = useTasksStore()
    const { setupWebSocket, cleanupWebSocket } = useWebSocket()
    const createModal = useModal()
    const editModal = useModal()
    const { execute } = useAsyncAction()
    
    const currentPage = ref(PAGINATION_DEFAULTS.CURRENT)
    const pageSize = ref(PAGINATION_DEFAULTS.PAGE_SIZE)
    const filters = reactive({
      search: '',
      status: null,
      priority: null,
      tags: []
    })
    
    const loading = computed(() => tasksStore.loading)
    const tasksByStatus = computed(() => tasksStore.tasksByStatus)
    const totalTasks = computed(() => tasksStore.filteredTasks.length)

    const paginatedTasksByStatus = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      const allFilteredTasks = tasksStore.filteredTasks.slice(start, end)
      const grouped = {
        [TASK_STATUS.TODO]: [],
        [TASK_STATUS.IN_PROGRESS]: [],
        [TASK_STATUS.DONE]: []
      }
      allFilteredTasks.forEach(task => {
        if (grouped[task.status]) {
          grouped[task.status].push(task)
        }
      })
      return grouped
    })
    
    const availableTags = computed(() => {
      const tags = new Set()
      tasksStore.tasks.forEach(task => {
        task.tags?.forEach(tag => tags.add(tag))
      })
      return Array.from(tags)
    })
    
    const handleFilterChange = () => {
      tasksStore.setFilters(filters)
      currentPage.value = 1
    }
    
    const resetFilters = () => {
      filters.search = ''
      filters.status = null
      filters.priority = null
      filters.tags = []
      tasksStore.resetFilters()
      currentPage.value = 1
    }
    
    const handlePageChange = (page, newPageSize) => {
      currentPage.value = page
      if (newPageSize) {
        pageSize.value = newPageSize
      }
    }
    
    const handleTaskMoved = async (taskId, newStatus) => {
      await execute(
        () => tasksStore.updateTaskStatus(taskId, newStatus),
        { successMessage: 'Task moved successfully' }
      )
    }
    
    const handleCreateTask = async (taskData) => {
      await execute(
        () => tasksStore.createTask(taskData),
        {
          successMessage: 'Task created successfully',
          onSuccess: () => createModal.close()
        }
      )
    }
    
    const handleEditTask = (task) => {
      editModal.open(task)
    }
    
    const handleUpdateTask = async (taskData) => {
      await execute(
        () => tasksStore.updateTask(editModal.data.value.id, taskData),
        {
          successMessage: 'Task updated successfully',
          onSuccess: () => editModal.close()
        }
      )
    }
    
    const handleDeleteTask = async (taskId) => {
      await execute(
        () => tasksStore.deleteTask(taskId),
        { successMessage: 'Task deleted successfully' }
      )
    }
    
    onMounted(() => {
      setupWebSocket()
      execute(() => tasksStore.fetchTasks())
    })
    
    onUnmounted(() => {
      cleanupWebSocket()
    })
    
    return {
      loading,
      tasksByStatus,
      paginatedTasksByStatus,
      availableTags,
      filters,
      createModal,
      showCreateModal: createModal.isVisible,
      showEditModal: editModal.isVisible,
      editingTask: editModal.data,
      currentPage,
      pageSize,
      totalTasks,
      handleFilterChange,
      resetFilters,
      handlePageChange,
      handleTaskMoved,
      handleCreateTask,
      handleEditTask,
      handleUpdateTask,
      handleDeleteTask,
      TASK_STATUS,
      TASK_PRIORITY,
      PAGINATION_DEFAULTS
    }
  }
}</script>

<style lang="scss" scoped>
.board-view {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.board-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.board-filters {
  margin-bottom: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: background-color 0.3s ease;
}

.board-columns {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 24px;
}

.board-pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: background-color 0.3s ease;
}
</style>
