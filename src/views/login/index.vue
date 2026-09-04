<script setup name="login">
import { reactive, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import md5 from 'js-md5'
import { validateE_N, validateC_E_N } from '@/utils/validate'
import { setCookie, getCookie } from '@/utils/support'
import { useUserStore } from '@/store/modules/user'
import login_bg from '@/assets/images/login_bg.png'
import logoImg from '@/assets/images/logo.png'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = shallowRef(false)

const loginForm = reactive({
  adminName: getCookie('adminName') || getCookie('username') || '',
  password: getCookie('password') || ''
})

const validateAdminName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入账号'))
  }
  if (!validateC_E_N(value)) {
    return callback(new Error('请输入中文、英文或数字'))
  }
  if ((value + '').length < 2 || (value + '').length > 20) {
    return callback(new Error('请输入 2~20 位中文、英文或数字'))
  }
  callback()
}

const validatePass = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (
    !validateE_N(value) ||
    (value + '').length < 6 ||
    (value + '').length > 20
  ) {
    return callback(new Error('请输入 6~20 位英文、数字或下划线'))
  }
  callback()
}

const loginRules = {
  adminName: [
    { required: true, trigger: 'blur', validator: validateAdminName }
  ],
  password: [{ required: true, trigger: 'blur', validator: validatePass }]
}

function cacheLoginUser(data) {
  setCookie('trueName', data.trueName || data.adminName || '', 15)
  setCookie('adminName', data.adminName || loginForm.adminName, 15)
  setCookie('isSysAdmin', data.isSysAdmin ?? 0, 15)
}

function handleLogin() {
  loginFormRef.value.validate(valid => {
    if (!valid) return false
    loading.value = true
    userStore
      .login({
        adminName: loginForm.adminName,
        password: md5(loginForm.password)
      })
      .then(res => {
        cacheLoginUser(res.retData || {})
        ElMessage({ message: '登录成功！', type: 'success', duration: 1000 })
        router.push({ path: '/' })
      })
      .finally(() => {
        loading.value = false
      })
  })
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-bg-media">
      <img :src="login_bg" class="login-bg-img" alt="bg" />
      <div class="login-bg-overlay" />
    </div>

    <div class="login-card-shell">
      <div class="login-card">
        <div class="login-brand-header">
          <div class="brand-logo-wrap">
            <img :src="logoImg" class="brand-logo-img" alt="YSplanter LOGO" />
          </div>
          <h1 class="brand-title">YSplanter</h1>
          <p class="brand-subtitle">智能花盆管理中心</p>
        </div>

        <div class="login-form-body">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-position="left"
          >
            <el-form-item prop="adminName">
              <el-input
                v-model="loginForm.adminName"
                class="login-input"
                name="adminName"
                type="text"
                size="large"
                autocomplete="username"
                placeholder="请输入登录账号"
              >
                <template #prefix>
                  <svg-icon icon-class="loginuser" class="login-prefix" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                class="login-input"
                name="password"
                type="password"
                size="large"
                autocomplete="current-password"
                show-password
                placeholder="请输入密码"
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <svg-icon icon-class="loginpwd" class="login-prefix" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item class="login-submit-item">
              <el-button
                class="login-submit-btn"
                type="primary"
                size="large"
                :loading="loading"
                @click="handleLogin"
              >
                登录进入系统
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <footer class="login-copyright">
      <span>版权所有 启和明(深圳)新能源科技有限公司 2024-2030</span>
      <span class="copyright-divider">·</span>
      <span>版本号 V1.0.0</span>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.login-prefix {
  font-size: 16px;
  color: var(--brand-500);
}

.login-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--app-canvas);
  overflow: hidden;
}

.login-bg-media {
  position: absolute;
  inset: 0;
  z-index: 1;

  .login-bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.92) contrast(1.02);
  }

  .login-bg-overlay {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 38%, rgba(32, 101, 108, 0.08), transparent 75%),
      linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.52) 100%);
    backdrop-filter: blur(2px);
  }
}

// 苹果发布会级纯净悬浮磨砂卡片（去除双层外壳嵌套与生硬描边）
.login-card-shell {
  position: relative;
  z-index: 10;
  width: 400px;
  max-width: 90vw;
}

.login-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(30px);
  padding: 44px 38px 34px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow:
    0 24px 48px -12px rgba(0, 0, 0, 0.18),
    0 2px 6px rgba(0, 0, 0, 0.04);
}

.login-brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 28px;

  .brand-logo-wrap {
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      transform: scale(1.05);
    }

    .brand-logo-img {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }
  }

  .brand-title {
    font-size: 23px;
    font-weight: 650;
    color: var(--app-ink);
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .brand-subtitle {
    font-size: 13px;
    color: var(--app-text-secondary);
    margin-top: 5px;
    letter-spacing: 0.01em;
  }
}

.login-form-body {
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-input__wrapper) {
    height: 44px;
    border-radius: var(--control-radius);
    box-shadow: 0 0 0 1px var(--app-border-strong) inset;
    background-color: rgba(255, 255, 255, 0.85);
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 0 0 1px #a1a1a6 inset;
    }

    &.is-focus {
      box-shadow:
        0 0 0 1.5px var(--brand-500) inset,
        0 0 0 3px rgba(32, 101, 108, 0.12) !important;
    }
  }

  .login-submit-item {
    margin-top: 24px;
    margin-bottom: 10px;
  }

  .login-submit-btn {
    width: 100%;
    height: 44px;
    border-radius: var(--control-radius);
    font-size: 14.5px;
    font-weight: 500;
    letter-spacing: 0.01em;
    background: var(--brand-500);
    border: none;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(32, 101, 108, 0.25);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: var(--brand-600);
      box-shadow: 0 4px 14px rgba(32, 101, 108, 0.35);
    }
  }
}

.login-copyright {
  position: absolute;
  bottom: 24px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.76);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);

  .copyright-divider {
    opacity: 0.5;
  }
}
</style>
