# AI 项目上下文

> 文档类型：当前项目上下文
> 状态：Active
> 最后核验：2026-09-10
> 适用范围：`flowerpot-web` 当前工作树
> 事实来源：源码与 CodeGraph、`package.json`、路由、请求层和 `docs/` 当前内容

## 1. 项目定位

`flowerpot-web` 是 YSplanter/花盆产品体系的 PC 管理后台前端，负责用户、产品与 FAQ、植物管理、APP 版本与应用市场，以及员工、角色、菜单和部门。2026-09-08 按产品要求下线了用户设备（用户产品列表）、用户产品图片、产品版本和系统配置四个模块（页面、路由与只服务于它们的接口封装一并删除；后端接口与已存在的菜单行不受影响，需要时在后台手工清理菜单）。2026-09-10 用户列表又去掉了总计 / 可用 / 消耗星币三列和行级「账户日志」按钮，只服务于可用星币编辑的 `UserAccountEditor.vue` 与 `setUserAccount` 封装一并删除——账户操作日志页 `userAccountLogs` 与工具栏那个全量入口保留，`getUserList` 响应里的三个星币字段和 `Post_User_SetUserAccount` 权限节点也都没动。仓库由旧管理后台迁移而来，`package.json` 名称和 README 仍有 `web-ui-v2` 复制痕迹；项目定位以当前路由、API 和本文件为准。

本仓库只包含管理后台前端。Flutter 用户端位于兄弟项目 `flowerpot`，服务端和数据库不在本仓库。

Git 是办公室电脑、家庭电脑和远程 SSH 环境之间唯一共享的事实来源。本机依赖、构建产物、`.codegraph/` 和未提交工作区不属于跨机器共享状态。

## 2. 技术栈与命令

- Vue 3.5，页面主要使用 `<script setup>`。
- Vite 5，Vue Router 4 Hash 模式，Pinia。
- Element Plus、vxe-table、SCSS、WangEditor。
- ECharts 6（2026-09-09 起，仅首页注册趋势柱状图在用；按需引入 `echarts/core` + `BarChart`，构建里单独拆成 `echarts` chunk）。
- Axios 请求层，Cookie 登录态，MD5 请求签名。
- Node.js `>=18`。

```bash
npm run dev
npm run build
npm run preview
```

项目没有 test、lint 或 type-check 脚本。仓库同时存在 `pnpm-lock.yaml`、`pnpm-workspace.yaml` 和 `yarn.lock`，README 仍推荐 yarn；主包管理器尚未由仓库规则确认。不要为了文档任务安装依赖或重写锁文件。

2026-09-09 新增 `echarts` 时用的是 `npm install echarts --save --no-package-lock`：只写 `package.json`，两个既有锁文件都没动，也没有新增 `package-lock.json`。**其他环境拉到这次改动后必须重新安装依赖**（锁文件里没有 echarts），锁文件的统一留到主包管理器确认之后再处理。

## 3. 环境与接口约定

- 当前管理后台 Swagger：`https://api.yikaltd.com/swagger-ui.html#/`。
- 机器可读契约：`https://api.yikaltd.com/v2/api-docs`。
- 2026-09-08 起接口地址改回域名 `https://api.yikaltd.com`：2026-08-25 因原域名在当时的机器上被阿里云
  ICP 备案页拦截而临时改用 IP `http://120.25.227.36:8601`，本次在 SSH 开发机上实测域名 `/v2/api-docs`
  返回 200 且与 IP 是同一份契约（仅 `host` 字段不同），故切回域名。地址只写在根目录 `.env` 的
  `VITE_APP_API_ORIGIN`；若某台机器又被备案页拦住，本机改这一个变量回退到 IP 即可。
- 只接入 Swagger tag 以 `管理后台-` 开头的接口。
- `VITE_APP_API_PREFIX` 通常为 `/ZoneAdmin`；API 模块默认不重复写该前缀。
- `VITE_APP_API_ORIGIN` 是生产接口源站，`VITE_APP_PROXY_TARGET` 是开发代理目标。
- 2026-09-08 起没有分环境覆盖项：遗留支付 / 上传服务（`VITE_APP_BASE_PAY`、`VITE_APP_BASE_UPLOAD`、
  `VITE_APP_BASE_BIGUPLOAD`，指向 `39.108.153.239`）连同 `src/utils/requestPay.js` 与两个无人调用的支付
  查询封装一并删除，`.env.development` / `.env.production` 只剩说明性注释。

不得把实际 Token、签名、密码、Cookie、接口密钥或完整环境文件复制到文档、源码、历史记录或提交信息。

## 4. 架构与数据流

