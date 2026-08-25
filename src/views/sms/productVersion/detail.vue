<script setup name="productVersionDetail">
import {
  computed,
  onActivated,
  onMounted,
  reactive,
  ref,
  shallowRef
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductList } from '@/api/productList'
import {
  addProductVersion,
  editProductVersion,
  getUserDeviceVersionDetail
} from '@/api/productVersion'
import PageHeader from '@/components/PageHeader/index.vue'
import FileUpload from '@/components/Upload/fileUpload.vue'
import { invalidateList } from '@/composables/useListRefresh'

const route = useRoute()
const router = useRouter()

const compulsoryOptions = [
  { value: 1, label: '强制升级' },
  { value: 2, label: '强提示升级' },
  { value: 3, label: '弱提示升级' },
  { value: 4, label: '不提示升级' }
]

const defaultForm = () => ({
  id: null,
  productId: null,
  versionNumber: '',
  downloadPath: '',
  compulsory: null,
  grade: 0
})

const formRef = ref(null)
const formData = reactive(defaultForm())
const productOptions = ref([])
const submitting = shallowRef(false)

// 取 URL 末段作为文件展示名
function getFileNameFromUrl(url) {
  if (!url) return '附件'
  const clean = String(url).split('?')[0]
  const name = decodeURIComponent(clean.substring(clean.lastIndexOf('/') + 1))
  return name || '附件'
}

// FileUpload 使用数组 [{ name, url }]，与表单中的 downloadPath 字符串互相转换
const downloadFileList = computed({
  get() {
    if (!formData.downloadPath) return []
    return [
      {
        name: getFileNameFromUrl(formData.downloadPath),
        url: formData.downloadPath
      }
    ]
  },
  set(val) {
    formData.downloadPath = val?.[0]?.url || ''
  }
})

const rules = {
  productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
  versionNumber: [
    { required: true, message: '请输入版本号', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  downloadPath: [{ required: true, message: '请上传附件', trigger: 'change' }],
  compulsory: [
    { required: true, message: '请选择升级类型', trigger: 'change' }
  ],
  grade: [{ required: true, message: '请输入权重', trigger: 'blur' }]
}

function resetForm() {
  Object.assign(formData, defaultForm())
}

function loadProductOptions() {
  getProductList({ pageIndex: 1, pageSize: 1000 })
    .then(response => {
      productOptions.value = response.retData?.pageData || []
    })
    .catch(() => {
      productOptions.value = []
    })
}

function getDetail() {
  if (!route.query.id) return
  getUserDeviceVersionDetail({ id: route.query.id }).then(response => {
    if (response.retCode === 200) {
      Object.assign(formData, defaultForm(), response.retData)
    }
  })
}

function submitForm() {
  formRef.value.validate(valid => {
    if (!valid) return false
    submitting.value = true
    const submitData = { ...formData }
    const request =
      route.query.type === 'edit'
        ? editProductVersion(submitData)
        : addProductVersion(submitData)
    request
      .then(response => {
        if (response.retCode === 200) {
          ElMessage.success(
            route.query.type === 'edit' ? '编辑成功' : '新增成功'
          )
          invalidateList('productVersion')
          router.push({ name: 'productVersion' })
        }
      })
      .finally(() => {
        submitting.value = false
      })
  })
}

function init() {
  resetForm()
  loadProductOptions()
  if (route.query.type === 'edit') getDetail()
}

onMounted(init)
onActivated(init)
</script>

<template>
  <div class="app-container">
    <PageHeader
      :title="route.query.type === 'edit' ? '编辑产品版本' : '新增产品版本'"
    />

    <el-card class="box-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="140px"
        size="small"
      >
        <el-form-item label="产品" prop="productId">
          <el-select
            v-model="formData.productId"
            class="input-width"
            filterable
            clearable
            placeholder="请选择产品"
          >
            <el-option
              v-for="item in productOptions"
              :key="item.productId || item.id"
              :label="item.productName"
              :value="item.productId || item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="versionNumber">
          <el-input
            v-model="formData.versionNumber"
            class="input-width"
            placeholder="请输入版本号"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="附件地址" prop="downloadPath">
          <FileUpload
            v-model="downloadFileList"
            :max-count="1"
            :max-size="0"
            accept=".bin"
          />
        </el-form-item>
        <el-form-item label="升级类型" prop="compulsory">
          <el-radio-group v-model="formData.compulsory">
            <el-radio
              v-for="item in compulsoryOptions"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权重" prop="grade">
          <el-input-number
            v-model="formData.grade"
            :min="0"
            :max="2147483647"
            :precision="0"
            :controls="false"
            class="input-width"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="submitForm"
            >提交</el-button
          >
          <el-button @click="router.push({ name: 'productVersion' })"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
  margin-top: 10px;
}
</style>
