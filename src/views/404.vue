<template>
  <div class="page-404">
    <img :src="img404" alt="404" class="img-404" />
    <div class="text">
      <h1>404</h1>
      <p>抱歉，你访问的页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup name="Page404">
import { useRouter } from 'vue-router'
import img404 from '@/assets/images/404.png'

const router = useRouter()
function goHome() {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.page-404 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 40px 20px;
  background:
    radial-gradient(circle at 50% 40%, rgba(199, 227, 216, 0.25), transparent 60%),
    var(--app-canvas);
}
.img-404 {
  max-width: 320px;
  width: 36vw;
  filter: drop-shadow(0 12px 28px rgba(19, 36, 39, 0.08));
}
.text {
  text-align: center;
  margin-top: 24px;
  h1 {
    font-size: 56px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--brand-600);
    line-height: 1;
  }
  p {
    font-size: 14px;
    color: var(--app-text);
    margin: 14px 0 24px;
    letter-spacing: 0.01em;
  }
}
</style>
