# AI 项目上下文

> 文档类型：当前项目上下文
> 状态：Active
> 最后核验：2026-08-12
> 适用范围：`flowerpot-web` 当前工作树
> 事实来源：源码与 CodeGraph、`package.json`、路由、请求层和 `docs/` 当前内容

## 1. 项目定位

`flowerpot-web` 是 YSplanter/花盆产品体系的 PC 管理后台前端，负责用户与用户设备、产品与 FAQ、产品版本、用户产品图片、APP 版本与应用市场，以及员工、角色、菜单、部门和系统配置。仓库由旧管理后台迁移而来，`package.json` 名称和 README 仍有 `web-ui-v2` 复制痕迹；项目定位以当前路由、API 和本文件为准。

本仓库只包含管理后台前端。Flutter 用户端位于兄弟项目 `flowerpot`，服务端和数据库不在本仓库。

Git 是办公室电脑、家庭电脑和远程 SSH 环境之间唯一共享的事实来源。本机依赖、构建产物、`.codegraph/` 和未提交工作区不属于跨机器共享状态。

## 2. 技术栈与命令

- Vue 3.5，页面主要使用 `<script setup>`。
- Vite 5，Vue Router 4 Hash 模式，Pinia。
- Element Plus、vxe-table、SCSS、WangEditor。
- Axios 请求层，Cookie 登录态，MD5 请求签名。
- Node.js `>=18`。

```bash
npm run dev
npm run build
npm run preview
```

项目没有 test、lint 或 type-check 脚本。仓库同时存在 `pnpm-lock.yaml`、`pnpm-workspace.yaml` 和 `yarn.lock`，README 仍推荐 yarn；主包管理器尚未由仓库规则确认。不要为了文档任务安装依赖或重写锁文件。

## 3. 环境与接口约定

- 当前管理后台 Swagger：`https://api.yikaltd.com/swagger-ui.html#/`。
- 机器可读契约：`https://api.yikaltd.com/v2/api-docs`。
- 只接入 Swagger tag 以 `管理后台-` 开头的接口。
- `VITE_APP_API_PREFIX` 通常为 `/ZoneAdmin`；API 模块默认不重复写该前缀。
- `VITE_APP_API_ORIGIN` 是生产接口源站，`VITE_APP_PROXY_TARGET` 是开发代理目标。
- `VITE_APP_BASE_PAY` 供遗留支付请求实例使用；是否继续保留需结合当前接口范围确认。

`.env` 当前有本地未提交改动。不得把实际 Token、签名、密码、Cookie、接口密钥或完整环境文件复制到文档、源码、历史记录或提交信息。

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
- `sms`：用户、用户产品、产品、用户产品图片、产品版本、FAQ、APP 版本和应用市场。
- `ums`：员工、角色、菜单权限、部门和系统配置。

消息、运单、日志、支付、货运和商品等复制项目遗留源码不在当前 yikaltd 管理后台 Swagger 范围内；是否删除必须以当前路由、依赖分析和接口契约为依据，不能仅凭目录存在恢复入口。

当前接口进度以工作树中的 [`docs/api-integration-progress.md`](docs/api-integration-progress.md) 为 Tracking 入口；其中的核验时间和构建结论需要按最新环境重新验证。`docs/interface-list.md` 混有旧 BoltFox 与当前 Yikaltd 来源，未完成整理前不能单独作为当前接口权威清单。

## 7. 重要设计约束

1. API 包装层默认只写业务路径，公共 `/ZoneAdmin` 前缀由环境与请求层处理。
2. `menuUrl`、路由 `name`、组件 `name` 和按钮权限码属于跨前后端契约，修改时联动核对。
3. 普通分页列表优先复用 `SearchPanel`、`ListToolbar`、`PaginationBar`、`usePagedList` 和 `useListRefresh`。
4. 只集成当前 yikaltd Swagger 的 `管理后台-` 接口；旧 boltfox 记录仅供迁移追溯。
5. 修改请求层、登录 Store、权限指令或路由前必须用 CodeGraph 查看调用者和影响范围。
6. CodeGraph 描述当前源码结构；Markdown 负责外部契约、人工流程、迁移决策和历史。

## 8. 开发与维护流程

开始任务时按以下顺序读取：

1. `AGENTS.md`
2. 本文件
3. `docs/README.md`
4. 与任务相关且已标明来源的 Active/Tracking 文档
5. CodeGraph 中的源码符号、调用链和影响范围
6. 仅在追查原因时读取 Historical 或临时交接记录

执行约定：

1. 先运行 `git status --short`。当前仓库存在业务代码、接口文档、环境文件和删除项的未提交改动，禁止覆盖或恢复。
2. `.codegraph/` 存在时，结构分析先运行 `codegraph status .` 和 `codegraph explore 问题或符号`。
3. 拉取后运行 `codegraph sync .`；有意义的源码修改完成后再次同步并检查状态。
4. JavaScript 变更运行相关 `node --check`，页面和路由变更运行 `npm run build`；无法执行时如实记录原因。
5. 架构、接口、命令、权限或模块范围变化时更新负责该事实的 Active/Tracking 文档。
6. 一次集中修改建立一份 `docs/history/YYYY-MM/YYYY-MM-DD-主题.md`，不在 AI_CONTEXT 或 `next-session.md` 无限追加。

## 9. 已知风险与待确认项

- 当前工作区有大量未提交修改，包括 `.env`、路由、用户产品图片、删除的 API 文件和接口文档；这些属于在途工作。
- README 和包名仍是复制项目口径，并列出了当前路由已移除的遗留模块。
- `api-integration-progress.md`、`interface-list.md` 混合不同时间和域名的事实；当前接口需以 yikaltd Swagger 与源码再次核验。
- `next-session.md` 是 2026-08-03 的临时交接，其中“没有 node_modules”等本机状态已经陈旧。
- CodeGraph 仍能看到被取消路由的遗留源码；在依赖清理完成前，索引存在不等于模块仍受支持。
- 项目没有自动化测试、lint 或类型检查脚本。
- 多套锁文件并存且主包管理器未定，安装依赖可能产生大范围无关差异。

## 10. 文档地图

- [`docs/README.md`](docs/README.md)：文档导航、可信边界和维护规则。
- [`docs/project-structure.md`](docs/project-structure.md)：当前 Vue/Vite 目录与公共列表约定。
- [`docs/api-integration-progress.md`](docs/api-integration-progress.md)：接口迁移进度，使用前核对日期和当前工作树。
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
- 不覆盖已有未提交改动，不恢复当前工作树已经删除的遗留文件。
- Historical 和 `next-session.md` 只用于追溯；与源码或 Active 事实冲突时先核验再修正文档。
