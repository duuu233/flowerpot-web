# web-ui-v2（后台管理系统 · Vue3 升级版）

在保留原 Vue2 项目（`xbb/web-ui`，mall-admin 风格）**接口调用与业务实现**的前提下，对前端做的全面技术栈升级。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Vue 3（`<script setup>`） |
| 构建 | Vite 5 |
| UI 组件 | Element Plus |
| 列表组件 | vxe-table 4.5（列表页主力） |
| 状态管理 | Pinia |
| 路由 | Vue Router 4（hash 模式） |
| 网络 | axios |
| 工具 | dayjs、lodash-es、js-cookie、js-md5、nprogress |

## 快速开始

```bash
yarn install      # 安装依赖
yarn dev          # 开发，默认 http://localhost:8090
yarn build        # 生产构建，输出 dist/
yarn preview      # 预览生产构建
```

## 环境变量

见 `.env` / `.env.development` / `.env.production`：

- `VITE_APP_API_ORIGIN`：后端接口域名，例如 `https://api.fce-inno.com`。
- `VITE_APP_API_PREFIX`：后端接口前缀，例如 `/ZoneAdmin`。开发环境 axios 使用此前缀走 Vite 代理；生产环境拼成完整地址。
- `VITE_APP_PROXY_TARGET`：可选，开发代理目标域名；未设置时默认使用 `VITE_APP_API_ORIGIN`。

## 目录结构

```
src/
├─ api/                # 接口模块（与原项目一一对应；配送员/配送点/取货点模块不迁移，未含）
├─ assets/images/      # 图片
├─ components/SvgIcon/ # svg 图标组件
├─ components/Upload/  # 图片/文件上传组件（MultiUpload / FileUpload，基于 ali-oss STS）
├─ directive/          # v-permission 权限指令
├─ icons/svg/          # svg 雪碧图源文件（vite-plugin-svg-icons）
├─ layout/             # 布局外壳：TopNav / Sidebar / TagsView / AppMain
├─ router/             # routes.js（路由表）+ index.js（路由实例）
├─ store/              # Pinia：user / app / tagsView / permission
├─ styles/             # 全局样式
├─ utils/              # request（签名/token/retCode）、auth、validate、date、index 等
├─ views/              # 页面
├─ permission.js       # 路由守卫（登录态 + 菜单拉取）
└─ main.js             # 入口
```

## 接口调用 / 业务实现（与原项目一致）

- **请求层 `utils/request.js`**：完整保留原签名机制（`randomString` + md5 `sign`）、token（cookie `loginToken` 注入为 `userToken`）、响应约定 `{ retCode, retMsg, retData }`（200 为成功），以及 406 被登出处理。遗留的支付接口实例 `utils/requestPay.js` 已于 2026-09-08 删除。
- **权限指令 `v-permission`**：检查 Pinia `user.permissions`（即 `getChildAppCodes` 返回的 `childAppCodes`），cookie `isSysAdmin === '1'` 时放行。用法不变：`v-permission="['xxx']"`。
- **菜单模型（后端驱动）**：登录后由路由守卫调用 `getSysMenus` 得到顶部系统导航（`app.sidebarTop`）；点击顶部导航调用 `getLeftMenus` 得到左侧分组菜单（`app.sidebarRight`），`menuUrl` 即路由 `name`。实际路由表使用本地静态表 `router/routes.js`。

## 已完成 / 待迁移

**已完成：**

- 全部基础设施：请求层、Pinia、路由、权限指令、路由守卫、布局、SvgIcon、上传组件、全局样式
- 17 个 `api/*.js` 接口模块（不含配送员 / 配送点 / 取货点；`dispatchWork` 仅保留运单列表用到的 `getQueryDcName`）
- `sms`：用户列表（+编辑/详情）、产品列表（+新增/编辑/详情）、常见问题（+新增/编辑/详情）、版本管理（+版本详情）、应用市场、消息推送、用户消息
- `ums`：员工列表、角色列表（+绑定权限）、菜单列表（+设置权限）、部门列表
- `oms`：运单列表（+运单详情）
- `log`：全部 21 个日志页面（handle 操作日志 10 个、business 业务日志 7 个、res 接口日志 2 个、error 异常日志 2 个），统一复用 `views/log/components/LogList.vue` 基础组件

**不迁移（按需求约定）：**

- `sms` 配送员 / 配送点 / 取货点 / 调度（`deliveryGuy` / `deliveryDc` / `deliveryShop` / `dispatchWork`）—— 管理页面与接口均不迁移（`deliveryGuy/Dc/Shop` 接口模块已删除）；对应只读日志页 `log/business/*` 仍保留，运单列表仍依赖 `dispatchWork.getQueryDcName`。
- 首页统计图表（订单/销售/分类）—— 当前 `home` 为占位页，未迁移仪表盘。
- 原 mall-admin 体系的 `ums/resource` 资源列表、`role` 分配资源、`area` 绑定区域 —— 新后端已改用「菜单按钮权限」模型，无对应接口，不再迁移。

## 日志页面（LogList 复用模式）

各日志页结构高度一致（搜索关键词 + 时间区间 + vxe-table 列表 + 分页），统一抽到 `views/log/components/LogList.vue`：

```vue
<template>
  <log-list title="用户操作日志" :fetch="getUserLogs" :columns="columns" />
</template>
<script setup name="userLogs">
import LogList from '../components/LogList.vue'
import { getUserLogs } from '@/api/log'
const columns = [
  { prop: 'adminName', label: '操作人' },
  { prop: 'account', label: '操作账号' },
  { prop: 'content', label: '操作内容' },
  { prop: 'joinTime', label: '操作时间' }
]
</script>
```

`LogList` 支持 `title` / `fetch`(列表接口) / `columns` / `searchLabel` / `searchPlaceholder` / `dateLabel`，以及可选 `exportFn`（传入即显示「导出」按钮，如骑手派单日志）。新增日志页只需写一个薄封装（`<script setup name="...">` 的 name 需与路由 name 一致以支持 keep-alive）并在 `router/routes.js` 的 `/log` 下补一条路由。

## 如何新增一个列表页（vxe-table 模式）

1. 在 `src/api/` 写接口（`import request from '@/utils/request'`，照搬原项目 url/method）。
2. 在 `src/views/<module>/<page>/index.vue` 参考 `views/sms/userList/index.vue`：
   - 顶部 `el-card` 搜索区（`el-form` inline）
   - 操作区 `el-card`（按钮配 `v-permission`）
   - `vxe-table` + `vxe-column`（自定义单元格用 `#default="{ row }"`）
   - `el-pagination` 分页，`listQuery`（`pageIndex`/`pageSize`）驱动
   - `<script setup name="路由name">`（name 需与路由 name 一致，供 keep-alive 缓存）
3. 在 `src/router/routes.js` 的 `asyncRouterMap` 补一条路由（`name` 与组件 name 一致）。
```
