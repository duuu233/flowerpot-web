<script setup name="userAccountLogs">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LogList from '@/views/log/components/LogList.vue'
import { getOperatUserAccountLog } from '@/api/userList'

const route = useRoute()

const languageOptions = [
  { value: 0, label: '英语' },
  { value: 1, label: '英语' },
  { value: 2, label: '德语' },
  { value: 3, label: '西班牙语' },
  { value: 4, label: '法语' },
  { value: 5, label: '意大利语' },
  { value: 6, label: '葡萄牙语' }
]

const baseQuery = computed(() => ({
  id: route.query.id || null
}))

const title = computed(() => {
  return route.query.id ? `账户操作日志 · 用户 ${route.query.id}` : '账户操作日志'
})

const columns = [
  { prop: 'userId', label: '用户ID', width: 100 },
  { prop: 'userNo', label: '用户编号', minWidth: 150 },
  { prop: 'nickName', label: '用户昵称', minWidth: 140 },
  { prop: 'operatContent', label: '操作内容', minWidth: 320 },
  { prop: 'adminName', label: '操作管理员', minWidth: 140 },
  { prop: 'joinTime', label: '操作时间', width: 180, time: true }
]
</script>

<template>
  <LogList
    :key="route.fullPath"
    :title="title"
    :fetch="getOperatUserAccountLog"
    :base-query="baseQuery"
    :columns="columns"
    search-label="用户关键词"
    search-placeholder="请输入用户编号或昵称"
  >
    <template #filters="{ query }">
      <el-form-item label="用户ID">
        <el-input
          v-model="query.id"
          clearable
          maxlength="12"
          placeholder="不填则查询全部"
          style="width: 160px"
        />
      </el-form-item>
      <el-form-item label="语言">
        <el-select v-model="query.language" clearable placeholder="请选择语言" style="width: 140px">
          <el-option
            v-for="item in languageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="query.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始时间"
          style="width: 170px"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="query.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择结束时间"
          style="width: 170px"
        />
      </el-form-item>
    </template>
  </LogList>
</template>
