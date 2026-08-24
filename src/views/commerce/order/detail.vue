<script setup name="orderListDetail">
import PageHeader from '@/components/PageHeader/index.vue'
import OrderDetailPanel from './components/OrderDetailPanel.vue'
import { useOrderDetail } from './useOrderDetail'

const { order, loading, backToList } = useOrderDetail()
</script>

<template>
  <div class="app-container">
    <PageHeader title="订单详情" icon="Document">
      <template #extra>
        <el-button size="small" link @click="backToList">返回订单列表</el-button>
      </template>
    </PageHeader>

    <div v-loading="loading" class="detail-loading-shell">
      <OrderDetailPanel :order="order" />
    </div>
  </div>
</template>

<style scoped>
.detail-loading-shell {
  min-height: 360px;
}
</style>
