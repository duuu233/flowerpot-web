<script setup name="commonFile">
import { shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ListToolbar from '@/components/ListToolbar/index.vue'
import PaginationBar from '@/components/PaginationBar/index.vue'
import { usePagedList } from '@/composables/usePagedList'
import { addCommonFile, editCommonFile, delCommonFile, getCommonFileList } from '@/api/commonFile'
import CommonFileFilters from './CommonFileFilters.vue'
import CommonFileTable from './CommonFileTable.vue'
import CommonFileFormDialog from './CommonFileFormDialog.vue'

const { listQuery, list, total, listLoading, getList, handleSearchList,
  handleResetSearch, handleSizeChange, handleCurrentChange } = usePagedList({
  fetchList: getCommonFileList,
  defaultQuery: () => ({ pageIndex: 1, pageSize: 10, keyword: '', startDate: '', endDate: '' })
})

const dialogVisible = shallowRef(false)
const dialogMode = shallowRef('add')
const dialogData = shallowRef({})
const submitting = shallowRef(false)
const deletingId = shallowRef(null)

function search(filters) {
  Object.assign(listQuery, filters)
  return handleSearchList()
}

function openForm(row = null) {
  if (submitting.value) return
  dialogMode.value = row ? 'edit' : 'add'
  dialogData.value = row ? { ...row } : {}
  dialogVisible.value = true
}

async function submit(payload) {
  if (submitting.value) return
  submitting.value = true
  try {
    const isEdit = dialogMode.value === 'edit'
    await (isEdit ? editCommonFile : addCommonFile)(payload)
    ElMessage.success(isEdit ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    if (isEdit) await getList()
    else await handleSearchList()
  } catch {
    // 请求层统一提示失败，保留表单供重试。
  } finally {
    submitting.value = false
  }
}

async function remove(row) {
  if (deletingId.value !== null) return
  deletingId.value = row.fileId
  try {
    await ElMessageBox.confirm('是否确认删除文件“' + row.fileName + '”？', '删除文件', {
      confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning'
    })
    await delCommonFile({ id: row.fileId })
    ElMessage.success('删除成功')
    if (list.value.length === 1 && listQuery.pageIndex > 1) listQuery.pageIndex -= 1
    await getList()
  } catch {
    // 取消时不调用接口；接口错误由请求层显示。
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="app-container">
    <CommonFileFilters @search="search" @reset="handleResetSearch()" />
    <ListToolbar title="文件列表">
      <el-button v-permission="['Post_CommonFile_AddCommonFile']" type="primary"
        size="small" icon="Plus" :disabled="submitting" @click="openForm()">新增文件</el-button>
    </ListToolbar>
    <CommonFileTable :rows="list" :loading="listLoading" :deleting-id="deletingId"
      :submitting="submitting" @edit="openForm" @delete="remove" />
    <PaginationBar v-model:current-page="listQuery.pageIndex" v-model:page-size="listQuery.pageSize"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <CommonFileFormDialog v-model="dialogVisible" :mode="dialogMode" :initial-data="dialogData"
      :submitting="submitting" @submit="submit" />
  </div>
</template>
