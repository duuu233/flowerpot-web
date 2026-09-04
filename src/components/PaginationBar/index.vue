<script setup name="PaginationBar">
const currentPage = defineModel('currentPage', { type: Number, required: true })
const pageSize = defineModel('pageSize', { type: Number, required: true })

defineProps({
  total: { type: Number, default: 0 },
  pageSizes: { type: Array, default: () => [10, 20, 30] },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  }
})

const emit = defineEmits(['size-change', 'current-change'])
</script>

<template>
  <div class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      background
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="emit('size-change', $event)"
      @current-change="emit('current-change', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.pagination-container {
  :deep(.el-pagination) {
    --el-pagination-button-bg-color: var(--app-surface-muted);
    --el-pagination-hover-color: var(--brand-600);

    .btn-prev,
    .btn-next,
    .el-pager li {
      border-radius: var(--control-radius);
      font-weight: 500;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        border-color 0.18s ease;

      &.is-active {
        background-color: var(--brand-500);
        color: #ffffff;
        font-weight: 600;
      }
    }
  }
}
</style>
