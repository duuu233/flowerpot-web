<script setup name="productPlant">
import { shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchPanel from '@/components/SearchPanel/index.vue'
import ListToolbar from '@/components/ListToolbar/index.vue'
import PaginationBar from '@/components/PaginationBar/index.vue'
import { cleanQuery, usePagedList } from '@/composables/usePagedList'
import {
  addProductPlant,
  editProductPlant,
  getProductPlantDetail,
  getProductPlantList,
  setProductPlantVerify
} from '@/api/productPlant'
import ProductPlantFormDialog from './ProductPlantFormDialog.vue'
import ProductPlantTable from './ProductPlantTable.vue'

const verifyOptions = [
  { value: 1, label: '有效' },
  { value: 0, label: '无效' }
]

const languageOptions = [
  { value: 1, label: '英语' },
  { value: 2, label: '德语' },
  { value: 3, label: '西班牙语' },
  { value: 4, label: '法语' },
  { value: 5, label: '意大利语' },
  { value: 6, label: '葡萄牙语' }
]

const defaultListQuery = () => ({
  pageIndex: 1,
  pageSize: 10,
  keyword: null,
  verify: null,
  language: null
})

const dateRange = shallowRef([])
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
  fetchList: getProductPlantList,
  defaultQuery: defaultListQuery,
  buildParams: cleanQuery
})

function getRowId(row) {
  return row.productPlantId || row.id
}

function applyDateRange() {
  if (dateRange.value?.length) {
    listQuery.startDate = dateRange.value[0]
    listQuery.endDate = dateRange.value[1]
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
  dateRange.value = []
  resetSearch()
}

function handleAdd() {
  dialogMode.value = 'add'
  dialogData.value = {}
  dialogVisible.value = true
}

async function openRecord(row, mode) {
  const response = await getProductPlantDetail({ id: getRowId(row) })
  dialogMode.value = mode
  dialogData.value = { ...row, ...(response.retData || {}) }
  dialogVisible.value = true
}

function handleDetail(row) {
  return openRecord(row, 'detail')
}

function handleEdit(row) {
  return openRecord(row, 'edit')
}

async function handleSubmit(payload) {
  submitting.value = true
  try {
    const request = dialogMode.value === 'edit' ? editProductPlant : addProductPlant
    await request(payload)
    ElMessage.success(dialogMode.value === 'edit' ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    await getList()
  } finally {
    submitting.value = false
  }
}

async function handleToggleStatus({ row, verify }) {
  const action = verify === 1 ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`是否确认${action}植物“${row.plantName || getRowId(row)}”？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await setProductPlantVerify({ id: getRowId(row), verify })
    ElMessage.success(`${action}成功`)
    await getList()
  } catch (error) {
    if (error === 'cancel' || error === 'close') ElMessage.info(`已取消${action}`)
  }
}

</script>

<template>
  <div class="app-container">
    <SearchPanel :model="listQuery" @search="handleSearchList" @reset="handleResetSearch">
      <el-form-item label="植物关键词">
        <el-input
          v-model="listQuery.keyword"
          class="input-width"
          placeholder="名称、学名或别名"
          clearable
          maxlength="30"
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="listQuery.verify" clearable placeholder="请选择状态" style="width: 120px">
          <el-option
            v-for="item in verifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="返回语言">
        <el-select
          v-model="listQuery.language"
          clearable
          placeholder="请选择语言"
          style="width: 150px"
        >
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
          v-model="dateRange"
          type="daterange"
          unlink-panels
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 280px"
        />
      </el-form-item>
    </SearchPanel>

    <ListToolbar title="植物资料列表">
      <el-button
        v-permission="['Post_ProductPlant_AddProductPlant']"
        size="small"
        icon="Plus"
        type="primary"
        @click="handleAdd"
      >
        新增植物
      </el-button>
    </ListToolbar>

    <ProductPlantTable
      :rows="list"
      :loading="listLoading"
      @detail="handleDetail"
      @edit="handleEdit"
      @toggle-status="handleToggleStatus"
    />

    <PaginationBar
      v-model:current-page="listQuery.pageIndex"
      v-model:page-size="listQuery.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <ProductPlantFormDialog
      v-model="dialogVisible"
      :mode="dialogMode"
      :initial-data="dialogData"
      :submitting="submitting"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.input-width {
  width: 210px;
}
</style>
