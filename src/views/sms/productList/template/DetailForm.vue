<script setup name="productListHandleDetail">
import { reactive, ref, shallowRef, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { addProduct, editProduct, getProductDetail } from '@/api/productList'
import { invalidateList } from '@/composables/useListRefresh'
import MultiUpload from '@/components/Upload/MultiUpload.vue'
import PageHeader from '@/components/PageHeader/index.vue'

const props = defineProps({
  pageType: {
    type: Number,
    default: 3
  }
})

const route = useRoute()
const router = useRouter()

const shapeTypeOptions = [
  { value: 0, label: '方形' },
  { value: 1, label: '圆形' }
]

const screenTypeOptions = [
  { value: 0, label: '竖屏' },
  { value: 1, label: '横屏' }
]

const defaultForm = () => ({
  productId: null,
  productName: '',
  productImg: [],
  shapeType: 0,
  screenType: 0,
  width: null,
  height: null,
  broadcastId: '',
  carouselInterval: null,
  rotationDegree: 0,
  verticalRotation: 0
})

const formRef = ref(null)
const formData = reactive(defaultForm())
const submitting = shallowRef(false)
let isInitialized = false

const rules = {
  productName: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  productImg: [
    {
      required: true,
      type: 'array',
      message: '请上传产品图片',
      trigger: 'change'
    }
  ],
  shapeType: [{ required: true, message: '请选择形状类型', trigger: 'change' }],
  screenType: [
    { required: true, message: '请选择屏幕方向', trigger: 'change' }
  ],
  width: [{ required: true, message: '请输入宽度', trigger: 'blur' }],
  height: [{ required: true, message: '请输入高度', trigger: 'blur' }],
  broadcastId: [{ required: true, message: '请输入广播ID', trigger: 'blur' }],
  carouselInterval: [
    { required: true, message: '请输入轮播间隔', trigger: 'blur' }
  ]
}

function resetForm() {
  Object.assign(formData, defaultForm())
}

async function getData() {
  if (!route.query.id) return
  const res = await getProductDetail({ id: route.query.id })
  const detail = res.retData || {}
  Object.assign(formData, defaultForm(), detail, {
    productImg: detail.productImg
      ? [{ url: detail.productImg, name: '产品图片' }]
      : [],
    broadcastId: detail.broadcastId ?? '',
    carouselInterval: detail.carouselInterval ?? null,
    screenType: detail.screenType ?? 0,
    rotationDegree: detail.rotationDegree ?? 0,
    verticalRotation: detail.verticalRotation ?? 0
  })
}

function buildSubmitData() {
  const submitData = cloneDeep(formData)
  submitData.productImg = formData.productImg[0]?.url || ''
  Object.keys(submitData).forEach(key => {
    if (
      submitData[key] === null ||
      submitData[key] === undefined ||
      submitData[key] === ''
    ) {
      delete submitData[key]
    }
  })
  return submitData
}

async function initializeData() {
  resetForm()
  if (props.pageType !== 1) await getData()
}

function submitForm() {
  formRef.value.validate(async valid => {
    if (!valid) return false
    submitting.value = true
    try {
      const submitData = buildSubmitData()
      if (props.pageType === 1) {
        await addProduct(submitData)
      } else if (props.pageType === 2) {
        await editProduct(submitData)
      }
      ElMessage.success(props.pageType === 1 ? '新增成功' : '编辑成功')
      invalidateList('productList')
      router.push({ name: 'productList' })
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  isInitialized = true
  initializeData()
})

onActivated(() => {
  if (!isInitialized) initializeData()
  isInitialized = false
})
</script>

<template>
  <div class="app-container">
    <PageHeader>
      <span v-if="pageType === 1">添加产品</span>
      <span v-else-if="pageType === 2">编辑产品</span>
      <span v-else-if="pageType === 3">查看产品</span>
    </PageHeader>

    <el-card class="box-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="140px"
        size="small"
      >
        <el-form-item label="产品名称" prop="productName">
          <el-input
            v-model="formData.productName"
            class="input-width"
            placeholder="请输入产品名称"
            clearable
            maxlength="20"
            show-word-limit
            :disabled="pageType === 3"
          />
        </el-form-item>

        <el-form-item label="产品图片" prop="productImg">
          <MultiUpload
            v-model="formData.productImg"
            :max-count="1"
            :disabled="pageType === 3"
          />
        </el-form-item>

        <el-form-item label="形状类型" prop="shapeType">
          <el-radio-group
            v-model="formData.shapeType"
            :disabled="pageType === 3"
          >
            <el-radio
              v-for="item in shapeTypeOptions"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="屏幕方向" prop="screenType">
          <el-radio-group
            v-model="formData.screenType"
            :disabled="pageType === 3"
          >
            <el-radio
              v-for="item in screenTypeOptions"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="尺寸(cm)" required>
          <div class="size-fields">
            <el-form-item prop="width">
              <el-input-number
                v-model="formData.width"
                :min="0"
                :max="2147483647"
                :precision="0"
                :controls="false"
                placeholder="宽度"
                :disabled="pageType === 3"
              />
            </el-form-item>
            <span class="size-separator">x</span>
            <el-form-item prop="height">
              <el-input-number
                v-model="formData.height"
                :min="0"
                :max="2147483647"
                :precision="0"
                :controls="false"
                placeholder="高度"
                :disabled="pageType === 3"
              />
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="广播ID" prop="broadcastId">
          <el-input
            v-model="formData.broadcastId"
            class="input-width"
            placeholder="请输入广播ID"
            clearable
            :disabled="pageType === 3"
          />
        </el-form-item>

        <el-form-item label="轮播间隔(分钟)" prop="carouselInterval">
          <el-input-number
            v-model="formData.carouselInterval"
            :min="0"
            :max="2147483647"
            :precision="0"
            :controls="false"
            placeholder="请输入轮播间隔"
            :disabled="pageType === 3"
          />
        </el-form-item>

        <el-form-item label="横向旋转度数" prop="rotationDegree">
          <el-input-number
            v-model="formData.rotationDegree"
            :precision="0"
            :controls="false"
            placeholder="请输入横向旋转度数"
            :disabled="pageType === 3"
          />
        </el-form-item>

        <el-form-item label="竖向旋转度数" prop="verticalRotation">
          <el-input-number
            v-model="formData.verticalRotation"
            :precision="0"
            :controls="false"
            placeholder="请输入竖向旋转度数"
            :disabled="pageType === 3"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="pageType !== 3"
            type="primary"
            :loading="submitting"
            @click="submitForm"
          >
            提交
          </el-button>
          <el-button @click="router.push({ name: 'productList' })"
            >返回</el-button
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

.size-fields {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.size-separator {
  line-height: 32px;
  color: var(--app-info);
}
</style>
