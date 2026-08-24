<script setup name="userProductImage">
import { shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchPanel from '@/components/SearchPanel/index.vue'
import ListToolbar from '@/components/ListToolbar/index.vue'
import PaginationBar from '@/components/PaginationBar/index.vue'
import { usePagedList, cleanQuery } from '@/composables/usePagedList'
import UserProductImageFormDialog from './UserProductImageFormDialog.vue'
import UserProductImageTable from './UserProductImageTable.vue'
import {
  addUserProductImg,
  deleteUserProductImg,
  editUserProductImg,
  getUserProductImgDetail,
  getUserProductImgList
} from '@/api/userProductImage'

const languageOptions = [
  { value: 1, label: '英语' },
  { value: 2, label: '简中' },
  { value: 3, label: '繁中' },
  { value: 4, label: '日文' }
]

const defaultListQuery = () => ({
  pageIndex: 1,
  pageSize: 10,
  keyword: null,
  language: null,
  userProductId: null
})

const dateList = shallowRef([])
const dialogVisible = shallowRef(false)
const dialogMode = shallowRef('add')
const dialogData = shallowRef({})
const submitting = shallowRef(false)

const {
  listQuery,
  list,
  total,
  listLoading,
  getList,
  handleSearchList: searchList,
  handleResetSearch: resetSearch,
  handleSizeChange,
  handleCurrentChange
} = usePagedList({
  fetchList: getUserProductImgList,
  defaultQuery: defaultListQuery,
  buildParams: cleanQuery
})

function getRowId(row) {
  return row.uProductImgId || row.uproductImgId || row.id
}

function applyDateRange() {
  if (dateList.value?.length) {
    listQuery.startDate = dateList.value[0]
    listQuery.endDate = dateList.value[1]
    return
  }
  delete listQuery.startDate
  delete listQuery.endDate
}

function handleSearchList() {
  applyDateRange()
  searchList()
}

function handleResetSearch() {
  dateList.value = []
  resetSearch()
}

function handleAdd() {
  dialogMode.value = 'add'
  dialogData.value = {}
  dialogVisible.value = true
}

async function handleEdit(row) {
  const response = await getUserProductImgDetail({ id: getRowId(row) })
  dialogMode.value = 'edit'
  dialogData.value = { ...row, ...(response.retData || {}) }
  dialogVisible.value = true
}

async function handleSubmit(payload) {
  submitting.value = true
  try {
    const request = dialogMode.value === 'edit' ? editUserProductImg : addUserProductImg
    await request(payload)
    ElMessage.success(dialogMode.value === 'edit' ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    await getList()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('是否确认删除该用户产品图片?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteUserProductImg({ id: getRowId(row) })
    ElMessage.success('删除成功')
    await getList()
  } catch (error) {
    if (error === 'cancel' || error === 'close') ElMessage.info('取消删除')
  }
}
</script>

<template>
  <div class="app-container">
    <SearchPanel :model="listQuery" @search="handleSearchList" @reset="handleResetSearch">
      <el-form-item label="设备ID">
        <el-input
          v-model="listQuery.keyword"
          class="input-width"
          placeholder="请输入设备ID"
          clearable
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="用户产品ID">
        <el-input-number
          v-model="listQuery.userProductId"
          :min="1"
          :max="2147483647"
          :precision="0"
          :controls="false"
          class="input-width"
          placeholder="请输入用户产品ID"
        />
      </el-form-item>
      <el-form-item label="语言">
        <el-select v-model="listQuery.language" clearable placeholder="请选择语言" style="width: 140px">
          <el-option
            v-for="item in languageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="dateList"
          style="width: 300px"
          type="daterange"
          unlink-panels
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
    </SearchPanel>

    <ListToolbar title="用户产品图片列表">
      <el-button
        v-permission="['Post_UserProductImg_AddUserProductImg']"
        size="small"
        icon="Plus"
        type="primary"
        @click="handleAdd"
      >
        新增图片
      </el-button>
    </ListToolbar>

    <UserProductImageTable
      :rows="list"
      :loading="listLoading"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <PaginationBar
      v-model:current-page="listQuery.pageIndex"
      v-model:page-size="listQuery.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <UserProductImageFormDialog
      v-model="dialogVisible"
      :mode="dialogMode"
      :initial-data="dialogData"
      :submitting="submitting"
      @submit="handleSubmit"
    />
  </div>
</template>
