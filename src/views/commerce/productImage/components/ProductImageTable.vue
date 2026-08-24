<script setup name="ProductImageTable">
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
      <vxe-column field="productImgId" title="图片 ID" width="90" align="center" />
      <vxe-column title="预览" width="92" align="center">
        <template #default="{ row }">
          <el-image
            v-if="row.img"
            class="image-preview"
            :src="row.img"
            :preview-src-list="[row.img]"
            :alt="row.title || '图库图片'"
            fit="cover"
            preview-teleported
          >
            <template #error>
              <div class="image-placeholder">加载失败</div>
            </template>
          </el-image>
          <span v-else>-</span>
        </template>
      </vxe-column>
      <vxe-column field="title" title="图片标题" min-width="170" show-overflow />
      <vxe-column
        field="categoryNames"
        title="图库分类"
        min-width="170"
        show-overflow
      />
      <vxe-column
        field="productSizes"
        title="适用设备尺寸"
        min-width="170"
        show-overflow
      />
      <vxe-column field="content" title="图片说明" min-width="220" show-overflow />
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
      <vxe-column title="更新时间" width="170" align="center">
        <template #default="{ row }">{{ formatDateTime(row.upTime) }}</template>
      </vxe-column>
      <vxe-column title="操作" width="250" align="center" fixed="right">
        <template #default="{ row }">
          <div class="row-actions">
            <el-button
              v-permission="['Post_ProductImg_EditProductImg']"
              size="small"
              type="primary"
              link
              @click="emit('edit', row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['Get_ProductImg_GetProductImgDetail']"
              size="small"
              type="primary"
              link
              @click="emit('detail', row)"
            >
              详情
            </el-button>
            <el-button
              v-permission="['Post_ProductImg_SetProductImgVerify']"
              size="small"
              :type="Number(row.verify) === 1 ? 'danger' : 'success'"
              :loading="changingId === row.productImgId"
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
.image-preview {
  display: block;
  width: 56px;
  height: 56px;
  margin: 0 auto;
  border: 1px solid var(--app-border);
  border-radius: 8px;
  background: var(--app-surface-muted);
}

.image-placeholder {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--app-muted);
  font-size: 11px;
}

.row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  white-space: nowrap;
}
</style>
