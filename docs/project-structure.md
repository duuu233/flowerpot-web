# 项目目录结构

> 文档类型：当前架构说明
> 状态：Active
> 最后核验：2026-08-13
> 事实来源：当前目录、源码、路由配置与 CodeGraph

本项目是 Vue 3 + Vite 后台管理系统。结构约定是：框架配置放在项目根目录，可复用 UI 放在 `src/components`，可复用组合式逻辑放在 `src/composables`，业务页面按模块放在 `src/views`。

## 根目录

```text
.
├─ .env                    # Vite 公共环境变量，包含接口域名和接口前缀
├─ .env.development        # 开发环境专属变量
├─ .env.production         # 生产环境专属变量
├─ vite.config.js          # Vite 插件、别名、开发代理、构建配置
├─ package.json            # scripts 和依赖
├─ README.md               # 项目说明
├─ scripts/
│  └─ sync-admin-menu.mjs    # 按 scope 幂等同步商品或用户账户后台菜单
└─ docs/
   ├─ project-structure.md # 目录结构说明
   └─ dynamic-menu-sync.md # 后端菜单自动生成与复用指南
```

接口地址规则：

- `VITE_APP_API_ORIGIN` 和 `VITE_APP_API_PREFIX` 放在根目录 `.env`。
- 开发环境 axios 使用 `VITE_APP_API_PREFIX`，再由 Vite 代理到 `VITE_APP_API_ORIGIN`。
- 生产环境 axios 会拼接 `VITE_APP_API_ORIGIN + VITE_APP_API_PREFIX`。
- `VITE_APP_PROXY_TARGET` 是可选项；只有开发代理目标和 `VITE_APP_API_ORIGIN` 不一致时才需要配置。

## src 目录

```text
src/
├─ api/              # 接口模块，按后端业务域分组
├─ assets/           # 图片等静态资源
├─ components/       # 可复用 UI 组件
├─ composables/      # 可复用 Composition API 逻辑
├─ directive/        # 自定义指令
├─ icons/            # 本地 svg 图标
├─ layout/           # 全局布局、侧栏、顶部导航、标签页
├─ router/           # 路由表和路由实例
├─ store/            # Pinia 状态模块
├─ styles/           # 全局样式和主题覆盖
├─ utils/            # request、auth、date、validate 等工具
└─ views/            # 路由页面，按业务模块分组
```

## 公共组件

```text
src/components/
├─ ListToolbar/      # 列表标题和右侧操作按钮
├─ PageSection/      # 带标题和图标的页面卡片区块
├─ PaginationBar/    # Element Plus 分页统一封装
├─ SearchPanel/      # 搜索表单容器，内置查询/重置按钮
├─ SvgIcon/          # 本地 svg 图标组件
└─ Upload/
   ├─ FileUpload.vue
   └─ MultiUpload.vue
```

新列表页优先使用 `SearchPanel`、`ListToolbar`、`PaginationBar`，避免重复写筛选卡片、操作栏和分页条。

## 组合式逻辑

```text
src/composables/
└─ usePagedList.js   # 分页查询、loading、搜索、重置、分页切换逻辑
```

普通服务端分页列表可使用 `usePagedList`。它适用于当前项目的 `pageIndex` / `pageSize` / `retData.pageData` / `retData.recordCount` 响应约定。页面有额外筛选条件时，先同步到 `listQuery`，再调用 `handleSearchList`。

## 页面模块

```text
src/views/
├─ home/             # 首页
├─ commerce/         # 商品、公共图库、图库分类、订单与 AI 配置
├─ login/            # 登录页
├─ log/              # 操作、接口、异常、业务日志
├─ oms/              # 订单 / 运单
├─ redirect/         # 路由重定向
├─ sms/              # 运营 / 内容
└─ ums/              # 权限 / 系统管理
```

用户列表相关页面位于 `src/views/sms/userList/`：列表页复用公共查询、工具栏和分页组件；`components/UserAccountEditor.vue` 负责可用星币编辑交互；`accountLogs.vue` 是账户操作日志的隐藏路由页面。

命名约定：

- 可复用 Vue 组件使用 PascalCase，例如 `FileUpload.vue`、`DetailForm.vue`。
- 路由页面文件使用描述清晰的 camelCase，例如 `productBasic.vue`、`shopData.vue`、`noPermission.vue`。
- 路由 `name` 保持稳定，因为 keep-alive 和后端菜单数据依赖这些值。
- add/edit/detail 共用的本地表单组件放在对应模块的 `template/DetailForm.vue`。

## 当前列表页复用模式

新增或迁移列表页建议使用以下结构：

```vue
<SearchPanel :model="listQuery" @search="handleSearchList" @reset="handleResetSearch">
  <!-- 页面自己的筛选项 -->
</SearchPanel>

<ListToolbar title="列表标题">
  <!-- 可选操作按钮 -->
</ListToolbar>

<div class="table-container">
  <!-- vxe-table -->
</div>

<PaginationBar
  v-model:current-page="listQuery.pageIndex"
  v-model:page-size="listQuery.pageSize"
  :total="total"
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
/>
```

已迁移列表页：

- `src/views/log/components/LogList.vue`
- `src/views/oms/waybill/index.vue`
- `src/views/sms/appVersion/index.vue`
- `src/views/sms/applicationStore/index.vue`
- `src/views/sms/messagePush/index.vue`
- `src/views/sms/messageUser/index.vue`
- `src/views/sms/productFaqList/index.vue`
- `src/views/sms/productList/index.vue`
- `src/views/sms/userList/index.vue`
- `src/views/ums/admin/index.vue`
- `src/views/ums/menuList/index.vue`
- `src/views/ums/role/index.vue`
