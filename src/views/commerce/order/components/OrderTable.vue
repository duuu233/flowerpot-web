<script setup name="OrderTable">
import {
  formatAmount,
  formatDateTime,
  getOptionLabel,
  getOrderStateTagType,
  getPayStateTagType,
  orderStateOptions,
  payStateOptions,
  payTypeOptions,
  terminalOptions
} from '@/views/commerce/utils'

defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['detail'])

function getOrderStateLabel(row) {
  return row.orderStateMsg || getOptionLabel(orderStateOptions, row.orderState)
}

function getPayStateLabel(row) {
  return row.payStateMsg || getOptionLabel(payStateOptions, row.payState)
}

function getPayTypeLabel(row) {
  return row.payTypeMsg || getOptionLabel(payTypeOptions, row.payType)
}

function getTerminalLabel(row) {
  return row.terminalMsg || getOptionLabel(terminalOptions, row.terminal)
}
</script>

<template>
  <div class="table-container">
    <vxe-table
      :data="rows"
      :loading="loading"
      border
      round
      stripe
      :row-config="{ isHover: true }"
      :column-config="{ resizable: true }"
      max-height="560"
    >
      <vxe-column field="orderNo" title="订单号" min-width="230" show-overflow />
      <vxe-column field="goodsName" title="商品名称" min-width="180" show-overflow />
      <vxe-column field="userId" title="用户 ID" width="90" align="center" />
      <vxe-column title="金额" width="100" align="right">
        <template #default="{ row }">
          <span class="amount-text">{{ formatAmount(row.amount) }}</span>
        </template>
      </vxe-column>
      <vxe-column field="num" title="数量" width="75" align="center" />
      <vxe-column title="支付方式" width="115" align="center">
        <template #default="{ row }">{{ getPayTypeLabel(row) }}</template>
      </vxe-column>
      <vxe-column title="支付状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getPayStateTagType(row.payState)" effect="light" round>
            {{ getPayStateLabel(row) }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column title="订单状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getOrderStateTagType(row.orderState)" effect="light" round>
            {{ getOrderStateLabel(row) }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column title="下单终端" width="105" align="center">
        <template #default="{ row }">{{ getTerminalLabel(row) }}</template>
      </vxe-column>
      <vxe-column title="创建时间" width="170" align="center">
        <template #default="{ row }">{{ formatDateTime(row.joinTime) }}</template>
      </vxe-column>
      <vxe-column title="操作" width="100" align="center" fixed="right">
        <template #default="{ row }">
          <el-button
            v-permission="['Get_Order_GetOrderDetail']"
            type="primary"
            size="small"
            link
            @click="emit('detail', row)"
          >
            查看详情
          </el-button>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<style scoped>
.amount-text {
  color: var(--app-ink);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
</style>
