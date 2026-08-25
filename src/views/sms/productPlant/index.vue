<script setup name="productPlant">
// 植物管理占位页。
// 接口封装已在 src/api/productPlant.js 就绪，列表与表单待 Swagger 字段契约确认后实现。
// 接口地址已于 2026-08-25 改用 IP http://120.25.227.36:8601，/v2/api-docs 可正常访问。
import PageHeader from '@/components/PageHeader/index.vue'

const endpoints = [
  { label: '列表', method: 'GET', url: '/ZoneAdmin/ProductPlant/getProductPlantList', code: 'Get_ProductPlant_GetProductPlantList' },
  { label: '详情', method: 'GET', url: '/ZoneAdmin/ProductPlant/getProductPlantDetail', code: 'Get_ProductPlant_GetProductPlantDetail' },
  { label: '新增', method: 'POST', url: '/ZoneAdmin/ProductPlant/addProductPlant', code: 'Post_ProductPlant_AddProductPlant' },
  { label: '编辑', method: 'POST', url: '/ZoneAdmin/ProductPlant/editProductPlant', code: 'Post_ProductPlant_EditProductPlant' },
  { label: '启用/禁用', method: 'POST', url: '/ZoneAdmin/ProductPlant/setProductPlantVerify', code: 'Post_ProductPlant_SetProductPlantVerify' }
]
</script>

<template>
  <div class="app-container">
    <PageHeader title="植物管理" icon="Sunny" />

    <el-card class="plant-placeholder" shadow="never">
      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="页面待实现"
        description="接口封装与路由已就绪，列表和表单待接口字段契约确认后补齐。"
      />

      <div class="plant-placeholder__title">已封装接口（src/api/productPlant.js）</div>
      <el-table :data="endpoints" size="small" border>
        <el-table-column prop="label" label="功能" width="110" />
        <el-table-column prop="method" label="方法" width="80" />
        <el-table-column prop="url" label="接口地址" min-width="320" />
        <el-table-column prop="code" label="权限编码" min-width="280" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.plant-placeholder {
  margin-top: 14px;
}

.plant-placeholder__title {
  margin: 20px 0 10px;
  color: var(--app-ink);
  font-size: 14px;
  font-weight: 650;
}
</style>
