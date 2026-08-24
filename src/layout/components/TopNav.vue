<template>
  <div class="top-nav-box">
    <div class="logo">
      <img :src="logoMini" alt="花盆 LOGO" />
    </div>
    <div class="nav-box">
      <ul class="nav">
        <li
          v-for="(item, index) in navList"
          :key="item.id"
          :class="clickedIndex === index ? 'clickedNav' : ''"
          @click="navClick(item.id, index)"
        >
          {{ item.systemName }}
        </li>
      </ul>
      <div class="right">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="userAvatar" alt="avatar" />
            <span class="user-name">{{ username }}</span>
            <el-icon class="caret"><CaretBottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item divided @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <i class="right-line" />
        <div class="message-icon-box">
          <svg-icon icon-class="nav-ring" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="TopNav">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { getLeftMenus } from '@/api/login'
import { getCookie } from '@/utils/support'
import logoMini from '@/assets/images/logo.png'
import userAvatar from '@/assets/images/user.png'

const appStore = useAppStore()
const userStore = useUserStore()
const { sidebarTop: navList } = storeToRefs(appStore)

const username = ref(getCookie('trueName') || '')
const clickedIndex = ref(0)

function navClick(menuId, index) {
  clickedIndex.value = index
  getLeftMenus({ parentMenuId: menuId }).then(response => {
    appStore.setSidebarRight(response.retData)
  })
}

// 顶部导航就绪后默认选中第一个系统
watch(
  navList,
  val => {
    if (val && val.length) {
      navClick(val[0].id, 0)
    }
  },
  { immediate: true }
)

function logout() {
  userStore.logOut().then(() => {
    ElMessage({ message: '已退出！', type: 'success', duration: 1000 })
    setTimeout(() => location.reload(), 100)
  })
}
</script>

<style lang="scss" scoped>
.top-nav-box {
  display: flex;
  height: var(--shell-header-height);
  align-items: center;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--app-shell);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 8px 24px rgba(38, 34, 32, 0.1);
  z-index: 99;
}
.logo {
  height: var(--shell-header-height);
  min-width: var(--shell-sidebar-width);
  display: flex;
  align-items: center;
  color: #fff;
  padding: 10px 28px;
  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
}
.nav-box {
  display: flex;
  flex: 10;
  min-width: 0;
  padding: 0 24px 0 0;
  align-items: center;
  justify-content: space-between;
  .right {
    display: flex;
    align-items: center;
  }
}
.nav {
  display: flex;
  min-width: 0;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  li {
    height: var(--shell-header-height);
    line-height: var(--shell-header-height);
    text-align: center;
    padding: 0 22px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition:
      color 0.2s cubic-bezier(0.16, 1, 0.3, 1),
      background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  li:hover {
    background-color: rgba(255, 255, 255, 0.06);
    color: #fff;
  }
}
.avatar-container {
  height: 35px;
  .avatar-wrapper {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.82);
    font-size: 14px;
    font-weight: 500;
    .user-avatar {
      width: 35px;
      height: 35px;
      border-radius: 10px;
      margin-right: 8px;
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    .caret {
      margin-left: 6px;
      font-size: 14px;
    }
  }
}
.right-line {
  width: 1px;
  height: 15px;
  background-color: rgba(255, 255, 255, 0.16);
  margin: 0 15px 0 20px;
}
.message-icon-box {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.82);
}
// 选中态：中性填充 + 2px LOGO 橙指示条。
// 深色顶栏上的细指示条是 LOGO 原色唯一合适的位置，面积小到不会刺眼。
.clickedNav {
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
  box-shadow: inset 0 -2px 0 var(--brand-logo);
}

@media (max-width: 768px) {
  .logo {
    min-width: 170px;
    padding: 10px 18px;
    img {
      width: 44px;
      height: 44px;
    }
  }

  .nav-box {
    padding-right: 12px;
  }

  .nav li {
    padding: 0 14px;
  }

  .user-name,
  .right-line,
  .message-icon-box {
    display: none;
  }
}
</style>
