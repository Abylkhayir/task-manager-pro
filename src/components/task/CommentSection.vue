<template>
  <div class="comment-section">
    <div class="comment-form">
      <a-textarea
        v-model:value="newComment"
        :placeholder="$t('task.addComment')"
        :rows="3"
      />
      <a-button type="primary" @click="handleAddComment" :loading="loading">
        {{ $t('task.addComment') }}
      </a-button>
    </div>

    <a-list :data-source="comments" :loading="loading">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #avatar>
              <a-avatar :style="{ backgroundColor: '#1890ff' }">
                {{ getInitials(item.author) }}
              </a-avatar>
            </template>
            <template #title>
              {{ item.author }}
              <span class="comment-time">{{ formatDate(item.createdAt) }}</span>
            </template>
            <template #description>
              {{ item.text }}
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>

    <a-empty v-if="comments.length === 0 && !loading" :description="$t('task.noComments')" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { commentsService } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import { useAsyncAction } from '../../composables/useAsyncAction'
import { getInitials, formatDateTime } from '../../utils/textHelpers'

export default {
  name: 'CommentSection',
  props: {
    taskId: [String, Number]
  },
  setup(props) {
    const comments = ref([])
    const newComment = ref('')
    const authStore = useAuthStore()
    const { loading, execute } = useAsyncAction()
    
    const fetchComments = async () => {
      await execute(
        () => commentsService.getComments(props.taskId),
        {
          showNotification: false,
          onSuccess: (data) => {
            comments.value = data
          }
        }
      )
    }
    
    const handleAddComment = async () => {
      if (!newComment.value.trim()) return
      
      await execute(
        () => commentsService.createComment(props.taskId, {
          text: newComment.value,
          author: authStore.currentUser?.name || 'Unknown User',
          createdAt: new Date().toISOString()
        }),
        {
          successMessage: 'Comment added successfully',
          onSuccess: (comment) => {
            comments.value.unshift(comment)
            newComment.value = ''
          }
        }
      )
    }
    
    onMounted(fetchComments)
    
    return { 
      comments, 
      newComment, 
      loading, 
      handleAddComment, 
      getInitials, 
      formatDate: formatDateTime 
    }
  }
}</script>

<style lang="scss" scoped>
.comment-form {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
