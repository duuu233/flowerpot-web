# 项目文档导航

> 文档类型：文档治理入口
> 状态：Active
> 最后核验：2026-08-24
> 事实来源：当前源码、CodeGraph、项目配置与工作树中的文档

本文件是 `docs/` 的统一入口。根目录保留执行规则 `AGENTS.md` 和当前 AI 快照 `AI_CONTEXT.md`；当前架构、接口迁移、临时交接和冻结历史都从这里定位。

## 推荐阅读顺序

1. `AGENTS.md`
2. `AI_CONTEXT.md`
3. 本文件
4. 与任务相关且来源清晰的 Active/Tracking 文档
5. CodeGraph 中的当前源码和调用链
6. 仅在需要理解原因时读取 Historical 或临时交接记录

## 当前文档

| 文档 | 状态 | 职责与注意事项 |
| --- | --- | --- |
| [`project-structure.md`](project-structure.md) | Active | 当前目录、请求地址规则、公共列表组件和 composable。 |
| [`api-integration-progress.md`](api-integration-progress.md) | Tracking / Reverify | yikaltd 管理端接口迁移进度；当前工作树正在修改，使用前核对日期、源码和 Swagger。 |
| [`dynamic-menu-sync.md`](dynamic-menu-sync.md) | Active | 后端菜单与按钮权限的声明式同步脚本、scope 划分和验证步骤。 |
| [`interface-list.md`](interface-list.md) | Mixed Sources | 同时保留 boltfox 历史与 yikaltd 更新，整理前不能单独作为当前契约。 |
| [`next-session.md`](next-session.md) | Temporary Handoff | 2026-08-03 的可替换会话交接；其中本机依赖状态已经陈旧。 |
| [`history/README.md`](history/README.md) | Active | 长期操作更新记录规则、模板与索引。 |

README 仍包含复制项目名称、yarn 命令和已移除路由等陈旧内容。完成当前遗留模块清理并确定主包管理器后再统一改写；在此之前不要将其“已完成模块”列表视为当前事实。

## CodeGraph 与文档的边界

- 当前文件、路由、符号、依赖、调用者和影响范围：源码与 CodeGraph。
- 当前外部接口：最新 yikaltd Swagger、实际只读响应与有核验日期的 Active/Tracking 文档。
- 产品/人工流程和架构不变量：最新 Active 文档。
- 迁移原因：Historical 或临时交接记录。

```bash
codegraph status .
codegraph explore 要理解的问题、文件或符号
codegraph sync .
```

拉取后运行 `codegraph sync .`；结构性源码修改后再次同步并检查状态。完整 `index` 只在索引缺失、损坏或工具建议时运行。`.codegraph/` 每台机器自行建立，永不提交。

## 文档生命周期

- `Active`：描述当前事实，直接更新正文，不追加流水账。
- `Tracking`：进度清单，必须标明核验日期和来源。
- `Mixed Sources`：尚未拆分的迁移材料，不能单独作为当前契约。
- `Temporary Handoff`：可覆盖的短期交接，不承担长期记录职责。
- `Historical`：一次任务结束后冻结，只用于追溯。
- `Superseded`：已被替代，开头必须链接新的权威文档。

架构、接口、命令、权限或模块范围变化时，更新负责该事实的 Active/Tracking 文档。新增、移动或替代文档时同步更新本索引。

## 历史记录

记录路径为 `history/YYYY-MM/YYYY-MM-DD-topic.md`。一次集中修改对应一份记录，不建立无限增长的单文件日志。不得记录 Token、签名、密码、Cookie、用户数据、完整环境文件或本机缓存。
