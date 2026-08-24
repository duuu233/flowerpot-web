<script setup name="ImageCategoryTable">
import { formatDateTime, getVerifyTagType } from '@/views/commerce/utils'

defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  changingId: { type: [Number, String], default: null }
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
      <vxe-column field="categoryId" title="分类 ID" width="100" align="center" />
      <vxe-column field="categoryName" title="分类名称" min-width="240" />
      <vxe-column title="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getVerifyTagType(row.verify)" effect="light" round>
            {{ row.verifyMsg || (Number(row.verify) === 1 ? '启用' : '禁用') }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column title="创建时间" width="180" align="center">
        <template #default="{ row }">{{ formatDateTime(row.joinTime) }}</template>
      </vxe-column>
      <vxe-column title="更新时间" width="180" align="center">
        <template #default="{ row }">{{ formatDateTime(row.upTime) }}</template>
      </vxe-column>
      <vxe-column title="操作" width="250" align="center" fixed="right">
        <template #default="{ row }">
          <div class="row-actions">
            <el-button
              v-permission="['Post_ProductImg_EditImgCategory']"
              size="small"
              type="primary"
              link
              @click="emit('edit', row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['Get_ProductImg_GetImgCategoryDetail']"
              size="small"
              type="primary"
              link
              @click="emit('detail', row)"
            >
              详情
            </el-button>
            <el-button
              v-permission="['Post_ProductImg_SetImgCategoryVerify']"
              size="small"
              :type="Number(row.verify) === 1 ? 'danger' : 'success'"
              :loading="changingId === row.categoryId"
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
.row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  white-space: nowrap;
}
</style>
