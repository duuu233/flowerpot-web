<script setup name="MultiUpload">
import { computed, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { setFileUpload } from '@/api/oss'
import {
  createUploadPreviewUrl,
  getUploadPreviewUrl,
  isValidUploadSize,
  normalizeUploadFileList,
  normalizeUploadedFiles,
  revokeUploadPreviewUrl
} from './utils'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxCount: {
    type: Number,
    default: 5
  },
  disabled: {
    type: Boolean,
    default: false
  },
  generateThumbnail: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])

const fileList = computed({
  get: () => normalizeUploadFileList(props.modelValue),
  set: (val) => emit('update:modelValue', normalizeUploadFileList(val))
})

function withLocalPreview(files, file) {
  const previewUrl = createUploadPreviewUrl(file)
  if (!previewUrl) return files
  return files.map((item) => ({ ...item, previewUrl }))
}

function beforeUpload(file) {
  const isImage = file.type.indexOf('image') !== -1
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isValidUploadSize(file)) {
    ElMessage.error('文件大小不能超过 15M')
    return false
  }
  return true
}

async function handleUpload(option) {
  try {
    const remainingCount = props.maxCount - fileList.value.length
    if (remainingCount <= 0) return

    const uploadOptions = props.generateThumbnail ? { isUploadThumb: 1 } : undefined
    const response = await setFileUpload(option.file, uploadOptions)
    const uploadedFiles = withLocalPreview(
      normalizeUploadedFiles(response.retData, option.file).slice(0, remainingCount),
      option.file
    )
    if (!uploadedFiles.length) throw new Error('Upload response does not include a file URL')

    fileList.value = fileList.value.concat(uploadedFiles)
    option.onSuccess?.(response)
  } catch (error) {
    option.onError?.(error)
    ElMessage.error('上传失败')
  }
}

function handleRemove(index) {
  const newList = fileList.value.slice()
  const removedFiles = newList.splice(index, 1)
  removedFiles.forEach(revokeUploadPreviewUrl)
  fileList.value = newList
}

onBeforeUnmount(() => {
  fileList.value.forEach(revokeUploadPreviewUrl)
})
</script>

<template>
  <div class="multi-upload">
    <el-upload
      v-if="!disabled && fileList.length < maxCount"
      :action="''"
      :http-request="handleUpload"
      :show-file-list="false"
      :before-upload="beforeUpload"
      list-type="picture-card"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
    <div v-if="fileList.length" class="upload-list">
      <div v-for="(item, index) in fileList" :key="item.url || index" class="upload-list-item">
        <img :src="getUploadPreviewUrl(item)" :alt="item.name || ''" />
        <div v-if="!disabled" class="upload-list-item-actions">
          <button
            type="button"
            class="upload-remove-button"
            aria-label="Remove image"
            @click="handleRemove(index)"
          >
            <el-icon><Delete /></el-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multi-upload {
  --multi-upload-size: 112px;

  display: inline-flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  line-height: 1;
}

.multi-upload :deep(.el-upload) {
  display: inline-flex;
}

.multi-upload :deep(.el-upload.el-upload--picture-card) {
  width: var(--multi-upload-size);
  height: var(--multi-upload-size);
  min-width: var(--multi-upload-size);
  min-height: var(--multi-upload-size);
  border-color: var(--app-border-strong);
  border-radius: 8px;
  background: var(--app-surface-muted);
  color: var(--app-muted);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.multi-upload :deep(.el-upload.el-upload--picture-card:hover) {
  border-color: var(--brand-500);
  background: var(--brand-50);
  color: var(--brand-600);
}

.multi-upload :deep(.el-upload.el-upload--picture-card .el-icon) {
  font-size: 24px;
}

.upload-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}

.upload-list-item {
  position: relative;
  flex: 0 0 var(--multi-upload-size);
  width: var(--multi-upload-size);
  height: var(--multi-upload-size);
  border: 1px solid var(--app-border-strong);
  border-radius: 8px;
  background: var(--app-surface-muted);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(31, 45, 61, 0.08);
}

.upload-list-item img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-list-item-actions {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 24, 39, 0.54);
  color: #fff;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.upload-list-item:hover .upload-list-item-actions,
.upload-list-item-actions:focus-within {
  opacity: 1;
}

.upload-remove-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    transform 0.18s ease;
}

.upload-remove-button:hover,
.upload-remove-button:focus-visible {
  background: var(--app-danger);
  outline: none;
  transform: scale(1.04);
}
</style>
