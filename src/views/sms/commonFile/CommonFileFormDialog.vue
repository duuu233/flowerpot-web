<script setup>
import { computed, nextTick, reactive, ref, useTemplateRef, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { setFileUpload } from '@/api/oss'
import { normalizeUploadedFiles } from '@/components/Upload/utils'

const props = defineProps({
  mode: { type: String, default: 'add', validator: value => ['add', 'edit'].includes(value) },
  initialData: { type: Object, default: () => ({}) },
  submitting: { type: Boolean, default: false }
})
const emit = defineEmits(['submit'])
const visible = defineModel({ type: Boolean, default: false })
const formRef = useTemplateRef('fileForm')
const uploading = ref(false)
const busy = computed(() => props.submitting || uploading.value)
const form = reactive({ fileName: '', filePath: '' })
const title = computed(() => props.mode === 'edit' ? '编辑文件' : '新增文件')

function textRule(label, max, requiredMessage = '请输入' + label) {
  return [{ validator: (_, value, callback) => {
    const text = String(value || '').trim()
    if (!text) callback(new Error(requiredMessage))
    else if (text.length > max) callback(new Error(label + '不能超过 ' + max + ' 个字符'))
    else callback()
  }, trigger: 'blur' }]
}
const rules = { fileName: textRule('文件名称', 20, '请先上传文件'), filePath: textRule('文件地址', 120) }

watch(visible, async (open) => {
  if (!open) return
  form.fileName = props.initialData.fileName || ''
  form.filePath = props.initialData.filePath || ''
  await nextTick()
  formRef.value?.clearValidate()
})

function close() {
  if (!busy.value) visible.value = false
}

async function uploadFile(option) {
  if (busy.value) {
    option.onError?.(new Error('文件正在处理中'))
    return
  }
  uploading.value = true
  try {
    const response = await setFileUpload(option.file, { isSaveOldFileName: 1 })
    const file = normalizeUploadedFiles(response.retData, option.file)[0]
    if (!file) throw new Error('上传响应缺少文件地址')
    form.fileName = file.name
    form.filePath = file.url
    formRef.value?.clearValidate(['fileName', 'filePath'])
    option.onSuccess?.(response)
  } catch (error) {
    option.onError?.(error)
    ElMessage.error('上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

async function submit() {
  if (busy.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid || busy.value) return
  const payload = { fileName: form.fileName, filePath: form.filePath.trim() }
  if (props.mode === 'edit') payload.fileId = props.initialData.fileId
  emit('submit', payload)
}
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="560px" destroy-on-close
    :close-on-click-modal="false" :close-on-press-escape="!busy" :show-close="!busy">
    <el-form ref="fileForm" :model="form" :rules="rules" label-width="90px" :disabled="busy"
      @submit.prevent="submit">
      <el-form-item label="文件名称" prop="fileName" required>
        <el-input v-model="form.fileName" placeholder="上传文件后自动填写" readonly />
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload action="" :http-request="uploadFile" :show-file-list="false" :disabled="busy">
          <el-button type="primary" :loading="uploading" :disabled="busy">{{ form.filePath ? '重新上传' : '上传文件' }}</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="文件地址" prop="filePath" required>
        <el-input v-model="form.filePath" placeholder="请输入文件地址" maxlength="120" show-word-limit
          type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="busy" @click="close">取消</el-button>
      <el-button type="primary" :loading="busy" :disabled="busy" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>
