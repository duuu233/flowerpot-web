import { computed, reactive, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductList } from '@/api/productList'
import {
  addProductImg,
  editProductImg,
  getImgCategoryList,
  getProductImgDetail
} from '@/api/productImage'
import { invalidateList } from '@/composables/useListRefresh'

const defaultForm = () => ({
  productImgId: null,
  title: '',
  content: '',
  imageFiles: [],
  thumbnailFiles: [],
  productIdList: [],
  categoryIdList: [],
  verify: null
})

function normalizeIdList(list, fallback) {
  const source = Array.isArray(list)
    ? list
    : String(fallback || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)

  return source
    .map(Number)
    .filter(value => Number.isInteger(value) && value > 0)
}

function fileFromUrl(url, name) {
  return url ? [{ name, url }] : []
}

export function useProductImageForm(mode) {
  const route = useRoute()
  const router = useRouter()
  const routeName = {
    add: 'productImageAdd',
    edit: 'productImageEdit',
    detail: 'productImageDetail'
  }[mode]

  const formRef = ref(null)
  const formData = reactive(defaultForm())
  const productOptions = shallowRef([])
  const categoryOptions = shallowRef([])
  const loading = shallowRef(false)
  const submitting = shallowRef(false)
  let requestSequence = 0

  const isAdd = computed(() => mode === 'add')
  const isReadOnly = computed(() => mode === 'detail')
  const pageTitle = computed(() => {
    if (isAdd.value) return '新增图库图片'
    return isReadOnly.value ? '图库图片详情' : '编辑图库图片'
  })

  const rules = {
    title: [
      { required: true, message: '请输入图片标题', trigger: 'blur' },
      { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请输入图片说明', trigger: 'blur' },
      { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
    ],
    imageFiles: [
      {
        required: true,
        type: 'array',
        min: 1,
        message: '请上传图库图片',
        trigger: 'change'
      }
    ],
    productIdList: [
      {
        required: true,
        type: 'array',
        min: 1,
        message: '请选择至少一个适用产品',
        trigger: 'change'
      }
    ],
    categoryIdList: [
      {
        required: true,
        type: 'array',
        min: 1,
        message: '请选择至少一个图库分类',
        trigger: 'change'
      }
    ]
  }

  function resetForm() {
    Object.assign(formData, defaultForm())
    formRef.value?.clearValidate?.()
  }

  function applyDetail(detail) {
    Object.assign(formData, defaultForm(), detail, {
      imageFiles: fileFromUrl(detail.img, detail.title || '图库图片'),
      thumbnailFiles: fileFromUrl(detail.imgThumb, '图片缩略图'),
      productIdList: normalizeIdList(detail.productIdList, detail.productIds),
      categoryIdList: normalizeIdList(detail.categoryIdList, detail.categoryIds)
    })
  }

  async function initializeData(id = route.query.id) {
    const sequence = ++requestSequence
    resetForm()

    if (!isAdd.value && !id) {
      ElMessage.error('缺少图库图片 ID')
      return
    }

    loading.value = true
    try {
      const requests = [
        getProductList({ pageIndex: 1, pageSize: 1000 }),
        getImgCategoryList({ pageIndex: 1, pageSize: 1000 })
      ]
      if (!isAdd.value) requests.push(getProductImgDetail({ id }))

      const [productResponse, categoryResponse, detailResponse] =
        await Promise.all(requests)
      if (sequence !== requestSequence) return

      productOptions.value = productResponse.retData?.pageData || []
      categoryOptions.value = categoryResponse.retData?.pageData || []
      if (detailResponse) applyDetail(detailResponse.retData || {})
    } catch (error) {
      if (sequence !== requestSequence) return
      productOptions.value = []
      categoryOptions.value = []
    } finally {
      if (sequence === requestSequence) loading.value = false
    }
  }

  function buildSubmitData() {
    const imageFile = formData.imageFiles[0]
    const img = imageFile?.url || ''
    const imgThumb = formData.thumbnailFiles[0]?.url || imageFile?.urlThumb || img
    const submitData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      img,
      imgThumb,
      productIdList: normalizeIdList(formData.productIdList),
      categoryIdList: normalizeIdList(formData.categoryIdList)
    }

    if (!isAdd.value) submitData.productImgId = Number(formData.productImgId)
    return submitData
  }

  async function submitForm() {
    if (!formRef.value || isReadOnly.value) return

    try {
      await formRef.value.validate()
    } catch (error) {
      return
    }

    submitting.value = true
    try {
      const submitData = buildSubmitData()
      if (isAdd.value) await addProductImg(submitData)
      else await editProductImg(submitData)

      ElMessage.success(isAdd.value ? '新增成功' : '编辑成功')
      invalidateList('productImageList')
      router.push({ name: 'productImageList' })
    } finally {
      submitting.value = false
    }
  }

  function backToList() {
    router.push({ name: 'productImageList' })
  }

  watch(
    () => [route.name, route.query.id],
    ([currentRouteName, id]) => {
      if (currentRouteName === routeName) initializeData(id)
      else {
        requestSequence += 1
        loading.value = false
      }
    },
    { immediate: true }
  )

  return {
    formRef,
    formData,
    productOptions,
    categoryOptions,
    loading,
    submitting,
    rules,
    isAdd,
    isReadOnly,
    pageTitle,
    submitForm,
    backToList
  }
}
