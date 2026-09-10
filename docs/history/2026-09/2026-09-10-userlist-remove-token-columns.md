# 用户列表下线星币三列与行级账户日志按钮

> 文档类型：Historical Change Record
> 日期：2026-09-10
> 环境：SSH（无 CodeGraph 索引）
> 分支与起始版本：main / e7b051e
> 范围：`src/views/sms/userList/`、`src/api/userList.js`、`docs/`
> 当前权威文档：`docs/project-structure.md`、`docs/interface-list.md`、`docs/dynamic-menu-sync.md`、`AI_CONTEXT.md`

## 背景与目标

产品要求用户列表去掉「总计星币」「可用星币」「消耗星币」三列和「账户日志」按钮。这批能力是 2026-08-13 随首页统计一起加的（见 `docs/history/2026-08/2026-08-13-user-account-statistics.md`）。

## 变更内容

`src/views/sms/userList/index.vue`：

- 删除 `totalToken`（总计星币）、`consumeToken`（消耗星币）两列，以及承载 `UserAccountEditor` 的「可用星币」列。
- 删除行操作里的「账户日志」按钮（`v-permission="['Get_User_GetOperatUserAccountLog']"`），操作列宽由 250 收到 170——只剩「编辑」「详情」两个按钮，和植物管理列表同宽。
- 连带删除只服务于上述两处的 `handleAccountUpdated`（星币回写行数据）与 `UserAccountEditor` 引入；`handleAccountLogs` 只剩工具栏那个全量入口在调用，签名由 `(row)` 简化为无参，不再拼 `query.id`。

删除 `src/views/sms/userList/components/UserAccountEditor.vue`（可用星币行内编辑弹层，全仓库唯一调用方就是那一列）与 `src/api/userList.js` 的 `setUserAccount` 封装（唯一调用方就是该组件）。`components/` 目录随之删空。

文档同步：`docs/project-structure.md` 的 userList 段落、`docs/interface-list.md` 的 getUserList / setUserAccount / getOperatUserAccountLog 三行、`docs/dynamic-menu-sync.md` 的账户日志入口说明、`AI_CONTEXT.md` 的模块下线记录。

## 关键决策

- **工具栏的「账户操作日志」按钮保留**。产品说的是「账户日志按钮」，即行级那个；工具栏那个标签是「账户操作日志」，进的是全量日志页，属于列表级入口，不在这次要求里。`accountLogs.vue` 页面与 `userAccountLogs` 路由都不动，它自己的「用户ID」筛选框（不填查全部）仍可缩到单个用户。
- **只服务于被删列的组件与接口封装一并删除**，与 2026-09-08 下线四个模块时的处理一致：留着就是没有调用方的死代码。要恢复可用星币编辑能力，直接 revert 本次提交即可。
- **不动后端菜单与权限节点**。`scripts/sync-admin-menu.mjs` 里 `Post_User_SetUserAccount`、`Get_User_GetOperatUserAccountLog` 两个节点的声明保持原样：删节点是后台数据变更，`--apply` 会写线上，需要单独指令。
- **不动接口本身**。`getUserList` 的响应里仍然带 `totalToken` / `availableToken` / `consumeToken`，只是前端不再展示；`POST /User/setUserAccount` 在后端照常存在。
- 「用户详情」「编辑用户」两页本来就没有星币字段，核对后未改。

## 外部操作

无。未调用任何写接口，未运行菜单同步脚本。

## 验证结果

- `NODE_OPTIONS=--max-old-space-size=1024 npm run build`（vite build）**通过**，45.58s，无报错无新警告；产物里 `accountLogs` 仍单独分包（日志页未受影响）。
- 全仓库检索确认无残留引用：`UserAccountEditor`、`setUserAccount`、`availableToken`、`totalToken`、`consumeToken` 在 `src/` 下只剩 `views/commerce/goods/components/GoodsForm.vue` 的 `totalTokenCount`，那是商品模块自己的计数，与用户星币无关。
- 项目没有 test / lint / type-check 脚本，未做其它自动检查；**未在浏览器里实机验证**列表渲染与操作列宽度。

## 未完成项与风险

- 需要在浏览器里看一眼：列少了三列之后表格是否还需要横向滚动、操作列 170px 在两个按钮下是否够宽。
- 后台菜单里「编辑用户账户」权限节点仍在，前端已无对应按钮；要不要从后台摘掉由产品决定。
- `docs/interface-list.md` 本身状态是 Mixed Sources，本次只修了这三行与当前实现有关的口径，其余历史内容未整理。

## 回滚或恢复

`git revert` 本次提交即可同时恢复三列、行级按钮、`UserAccountEditor.vue` 与 `setUserAccount`；后端接口和权限节点未动，无需额外恢复动作。
