<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="['tags-view-item', isActive(tag) ? 'active' : '']"
        :to="{ path: tag.path, query: tag.query }"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <el-icon
          v-if="!isAffix(tag)"
          class="close-icon"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </div>

    <ul
      v-show="menuVisible"
      :style="{ left: menuLeft + 'px', top: menuTop + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup name="TagsView">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTagsViewStore } from '@/store/modules/tagsView'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const { visitedViews } = storeToRefs(tagsViewStore)

const menuVisible = ref(false)
const menuLeft = ref(0)
const menuTop = ref(0)
const selectedTag = ref({})
const affixTags = ref([])

function isActive(tag) {
  return tag.path === route.path
}
function isAffix(tag) {
  return tag.meta && tag.meta.affix
}

function filterAffixTags(routes) {
  let tags = []
  routes.forEach((r) => {
    if (r.meta && r.meta.affix && r.name) {
      tags.push({
        name: r.name,
        path: r.path,
        meta: { ...r.meta }
      })
    }
  })
  return tags
}

function initTags() {
  affixTags.value = filterAffixTags(router.getRoutes())
  for (const tag of affixTags.value) {
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

function addTags() {
  if (route.name) {
    tagsViewStore.addView(route)
  }
}

function closeSelectedTag(view) {
  tagsViewStore.delView(view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
  closeMenu()
}

function closeOthersTags() {
  router.push(selectedTag.value).catch(() => {})
  tagsViewStore.delOthersViews(selectedTag.value)
  closeMenu()
}

function closeAllTags(view) {
  tagsViewStore.delAllViews().then(({ visitedViews }) => {
    if (affixTags.value.some((tag) => tag.path === view.path)) return
    toLastView(visitedViews, view)
  })
  closeMenu()
}

function refreshSelectedTag(view) {
  tagsViewStore.delCachedView(view)
  nextTick(() => {
    router.replace({ path: '/redirect' + view.path, query: view.query })
  })
  closeMenu()
}

function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    router.push('/')
  }
}

function openMenu(tag, e) {
  menuLeft.value = e.clientX
  menuTop.value = e.clientY
  menuVisible.value = true
  selectedTag.value = tag
}
function closeMenu() {
  menuVisible.value = false
}

watch(menuVisible, (val) => {
  if (val) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

watch(
  () => route.path,
  () => addTags()
)

onMounted(() => {
  initTags()
  addTags()
})
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 38px;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid var(--app-border);
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: none;
}

.tags-view-wrapper {
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 16px;
  overflow-x: auto;
  gap: 4px;

  &::-webkit-scrollbar {
    height: 0;
  }

  .tags-view-item {
    display: inline-flex;
    align-items: center;
    height: 26px;
    line-height: 26px;
    border: none;
    color: var(--app-text);
    background: transparent;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 6px;
    white-space: nowrap;
    transition:
      color 0.18s cubic-bezier(0.16, 1, 0.3, 1),
      background-color 0.18s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: rgba(0, 0, 0, 0.04);
      color: var(--app-ink);
    }

    // 激活项：苹果分段控件药丸卡片，微浮起，绝不画多余彩色圆点
    &.active {
      background: #ffffff;
      color: var(--app-ink);
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.04);

      .close-icon {
        color: var(--app-text);
        &:hover {
          color: var(--app-ink);
          background: rgba(0, 0, 0, 0.06);
        }
      }
    }

    .close-icon {
      margin-left: 5px;
      font-size: 11px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition:
        background-color 0.16s ease,
        color 0.16s ease,
        transform 0.16s ease;

      &:hover {
        background: rgba(19, 36, 39, 0.1);
        color: var(--app-ink);
        transform: scale(1.1);
      }
    }
  }
}

.contextmenu {
  margin: 0;
  background: rgba(255, 255, 255, 0.96);
  z-index: 3000;
  position: fixed;
  list-style-type: none;
  padding: 5px;
  border: 1px solid var(--app-border);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--app-ink);
  box-shadow: var(--app-shadow-md);
  backdrop-filter: blur(12px);

  li {
    margin: 0;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    transition:
      background-color 0.16s ease,
      color 0.16s ease;

    &:hover {
      background: var(--brand-50);
      color: var(--brand-600);
    }
  }
}
</style>
