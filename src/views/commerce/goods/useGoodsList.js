import { shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getGoodsList, setGoodsVerify } from '@/api/goods'
import { cleanQuery, usePagedList } from '@/composables/usePagedList'

const defaultListQuery = () => ({
  pageIndex: 1,
  pageSize: 10,
  keyword: '',
  language: null,
  verify: null
})

export function useGoodsList() {
  const dateRange = shallowRef([])
  const pagedList = usePagedList({
    fetchList: getGoodsList,
    defaultQuery: defaultListQuery,
    buildParams: cleanQuery,
    reloadOnActivated: false,
    refreshKey: 'goodsList'
  })

  function applyDateRange() {
    if (dateRange.value?.length === 2) {
      pagedList.listQuery.startDate = dateRange.value[0]
      pagedList.listQuery.endDate = dateRange.value[1]
      return
    }

    delete pagedList.listQuery.startDate
    delete pagedList.listQuery.endDate
  }

  function handleSearchList() {
    applyDateRange()
    return pagedList.handleSearchList()
  }

  function handleResetSearch() {
    dateRange.value = []
    return pagedList.handleResetSearch()
  }

  async function handleStatusChange(row) {
    const nextVerify = Number(row.verify) === 1 ? 0 : 1
    const actionLabel = nextVerify === 1 ? '启用' : '禁用'

    try {
      await ElMessageBox.confirm(
        `确认${actionLabel}商品“${row.goodsName || row.goodsId}”吗？`,
        '商品状态确认',
        {
          confirmButtonText: actionLabel,
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      await setGoodsVerify({ id: row.goodsId, verify: nextVerify })
      ElMessage.success(`${actionLabel}成功`)
      await pagedList.getList()
    } catch (error) {
      // 取消确认或请求错误均已由 Element Plus / 请求拦截器反馈。
    }
  }

  return {
    ...pagedList,
    dateRange,
    handleSearchList,
    handleResetSearch,
    handleStatusChange
  }
}
