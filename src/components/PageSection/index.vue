<script setup name="PageSection">
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: '' }
})
</script>

<template>
  <el-card class="page-section" shadow="never">
    <div class="page-section__header">
      <el-icon v-if="icon" class="page-section__title-icon">
        <component :is="icon" />
      </el-icon>
      <span>{{ title }}</span>
      <div v-if="$slots.extra" class="page-section__extra">
        <slot name="extra" />
      </div>
    </div>
    <div v-if="$slots.default" class="page-section__body">
      <slot />
    </div>
  </el-card>
</template>

<style scoped>
.page-section {
  overflow: hidden;
  border-radius: var(--app-radius);
  border: 1px solid var(--app-border);
  background: var(--app-surface);
}

.page-section :deep(.el-card__body) {
  padding: 16px 20px 18px;
}

.page-section__header {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 24px;
  color: var(--app-ink);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.page-section__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-500);
  font-size: 16px;
}

.page-section__extra {
  margin-left: auto;
}

.page-section__body {
  margin-top: 16px;
}
</style>
