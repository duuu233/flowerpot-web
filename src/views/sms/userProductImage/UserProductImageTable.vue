<script setup>
import { formatDate } from '@/utils/date'

defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])

function getRowId(row) {
  return row.uProductImgId || row.uproductImgId || row.id
}

function formatDateTime(time) {
  if (time == null || time === '') return 'N/A'
  return formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
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
      <vxe-column field="uProductImgId" title="编号" width="90" align="center">
        <template #default="{ row }">{{ getRowId(row) || '-' }}</template>
      </vxe-column>
      <vxe-column field="nickName" title="用户昵称" min-width="120" align="center" show-overflow />
      <vxe-column field="userId" title="用户ID" width="90" align="center" />
      <vxe-column field="userMobile" title="手机号" min-width="120" align="center" show-overflow />
      <vxe-column field="userEmail" title="邮箱" min-width="160" align="center" show-overflow />
      <vxe-column field="deviceId" title="设备ID" min-width="150" align="center" show-overflow />
      <vxe-column field="productName" title="产品名称" min-width="140" align="center" show-overflow />
      <vxe-column title="产品图片" width="100" align="center">
        <template #default="{ row }">
          <el-image
            v-if="row.img"
            :src="row.img"
            :preview-src-list="[row.img]"
            preview-teleported
            fit="cover"
            class="product-image"
          />
          <span v-else>-</span>
        </template>
      </vxe-column>
      <vxe-column title="状态" width="90" align="center">
        <template #default="{ row }">
          <span :class="row.verify ? 'status-enabled' : 'status-disabled'">
            {{ row.verify ? '有效' : '无效' }}
          </span>
        </template>
      </vxe-column>
      <vxe-column title="添加时间" width="170" align="center">
        <template #default="{ row }">{{ formatDateTime(row.joinTime) }}</template>
      </vxe-column>
      <vxe-column title="操作" width="170" align="center" fixed="right">
        <template #default="{ row }">
          <div class="handle-table-box">
            <el-button
              v-permission="['Post_UserProductImg_EditUserProductImg']"
              size="small"
              type="primary"
              @click="emit('edit', row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['Post_UserProductImg_DeleteUserProductImg']"
              size="small"
              type="danger"
              @click="emit('delete', row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<style scoped>
.product-image {
  width: 60px;
  height: 60px;
}

.status-enabled {
  color: var(--app-success);
}

.status-disabled {
  color: var(--app-danger);
}
</style>
