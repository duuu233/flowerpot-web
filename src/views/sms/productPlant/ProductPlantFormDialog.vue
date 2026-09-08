<script setup>
import { computed, nextTick, reactive, useTemplateRef, watch } from 'vue'
import MultiUpload from '@/components/Upload/multiUpload.vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit', 'detail'].includes(value)
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])
const visible = defineModel({ type: Boolean, default: false })
const formRef = useTemplateRef('form')

const defaultForm = () => ({
  productPlantId: null,
  productId: null,
  plantName: '',
  plantImgList: [],
  scientificName: '',
  introduction: '',
  alias: '',
  difficultyMaintenance: null,
  wateringFrequency: '',
  growthCharacteristics: '',
  optimalTemperature: '',
  optimalHumidity: '',
  lightingRequirements: null,
  careInstructions: '',
  // 2026-09-08 新增：分类下发进设备 DP 161（1 水培 / 2 适中 / 3 耐旱），
  // 四条建议是纯文案，APP 端只读展示。均可留空以兼容既有植物资料。
  categoryType: null,
  lightingSuggestions: '',
  waterSuggestion: '',
  temperatureSuggestion: '',
  humiditySuggestion: '',
  tuYaRemark: ''
})

// 分类枚举与设备端 plant_type(161) 对齐，取值范围外不下发。
const categoryTypeOptions = [
  { label: '1 · 水培', value: 1 },
  { label: '2 · 适中', value: 2 },
  { label: '3 · 耐旱', value: 3 }
]

const formData = reactive(defaultForm())
const isEdit = computed(() => props.mode === 'edit')
const isDetail = computed(() => props.mode === 'detail')
const title = computed(() => {
  if (isDetail.value) return '植物资料详情'
  return isEdit.value ? '编辑植物资料' : '新增植物资料'
})

const requiredTextRule = (label, max) => [
  { required: true, message: `请输入${label}`, trigger: 'blur' },
  { max, message: `${label}不能超过 ${max} 个字符`, trigger: 'blur' }
]

const rules = computed(() => {
  if (isDetail.value) return {}
  return {
    plantName: requiredTextRule('植物名称', 20),
    plantImgList: [
      { required: true, type: 'array', min: 1, message: '请上传植物图片', trigger: 'change' }
    ],
    scientificName: requiredTextRule('植物学名', 30),
    introduction: requiredTextRule('植物简介', 100),
    alias: requiredTextRule('植物别名', 30),
    difficultyMaintenance: [
      { required: true, message: '请输入养护难度等级', trigger: 'change' }
    ],
    wateringFrequency: requiredTextRule('浇水频率', 150),
    growthCharacteristics: requiredTextRule('生长特点', 150),
    optimalTemperature: requiredTextRule('适宜温度', 20),
    optimalHumidity: requiredTextRule('适宜湿度', 20),
    lightingRequirements: [
      { required: true, message: '请输入光照需求等级', trigger: 'change' }
    ],
    careInstructions: requiredTextRule('养护建议', 5000),
    // 新增字段选填：旧植物资料没有这些值，强制必填会卡住编辑保存。
    lightingSuggestions: [{ max: 150, message: '光照建议不能超过 150 个字符', trigger: 'blur' }],
    waterSuggestion: [{ max: 150, message: '需水建议不能超过 150 个字符', trigger: 'blur' }],
    temperatureSuggestion: [{ max: 150, message: '空气温度建议不能超过 150 个字符', trigger: 'blur' }],
    humiditySuggestion: [{ max: 150, message: '湿度建议不能超过 150 个字符', trigger: 'blur' }],
    tuYaRemark: [{ max: 50, message: '涂鸦标识符不能超过 50 个字符', trigger: 'blur' }]
  }
})

function resetForm() {
  const data = props.initialData || {}
  Object.assign(formData, defaultForm(), data, {
    plantImgList: data.plantImg
      ? [{ name: data.plantName || '植物图片', url: data.plantImg }]
      : []
  })
  nextTick(() => formRef.value?.clearValidate())
}

function cleanPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload)
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
  )
}

function buildPayload() {
  const payload = {
    productId: formData.productId,
    plantName: formData.plantName,
    plantImg: formData.plantImgList[0]?.url || '',
    scientificName: formData.scientificName,
    introduction: formData.introduction,
    alias: formData.alias,
    difficultyMaintenance: formData.difficultyMaintenance,
    wateringFrequency: formData.wateringFrequency,
    growthCharacteristics: formData.growthCharacteristics,
    optimalTemperature: formData.optimalTemperature,
    optimalHumidity: formData.optimalHumidity,
    lightingRequirements: formData.lightingRequirements,
    careInstructions: formData.careInstructions,
    categoryType: formData.categoryType,
    lightingSuggestions: formData.lightingSuggestions,
    waterSuggestion: formData.waterSuggestion,
    temperatureSuggestion: formData.temperatureSuggestion,
    humiditySuggestion: formData.humiditySuggestion,
    tuYaRemark: formData.tuYaRemark
  }
  if (isEdit.value) payload.productPlantId = formData.productPlantId
  return cleanPayload(payload)
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('submit', buildPayload())
}

