<script setup name="productImageList">
import { useRouter } from 'vue-router'
import ListToolbar from '@/components/ListToolbar/index.vue'
import PaginationBar from '@/components/PaginationBar/index.vue'
import ProductImageFilters from './components/ProductImageFilters.vue'
import ProductImageTable from './components/ProductImageTable.vue'
import { useProductImageList } from './useProductImageList'

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
} = useProductImageList()

function handleAdd() {
  router.push({ name: 'productImageAdd' })
}

function handleEdit(row) {
  router.push({ name: 'productImageEdit', query: { id: row.productImgId } })
}

function handleDetail(row) {
  router.push({ name: 'productImageDetail', query: { id: row.productImgId } })
}
</script>

<template>
  <div class="app-container">
    <ProductImageFilters
      v-model:keyword="listQuery.keyword"
      v-model:language="listQuery.language"
      v-model:verify="listQuery.verify"
      v-model:date-range="dateRange"
      @search="handleSearchList"
      @reset="handleResetSearch"
    />

    <ListToolbar title="公共图库">
      <el-button
        v-permission="['Post_ProductImg_AddProductImg']"
        type="primary"
        size="small"
        icon="Plus"
        @click="handleAdd"
      >
        新增图片
      </el-button>
    </ListToolbar>

    <ProductImageTable
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
