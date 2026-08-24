<script setup name="ImageCategoryFilters">
import { computed } from 'vue'
import SearchPanel from '@/components/SearchPanel/index.vue'
import { languageOptions } from '@/views/commerce/utils'

const keyword = defineModel('keyword', { type: String, default: '' })
const language = defineModel('language', { type: Number, default: null })
const verify = defineModel('verify', { type: Number, default: null })
const dateRange = defineModel('dateRange', { type: Array, default: () => [] })

const emit = defineEmits(['search', 'reset'])

const filterModel = computed(() => ({
  keyword: keyword.value,
  language: language.value,
  verify: verify.value,
  dateRange: dateRange.value
}))

const verifyOptions = [
  { value: 1, label: '启用' },
  { value: 0, label: '禁用' }
]
</script>

<template>
  <SearchPanel
    :model="filterModel"
    @search="emit('search')"
    @reset="emit('reset')"
  >
    <el-form-item label="分类名称">
      <el-input
        v-model="keyword"
        class="filter-input"
        clearable
        maxlength="20"
        placeholder="请输入分类名称"
        show-word-limit
      />
    </el-form-item>

    <el-form-item label="语言">
      <el-select
        v-model="language"
        class="filter-select"
        clearable
        placeholder="全部语言"
      >
        <el-option
          v-for="item in languageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="状态">
      <el-select
        v-model="verify"
        class="filter-select filter-select--compact"
        clearable
        placeholder="全部状态"
      >
        <el-option
          v-for="item in verifyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="创建时间">
      <el-date-picker
        v-model="dateRange"
        class="filter-date"
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
</template>

<style scoped>
.filter-input {
  width: 210px;
}

.filter-select {
  width: 150px;
}

.filter-select--compact {
  width: 120px;
}

.filter-date {
  width: 280px;
}
</style>
