import { shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAiConfigList, setAiConfigVerify } from '@/api/aiConfig'
import { cleanQuery, usePagedList } from '@/composables/usePagedList'

const defaultListQuery = () => ({
  pageIndex: 1,
  pageSize: 10,
  keyword: '',
  language: null,
  aiModel: null,
  verify: null
})

export function useAiConfigList() {
  const dateRange = shallowRef([])
  const changingId = shallowRef(null)
  const pagedList = usePagedList({
    fetchList: getAiConfigList,
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

  async function handleStatusChange(row) {
    const nextVerify = Number(row.verify) === 1 ? 0 : 1
    const actionLabel = nextVerify === 1 ? '启用' : '禁用'

    try {
      await ElMessageBox.confirm(
        `确认${actionLabel} AI 项目“${row.aiProject || row.aiConfigId}”吗？`,
        'AI 配置状态确认',
        {
          confirmButtonText: actionLabel,
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      changingId.value = row.aiConfigId
      await setAiConfigVerify({ id: row.aiConfigId, verify: nextVerify })
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
