import {
  computed,
  reactive,
  ref,
  shallowRef,
  watch
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { addGoods, editGoods, getGoodsDetail } from '@/api/goods'
import { invalidateList } from '@/composables/useListRefresh'

const defaultForm = () => ({
  goodsId: null,
  goodsName: '',
  amount: null,
  num: 1,
  giveNum: 0,
  grade: 0,
  appleProductId: '',
  wxProductId: '',
  unitPrice: null,
  verify: null
})

export function useGoodsForm(mode) {
  const route = useRoute()
  const router = useRouter()
  const routeName = {
    add: 'goodsListAdd',
    edit: 'goodsListEdit',
    detail: 'goodsListDetail'
  }[mode]
  const formRef = ref(null)
  const formData = reactive(defaultForm())
  const loading = shallowRef(false)
  const submitting = shallowRef(false)
  let requestSequence = 0

  const isAdd = computed(() => mode === 'add')
  const isReadOnly = computed(() => mode === 'detail')
  const pageTitle = computed(() => {
    if (isAdd.value) return '新增商品'
    return isReadOnly.value ? '商品详情' : '编辑商品'
  })

  const rules = {
    goodsName: [
      { required: true, message: '请输入商品名称', trigger: 'blur' },
      { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
    ],
    amount: [{ required: true, message: '请输入商品金额', trigger: 'change' }],
    num: [{ required: true, message: '请输入发放数量', trigger: 'change' }],
    giveNum: [{ required: true, message: '请输入赠送数量', trigger: 'change' }],
    grade: [{ required: true, message: '请输入商品权重', trigger: 'change' }],
    appleProductId: [
      { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }
    ],
    wxProductId: [
      { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }
    ]
  }

  function resetForm() {
    Object.assign(formData, defaultForm())
    formRef.value?.clearValidate?.()
  }

  async function loadDetail(id = route.query.id) {
    if (!id) {
      ElMessage.error('缺少商品 ID')
      return
    }

    const sequence = ++requestSequence
    loading.value = true
    try {
      const response = await getGoodsDetail({ id })
      if (sequence !== requestSequence) return
      Object.assign(formData, defaultForm(), response.retData || {})
    } finally {
      if (sequence === requestSequence) loading.value = false
    }
  }

  function buildSubmitData() {
    const submitData = {
      goodsName: formData.goodsName.trim(),
      amount: Number(formData.amount),
      num: Number(formData.num),
      giveNum: Number(formData.giveNum),
      grade: Number(formData.grade),
      appleProductId: formData.appleProductId?.trim() || '',
      wxProductId: formData.wxProductId?.trim() || ''
    }

    if (!isAdd.value) submitData.goodsId = Number(formData.goodsId)
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
      if (isAdd.value) {
        await addGoods(submitData)
      } else {
        await editGoods(submitData)
      }
      ElMessage.success(isAdd.value ? '新增成功' : '编辑成功')
      invalidateList('goodsList')
      router.push({ name: 'goodsList' })
    } finally {
      submitting.value = false
    }
  }

  async function initializeData(id = route.query.id) {
    resetForm()
    if (!isAdd.value) await loadDetail(id)
  }

  function backToList() {
    router.push({ name: 'goodsList' })
  }

  watch(
    () => [route.name, route.query.id],
    ([currentRouteName, id]) => {
      if (currentRouteName === routeName) {
        initializeData(id)
      } else {
        requestSequence += 1
        loading.value = false
      }
    },
    { immediate: true }
  )

  return {
    formRef,
    formData,
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
