<script setup name="config">
import { computed, onActivated, onMounted, reactive, ref, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import { getConfigDataList, setConfigDataEdit } from '@/api/config'

const form = reactive({ configList: [] })
const loading = shallowRef(true)
const formRef = ref(null)

const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
const platformDeviceIdNames = new Set([
  '平台设备id',
  'platformdeviceid',
  'platdeviceid'
])

function getConfigLabel(item) {
  return item.configContent || item.configKey || `配置 ${item.configType}`
}

function isEditableConfig(item) {
  return [1, 2].includes(item.configType)
}

function normalizeConfigName(value) {
  return String(value ?? '')
    .replace(/[\s_：:-]/g, '')
    .toLowerCase()
}

function isPlatformDeviceIdConfig(item) {
  return [item?.configContent, item?.configKey].some(value =>
    platformDeviceIdNames.has(normalizeConfigName(value))
  )
}

const visibleEditableConfigs = computed(() =>
  form.configList
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item }) => isEditableConfig(item) && !isPlatformDeviceIdConfig(item)
    )
)

function shouldValidateEmail(item) {
  const label = `${item?.configKey || ''}${item?.configContent || ''}`
  return /email|mail|邮箱/i.test(label)
}

function validateConfigValue(rule, value, callback) {
  const index = Number(rule.field.split('.')[1])
  const item = form.configList[index]
  if (!value) {
    callback(new Error('配置值不能为空'))
    return
  }
  if (shouldValidateEmail(item) && !emailReg.test(value)) {
    callback(new Error('请输入正确的邮箱'))
    return
  }
  callback()
}

const rules = {
  configValue: [{ required: true, validator: validateConfigValue, trigger: 'blur' }]
}

function buildConfigPayload() {
  return {
    listConfigTypeValue: form.configList
      .filter(item => !isPlatformDeviceIdConfig(item))
      .map((item) => {
        const payload = {
          configType: item.configType,
          configValue: item.configValue
        }
        if (item.configKey !== undefined && item.configKey !== null) {
          payload.configKey = item.configKey
        }
        if (item.adminId !== undefined && item.adminId !== null) {
          payload.adminId = item.adminId
        }
        if (item.countyId !== undefined && item.countyId !== null) {
          payload.countyId = item.countyId
        }
        return payload
      })
  }
}

async function getData() {
  loading.value = true
  try {
    const response = await getConfigDataList()
    form.configList = response.retData || []
  } finally {
    loading.value = false
  }
}

async function handleDialogConfirm() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    await setConfigDataEdit(buildConfigPayload())
    ElMessage.success('保存成功')
    getData()
  } catch (error) {
    // Element Plus validation and request interceptor already surface errors.
  }
}

onMounted(getData)
onActivated(getData)
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" class="box-card" shadow="never">
      <template #header>
        <span>系统设置</span>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="160px" size="small">
        <template
          v-for="({ item, index }) in visibleEditableConfigs"
          :key="item.configKey || index"
        >
          <el-form-item
            :label="getConfigLabel(item)"
            :prop="'configList.' + index + '.configValue'"
            :rules="rules.configValue"
          >
            <el-input
              v-if="item.configType === 2"
              v-model="item.configValue"
              :placeholder="`请输入${getConfigLabel(item)}`"
              style="width: 311px"
              maxlength="40"
              show-word-limit
            />
            <el-input
              v-else
              v-model="item.configValue"
              :placeholder="`请输入${getConfigLabel(item)}`"
              type="textarea"
              :rows="2"
              style="width: 311px"
              maxlength="500"
              show-word-limit
            />
            <i
              v-if="item.configType === 1"
              style="padding-left: 6px; font-size: 12px"
            >
              (多个值请使用英文逗号分隔)
            </i>
          </el-form-item>
        </template>
      </el-form>
      <div class="btn-box">
        <el-button
          v-permission="['Post_Common_SetConfigDataEdit']"
          type="primary"
          size="small"
          @click="handleDialogConfirm"
        >
          保存
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.btn-box {
  text-align: center;
}
</style>
