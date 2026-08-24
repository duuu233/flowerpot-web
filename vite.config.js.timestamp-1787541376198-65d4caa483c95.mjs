// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "file:///D:/Work/learn/flowerpot-web/node_modules/.pnpm/vite@5.4.21_sass@1.101.3/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Work/learn/flowerpot-web/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.21_vue@3.5.40/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/Work/learn/flowerpot-web/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.21/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import VueSetupExtend from "file:///D:/Work/learn/flowerpot-web/node_modules/.pnpm/unplugin-vue-setup-extend-plus@1.0.1/node_modules/unplugin-vue-setup-extend-plus/dist/vite.js";
import path from "node:path";
var __vite_injected_original_import_meta_url = "file:///D:/Work/learn/flowerpot-web/vite.config.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const apiPrefix = env.VITE_APP_API_PREFIX || "/ZoneAdmin";
  const proxyTarget = env.VITE_APP_PROXY_TARGET || env.VITE_APP_API_ORIGIN;
  return {
    plugins: [
      vue(),
      // 允许在 <script setup> 中通过 name 选项命名组件（keep-alive 缓存依赖 name）
      VueSetupExtend(),
      // svg 雪碧图：与原项目 @/icons 一致，组件中用 <svg-icon icon-class="xxx" />
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        symbolId: "icon-[name]"
      })
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 兼容 dart-sass 新旧 API 警告
          api: "modern-compiler"
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: 8090,
      open: false,
      proxy: proxyTarget ? {
        // 开发环境通过代理转发，规避跨域；axios baseURL = VITE_APP_API_PREFIX
        [apiPrefix]: {
          target: proxyTarget,
          changeOrigin: true
        }
      } : void 0
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // 拆分第三方库，避免单一超大 chunk
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("element-plus") || id.includes("@element-plus")) {
                return "element-plus";
              }
              if (id.includes("vxe-table") || id.includes("xe-utils")) {
                return "vxe-table";
              }
              return "vendor";
            }
          }
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXb3JrXFxcXGxlYXJuXFxcXGZsb3dlcnBvdC13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFdvcmtcXFxcbGVhcm5cXFxcZmxvd2VycG90LXdlYlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovV29yay9sZWFybi9mbG93ZXJwb3Qtd2ViL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcbmltcG9ydCBWdWVTZXR1cEV4dGVuZCBmcm9tICd1bnBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kLXBsdXMvdml0ZSdcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxuICBjb25zdCBhcGlQcmVmaXggPSBlbnYuVklURV9BUFBfQVBJX1BSRUZJWCB8fCAnL1pvbmVBZG1pbidcbiAgY29uc3QgcHJveHlUYXJnZXQgPSBlbnYuVklURV9BUFBfUFJPWFlfVEFSR0VUIHx8IGVudi5WSVRFX0FQUF9BUElfT1JJR0lOXG5cbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICB2dWUoKSxcbiAgICAgIC8vIFx1NTE0MVx1OEJCOFx1NTcyOCA8c2NyaXB0IHNldHVwPiBcdTRFMkRcdTkwMUFcdThGQzcgbmFtZSBcdTkwMDlcdTk4NzlcdTU0N0RcdTU0MERcdTdFQzRcdTRFRjZcdUZGMDhrZWVwLWFsaXZlIFx1N0YxM1x1NUI1OFx1NEY5RFx1OEQ1NiBuYW1lXHVGRjA5XG4gICAgICBWdWVTZXR1cEV4dGVuZCgpLFxuICAgICAgLy8gc3ZnIFx1OTZFQVx1NzhBN1x1NTZGRVx1RkYxQVx1NEUwRVx1NTM5Rlx1OTg3OVx1NzZFRSBAL2ljb25zIFx1NEUwMFx1ODFGNFx1RkYwQ1x1N0VDNFx1NEVGNlx1NEUyRFx1NzUyOCA8c3ZnLWljb24gaWNvbi1jbGFzcz1cInh4eFwiIC8+XG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgIGljb25EaXJzOiBbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvaWNvbnMvc3ZnJyldLFxuICAgICAgICBzeW1ib2xJZDogJ2ljb24tW25hbWVdJ1xuICAgICAgfSlcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICB9XG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIC8vIFx1NTE3Q1x1NUJCOSBkYXJ0LXNhc3MgXHU2NUIwXHU2NUU3IEFQSSBcdThCNjZcdTU0NEFcbiAgICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogJzAuMC4wLjAnLFxuICAgICAgcG9ydDogODA5MCxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgcHJveHk6IHByb3h5VGFyZ2V0XG4gICAgICAgID8ge1xuICAgICAgICAgICAgLy8gXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXHU5MDFBXHU4RkM3XHU0RUUzXHU3NDA2XHU4RjZDXHU1M0QxXHVGRjBDXHU4OUM0XHU5MDdGXHU4REU4XHU1N0RGXHVGRjFCYXhpb3MgYmFzZVVSTCA9IFZJVEVfQVBQX0FQSV9QUkVGSVhcbiAgICAgICAgICAgIFthcGlQcmVmaXhdOiB7XG4gICAgICAgICAgICAgIHRhcmdldDogcHJveHlUYXJnZXQsXG4gICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNTAwLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAvLyBcdTYyQzZcdTUyMDZcdTdCMkNcdTRFMDlcdTY1QjlcdTVFOTNcdUZGMENcdTkwN0ZcdTUxNERcdTUzNTVcdTRFMDBcdThEODVcdTU5MjcgY2h1bmtcbiAgICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdlbGVtZW50LXBsdXMnKSB8fCBpZC5pbmNsdWRlcygnQGVsZW1lbnQtcGx1cycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdlbGVtZW50LXBsdXMnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd2eGUtdGFibGUnKSB8fCBpZC5pbmNsdWRlcygneGUtdXRpbHMnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAndnhlLXRhYmxlJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiAndmVuZG9yJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlEsU0FBUyxlQUFlLFdBQVc7QUFDOVMsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sVUFBVTtBQUxvSixJQUFNLDJDQUEyQztBQVF0TixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDO0FBQ3ZDLFFBQU0sWUFBWSxJQUFJLHVCQUF1QjtBQUM3QyxRQUFNLGNBQWMsSUFBSSx5QkFBeUIsSUFBSTtBQUVyRCxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUE7QUFBQSxNQUVKLGVBQWU7QUFBQTtBQUFBLE1BRWYscUJBQXFCO0FBQUEsUUFDbkIsVUFBVSxDQUFDLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxlQUFlLENBQUM7QUFBQSxRQUN2RCxVQUFVO0FBQUEsTUFDWixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUN0RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQTtBQUFBLFVBRUosS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTyxjQUNIO0FBQUE7QUFBQSxRQUVFLENBQUMsU0FBUyxHQUFHO0FBQUEsVUFDWCxRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGLElBQ0E7QUFBQSxJQUNOO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsTUFDWCx1QkFBdUI7QUFBQSxNQUN2QixlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUE7QUFBQSxVQUVOLGFBQWEsSUFBSTtBQUNmLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0Isa0JBQUksR0FBRyxTQUFTLGNBQWMsS0FBSyxHQUFHLFNBQVMsZUFBZSxHQUFHO0FBQy9ELHVCQUFPO0FBQUEsY0FDVDtBQUNBLGtCQUFJLEdBQUcsU0FBUyxXQUFXLEtBQUssR0FBRyxTQUFTLFVBQVUsR0FBRztBQUN2RCx1QkFBTztBQUFBLGNBQ1Q7QUFDQSxxQkFBTztBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
