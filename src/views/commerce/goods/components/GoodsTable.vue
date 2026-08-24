<script setup name="GoodsTable">
import {
  formatAmount,
  formatDateTime,
  getVerifyTagType
} from '@/views/commerce/utils'

defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'detail', 'toggle-status'])
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
      <vxe-column field="goodsId" title="商品 ID" width="90" align="center" />
      <vxe-column
        field="goodsName"
        title="商品名称"
        min-width="190"
        align="left"
        show-overflow
      />
      <vxe-column title="商品金额" width="110" align="right">
        <template #default="{ row }">
          <span class="amount-text">{{ formatAmount(row.amount) }}</span>
        </template>
      </vxe-column>
      <vxe-column field="num" title="基础数量" width="95" align="center" />
      <vxe-column field="giveNum" title="赠送数量" width="95" align="center" />
      <vxe-column title="Token 单价" width="110" align="right">
        <template #default="{ row }">{{ formatAmount(row.unitPrice) }}</template>
      </vxe-column>
      <vxe-column field="grade" title="权重" width="80" align="center" />
      <vxe-column
        field="wxProductId"
        title="微信产品 ID"
        min-width="150"
        align="center"
        show-overflow
      />
      <vxe-column
        field="appleProductId"
        title="Apple 产品 ID"
        min-width="150"
        align="center"
        show-overflow
      />
      <vxe-column title="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="getVerifyTagType(row.verify)" effect="light" round>
            {{ row.verifyMsg || (Number(row.verify) === 1 ? '启用' : '禁用') }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column title="创建时间" width="170" align="center">
        <template #default="{ row }">{{ formatDateTime(row.joinTime) }}</template>
      </vxe-column>
      <vxe-column title="操作" width="250" align="center" fixed="right">
        <template #default="{ row }">
          <div class="row-actions">
            <el-button
              v-permission="['Post_Goods_EditGoods']"
              size="small"
              type="primary"
              link
              @click="emit('edit', row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['Get_Goods_GetGoodsDetail']"
              size="small"
              type="primary"
              link
              @click="emit('detail', row)"
            >
              详情
            </el-button>
            <el-button
              v-permission="['Post_Goods_SetGoodsVerify']"
              size="small"
              :type="Number(row.verify) === 1 ? 'danger' : 'success'"
              link
              @click="emit('toggle-status', row)"
            >
              {{ Number(row.verify) === 1 ? '禁用' : '启用' }}
            </el-button>
          </div>
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

.row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  white-space: nowrap;
}
</style>
