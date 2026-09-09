import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const apiPrefix = env.VITE_APP_API_PREFIX || '/ZoneAdmin'
  const proxyTarget = env.VITE_APP_PROXY_TARGET || env.VITE_APP_API_ORIGIN

  return {
    plugins: [
      vue(),
      // 允许在 <script setup> 中通过 name 选项命名组件（keep-alive 缓存依赖 name）
      VueSetupExtend(),
      // svg 雪碧图：与原项目 @/icons 一致，组件中用 <svg-icon icon-class="xxx" />
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[name]'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 兼容 dart-sass 新旧 API 警告
          api: 'modern-compiler'
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8090,
      open: false,
      proxy: proxyTarget
        ? {
            // 开发环境通过代理转发，规避跨域；axios baseURL = VITE_APP_API_PREFIX
            [apiPrefix]: {
              target: proxyTarget,
              changeOrigin: true
            }
          }
        : undefined
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // 拆分第三方库，避免单一超大 chunk
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('element-plus') || id.includes('@element-plus')) {
                return 'element-plus'
              }
              if (id.includes('vxe-table') || id.includes('xe-utils')) {
                return 'vxe-table'
              }
              // 图表只有首页用，单独拆包，避免拖慢其他页面的首屏
              if (id.includes('echarts') || id.includes('zrender')) {
                return 'echarts'
              }
              return 'vendor'
            }
          }
        }
      }
    }
  }
})