```text
src/main.js
  → 注册 Pinia / Router / Element Plus / VXETable / v-permission
  → src/permission.js 检查 loginToken
  → 登录后拉取顶部菜单和按钮权限
  → 后端菜单控制导航可见性
  → src/router/routes.js 的本地静态路由加载页面
  → v-permission 根据 childAppCodes 控制按钮
```

请求链：

```text
src/views 与 src/components
  → src/api/*.js
  → src/utils/request.js
  → VITE_APP_API_ORIGIN + VITE_APP_API_PREFIX
  → 管理后台接口
```

`src/utils/request.js` 自动添加 `randomString`、MD5 `sign` 和 `userToken`；Token 来自 Cookie `loginToken`。响应约定为 `{ retCode, retMsg, retData }`，`retCode === 406` 会触发重新登录。

后端菜单与本地路由是双层模型：后端决定可见性和授权，本地路由决定组件映射。后端 `menuUrl`、Vue Router `name` 和页面组件 `name` 必须一致，才能保证跳转、标签页和 keep-alive 正常。

侧栏（`src/layout/components/Sidebar.vue`）渲染前会用 `router.hasRoute(menuUrl)` 过滤接口返回的菜单：本地没有同名路由的节点直接跳过，开发环境 `console.warn` 一次。模块下线后后台常残留菜单行，不过滤会让 `RouterLink` 在渲染期抛 `No match for {"name":"..."}`，整块左侧菜单都渲染不出来。

## 5. 关键目录

| 路径 | 职责 |
| --- | --- |
| `src/api/` | 按业务域封装管理后台接口。 |
| `src/views/` | home、sms、ums 等路由页面。 |
| `src/components/` | 搜索、工具栏、分页、上传、富文本等公共 UI。 |
| `src/composables/` | `usePagedList`、`useListRefresh` 等列表逻辑。 |
| `src/router/routes.js` | 当前本地静态路由与组件映射。 |
| `src/store/modules/` | 用户、布局菜单、权限路由与标签页状态。 |
| `src/directive/permission.js` | 按 `childAppCodes` 控制按钮权限。 |
| `src/utils/request.js` | 主请求实例、签名、登录态和统一响应。 |
| `docs/` | 当前结构、接口跟踪、短期交接与冻结历史记录。 |

## 6. 当前有效业务模块

- `home`：后台首页。
- `sms`：用户、产品、FAQ、植物管理、APP 版本和应用市场；
  `productPlant` 已完成分页列表、新增、编辑、详情、图片上传、启用/禁用、路由和后端菜单。
- `ums`：员工、角色、菜单权限和部门。

2026-08-25 已按 Excel 清单对系统 `1` 同步完整菜单：运营管理下为植物管理、APP版本管理和
基础信息配置，系统管理下为管理员权限。`scripts/sync-admin-menu.mjs` 的 `checklist` scope 可在
其他环境幂等预览/写入，并能迁移旧 `Content` 前缀 APP 版本权限；普通角色仍需绑定权限后重新登录。

`userProductImage` 的本地包装、页面和路由仍在仓库中，但 2026-08-25 的当前 Swagger 已无
`/ZoneAdmin/UserProductImg/*`；它属于待清理遗留实现，不再视为已确认受支持模块，也不应新增菜单。

消息、运单、日志、支付、货运和商品等复制项目遗留源码不在当前 yikaltd 管理后台 Swagger 范围内；是否删除必须以当前路由、依赖分析和接口契约为依据，不能仅凭目录存在恢复入口。

当前接口进度以工作树中的 [`docs/api-integration-progress.md`](docs/api-integration-progress.md) 为 Tracking 入口；其中的核验时间和构建结论需要按最新环境重新验证。`docs/interface-list.md` 混有旧 BoltFox 与当前 Yikaltd 来源，未完成整理前不能单独作为当前接口权威清单。

## 7. 重要设计约束

1. API 包装层默认只写业务路径，公共 `/ZoneAdmin` 前缀由环境与请求层处理。
2. `menuUrl`、路由 `name`、组件 `name` 和按钮权限码属于跨前后端契约，修改时联动核对。
3. 普通分页列表优先复用 `SearchPanel`、`ListToolbar`、`PaginationBar`、`usePagedList` 和 `useListRefresh`。
4. 只集成当前 yikaltd Swagger 的 `管理后台-` 接口；旧 boltfox 记录仅供迁移追溯。
5. 修改请求层、登录 Store、权限指令或路由前必须用 CodeGraph 查看调用者和影响范围。
6. CodeGraph 描述当前源码结构；Markdown 负责外部契约、人工流程、迁移决策和历史。
7. 主题配色集中在 `src/styles/variables.scss` 与 `src/styles/index.scss` 的 `:root` 令牌；
   页面和组件只引用 `--brand-*`、`--app-*`、`--el-*` 变量，不写死品牌色。
