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

- [`2026-08/2026-08-12-ai-context-codegraph-maintenance.md`](2026-08/2026-08-12-ai-context-codegraph-maintenance.md)：建立项目专属 AI 上下文、文档入口与 CodeGraph/历史记录规则。
- [`2026-08/2026-08-12-official-gallery-upload-thumbnail.md`](2026-08/2026-08-12-official-gallery-upload-thumbnail.md)：官方图库上传时生成缩略图。
- [`2026-08/2026-08-13-user-account-statistics.md`](2026-08/2026-08-13-user-account-statistics.md)：首页统计与用户星币账户。
- [`2026-08/2026-08-24-theme-recolor-and-product-plant-scaffold.md`](2026-08/2026-08-24-theme-recolor-and-product-plant-scaffold.md)：主题配色改为 LOGO 青绿，新增植物管理接口封装、路由与菜单同步范围。
- [`2026-08/2026-08-25-product-plant-integration-menu-sync.md`](2026-08/2026-08-25-product-plant-integration-menu-sync.md)：按 Excel、Swagger 与 CodeGraph 完成植物管理 CRUD，并生成、迁移和复查完整清单菜单权限。
- [`2026-09/2026-09-04-ui-refactoring.md`](2026-09/2026-09-04-ui-refactoring.md)：基于 SKILL.md 与 LOGO 配色进行全站视觉风格、Bento 仪表盘、顶栏侧边栏与微交互全面重构。
- [`2026-09/2026-09-08-plant-category-and-suggestions.md`](2026-09/2026-09-08-plant-category-and-suggestions.md)：植物资料新增分类与四条养护建议字段。
- [`2026-09/2026-09-08-api-origin-back-to-domain.md`](2026-09/2026-09-08-api-origin-back-to-domain.md)：接口地址由临时 IP 改回域名 `https://api.yikaltd.com`，并删除遗留支付 / 上传配置与 `requestPay` 实例。
