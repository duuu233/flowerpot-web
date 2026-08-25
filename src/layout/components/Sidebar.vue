<template>
  <div class="sidebar-inner">
    <div class="menus-box">
      <template v-for="(item, index) in sidebarRight" :key="index">
        <div
          v-show="hideItemList.indexOf(item.menuName) === -1"
          class="item"
        >
          <div class="title">
            <i class="line" />
            <span class="name">{{ item.menuName }}</span>
          </div>
          <div v-if="item.childs && item.childs.length" class="route-box">
            <template v-for="(v, i) in item.childs" :key="i">
              <div
                v-if="hideSubItemList.indexOf(v.menuName) === -1"
                class="subitem"
              >
                <router-link
                  v-if="v.menuUrl"
                  :to="{ name: v.menuUrl }"
                  :class="{ clickedNav: isActive(v.menuUrl) }"
                >
                  {{ v.menuName }}
                </router-link>
                <span v-else>{{ v.menuName }}</span>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup name="Sidebar">
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const { sidebarRight } = storeToRefs(appStore)
const route = useRoute()

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

function isActive(name) {
  return route.name === name
}
</script>

<style lang="scss" scoped>
.sidebar-inner {
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd4d2;
    border-radius: 20px;
  }
}
.menus-box {
  .item {
    padding: 12px 12px 16px;
    margin: 0 8px;
    border-bottom: 1px solid var(--app-border);
  }
  .title {
    display: flex;
    font-size: 14px;
    line-height: 30px;
    color: var(--app-ink);
    margin: 0 0 6px;
    font-weight: 650;
    align-items: center;
    position: relative;
    .line {
      width: 3px;
      height: 14px;
      background-color: var(--brand-logo);
      position: absolute;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 2px;
    }
  }
  .route-box {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3px;
    color: var(--app-text);
    .subitem {
      a,
      span {
        display: block;
        border: 1px solid transparent;
        border-radius: 7px;
        line-height: 18px;
        max-width: 100%;
        padding: 6px 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition:
          color 0.18s cubic-bezier(0.16, 1, 0.3, 1),
          background-color 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      }
      // hover 用中性灰，只有「当前页」用品牌色，
      // 否则整条侧边栏在鼠标移动时一直在闪橙色。
      a:hover {
        color: var(--app-ink);
        background: var(--app-surface-hover);
      }
    }
  }
}
.clickedNav {
  color: var(--brand-600) !important;
  border-color: transparent !important;
  background: var(--brand-50) !important;
  font-weight: 600;
}
</style>