8. 跨平台大小写：本仓库在 Windows 与 Linux 之间同步，import 路径必须与磁盘文件名大小写完全一致。

## 8. 开发与维护流程

开始任务时按以下顺序读取：

1. `AGENTS.md`
2. 本文件
3. `docs/README.md`
4. 与任务相关且已标明来源的 Active/Tracking 文档
5. CodeGraph 中的源码符号、调用链和影响范围
6. 仅在追查原因时读取相关 Historical 或临时交接记录

执行约定：

1. 先运行 `git status --short`，识别并保护已有用户改动。
2. `.codegraph/` 存在时，结构分析先运行 `codegraph status .` 和 `codegraph explore "问题或符号"`。
3. 拉取后运行 `codegraph sync .`；有意义的源码修改完成后再次同步并检查状态。
4. JavaScript 变更运行相关 `node --check`，页面和路由变更运行 `npm run build`；无法执行时如实记录原因。
5. 行为、接口、架构、命令、权限或部署方式变化时，更新对应 Active/Tracking 文档。
6. 一次集中修改建立一份 `docs/history/YYYY-MM/YYYY-MM-DD-主题.md`，只记录实际验证，不把流水账追加到 AI_CONTEXT。

## 9. 已知风险与待确认项

- 项目暂无自动化测试、lint 和类型检查脚本，回归主要依赖构建与人工验证。
- 后台菜单与本地路由可能独立演进；新增页面后需要重新绑定角色权限并重新登录验证。
- 旧「APP管理」节点因 APP 版本迁移而为空，系统 `1` 已将其设为非导航但没有删除；其他环境由 `checklist --apply --update` 在确认空节点后处理。
- 请求签名和统一错误处理集中在请求层，修改的影响面很大。
- 当前 Swagger 已移除 `UserProductImg`，但仓库仍保留其包装、页面和路由；清理前不能把文件存在误判为后端支持。
- 仓库还保留商品、订单、图库、AI、消息、日志、运单和支付等不在当前 Swagger 的遗留包装或页面。
- `docs/interface-list.md` 混合不同来源，当前契约以最新 Swagger、真实只读响应和源码为准。
- README、包名和短期交接仍有复制项目或陈旧环境口径。
- 仓库同时保留 `yarn.lock` 与 `pnpm-lock.yaml`；主包管理器尚未确认，不应擅自重写锁文件。
- 支付请求使用独立请求地址，修改通用接口环境变量时不能默认覆盖支付链路。

## 10. 文档地图

- [`docs/README.md`](docs/README.md)：文档导航、可信边界和维护规则。
- [`docs/project-structure.md`](docs/project-structure.md)：当前 Vue/Vite 目录与公共列表约定。
- [`docs/api-integration-progress.md`](docs/api-integration-progress.md)：接口迁移与核验进度。
- [`docs/dynamic-menu-sync.md`](docs/dynamic-menu-sync.md)：动态菜单同步、验证和回滚。
- [`docs/interface-list.md`](docs/interface-list.md)：混合来源接口清单，待拆分历史与当前事实。
- [`docs/next-session.md`](docs/next-session.md)：可替换的短期交接，不是长期日志。
- [`docs/history/README.md`](docs/history/README.md)：本地操作更新记录规范与模板。

## 11. 兄弟项目边界与同步触发

| 项目 | 主要职责 | 需要同步的变化 |
| --- | --- | --- |
| `flowerpot-web` | 花盆产品 PC 管理后台 | 管理端 API、产品/版本/用户设备字段、菜单与权限契约。 |
| `flowerpot` | YSplanter Flutter 用户端 | 用户态接口模型、设备状态、DP、配网、OTA 和协议口径。 |
| `web-ui-v2` | BoltFox PC 管理后台 | 仅在复用的管理端组件、流程或接口契约确实共享时同步。 |

共享契约变化时，在两个受影响仓库各自建立历史记录，注明上游来源、已同步内容、有意差异和未完成项。不要把 Flutter 构建、涂鸦 SDK 或移动签名规则复制到本项目。

## 12. AI 工作备注

- 当前源码和 CodeGraph 优先于复制项目 README、旧域名接口清单或临时会话说明。
- 不读取、输出或记录 `.env` 中的实际秘密；只引用变量名。
- 不覆盖已有未提交改动，不恢复当前工作树已经删除的遗留文件；每次开始任务重新检查状态。
- 不根据文件名或旧路由猜测后端支持范围，先核对 CodeGraph、最新 Swagger 与 Active 文档。
- 不把本机绝对路径、依赖缓存或某台机器的安装状态写成跨环境事实。
- Historical 和 `next-session.md` 只用于追溯；与源码或 Active 事实冲突时先核验再修正文档。
