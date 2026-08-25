# 智能花盆管理后台清单对接与菜单同步

> 文档类型：Historical Change Record
> 日期：2026-08-25
> 环境：本地 Windows / PowerShell / Asia/Shanghai
> 分支与起始版本：`main` / `c7e4db3`
> 范围：`flowerpot-web` 植物管理、清单模块菜单、接口跟踪与权限
> 当前权威文档：`docs/api-integration-progress.md`、`docs/dynamic-menu-sync.md`

## 背景与目标

`src/assets/智能花盆接口url功能列表清单.xlsx` 的 PC 管理后台范围包含植物管理、APP 版本管理、
基础信息配置和管理员权限。仓库此前只有植物管理 API 包装、本地路由、菜单声明和占位页；
另外三个模块已有页面与包装，但后端菜单缺失或使用旧分组和旧权限码。本次按最新 Swagger、
真实响应和 CodeGraph 补齐植物页面，并把清单菜单幂等写入后台。

## 变更内容

- 核对 Excel、最新 `/v2/api-docs`、CodeGraph 调用链和真实只读接口响应。
- 将植物管理占位页改为分页筛选、详情、新增、编辑、图片上传和启用/禁用的完整页面。
- 页面拆分为路由协调页、资料表格和统一表单对话框，复用公共查询、工具栏、分页、上传和列表逻辑。
- 权限按钮统一使用清单对应的 4 个操作编码，菜单路由继续使用 `productPlant`。
- 新增 `checklist` 菜单作用域，复用已有 `appVersion`、`config`、`menuList` 路由与页面。
- 支持识别旧 `Content` 前缀的 APP 版本权限码、跨分组迁移节点，并仅在旧分组为空时设为非导航。
- 更新 ProductPlant API 契约说明、项目结构、接口进度和动态菜单操作手册。
- 修复 `AI_CONTEXT.md` 中已存在的合并冲突标记，并更新植物模块与当前 Swagger 风险事实。

## 受影响文件与模块

- `src/api/productPlant.js` 与 `src/views/sms/productPlant/`：植物管理 API、列表、表格和表单对话框。
- `scripts/sync-admin-menu.mjs` 与 `package.json`：完整清单 scope、旧权限迁移、空分组收尾和 npm 命令。
- `appVersion`、`config`、`menuList`：仅复用现有路由、页面与 API，并生成/迁移后端权限；未修改页面源码。
- `AI_CONTEXT.md`、`docs/api-integration-progress.md`、`docs/dynamic-menu-sync.md`、
  `docs/project-structure.md` 和历史索引：更新当前事实、操作方式与验证记录。

## 关键决策

- 本仓库只处理清单中属于 PC 管理后台的植物管理；`/Client/*`、PC 官网和隐私政策不进入本项目。
- APP 版本、基础配置和系统权限复用仓库已有页面与包装，只生成或迁移清单要求的后端菜单，不重复开发页面。
- Swagger 未给出养护难度和光照等级的完整枚举映射，表单使用正整数等级，列表展示后端返回的描述字段，避免硬编码错误字典。
- 新增、编辑和详情共用一个对话框，不增加隐藏路由；路由 `name`、组件 `name` 与后端 `appUrl` 保持 `productPlant`。
- 菜单分组按 Excel 使用「运营管理」，写入前先执行只读预览，确认后台不存在同名或别名分组。

## 外部操作

- 读取当前 Swagger 机器契约，并调用植物列表、植物详情和产品列表只读接口核对真实字段。
- 对系统 `1` 执行 `product-plant --apply`：新增「运营管理」分组、植物管理导航和 4 个操作权限，共 6 个节点。
- 对系统 `1` 执行 `checklist --apply --update`：新增基础信息配置与管理员权限树共 14 个节点，
  更新植物排序和 APP 版本旧节点共 7 个节点。
- APP 版本迁移后旧「APP管理」为空，执行同一清单同步将它设为非导航，额外更新 1 个节点；没有删除后台数据。
- 最终再次运行只读预览，26 个声明节点均显示“存在”且无配置差异；`getLeftMenus` 已返回目标层级且不再返回旧空分组。
- 所有认证材料仅用于当次进程，没有写入源码、环境文件、文档或日志正文。

## 验证结果

- 任务开始时 `codegraph status .` 显示索引为最新；结构和影响分析先通过 CodeGraph 完成。
- 源码变更后 `codegraph sync .` 成功，新组件和菜单脚本可被 `codegraph explore` 查询。最终状态仍报告
  2 个既有文件的 Windows 大小写差异；增量同步无法消除，完整重建又被当前 CodeGraph 服务的数据库占用阻止。
- 植物列表、植物详情、产品列表真实只读请求均返回 `retCode: 200`。
- `node --check src/api/productPlant.js`：通过。
- `npm run build`：通过；Vite 5.4.21 转换 2419 个模块并成功生成生产构建。
- 菜单同步累计新增 20、更新 8；最终预览 26 个清单声明节点全部为“存在”且零差异。
- `getLeftMenus(parentMenuId=1)` 返回「运营管理 → 植物管理 / APP版本管理 / 基础信息配置」和
  「系统管理 → 管理员权限」，路由名分别为 `productPlant`、`appVersion`、`config`、`menuList`。
- 本地 Vite 服务可访问；当前会话无可连接浏览器实例，因此没有完成截图级视觉回归。

## 未完成项与风险

- 非系统管理员仍需在角色管理中绑定新增权限，并重新登录刷新菜单与 `childAppCodes`。
- 旧「APP管理」节点仍保留在权限管理数据中但已设为非导航；这是可逆收尾，未执行删除。
- 本机 CodeGraph 的大小写状态差异仅影响本地生成索引；在可停止 CodeGraph 服务的窗口执行
  `codegraph index .` 可重建，不应提交或跨机器复制 `.codegraph/`。
- 需要在可用浏览器环境人工走查筛选、上传、新增、编辑、详情和状态确认交互。
- 养护难度和光照等级的完整业务枚举仍需后端给出；当前正整数输入符合 Swagger，但不替代业务字典。
- 2026-08-25 的 Swagger 已无 `UserProductImg`，仓库仍保留相关包装、页面和路由；遗留范围需单独评估清理。

## 回滚或恢复

- 前端可按本记录的受影响文件回退植物页面和文档变更；API 路径和既有 `productPlant` 路由无需删除。
- 菜单脚本只新增或更新、不删除。若需要回滚，先按本记录恢复 APP 版本旧父级与旧权限码、
  恢复旧「APP管理」为导航，再按子节点优先顺序移除本次新增的基础配置、管理员权限和植物节点；
  只有确认分组不再承载其他业务时才移除分组。
