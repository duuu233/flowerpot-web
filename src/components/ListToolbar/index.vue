<script setup name="ListToolbar">
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: 'Tickets' }
})
</script>

<template>
  <div class="list-toolbar">
    <div class="list-toolbar__left">
      <el-icon v-if="icon" class="list-toolbar__icon">
        <component :is="icon" />
      </el-icon>
      <span class="list-toolbar__title">{{ title }}</span>
      <div v-if="$slots.default" class="list-toolbar__actions">
        <slot />
      </div>
    </div>
    <div v-if="$slots.extra" class="list-toolbar__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  margin-bottom: 0;
  padding: 12px 18px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  .list-toolbar__left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .list-toolbar__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--brand-500);
    font-size: 16px;
  }

  .list-toolbar__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--app-ink);
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  // 操作按钮紧贴标题排列在左侧，符合用户操作直觉
  .list-toolbar__actions {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-left: 16px;
  }

  .list-toolbar__extra {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }
}
</style>
