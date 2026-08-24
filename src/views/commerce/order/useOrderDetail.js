import { shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrderDetail } from '@/api/order'

export function useOrderDetail() {
  const route = useRoute()
  const router = useRouter()
  const order = shallowRef({})
  const loading = shallowRef(false)
  let requestSequence = 0

  async function loadDetail(id = route.query.id) {
    if (!id) {
      ElMessage.error('缺少订单 ID')
      return
    }

    const sequence = ++requestSequence
    order.value = {}
    loading.value = true
    try {
      const response = await getOrderDetail({ id })
      if (sequence !== requestSequence) return
      order.value = response.retData || {}
    } finally {
      if (sequence === requestSequence) loading.value = false
    }
  }

  function backToList() {
    router.push({ name: 'orderList' })
  }

  watch(
    () => [route.name, route.query.id],
    ([currentRouteName, id]) => {
      if (currentRouteName === 'orderListDetail') {
        loadDetail(id)
      } else {
        requestSequence += 1
        loading.value = false
      }
    },
    { immediate: true }
  )

  return {
    order,
    loading,
    loadDetail,
    backToList
  }
}
