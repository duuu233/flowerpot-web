# 本地操作更新记录

> 文档类型：历史记录规范与索引
> 状态：Active
> 最后核验：2026-08-25
> 事实来源：`AGENTS.md` 与项目文档治理约定

本目录补充 Git 提交，记录集中修改的背景、外部操作、验证和未完成项，但不替代源码、提交历史或 Active 文档。文件使用 `YYYY-MM/YYYY-MM-DD-topic.md`，任务完成后冻结。

## 模板

```markdown
# 主题

> 文档类型：Historical Change Record
> 日期：YYYY-MM-DD
> 环境：办公室 / 家庭 / SSH / 其他
> 分支与起始版本：branch / short-sha
> 范围：模块或仓库
> 当前权威文档：相关 Active 文档

## 背景与目标
## 变更内容
## 关键决策
## 外部操作
## 验证结果
## 未完成项与风险
## 回滚或恢复
```

只写实际完成的动作和验证。跨项目同步还要写上游来源、新契约、已同步内容、有意差异和未同步事项。禁止记录任何 Token、签名、密码、Cookie、用户数据或完整环境文件。

## 索引

- [`2026-09/2026-09-10-userlist-remove-token-columns.md`](2026-09/2026-09-10-userlist-remove-token-columns.md)：用户列表去掉总计/可用/消耗星币三列与行级「账户日志」按钮，连带删除只服务于该列的 `UserAccountEditor.vue` 与 `setUserAccount` 封装；工具栏「账户操作日志」入口、后端接口与权限节点均保留。
- [`2026-09/2026-09-09-plant-remove-care-instructions.md`](2026-09/2026-09-09-plant-remove-care-instructions.md)：植物资料再删「养护建议」表单项与必填校验，提交体保留原样回传以免清空存量数据。
- [`2026-09/2026-09-09-plant-remove-suggestion-fields.md`](2026-09/2026-09-09-plant-remove-suggestion-fields.md)：植物资料新增/编辑/详情删除光照、需水、空气温度、湿度四条建议字段；核对确认后端契约里从未有过这四个字段。
- [`2026-09/2026-09-09-home-registration-bar-chart.md`](2026-09/2026-09-09-home-registration-bar-chart.md)：首页用户注册增长趋势由手写条形列表改为按需引入的 ECharts 柱状图，新增 echarts 依赖与独立分包。
- [`2026-09/2026-09-09-sidebar-route-filter.md`](2026-09/2026-09-09-sidebar-route-filter.md)：侧栏渲染前用 `router.hasRoute` 过滤后端返回的失效菜单，修复已下线模块残留菜单行导致整块左侧菜单不显示。
- [`2026-09/2026-09-08-module-cleanup-and-product-field-trim.md`](2026-09/2026-09-08-module-cleanup-and-product-field-trim.md)：下线用户设备、用户产品图片、产品版本与系统配置四个模块，植物去掉所属产品，产品表单精简七个字段与列表两列。

- [`2026-08/2026-08-12-ai-context-codegraph-maintenance.md`](2026-08/2026-08-12-ai-context-codegraph-maintenance.md)：建立项目专属 AI 上下文、文档入口与 CodeGraph/历史记录规则。
- [`2026-08/2026-08-12-official-gallery-upload-thumbnail.md`](2026-08/2026-08-12-official-gallery-upload-thumbnail.md)：官方图库上传时生成缩略图。
- [`2026-08/2026-08-13-user-account-statistics.md`](2026-08/2026-08-13-user-account-statistics.md)：首页统计与用户星币账户。
- [`2026-08/2026-08-24-theme-recolor-and-product-plant-scaffold.md`](2026-08/2026-08-24-theme-recolor-and-product-plant-scaffold.md)：主题配色改为 LOGO 青绿，新增植物管理接口封装、路由与菜单同步范围。
- [`2026-08/2026-08-25-product-plant-integration-menu-sync.md`](2026-08/2026-08-25-product-plant-integration-menu-sync.md)：按 Excel、Swagger 与 CodeGraph 完成植物管理 CRUD，并生成、迁移和复查完整清单菜单权限。
- [`2026-09/2026-09-04-ui-refactoring.md`](2026-09/2026-09-04-ui-refactoring.md)：基于 SKILL.md 与 LOGO 配色进行全站视觉风格、Bento 仪表盘、顶栏侧边栏与微交互全面重构。
- [`2026-09/2026-09-08-plant-category-and-suggestions.md`](2026-09/2026-09-08-plant-category-and-suggestions.md)：植物资料新增分类与四条养护建议字段。
- [`2026-09/2026-09-08-api-origin-back-to-domain.md`](2026-09/2026-09-08-api-origin-back-to-domain.md)：接口地址由临时 IP 改回域名 `https://api.yikaltd.com`，并删除遗留支付 / 上传配置与 `requestPay` 实例。
