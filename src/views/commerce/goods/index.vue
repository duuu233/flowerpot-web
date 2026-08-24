<script setup name="goodsList">
import { useRouter } from 'vue-router'
import ListToolbar from '@/components/ListToolbar/index.vue'
import PaginationBar from '@/components/PaginationBar/index.vue'
import GoodsFilters from './components/GoodsFilters.vue'
import GoodsTable from './components/GoodsTable.vue'
import { useGoodsList } from './useGoodsList'

const router = useRouter()
const {
  listQuery,
  list,
  total,
  listLoading,
  dateRange,
  handleSearchList,
  handleResetSearch,
  handleSizeChange,
  handleCurrentChange,
  handleStatusChange
} = useGoodsList()

function handleAdd() {
  router.push({ name: 'goodsListAdd' })
}

function handleEdit(row) {
  router.push({ name: 'goodsListEdit', query: { id: row.goodsId } })
}

function handleDetail(row) {
  router.push({ name: 'goodsListDetail', query: { id: row.goodsId } })
}
</script>

<template>
  <div class="app-container">
    <GoodsFilters
      v-model:keyword="listQuery.keyword"
      v-model:language="listQuery.language"
      v-model:verify="listQuery.verify"
      v-model:date-range="dateRange"
      @search="handleSearchList"
      @reset="handleResetSearch"
    />

    <ListToolbar title="商品列表">
      <el-button
        v-permission="['Post_Goods_AddGoods']"
        type="primary"
        size="small"
        icon="Plus"
        @click="handleAdd"
      >
        新增商品
      </el-button>
    </ListToolbar>

    <GoodsTable
      :rows="list"
      :loading="listLoading"
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
