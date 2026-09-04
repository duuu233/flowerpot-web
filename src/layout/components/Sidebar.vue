<template>
  <div class="sidebar-inner">
    <div class="menus-box">
      <template v-for="(item, index) in sidebarRight" :key="index">
        <div
          v-show="hideItemList.indexOf(item.menuName) === -1"
          class="item"
        >
          <div class="title">
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
