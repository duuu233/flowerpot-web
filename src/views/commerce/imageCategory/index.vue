<script setup name="imageCategoryList">
import { useRouter } from 'vue-router'
import ListToolbar from '@/components/ListToolbar/index.vue'
import PaginationBar from '@/components/PaginationBar/index.vue'
import ImageCategoryFilters from './components/ImageCategoryFilters.vue'
import ImageCategoryTable from './components/ImageCategoryTable.vue'
import { useImageCategoryList } from './useImageCategoryList'

const router = useRouter()
const {
  listQuery,
  list,
  total,
  listLoading,
  dateRange,
  changingId,
  handleSearchList,
  handleResetSearch,
  handleSizeChange,
  handleCurrentChange,
  handleStatusChange
} = useImageCategoryList()

function handleAdd() {
  router.push({ name: 'imageCategoryAdd' })
}

function handleEdit(row) {
  router.push({ name: 'imageCategoryEdit', query: { id: row.categoryId } })
}

function handleDetail(row) {
  router.push({ name: 'imageCategoryDetail', query: { id: row.categoryId } })
}
</script>

<template>
  <div class="app-container">
    <ImageCategoryFilters
      v-model:keyword="listQuery.keyword"
      v-model:language="listQuery.language"
      v-model:verify="listQuery.verify"
      v-model:date-range="dateRange"
      @search="handleSearchList"
      @reset="handleResetSearch"
    />

    <ListToolbar title="图库分类">
      <el-button
        v-permission="['Post_ProductImg_AddImgCategory']"
        type="primary"
        size="small"
        icon="Plus"
        @click="handleAdd"
      >
        新增分类
      </el-button>
    </ListToolbar>

    <ImageCategoryTable
      :rows="list"
      :loading="listLoading"
      :changing-id="changingId"
      @edit="handleEdit"
      @detail="handleDetail"
      @toggle-status="handleStatusChange"
    />

    <PaginationBar
      v-model:current-page="listQuery.pageIndex"
      v-model:page-size="listQuery.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
