<script setup name="aiConfigList">
import { shallowRef } from 'vue'
import ListToolbar from '@/components/ListToolbar/index.vue'
import PaginationBar from '@/components/PaginationBar/index.vue'
import AiConfigEditor from './components/AiConfigEditor.vue'
import AiConfigFilters from './components/AiConfigFilters.vue'
import AiConfigTable from './components/AiConfigTable.vue'
import { useAiConfigList } from './useAiConfigList'

const {
  listQuery,
  list,
  total,
  listLoading,
  dateRange,
  changingId,
  getList,
  handleSearchList,
  handleResetSearch,
  handleSizeChange,
  handleCurrentChange,
  handleStatusChange
} = useAiConfigList()

const editorVisible = shallowRef(false)
const editingConfig = shallowRef(null)

function handleEdit(row) {
  editingConfig.value = { ...row }
  editorVisible.value = true
}
</script>

<template>
  <div class="app-container">
    <AiConfigFilters
      v-model:keyword="listQuery.keyword"
      v-model:language="listQuery.language"
      v-model:ai-model="listQuery.aiModel"
      v-model:verify="listQuery.verify"
      v-model:date-range="dateRange"
      @search="handleSearchList"
      @reset="handleResetSearch"
    />

    <ListToolbar title="AI 配置列表" />

    <AiConfigTable
      :rows="list"
      :loading="listLoading"
      :changing-id="changingId"
      @edit="handleEdit"
      @toggle-status="handleStatusChange"
    />

    <PaginationBar
      v-model:current-page="listQuery.pageIndex"
      v-model:page-size="listQuery.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <AiConfigEditor
      v-model:visible="editorVisible"
      :config="editingConfig"
      @saved="getList"
    />
  </div>
</template>
