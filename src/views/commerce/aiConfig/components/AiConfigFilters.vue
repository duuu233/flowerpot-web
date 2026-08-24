<script setup name="AiConfigFilters">
import { computed } from 'vue'
import SearchPanel from '@/components/SearchPanel/index.vue'
import { aiModelOptions, languageOptions } from '@/views/commerce/utils'

const keyword = defineModel('keyword', { type: String, default: '' })
const language = defineModel('language', { type: Number, default: null })
const aiModel = defineModel('aiModel', { type: Number, default: null })
const verify = defineModel('verify', { type: Number, default: null })
const dateRange = defineModel('dateRange', { type: Array, default: () => [] })

const emit = defineEmits(['search', 'reset'])

const filterModel = computed(() => ({
  keyword: keyword.value,
  language: language.value,
  aiModel: aiModel.value,
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
    <el-form-item label="AI 项目">
      <el-input
        v-model="keyword"
        class="filter-input"
        clearable
        maxlength="50"
        placeholder="请输入项目关键词"
      />
    </el-form-item>

    <el-form-item label="AI 模型">
      <el-select
        v-model="aiModel"
        class="filter-select"
        clearable
        placeholder="全部模型"
      >
        <el-option
          v-for="item in aiModelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="语言">
      <el-select
        v-model="language"
        class="filter-select filter-select--language"
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

    <el-form-item label="更新时间">
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
  width: 220px;
}

.filter-select {
  width: 135px;
}

.filter-select--language {
  width: 150px;
}

.filter-select--compact {
  width: 120px;
}

.filter-date {
  width: 280px;
}
</style>
