<script setup>
import { reactive, shallowRef } from 'vue'
import SearchPanel from '@/components/SearchPanel/index.vue'

const emit = defineEmits(['search', 'reset'])
const filters = reactive({ keyword: '' })
const dateRange = shallowRef([])

function search() {
  emit('search', {
    keyword: filters.keyword.trim(),
    startDate: dateRange.value?.[0] || '',
    endDate: dateRange.value?.[1] || ''
  })
}

function reset() {
  filters.keyword = ''
  dateRange.value = []
  emit('reset')
}
</script>

<template>
  <SearchPanel :model="filters" @search="search" @reset="reset">
    <el-form-item label="文件关键词">
      <el-input v-model="filters.keyword" placeholder="文件名称或地址" clearable class="keyword-input" />
    </el-form-item>
    <el-form-item label="添加时间">
      <el-date-picker v-model="dateRange" type="daterange" unlink-panels value-format="YYYY-MM-DD"
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="date-input" />
    </el-form-item>
  </SearchPanel>
</template>

<style scoped>
.keyword-input { width: 240px; }
.date-input { width: 280px; }
</style>
