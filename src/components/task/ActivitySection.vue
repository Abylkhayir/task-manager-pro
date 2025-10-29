<template>
  <div class="activity-section">
    <a-timeline>
      <a-timeline-item v-for="item in activities" :key="item.id" :color="getActivityColor(item.type)">
        <template #dot>
          <component :is="getActivityIcon(item.type)" />
        </template>
        <div class="activity-item">
          <div class="activity-header">
            <strong>{{ item.user }}</strong>
            <span class="activity-action">{{ item.action }}</span>
          </div>
          <div class="activity-time">{{ formatDate(item.timestamp) }}</div>
          <div v-if="item.details" class="activity-details">{{ item.details }}</div>
        </div>
      </a-timeline-item>
    </a-timeline>

    <a-empty v-if="activities.length === 0 && !loading" description="No activity yet" />
  </div>
</template>

<script>import { ref, onMounted } from 'vue'
import { activityService } from '../../services/api'
import {
  PlusCircleOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  PaperClipOutlined
} from '@ant-design/icons-vue'
export default {
  name: 'ActivitySection',
  components: {
    PlusCircleOutlined,
    EditOutlined,
    CheckCircleOutlined,
    CommentOutlined,
    PaperClipOutlined
  },
  props: {
    taskId: [String, Number]
  },
  setup(props) {
    const activities = ref([])
    const loading = ref(false)
    const getActivityIcon = (type) => {
      const icons = {
        created: PlusCircleOutlined,
        updated: EditOutlined,
        completed: CheckCircleOutlined,
        commented: CommentOutlined,
        attached: PaperClipOutlined
      }
      return icons[type] || EditOutlined
    }
    const getActivityColor = (type) => {
      const colors = {
        created: 'blue',
        updated: 'orange',
        completed: 'green',
        commented: 'purple',
        attached: 'cyan'
      }
      return colors[type] || 'gray'
    }
    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }
    const fetchActivities = async () => {
      loading.value = true
      try {
        activities.value = await activityService.getActivity(props.taskId)
      } finally {
        loading.value = false
      }
    }
    onMounted(fetchActivities)
    return {
      activities,
      loading,
      getActivityIcon,
      getActivityColor,
      formatDate
    }
  }
}</script>

<style lang="scss" scoped>
.activity-item {
  .activity-header {
    margin-bottom: 4px;

    .activity-action {
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.65);
    }
  }

  .activity-time {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    margin-bottom: 8px;
  }

  .activity-details {
    padding: 8px 12px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 13px;
  }
}
</style>
