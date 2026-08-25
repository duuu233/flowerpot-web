<script setup name="login">
import { reactive, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import md5 from 'js-md5'
import { validateE_N, validateC_E_N } from '@/utils/validate'
import { setCookie, getCookie } from '@/utils/support'
import { useUserStore } from '@/store/modules/user'
import { getCountryListForTest } from '@/api/clientBasic'
import login_bg from '@/assets/images/login_bg.png'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = shallowRef(false)
const countryApiTesting = shallowRef(false)

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

async function handleCountryApiTest() {
  countryApiTesting.value = true
  try {
    const response = await getCountryListForTest()
    const result = response.data || {}
    const countryCount = Array.isArray(result.retData) ? result.retData.length : 0

    console.info('[国家列表接口测试]', response)
    if (result.retCode === 200) {
      ElMessage.success(`接口调用成功：HTTP ${response.status}，返回 ${countryCount} 个国家`)
    } else {
      ElMessage.warning(
        `接口已响应：HTTP ${response.status}，业务码 ${result.retCode ?? '未知'}`
      )
    }
  } catch (error) {
    const reason = error.response?.status
      ? `HTTP ${error.response.status}`
      : error.message || '未知错误'
    console.error('[国家列表接口测试失败]', error)
    ElMessage.error(`接口调用失败：${reason}`)
  } finally {
    countryApiTesting.value = false
  }
}
</script>

<template>
  <div class="login_content_bg">
    <img :src="login_bg" class="login_bg_img" alt="bg" />
    <div class="logon_content_bx">
      <div class="login_content_tp">
        <p class="login_title">花盆 管理中心</p>
      </div>
      <div class="login_content_bm">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-position="left"
        >
          <el-form-item prop="adminName">
            <el-input
              v-model="loginForm.adminName"
              class="login_input"
              name="adminName"
              type="text"
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
              class="login_input"
              name="password"
              type="password"
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
          <el-form-item>
            <el-button
              class="logon_btn"
              type="primary"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button
        class="country-api-test-btn"
        type="primary"
        link
        :loading="countryApiTesting"
        @click="handleCountryApiTest"
      >
        测试国家列表接口
      </el-button>
    </div>
    <p class="login_copyright">
      版权所有 启和明(深圳)新能源科技有限公司 2024-2030年 版本号 V1.0.0
    </p>
  </div>
</template>

<style scoped lang="scss">
.login-prefix {
  font-size: 16px;
  color: var(--brand-500);
}

.login_content_bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-sizing: content-box;
}

.login_bg_img {
  display: inline-block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logon_content_bx {
  width: 400px;
  height: 470px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(22, 38, 42, 0.08);
  border-radius: 12px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 22px 56px rgba(22, 38, 42, 0.12);
}

// 顶部色带用主题色阶绘制，跟随 --brand-* 变化，不再依赖固定颜色的图片
.login_content_tp {
  width: 100%;
  height: 130px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--brand-600) 0%,
    var(--brand-500) 55%,
    var(--brand-400) 100%
  );

  // 两个柔光圆点，还原原设计的层次感
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &::before {
    width: 190px;
    height: 190px;
    top: -96px;
    right: -34px;
  }

  &::after {
    width: 140px;
    height: 140px;
    bottom: -62px;
    left: -40px;
  }
}

.login_title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  height: 130px;
  line-height: 130px;
  font-size: 28px;
  color: #fff;
  font-weight: 500;
  z-index: 9;
}

.login_copyright {
  width: 100vw;
  text-align: center;
  font-size: 14px;
  color: var(--app-text);
  bottom: 74px;
  line-height: 14px;
  position: absolute;
}

.login_content_bm {
  width: 317px;
  margin: 40px auto 0;
}

.login_input {
  margin-bottom: 30px;
}

.logon_btn {
  margin-top: 5px;
  width: 100%;
  height: 45px;
  border-radius: var(--control-radius);
  font-weight: 600;
  background-color: var(--brand-500);
  border-color: var(--brand-500);
  box-shadow: 0 6px 16px rgba(22, 38, 42, 0.1);
  font-size: 16px;
}

.country-api-test-btn {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
