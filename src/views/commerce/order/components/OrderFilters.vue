<script setup name="OrderFilters">
import { computed } from 'vue'
import SearchPanel from '@/components/SearchPanel/index.vue'
import {
  languageOptions,
  orderStateOptions,
  payStateOptions,
  payTypeOptions
} from '@/views/commerce/utils'

const keyword = defineModel('keyword', { type: String, default: '' })
const language = defineModel('language', { type: Number, default: null })
const orderState = defineModel('orderState', { type: Number, default: null })
const payState = defineModel('payState', { type: Number, default: null })
const payType = defineModel('payType', { type: Number, default: null })
const dateRange = defineModel('dateRange', { type: Array, default: () => [] })

const emit = defineEmits(['search', 'reset'])

const filterModel = computed(() => ({
  keyword: keyword.value,
  language: language.value,
  orderState: orderState.value,
  payState: payState.value,
  payType: payType.value,
  dateRange: dateRange.value
}))
</script>

<template>
  <SearchPanel
    :model="filterModel"
    @search="emit('search')"
    @reset="emit('reset')"
  >
    <el-form-item label="订单关键词">
      <el-input
        v-model="keyword"
        class="filter-keyword"
        clearable
        maxlength="50"
        placeholder="订单号 / 商品名称"
      />
    </el-form-item>

    <el-form-item label="订单状态">
      <el-select
        v-model="orderState"
        class="filter-select"
        clearable
        placeholder="全部状态"
      >
        <el-option
          v-for="item in orderStateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="支付状态">
      <el-select
        v-model="payState"
        class="filter-select"
        clearable
        placeholder="全部状态"
      >
        <el-option
          v-for="item in payStateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="支付方式">
      <el-select
        v-model="payType"
        class="filter-select filter-select--pay"
        clearable
        placeholder="全部方式"
      >
        <el-option
          v-for="item in payTypeOptions"
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
.filter-keyword {
  width: 220px;
}

.filter-select {
  width: 120px;
}

.filter-select--pay,
.filter-select--language {
  width: 145px;
}

.filter-date {
  width: 280px;
}
</style>
