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

const emit = defineEmits(['detail', 'edit', 'toggleStatus'])

function getRowId(row) {
  return row.productPlantId || row.id || '-'
}

function formatDateTime(time) {
  if (time == null || time === '') return 'N/A'
  return formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
}

function emitStatusChange(row, verify) {
  emit('toggleStatus', { row, verify })
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
      :row-config="{ isHover: true, keyField: 'productPlantId' }"
      :column-config="{ resizable: true }"
      max-height="580"
    >
      <vxe-column title="编号" width="78" align="center">
        <template #default="{ row }">{{ getRowId(row) }}</template>
      </vxe-column>

      <vxe-column title="植物" min-width="220">
        <template #default="{ row }">
          <div class="plant-identity">
            <el-image
              v-if="row.plantImg"
              :src="row.plantImg"
              :preview-src-list="[row.plantImg]"
              preview-teleported
              fit="cover"
              class="plant-identity__image"
            >
              <template #error>
                <div class="plant-identity__fallback"><el-icon><Picture /></el-icon></div>
              </template>
            </el-image>
            <div v-else class="plant-identity__fallback"><el-icon><Picture /></el-icon></div>
            <div class="plant-identity__copy">
              <strong>{{ row.plantName || '-' }}</strong>
              <span>{{ row.scientificName || row.alias || '-' }}</span>
            </div>
          </div>
        </template>
      </vxe-column>

      <vxe-column field="alias" title="别名" min-width="125" align="center" show-overflow />
      <vxe-column field="difficultyMaintenanceMsg" title="养护难度" width="105" align="center">
        <template #default="{ row }">
          {{ row.difficultyMaintenanceMsg || `等级 ${row.difficultyMaintenance || '-'}` }}
        </template>
      </vxe-column>
      <vxe-column field="lightingRequirementsMsg" title="光照需求" width="110" align="center">
        <template #default="{ row }">
          {{ row.lightingRequirementsMsg || `等级 ${row.lightingRequirements || '-'}` }}
        </template>
      </vxe-column>
      <vxe-column title="温度 / 湿度" min-width="145" align="center">
        <template #default="{ row }">
          {{ row.optimalTemperature || '-' }} / {{ row.optimalHumidity || '-' }}
        </template>
      </vxe-column>
      <vxe-column field="wateringFrequency" title="浇水频率" min-width="155" align="center" show-overflow />
      <vxe-column title="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.verify === 1 ? 'success' : 'info'" effect="light" round>
            {{ row.verifyMsg || (row.verify === 1 ? '有效' : '无效') }}
          </el-tag>
        </template>
      </vxe-column>
      <vxe-column title="添加时间" width="170" align="center">
        <template #default="{ row }">{{ formatDateTime(row.joinTime) }}</template>
      </vxe-column>
      <vxe-column
        v-permission="['Post_ProductPlant_SetProductPlantVerify']"
        title="启用状态"
        width="100"
        align="center"
      >
        <template #default="{ row }">
          <el-switch
            :model-value="row.verify"
            :active-value="1"
            :inactive-value="0"
            @change="emitStatusChange(row, $event)"
          />
        </template>
      </vxe-column>
      <vxe-column title="操作" width="170" align="center" fixed="right">
        <template #default="{ row }">
          <div class="handle-table-box">
            <el-button
              v-permission="['Get_ProductPlant_GetProductPlantDetail']"
              size="small"
              @click="emit('detail', row)"
            >
              详情
            </el-button>
            <el-button
              v-permission="['Post_ProductPlant_EditProductPlant']"
              size="small"
              type="primary"
              @click="emit('edit', row)"
            >
              编辑
            </el-button>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<style scoped>
.plant-identity {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.plant-identity__image,
.plant-identity__fallback {
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  border: 1px solid var(--app-border);
  border-radius: 13px;
  background: var(--brand-50);
  overflow: hidden;
}

.plant-identity__fallback {
  display: grid;
  place-items: center;
  color: var(--brand-500);
  font-size: 20px;
}

.plant-identity__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.plant-identity__copy strong,
.plant-identity__copy span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plant-identity__copy strong {
  color: var(--app-ink);
  font-weight: 650;
}

.plant-identity__copy span {
  color: var(--app-muted);
  font-size: 12px;
  font-style: italic;
}
</style>
