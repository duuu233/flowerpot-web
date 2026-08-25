<template>
  <div class="app-wrapper" :class="classObj">
    <top-nav />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <tags-view />
      <app-main />
    </div>
  </div>
</template>

<script setup name="layout">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import TopNav from './components/TopNav.vue'
import Sidebar from './components/Sidebar.vue'
import AppMain from './components/AppMain.vue'
import TagsView from './components/TagsView/index.vue'

const appStore = useAppStore()
const { sidebar, device } = storeToRefs(appStore)

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))
</script>

<style lang="scss" scoped>
@use '../styles/mixin.scss' as *;

.app-wrapper {
  @include clearfix;
  position: relative;
  min-height: 100dvh;
  padding-top: var(--shell-header-height);
  padding-left: var(--shell-sidebar-width);
  background:
    radial-gradient(circle at 100% 0, rgba(72, 153, 159, 0.06), transparent 24rem),
    var(--app-canvas);
}

.main-container {
  min-height: calc(100dvh - var(--shell-header-height));
}
</style>
