<script setup name="AiConfigEditor">
import { nextTick, reactive, ref, shallowRef, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { editAiConfig } from '@/api/aiConfig'
import { aiModelOptions } from '@/views/commerce/utils'

const props = defineProps({
  config: { type: Object, default: null }
})

const visible = defineModel('visible', { type: Boolean, default: false })
const emit = defineEmits(['saved'])

const defaultForm = () => ({
  aiConfigId: null,
  aiProject: '',
  aiModel: 1,
  num: null
})

const formRef = ref(null)
const formData = reactive(defaultForm())
const submitting = shallowRef(false)

const rules = {
  aiProject: [{ required: true, message: '请输入 AI 项目', trigger: 'blur' }],
  aiModel: [{ required: true, message: '请选择 AI 模型', trigger: 'change' }],
  num: [{ required: true, message: '请输入 Token 消耗数量', trigger: 'change' }]
}

function resetForm() {
  Object.assign(formData, defaultForm())
  formRef.value?.clearValidate?.()
}

watch(
  [visible, () => props.config],
  ([isVisible, config]) => {
    if (!isVisible) return
    Object.assign(formData, defaultForm(), config || {})
    nextTick(() => formRef.value?.clearValidate?.())
  },
  { immediate: true }
)

async function submitForm() {
  if (!formRef.value || !formData.aiConfigId) return

  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  submitting.value = true
  try {
    await editAiConfig({
      aiConfigId: Number(formData.aiConfigId),
      aiProject: formData.aiProject.trim(),
      aiModel: Number(formData.aiModel),
      num: Number(formData.num)
    })
    ElMessage.success('编辑成功')
    visible.value = false
    emit('saved')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    class="ai-config-dialog"
    title="编辑 AI 配置"
    width="560px"
    destroy-on-close
    append-to-body
    @closed="resetForm"
  >
    <div class="dialog-lead">
      <span class="dialog-lead__id">CONFIG #{{ formData.aiConfigId || '-' }}</span>
      <p class="dialog-lead__text">调整项目模型与每次调用所消耗的 Token 数量。</p>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      size="default"
    >
      <el-form-item label="AI 项目" prop="aiProject">
        <el-input
          v-model="formData.aiProject"
          maxlength="100"
          placeholder="请输入 AI 项目标识"
          show-word-limit
        />
      </el-form-item>

      <div class="form-grid">
        <el-form-item label="AI 模型" prop="aiModel">
          <el-select v-model="formData.aiModel" class="field-control">
            <el-option
              v-for="item in aiModelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Token 消耗数量" prop="num">
          <el-input-number
            v-model="formData.num"
            class="field-control"
            :min="0"
            :max="999999999"
            :precision="4"
            :step="1"
            controls-position="right"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submitForm">
        保存配置
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-lead {
  margin: -4px 0 22px;
  padding: 14px 16px;
  border-left: 3px solid var(--brand-logo);
  background: var(--app-surface-muted);
}

.dialog-lead__id {
  color: var(--brand-600);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.dialog-lead__text {
  margin: 5px 0 0;
  color: var(--app-text);
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.field-control {
  width: 100%;
}

@media (max-width: 620px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