watch(visible, (isVisible) => {
  if (isVisible) resetForm()
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="940px"
    top="5vh"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <div class="dialog-intro">
      <span class="dialog-intro__mark">PLANT PROFILE</span>
      <span>维护产品可选植物及其养护参数；等级字段按后端枚举值填写。</span>
    </div>

    <div class="dialog-scroll">
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-position="top"
        size="small"
        status-icon
      >
        <section class="form-section">
          <div class="form-section__heading">
            <span>基础资料</span>
            <small>归属、命名与识别信息</small>
          </div>

          <el-row :gutter="18">
            <el-col :span="8">
              <el-form-item label="植物名称" prop="plantName">
                <el-input
                  v-model="formData.plantName"
                  placeholder="1-20 个字符"
                  maxlength="20"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="植物学名" prop="scientificName">
                <el-input
                  v-model="formData.scientificName"
                  placeholder="1-30 个字符"
                  maxlength="30"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="植物别名" prop="alias">
                <el-input
                  v-model="formData.alias"
                  placeholder="1-30 个字符"
                  maxlength="30"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="涂鸦标识符" prop="tuYaRemark">
                <el-input
                  v-model="formData.tuYaRemark"
                  placeholder="可选，最多 50 个字符"
                  maxlength="50"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="植物图片" prop="plantImgList">
                <MultiUpload v-model="formData.plantImgList" :max-count="1" :disabled="isDetail" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="植物简介" prop="introduction">
                <el-input
                  v-model="formData.introduction"
                  type="textarea"
                  :rows="3"
                  placeholder="概括植物的主要特征"
                  maxlength="100"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section>

        <section class="form-section form-section--care">
          <div class="form-section__heading">
            <span>生长与养护</span>
            <small>环境阈值、浇水节奏与维护建议</small>
          </div>

          <el-row :gutter="18">
            <el-col :span="6">
              <el-form-item label="养护难度等级" prop="difficultyMaintenance">
                <el-input-number
                  v-model="formData.difficultyMaintenance"
                  :min="1"
                  :precision="0"
                  :controls="false"
                  placeholder="例如 1"
                  class="form-control"
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="光照需求等级" prop="lightingRequirements">
                <el-input-number
                  v-model="formData.lightingRequirements"
                  :min="1"
                  :precision="0"
                  :controls="false"
                  placeholder="例如 1"
                  class="form-control"
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="适宜温度" prop="optimalTemperature">
                <el-input
                  v-model="formData.optimalTemperature"
                  placeholder="例如 18-29℃"
                  maxlength="20"
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="适宜湿度" prop="optimalHumidity">
                <el-input
                  v-model="formData.optimalHumidity"
                  placeholder="例如 50-70%"
                  maxlength="20"
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="浇水频率" prop="wateringFrequency">
                <el-input
                  v-model="formData.wateringFrequency"
                  placeholder="例如春秋每周 1-2 次"
                  maxlength="150"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生长特点" prop="growthCharacteristics">
                <el-input
                  v-model="formData.growthCharacteristics"
                  placeholder="描述植物的生长习性"
                  maxlength="150"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="植物分类" prop="categoryType">
                <el-select
                  v-model="formData.categoryType"
                  clearable
                  placeholder="选填，1 水培 / 2 适中 / 3 耐旱"
                  class="form-control"
                  :disabled="isDetail"
                >
                  <el-option
                    v-for="item in categoryTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="光照建议" prop="lightingSuggestions">
                <el-input
                  v-model="formData.lightingSuggestions"
                  placeholder="选填，例如每日散射光 4-6 小时"
                  maxlength="150"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="需水建议" prop="waterSuggestion">
                <el-input
                  v-model="formData.waterSuggestion"
                  placeholder="选填，例如土面下 2cm 干燥后浇透"
                  maxlength="150"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="空气温度建议" prop="temperatureSuggestion">
                <el-input
                  v-model="formData.temperatureSuggestion"
                  placeholder="选填，例如避免低于 10℃"
                  maxlength="150"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="湿度建议" prop="humiditySuggestion">
                <el-input
                  v-model="formData.humiditySuggestion"
                  placeholder="选填，例如干燥季节配合加湿"
                  maxlength="150"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="养护建议" prop="careInstructions">
                <el-input
                  v-model="formData.careInstructions"
                  type="textarea"
                  :rows="5"
                  placeholder="填写完整的日常养护建议"
                  maxlength="5000"
                  show-word-limit
                  :disabled="isDetail"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section>
      </el-form>
    </div>

    <template #footer>
      <el-button size="small" @click="visible = false">{{ isDetail ? '关闭' : '取消' }}</el-button>
      <el-button
        v-if="!isDetail"
        type="primary"
        size="small"
        :loading="submitting"
        @click="handleSubmit"
      >
        保存资料
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-intro {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: -2px 0 16px;
  padding: 10px 13px;
  border: 1px solid var(--brand-100);
  border-radius: 9px;
  background: var(--brand-50);
  color: var(--app-muted);
  font-size: 12px;
}

.dialog-intro__mark {
  color: var(--brand-700);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.12em;
}

.dialog-scroll {
  max-height: 64vh;
  padding-right: 5px;
  overflow-y: auto;
}

.form-section {
  padding: 16px 18px 4px;
  border: 1px solid var(--app-border);
  border-radius: 12px;
  background: var(--app-surface);
}

.form-section + .form-section {
  margin-top: 16px;
}

.form-section--care {
  background: linear-gradient(180deg, var(--brand-50), var(--app-surface) 74px);
}

.form-section__heading {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--app-border);
}

.form-section__heading span {
  color: var(--app-ink);
  font-size: 14px;
  font-weight: 700;
}

.form-section__heading small {
  color: var(--app-muted);
  font-size: 12px;
}

.form-control {
  width: 100%;
}
</style>
