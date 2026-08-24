import { shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getImgCategoryList,
  setImgCategoryVerify
} from '@/api/productImage'
import { cleanQuery, usePagedList } from '@/composables/usePagedList'

const defaultListQuery = () => ({
  pageIndex: 1,
  pageSize: 10,
  keyword: '',
  language: null,
  verify: null
})

export function useImageCategoryList() {
  const dateRange = shallowRef([])
  const changingId = shallowRef(null)
  const pagedList = usePagedList({
    fetchList: getImgCategoryList,
    defaultQuery: defaultListQuery,
    buildParams: cleanQuery,
    reloadOnActivated: false,
    refreshKey: 'imageCategoryList'
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
        `确认${actionLabel}分类“${row.categoryName || row.categoryId}”吗？`,
        '分类状态确认',
        {
          confirmButtonText: actionLabel,
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      changingId.value = row.categoryId
      await setImgCategoryVerify({ id: row.categoryId, verify: nextVerify })
      ElMessage.success(`${actionLabel}成功`)
      await pagedList.getList()
    } catch (error) {
      // 用户取消或请求拦截器已反馈错误。
    } finally {
      changingId.value = null
    }
  }

  return {
    ...pagedList,
    dateRange,
    changingId,
    handleSearchList,
    handleResetSearch,
    handleStatusChange
  }
}
