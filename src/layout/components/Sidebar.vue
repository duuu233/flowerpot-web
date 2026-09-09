<template>
  <div class="sidebar-inner">
    <div class="menus-box">
      <div v-for="(item, index) in visibleMenus" :key="index" class="item">
        <div class="title">
          <span class="name">{{ item.menuName }}</span>
        </div>
        <div class="route-box">
          <div v-for="(v, i) in item.childs" :key="i" class="subitem">
            <router-link
              v-if="v.menuUrl"
              :to="{ name: v.menuUrl }"
              :class="{ clickedNav: isActive(v.menuUrl) }"
            >
              {{ v.menuName }}
            </router-link>
            <span v-else>{{ v.menuName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="Sidebar">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const { sidebarRight } = storeToRefs(appStore)
const route = useRoute()
const router = useRouter()

// 与原项目一致：屏蔽部分尚未启用的菜单
const hideItemList = ['支付查询']
const hideSubItemList = [
  '商品品牌',
  '新闻分类',
  '新闻列表',
  '意见反馈',
  '商品属性值',
  '搜索关键词',
  '基础信息',
  '活动管理',
  '广告位置',
  '用户优惠券列表'
]

// 已提示过的失效 menuUrl，避免每次重新渲染都刷屏
const warnedMenuUrls = new Set()

// 后端菜单和本地路由表各自维护：模块下线后后台可能还留着菜单行（例如已删除的 config）。
// RouterLink 解析不存在的 name 会在渲染期抛错，整块侧栏都渲染不出来，所以先把这类节点丢掉。
function isRenderable(child) {
  if (!child.menuUrl) return true
  if (router.hasRoute(child.menuUrl)) return true
  if (import.meta.env.DEV && !warnedMenuUrls.has(child.menuUrl)) {
    warnedMenuUrls.add(child.menuUrl)
    console.warn(
      `[Sidebar] 后台菜单「${child.menuName}」指向的路由 ${child.menuUrl} 在本地不存在，已跳过`
    )
  }
  return false
}

// 过滤后没有可见子项的分组不再渲染，避免留下一个空标题
const visibleMenus = computed(() => {
  const list = Array.isArray(sidebarRight.value) ? sidebarRight.value : []
  return list
    .filter(item => hideItemList.indexOf(item.menuName) === -1)
    .map(item => ({
      ...item,
      childs: (item.childs || []).filter(
        v => hideSubItemList.indexOf(v.menuName) === -1 && isRenderable(v)
      )
    }))
    .filter(item => item.childs.length > 0)
})

function isActive(name) {
  return route.name === name
}
</script>

<style lang="scss" scoped>
.sidebar-inner {
  height: 100%;
  overflow-y: auto;
  padding: 4px 0 16px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(19, 36, 39, 0.14);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(19, 36, 39, 0.24);
  }
}

.menus-box {
  padding: 6px 8px;

  .item {
    padding: 10px 4px 6px;
    margin: 0;

    &:first-child {
      padding-top: 4px;
    }
  }

  // 一级菜单分组标题：字号加大，深炭黑加粗，与二级菜单形成清晰层级区分
  .title {
    display: flex;
    align-items: center;
    font-size: 13.5px;
    line-height: 22px;
    color: var(--app-ink);
    margin: 0 0 8px;
    font-weight: 650;
    letter-spacing: -0.01em;
    padding: 0 8px;
  }

  .route-box {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
    color: var(--app-text);

    .subitem {
      a,
      span {
        display: block;
        border: none;
        border-radius: 8px;
        line-height: 18px;
        font-size: 12.5px;
        max-width: 100%;
        padding: 7px 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #555558;
        font-weight: 450;
        transition:
          color 0.18s cubic-bezier(0.16, 1, 0.3, 1),
          background-color 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      }

      a:hover {
        color: var(--app-ink);
        background: rgba(0, 0, 0, 0.04);
      }
    }
  }
}

// 激活项：苹果纯净微胶囊（无边框、无发光暗影，触感自然平滑）
.clickedNav {
  color: var(--brand-600) !important;
  background: rgba(32, 101, 108, 0.09) !important;
  font-weight: 600 !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
