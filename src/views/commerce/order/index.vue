<script setup name="orderList">
import { useRouter } from 'vue-router'
import ListToolbar from '@/components/ListToolbar/index.vue'
import PaginationBar from '@/components/PaginationBar/index.vue'
import OrderFilters from './components/OrderFilters.vue'
import OrderTable from './components/OrderTable.vue'
import { useOrderList } from './useOrderList'

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
  handleCurrentChange
} = useOrderList()

function handleDetail(row) {
  router.push({ name: 'orderListDetail', query: { id: row.orderId } })
}
</script>

<template>
  <div class="app-container">
    <OrderFilters
      v-model:keyword="listQuery.keyword"
      v-model:language="listQuery.language"
      v-model:order-state="listQuery.orderState"
      v-model:pay-state="listQuery.payState"
      v-model:pay-type="listQuery.payType"
      v-model:date-range="dateRange"
      @search="handleSearchList"
      @reset="handleResetSearch"
    />

    <ListToolbar title="订单列表" />

    <OrderTable :rows="list" :loading="listLoading" @detail="handleDetail" />

    <PaginationBar
      v-model:current-page="listQuery.pageIndex"
      v-model:page-size="listQuery.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
