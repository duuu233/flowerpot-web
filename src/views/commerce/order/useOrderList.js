import { shallowRef } from 'vue'
import { getOrderList } from '@/api/order'
import { cleanQuery, usePagedList } from '@/composables/usePagedList'

const defaultListQuery = () => ({
  pageIndex: 1,
  pageSize: 10,
  keyword: '',
  language: null,
  orderState: null,
  payState: null,
  payType: null
})

export function useOrderList() {
  const dateRange = shallowRef([])
  const pagedList = usePagedList({
    fetchList: getOrderList,
    defaultQuery: defaultListQuery,
    buildParams: cleanQuery,
    reloadOnActivated: true
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

  return {
    ...pagedList,
    dateRange,
    handleSearchList,
    handleResetSearch
  }
}
