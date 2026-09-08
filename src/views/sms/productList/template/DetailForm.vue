<script setup name="productListHandleDetail">
import { reactive, ref, shallowRef, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { addProduct, editProduct, getProductDetail } from '@/api/productList'
import { invalidateList } from '@/composables/useListRefresh'
import MultiUpload from '@/components/Upload/multiUpload.vue'
import PageHeader from '@/components/PageHeader/index.vue'

const props = defineProps({
  pageType: {
    type: Number,
    default: 3
  }
})

const route = useRoute()
const router = useRouter()

const defaultForm = () => ({
  productId: null,
  productName: '',
  productImg: []
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
  ]
}

function resetForm() {
  Object.assign(formData, defaultForm())
}

async function getData() {
  if (!route.query.id) return
  const res = await getProductDetail({ id: route.query.id })
  const detail = res.retData || {}
  // 形状、尺寸、广播ID、轮播间隔、旋转度数这些字段界面上已经不展示，但仍随
  // detail 原样进入 formData 并在保存时回传，免得编辑一次就把后端已有的值清空。
  Object.assign(formData, defaultForm(), detail, {
    productImg: detail.productImg
      ? [{ url: detail.productImg, name: '产品图片' }]
      : []
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

</style>
