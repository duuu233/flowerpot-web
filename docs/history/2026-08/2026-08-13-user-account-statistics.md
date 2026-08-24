# 首页统计与用户星币账户

> 文档类型：Historical Change Record
> 日期：2026-08-13
> 环境：本机 Windows（Asia/Shanghai）
> 分支与起始版本：main / 0ef17c8
> 范围：`web-ui-v2` 首页、用户列表、账户日志、路由、接口与后台权限菜单
> 当前权威文档：[`../../interface-list.md`](../../interface-list.md)、[`../../api-integration-progress.md`](../../api-integration-progress.md)、[`../../dynamic-menu-sync.md`](../../dynamic-menu-sync.md)

## 背景与目标

依据 2026-08-13 提供的新增模块清单，为首页补充绑定设备数与订单金额，为用户列表展示星币账户字段并提供可用星币调整及账户操作日志能力，同时把新接口权限幂等写入后台菜单树。

## 变更内容

| 文件或模块 | 变更 |
| --- | --- |
| 首页 | 消费 `getUserCount` 的 `userBindProductCount`、`orderAmount` 并增加统计卡片。 |
| 用户 API | 新增 `setUserAccount` 与 `getOperatUserAccountLog` 请求封装。 |
| 用户列表 | 展示总计、可用、消耗星币；隐藏国家和国家编号；增加账户编辑及日志入口。 |
| 账户编辑组件 | 按权限显示可点击余额，校验非负数后提交 `userId` 与 `availableToken`。 |
| 账户日志 | 新增隐藏路由页面，支持全部日志、按用户 ID、关键词、语言及日期查询。 |
| 菜单同步 | 将脚本扩为按 scope 同步，并增加 `user-account` 范围。 |
| 项目文档 | 更新接口清单、接入状态、结构说明和菜单操作手册。 |

## 关键决策

- 账户日志是用户列表的下钻页面，不新增左侧导航；后端仅新增非导航操作权限。
- 账户编辑保持独立组件，列表页只接收更新后的余额，不直接持有编辑表单状态。
- 临时鉴权参数只用于接口核对和菜单同步，没有写入源码、文档或配置。

## 外部操作

- 只读核对 Swagger 中 4 个目标接口的路径、方法、参数和模型，并读取首页、用户列表及账户日志的线上响应结构。
- 对系统 `1` 先预览后写入 `Post_User_SetUserAccount`、`Get_User_GetOperatUserAccountLog` 两个权限节点；实际结果为新增 2、更新 0。二次只读预览确认两者均已存在。
- 未修改角色与权限绑定；非系统管理员仍需由管理员绑定新增节点并重新登录。

## 验证结果

- `node --check scripts/sync-admin-menu.mjs`：通过。
- `node --check src/api/userList.js`：通过。
- `npm run build`：通过，Vite 完成 2442 个模块转换。
- 账户日志按抽样用户 ID 只读查询：`retCode=200`，返回 3 行且用户 ID 全部匹配。
- `npm run menu:sync:user-account`：写入前显示 2 个待新增节点，写入后显示 2 个已存在节点。

## 未完成项与风险

- 未执行真实账户余额修改，避免对线上用户财务数据造成测试性变更；需使用受控测试账号人工验证保存后的余额与日志内容。
- 普通管理员若未绑定两个新权限，将只看到只读余额且不会看到日志入口。

## 回滚或恢复

- 前端可回退本次相关源码与路由变更。
- 后台新增权限节点不会因前端回退自动删除；如确需回滚，应在权限管理中确认无角色依赖后分别删除两个新增节点。
