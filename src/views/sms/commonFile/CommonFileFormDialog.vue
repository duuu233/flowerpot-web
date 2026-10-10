<script setup>
import { computed, nextTick, reactive, useTemplateRef, watch } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'add', validator: value => ['add', 'edit'].includes(value) },
  initialData: { type: Object, default: () => ({}) },
  submitting: { type: Boolean, default: false }
})
const emit = defineEmits(['submit'])
const visible = defineModel({ type: Boolean, default: false })
const formRef = useTemplateRef('fileForm')
const form = reactive({ fileName: '', filePath: '' })
const title = computed(() => props.mode === 'edit' ? '编辑文件' : '新增文件')

function textRule(label, max) {
  return [{ validator: (_, value, callback) => {
    const text = String(value || '').trim()
    if (!text) callback(new Error('请输入' + label))
    else if (text.length > max) callback(new Error(label + '不能超过 ' + max + ' 个字符'))
    else callback()
  }, trigger: 'blur' }]
}
const rules = { fileName: textRule('文件名称', 20), filePath: textRule('文件地址', 120) }

watch(visible, async (open) => {
  if (!open) return
  form.fileName = props.initialData.fileName || ''
  form.filePath = props.initialData.filePath || ''
  await nextTick()
  formRef.value?.clearValidate()
})

function close() {
  if (!props.submitting) visible.value = false
}

async function submit() {
  if (props.submitting) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid || props.submitting) return
  const payload = { fileName: form.fileName.trim(), filePath: form.filePath.trim() }
  if (props.mode === 'edit') payload.fileId = props.initialData.fileId
  emit('submit', payload)
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="560px" destroy-on-close
    :close-on-click-modal="false" :close-on-press-escape="!submitting" :show-close="!submitting">
    <el-form ref="fileForm" :model="form" :rules="rules" label-width="90px" :disabled="submitting"
      @submit.prevent="submit">
      <el-form-item label="文件名称" prop="fileName" required>
        <el-input v-model="form.fileName" placeholder="请输入文件名称" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="文件地址" prop="filePath" required>
        <el-input v-model="form.filePath" placeholder="请输入文件地址" maxlength="120" show-word-limit
          type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="submitting" @click="close">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="submitting" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>
