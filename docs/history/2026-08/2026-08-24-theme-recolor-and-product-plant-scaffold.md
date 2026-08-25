# 主题配色改为 LOGO 青绿，并接入植物管理封装层与菜单节点

> 文档类型：Historical Change Record
> 日期：2026-08-24
> 环境：Linux / SSH（`/pgdata/pg/dh/flowerpot-web`）
> 分支与起始版本：main / c4fa07b
> 范围：全局样式令牌、`src/api`、`src/router`、`src/views/sms`、菜单同步脚本与相关文档
> 当前权威文档：`AI_CONTEXT.md`、`docs/api-integration-progress.md`、`docs/dynamic-menu-sync.md`

## 背景与目标

1. 按《智能花盆接口url功能列表清单.xlsx》对接后端已完成的管理端功能。清单中标注 2026.8.24
   的管理端新增项只有「运营管理 → 植物管理」一组共 5 个接口。
2. 原主题品牌色取自 BoltStar 橙色 LOGO（`public/logoV2.png`），与产品实际使用的 YSplanter
   青绿 LOGO（`src/assets/images/logo.png`，同时是 favicon 与顶栏图标）不一致，需要改为简约的
   青绿体系。

## 变更内容

主题配色：

- `src/styles/variables.scss`、`src/styles/index.scss`：品牌色阶由 24° 橙改为 186° 青绿。
  LOGO 深端 `#48999f` 只用于细指示条；界面主色 `#2a757c`，hover/链接 `#1f6a71`。
- 中性色由暖灰改为带绿灰的冷中性；顶栏底色 `#262220` → `#0f2a2e`；画布 `#f5f4f2` → `#f4f6f6`。
- 语义色随之调整：success 推到 145° 叶绿 `#35774a`，与品牌青绿拉开色相；warning/danger/info
  重新压深到白底 ≥ 4.6:1。Element Plus 的 `light-3/5/7/8/9` 与 `dark-2` 全部按新主色重算。
- 「简约」方向的形态收敛：卡片阴影由 `0 10px 26px` 收到 `0 1px 2px`，主圆角 12 → 10，
  控件圆角 8 → 6，弹窗圆角 16 → 12，侧栏去掉右上圆角、投影改为 1px 分隔线。
- 清理散落的暖色硬编码：`src/layout/index.vue` 的橙色径向渐变、`src/styles/mixin.scss` 与
  `src/layout/components/Sidebar.vue` 的滚动条、`src/views/home/index.vue` 的进度条底色、
  以及 login / home / TopNav 的暖色阴影 rgba。

植物管理（只做封装层与路由，页面暂缓）：

- 新增 `src/api/productPlant.js`，封装 5 个接口，路径省略 `/ZoneAdmin`。
- 新增本地路由 `productPlant` 与占位页 `src/views/sms/productPlant/index.vue`，
  组件 `name` 与路由 `name` 一致。
- `scripts/sync-admin-menu.mjs` 新增 `productPlantMenuTree` 与 `product-plant` scope；
  `package.json` 新增 `menu:sync:product-plant`。
- 顺带修正脚本里迁移后遗留的 `DEFAULT_API_BASE`（`api.boltfox.cn` → `api.yikaltd.com`），
  与 `.env` 的 `VITE_APP_API_ORIGIN` 对齐。

跨平台缺陷修复（阻塞构建，非本次需求范围）：

- `src/views/sms/productVersion/detail.vue` 引用 `Upload/FileUpload.vue`、
  `src/views/sms/productList/template/DetailForm.vue` 引用 `Upload/MultiUpload.vue`，
  磁盘上实际是 `fileUpload.vue` 与 `multiUpload.vue`。Windows 不区分大小写所以能构建，
  Linux 直接 `ENOENT`。改为与磁盘一致的小写开头，未重命名文件。

## 关键决策

- 主色没有直接用 LOGO 的 `#48999f`：白字对比度只有 3.32:1，大面积铺开不达 WCAG AA。
  压深到同色相的 `#2a757c` 后白字 5.34:1，LOGO 原色只保留在顶栏选中指示条等 1-2px 位置。
- 植物管理只做封装层和路由：本机取不到 Swagger，入参与返回字段无法核对，写列表和表单等于
  凭猜测生成代码。该决策由本次任务中明确选择。
- 菜单分组「运营管理」按功能清单的层级命名，并带 `aliases`，避免后端已有同名分组时重复创建；
  同步脚本默认只读预览，本次没有对后端执行任何写操作。
- 大小写导入问题选择改 import 而不是重命名文件：重命名在大小写不敏感的文件系统上容易产生
  半吊子的 Git 重命名记录，改 import 影响面更小。

## 外部操作

无。菜单同步脚本未对后端执行；没有调用任何写接口。

## 验证结果

- `npm install --no-save --no-package-lock`：安装成功，未改动 `yarn.lock` / `pnpm-lock.yaml`，
  也没有生成 `package-lock.json`。
- `npm run build`：通过（首次失败于上述大小写问题，修复后通过）。
- `sass src/styles/index.scss`：独立编译通过。
- `node --check`：`scripts/sync-admin-menu.mjs` 通过；`src/api/productPlant.js`、
  `src/router/routes.js` 以 ESM 副本检查通过。
- `node scripts/sync-admin-menu.mjs --scope=product-plant --help` 正常输出；不带 token 运行时
  按预期报「请通过 BOLTFOX_USER_TOKEN 环境变量提供管理员 userToken」，说明 scope 注册生效。
- 构建产物中已无 `#f26910` / `#b25a1e` / `rgba(242,105,16,…)` 等旧品牌色，新令牌已落地。
- 未做浏览器实机验证：本机访问不到管理端接口，登录后的页面无法加载数据。

## 未完成项与风险

- 植物管理页面（列表、详情、新增、编辑、启用/禁用）未实现，等待 Swagger 字段契约。
- 菜单节点未同步到后端。执行 `npm run menu:sync:product-plant` 只读预览确认分组归属后，
  再决定是否 `--apply`；非系统管理员还需在角色管理中绑定权限并重新登录。
- `AI_CONTEXT.md` 第 110、178 行附近存在两处已提交的 Git 冲突标记（`<<<<<<< HEAD` /
  `=======` / `>>>>>>> e1edab3`），本次未合并，需要作者确认保留哪一侧。
- `docs/api-integration-progress.md` 中 77 个端点的统计仍是 2026-08-03 快照，未按最新 Swagger 重数。
- 主题只做了静态核验，没有在真实登录态下逐页看过，表格、弹窗、上传等组件的观感需要人工确认。

## 回滚或恢复

主题与植物管理封装层是各自独立的改动，可分别回滚：

- 主题：还原 `src/styles/*`、`src/layout/index.vue`、`src/layout/components/{TopNav,Sidebar}.vue`、
  `src/views/{login,home}/index.vue`、`src/views/commerce/order/components/OrderDetailPanel.vue`。
- 植物管理：删除 `src/api/productPlant.js`、`src/views/sms/productPlant/`，还原 `src/router/routes.js`、
  `scripts/sync-admin-menu.mjs`、`package.json`。后端菜单未写入，无需在后台回滚。
