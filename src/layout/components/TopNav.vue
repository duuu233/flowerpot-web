<template>
  <div class="top-nav-box">
    <div class="logo">
      <img :src="logoMini" alt="花盆 LOGO" />
      <div class="logo-title-group">
        <span class="logo-brand">YSplanter</span>
        <span class="logo-sub">管理中心</span>
      </div>
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
            <span class="user-name">{{ username || '管理员' }}</span>
            <el-icon class="caret"><CaretBottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item divided @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <i class="right-line" />
        <div class="message-icon-box" title="通知消息">
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
  background-color: rgba(22, 22, 23, 0.88);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: none;
  z-index: 1002;
  backdrop-filter: saturate(180%) blur(20px);
}

.logo {
  height: var(--shell-header-height);
  min-width: var(--shell-sidebar-width);
  display: flex;
  align-items: center;
  color: #fff;
  padding: 0 20px;
  user-select: none;

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      transform: scale(1.04);
    }
  }

  .logo-title-group {
    display: flex;
    flex-direction: column;
    margin-left: 12px;
    line-height: 1.15;
  }

  .logo-brand {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: #f5f5f7;
  }

  .logo-sub {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.48);
    letter-spacing: 0.02em;
    margin-top: 2px;
  }
}

.nav-box {
  display: flex;
  flex: 10;
  min-width: 0;
  padding: 0 20px 0 0;
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
  gap: 4px;
  align-items: center;

  &::-webkit-scrollbar {
    display: none;
  }

  li {
    position: relative;
    height: 32px;
    line-height: 32px;
    text-align: center;
    padding: 0 14px;
    color: rgba(255, 255, 255, 0.68);
    font-size: 13.5px;
    font-weight: 450;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 6px;
    transition:
      color 0.2s cubic-bezier(0.16, 1, 0.3, 1),
      background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
  }
}

// 选中态：苹果极简平滑高光，彻底移除发光描边
.clickedNav {
  background-color: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
  font-weight: 550 !important;
}

.avatar-container {
  height: 34px;

  .avatar-wrapper {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.88);
    font-size: 13px;
    font-weight: 450;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background-color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      margin-right: 8px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      object-fit: cover;
    }

    .user-name {
      margin-right: 2px;
    }

    .caret {
      margin-left: 4px;
      font-size: 12px;
      opacity: 0.6;
      transition: transform 0.2s ease;
    }
  }
}

.right-line {
  width: 1px;
  height: 14px;
  background-color: rgba(255, 255, 255, 0.12);
  margin: 0 14px 0 16px;
}

.message-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
}

@media (max-width: 768px) {
  .logo {
    min-width: auto;
    padding: 0 14px;

    img {
      width: 34px;
      height: 34px;
    }

    .logo-sub {
      display: none;
    }
  }

  .nav-box {
    padding-right: 12px;
  }

  .nav li {
    padding: 0 12px;
    font-size: 13px;
  }

  .user-name,
  .right-line,
  .message-icon-box {
    display: none;
  }
}
</style>
