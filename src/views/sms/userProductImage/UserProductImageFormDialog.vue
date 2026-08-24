<script setup>
import { computed, reactive, useTemplateRef, watch } from 'vue'
import MultiUpload from '@/components/Upload/multiUpload.vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'add',
    validator: (value) => ['add', 'edit'].includes(value)
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
  uProductImgId: null,
  userId: null,
  userProductId: null,
  imgList: [],
  imgBle: '',
  imgThumb: '',
  imgIndex: '',
  upirid: null
})

const formData = reactive(defaultForm())
const isEdit = computed(() => props.mode === 'edit')
const title = computed(() => (isEdit.value ? '编辑用户产品图片' : '新增用户产品图片'))
const rules = computed(() => ({
  userId: isEdit.value ? [] : [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
  userProductId: isEdit.value
    ? []
    : [{ required: true, message: '请输入用户产品ID', trigger: 'blur' }],
  imgList: [{ required: true, type: 'array', min: 1, message: '请上传产品图片', trigger: 'change' }]
}))

function getRecordId(data) {
  return data.uProductImgId || data.uproductImgId || data.id || null
}

function resetForm() {
  const data = props.initialData || {}
  Object.assign(formData, defaultForm(), data, {
    uProductImgId: getRecordId(data),
    imgList: data.img ? [{ name: '用户产品图片', url: data.img }] : []
  })
  formRef.value?.clearValidate()
}

function cleanPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== null && value !== undefined && value !== '')
  )
}

function buildPayload() {
  const payload = {
    userId: formData.userId,
    userProductId: formData.userProductId,
    img: formData.imgList[0]?.url || '',
    imgBle: formData.imgBle,
    imgThumb: formData.imgThumb,
    imgIndex: formData.imgIndex,
    upirid: formData.upirid
  }
  if (isEdit.value) payload.uProductImgId = formData.uProductImgId
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
    width="680px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="125px" size="small">
      <el-form-item label="用户ID" prop="userId">
        <el-input-number
          v-model="formData.userId"
          :min="1"
          :max="2147483647"
          :precision="0"
          :controls="false"
          class="form-control"
          placeholder="请输入用户ID"
        />
      </el-form-item>
      <el-form-item label="用户产品ID" prop="userProductId">
        <el-input-number
          v-model="formData.userProductId"
          :min="1"
          :max="2147483647"
          :precision="0"
          :controls="false"
          class="form-control"
          placeholder="请输入用户产品ID"
        />
      </el-form-item>
      <el-form-item label="产品图片" prop="imgList">
        <MultiUpload v-model="formData.imgList" :max-count="1" />
      </el-form-item>
      <el-collapse class="advanced-fields">
        <el-collapse-item title="高级图片字段" name="advanced">
          <el-form-item label="固件图片地址">
            <el-input v-model="formData.imgBle" placeholder="可选，imgBle" clearable />
          </el-form-item>
          <el-form-item label="缩略图地址">
            <el-input v-model="formData.imgThumb" placeholder="可选，imgThumb" clearable />
          </el-form-item>
          <el-form-item label="设备图片索引">
            <el-input v-model="formData.imgIndex" placeholder="可选，imgIndex" clearable />
          </el-form-item>
          <el-form-item label="投屏记录ID">
            <el-input-number
              v-model="formData.upirid"
              :min="1"
              :max="2147483647"
              :precision="0"
              :controls="false"
              class="form-control"
              placeholder="可选，upirid"
            />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <template #footer>
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="submitting" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.form-control {
  width: 100%;
}

.advanced-fields {
  margin-top: 4px;
}
</style>
