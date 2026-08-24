<script setup name="AiConfigTable">
import {
  aiModelOptions,
  formatDateTime,
  getAiModelTagType,
  getOptionLabel,
  getVerifyTagType
} from '@/views/commerce/utils'

defineProps({
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  changingId: { type: [Number, String], default: null }
})

const emit = defineEmits(['edit', 'toggle-status'])

function getModelLabel(row) {
  return row.aiModelMsg || getOptionLabel(aiModelOptions, row.aiModel)
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
      <vxe-column field="aiConfigId" title="配置 ID" width="100" align="center" />
      <vxe-column field="aiProject" title="AI 项目" min-width="240" show-overflow />
      <vxe-column title="模型" width="130" align="center">
        <template #default="{ row }">
          <el-tag :type="getAiModelTagType(row.aiModel)" effect="plain" round>
            {{ getModelLabel(row) }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column title="Token 消耗" min-width="160" align="right">
        <template #default="{ row }">
          <strong class="token-value">{{ row.num ?? '-' }}</strong>
        </template>
      </vxe-column>
      <vxe-column title="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getVerifyTagType(row.verify)" effect="light" round>
            {{ row.verifyMsg || (Number(row.verify) === 1 ? '启用' : '禁用') }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column title="最近修改" width="180" align="center">
        <template #default="{ row }">{{ formatDateTime(row.upTime) }}</template>
      </vxe-column>
      <vxe-column title="操作" width="190" align="center" fixed="right">
        <template #default="{ row }">
          <div class="row-actions">
            <el-button
              v-permission="['Post_AiConfig_EditAiConfig']"
              size="small"
              type="primary"
              link
              @click="emit('edit', row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['Post_AiConfig_SetAiConfigVerify']"
              size="small"
              :type="Number(row.verify) === 1 ? 'danger' : 'success'"
              :loading="changingId === row.aiConfigId"
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
.token-value {
  color: var(--app-ink);
  font-size: 14px;
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
