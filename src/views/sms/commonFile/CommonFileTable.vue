<script setup>
import { formatDate } from '@/utils/date'

defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  deletingId: { type: Number, default: null },
  submitting: { type: Boolean, default: false }
})
const emit = defineEmits(['edit', 'delete'])

function fileLink(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

function dateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}
</script>

<template>
  <div class="table-container">
    <vxe-table :data="rows" :loading="loading" border round stripe
      :row-config="{ isHover: true, keyField: 'fileId' }" :column-config="{ resizable: true }" max-height="580">
      <vxe-column field="fileId" title="编号" width="90" align="center" />
      <vxe-column field="fileName" title="表情名称" min-width="210" show-overflow>
        <template #default="{ row }">
          <div class="file-identity"><el-icon class="file-icon"><Document /></el-icon>
            <span>{{ row.fileName || '-' }}</span></div>
        </template>
      </vxe-column>
      <vxe-column field="filePath" title="表情地址" min-width="340" show-overflow>
        <template #default="{ row }">
          <a v-if="fileLink(row.filePath)" :href="fileLink(row.filePath)" target="_blank"
            rel="noopener noreferrer" class="file-link">{{ row.filePath }}</a>
          <span v-else>{{ row.filePath || '-' }}</span>
        </template>
      </vxe-column>
      <vxe-column title="添加时间" width="175" align="center">
        <template #default="{ row }">{{ dateTime(row.joinTime) }}</template>
      </vxe-column>
      <vxe-column title="操作" width="160" align="center" fixed="right">
        <template #default="{ row }">
          <div class="handle-table-box">
            <el-button v-permission="['Post_CommonFile_EditCommonFile']" size="small" type="primary"
              :disabled="submitting || deletingId !== null" @click="emit('edit', row)">编辑</el-button>
            <el-button v-permission="['Post_CommonFile_DelCommonFile']" size="small" type="danger"
              :loading="deletingId === row.fileId" :disabled="submitting || deletingId !== null"
              @click="emit('delete', row)">删除</el-button>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<style scoped>
.file-identity { display: flex; align-items: center; gap: 10px; }
.file-icon { padding: 8px; border-radius: 8px; background: var(--brand-50); color: var(--brand-500); }
.file-link { color: var(--el-color-primary); text-decoration: none; }
.file-link:hover { text-decoration: underline; }
</style>
