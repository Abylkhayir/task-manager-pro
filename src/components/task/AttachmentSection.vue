<template>
  <div class="attachment-section">
    <a-upload
      :file-list="fileList"
      :before-upload="beforeUpload"
      :custom-request="handleUpload"
      @remove="handleRemove"
    >
      <a-button type="primary">
        <UploadOutlined />
        {{ $t('task.uploadFile') }}
      </a-button>
    </a-upload>

    <a-list :data-source="attachments" :loading="loading" style="margin-top: 24px">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #avatar>
              <FileOutlined style="font-size: 24px" />
            </template>
            <template #title>
              <a :href="item.url" target="_blank">{{ item.name }}</a>
            </template>
            <template #description>
              {{ formatSize(item.size) }} • {{ formatDate(item.uploadedAt) }}
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-progress v-if="item.uploading" :percent="item.progress" />
          </template>
        </a-list-item>
      </template>
    </a-list>

    <a-empty v-if="attachments.length === 0 && !loading" :description="$t('task.noAttachments')" />
  </div>
</template>

<script>import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { attachmentsService } from '../../services/api'
import { UploadOutlined, FileOutlined } from '@ant-design/icons-vue'
export default {
  name: 'AttachmentSection',
  components: {
    UploadOutlined,
    FileOutlined
  },
  props: {
    taskId: [String, Number]
  },
  setup(props) {
    const attachments = ref([])
    const fileList = ref([])
    const loading = ref(false)
    const formatSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }
    const formatDate = (date) => new Date(date).toLocaleString()
    const fetchAttachments = async () => {
      loading.value = true
      try {
        attachments.value = await attachmentsService.getAttachments(props.taskId)
      } finally {
        loading.value = false
      }
    }
    const beforeUpload = (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!')
      }
      return isLt10M
    }
    const handleUpload = async ({ file, onProgress, onSuccess, onError }) => {
      try {
        const attachment = await attachmentsService.uploadAttachment(
          props.taskId,
          file,
          (percent) => onProgress({ percent })
        )
        attachments.value.push(attachment)
        onSuccess()
        message.success('File uploaded successfully')
      } catch (error) {
        onError(error)
        message.error('Failed to upload file')
      }
    }
    const handleRemove = async (file) => {
      try {
        await attachmentsService.deleteAttachment(props.taskId, file.uid)
        attachments.value = attachments.value.filter(a => a.id !== file.uid)
        message.success('File removed')
      } catch (error) {
        message.error('Failed to remove file')
      }
    }
    onMounted(fetchAttachments)
    return {
      attachments,
      fileList,
      loading,
      formatSize,
      formatDate,
      beforeUpload,
      handleUpload,
      handleRemove
    }
  }
}</script>
