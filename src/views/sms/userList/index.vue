<script setup name="userList">
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchPanel from '@/components/SearchPanel/index.vue'
import ListToolbar from '@/components/ListToolbar/index.vue'
import PaginationBar from '@/components/PaginationBar/index.vue'
import { usePagedList, cleanQuery } from '@/composables/usePagedList'
import { formatDate } from '@/utils/date'
import { getUserList, getUserListExcel, setUserVerify } from '@/api/userList'
import UserAccountEditor from './components/UserAccountEditor.vue'

const router = useRouter()

const languageOptions = [
  { value: 0, label: '英语' },
  { value: 1, label: '英语' },
  { value: 2, label: '德语' },
  { value: 3, label: '西班牙语' },
  { value: 4, label: '法语' },
  { value: 5, label: '意大利语' },
  { value: 6, label: '葡萄牙语' }
]

const terminalOptions = [
  { value: 1, label: 'Android' },
  { value: 2, label: 'iOS' }
]

const verifyOptions = [
  { value: 1, label: '有效' },
  { value: 0, label: '无效' }
]

const defaultListQuery = () => ({
  pageIndex: 1,
  pageSize: 10,
  keyword: null,
  language: null,
  terminal: null,
  verify: null
})

const dateList = shallowRef([])

const {
  listQuery,
  list,
  total,
  listLoading,
  getList,
  handleSearchList: searchList,
  handleResetSearch: resetSearch,
  handleSizeChange,
  handleCurrentChange
} = usePagedList({
  fetchList: getUserList,
  defaultQuery: defaultListQuery,
  buildParams: cleanQuery,
  reloadOnActivated: false,
  refreshKey: 'userList'
})

function formatDateTime(time) {
  if (time == null || time === '') return 'N/A'
  return formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
}

function applyDateRange() {
  if (dateList.value?.length) {
    listQuery.startDate = dateList.value[0]
    listQuery.endDate = dateList.value[1]
    return
  }
  delete listQuery.startDate
  delete listQuery.endDate
}

function handleSearchList() {
  applyDateRange()
  searchList()
}

function handleResetSearch() {
  dateList.value = []
  resetSearch()
}

function handleStatusChange(status, row) {
  ElMessageBox.confirm('是否修改该用户状态?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      setUserVerify({ verify: status, id: row.userId }).then(() => {
        ElMessage.success('修改成功')
        row.verify = status
      })
    })
    .catch(() => {
      ElMessage.info('取消修改')
    })
}

function handleExport() {
  applyDateRange()
  const query = cleanQuery({ ...listQuery, pageIndex: 1 })
  getUserListExcel(query).then((res) => {
    if (res.retData) {
      window.location.href = res.retData
      return
    }
    ElMessage.warning('数据为空，无法导出')
  })
}

function handleEdit(row) {
  router.push({ name: 'userListEdit', query: { id: row.userId } })
}

function handleDetail(row) {
  router.push({ name: 'userListDetail', query: { id: row.userId } })
}

function handleAccountUpdated(row, availableToken) {
  row.availableToken = availableToken
}

function handleAccountLogs(row) {
  const query = row ? { id: row.userId } : undefined
  router.push({ name: 'userAccountLogs', query })
}
</script>

<template>
  <div class="app-container">
    <SearchPanel :model="listQuery" @search="handleSearchList" @reset="handleResetSearch">
      <el-form-item label="用户关键词">
        <el-input
          v-model="listQuery.keyword"
          placeholder="请输入用户昵称、邮箱"
          clearable
          maxlength="40"
          class="input-width"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="语言">
        <el-select v-model="listQuery.language" clearable placeholder="请选择语言" style="width: 140px">
          <el-option
            v-for="item in languageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="终端">
        <el-select v-model="listQuery.terminal" clearable placeholder="请选择终端" style="width: 140px">
          <el-option
            v-for="item in terminalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="listQuery.verify" clearable placeholder="请选择状态" style="width: 120px">
          <el-option
            v-for="item in verifyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="注册时间">
        <el-date-picker
          v-model="dateList"
          style="width: 300px"
          type="daterange"
          unlink-panels
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
    </SearchPanel>

    <ListToolbar title="用户列表">
      <el-button
        v-permission="['Get_User_GetOperatUserAccountLog']"
        size="small"
        icon="Clock"
        @click="handleAccountLogs()"
      >
        账户操作日志
      </el-button>
      <el-button
        v-permission="['Get_User_GetUserListExcel']"
        size="small"
        icon="Document"
        type="primary"
        @click="handleExport"
      >
        导出用户
      </el-button>
    </ListToolbar>

    <div class="table-container">
      <vxe-table
        :data="list"
        :loading="listLoading"
        border
        round
        stripe
        :row-config="{ isHover: true }"
        :column-config="{ resizable: true }"
        max-height="560"
      >
        <vxe-column type="seq" title="编号" width="70" align="center" />
        <vxe-column field="userId" title="用户ID" width="90" align="center" />
        <vxe-column field="userNo" title="用户编号" min-width="130" align="center" show-overflow />
        <vxe-column field="nickName" title="用户昵称" min-width="120" align="center" show-overflow />
        <vxe-column field="userEmail" title="用户邮箱" min-width="170" align="center" show-overflow />
        <vxe-column field="terminalMsg" title="终端" width="110" align="center" show-overflow />
        <vxe-column field="totalToken" title="总计星币" min-width="120" align="right" show-overflow />
        <vxe-column title="可用星币" min-width="150" align="right">
          <template #default="{ row }">
            <UserAccountEditor
              :user="row"
              @updated="handleAccountUpdated(row, $event)"
            />
          </template>
        </vxe-column>
        <vxe-column field="consumeToken" title="消耗星币" min-width="120" align="right" show-overflow />
        <vxe-column title="状态" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-permission="['Post_User_SetUserVerify']"
              :model-value="row.verify"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange($event, row)"
            />
          </template>
        </vxe-column>
        <vxe-column title="注册时间" width="170" align="center">
          <template #default="{ row }">{{ formatDateTime(row.joinTime) }}</template>
        </vxe-column>
        <vxe-column title="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <div class="handle-table-box">
              <el-button
                v-permission="['Post_User_SetUserInfo']"
                size="small"
                type="primary"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="['Get_User_GetUserDetail']"
                size="small"
                type="primary"
                @click="handleDetail(row)"
              >
                详情
              </el-button>
              <el-button
                v-permission="['Get_User_GetOperatUserAccountLog']"
                size="small"
                @click="handleAccountLogs(row)"
              >
                账户日志
              </el-button>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <PaginationBar
      v-model:current-page="listQuery.pageIndex"
      v-model:page-size="listQuery.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
