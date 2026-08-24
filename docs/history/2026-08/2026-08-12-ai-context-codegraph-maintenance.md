# 建立 AI 上下文与 CodeGraph 长期维护机制

> 文档类型：Historical Change Record
> 日期：2026-08-12
> 环境：本地工作区
> 分支与起始版本：`main` / `028fbf5`
> 范围：文档治理、AI 上下文、CodeGraph 工作流
> 当前权威文档：[`AI_CONTEXT.md`](../../../AI_CONTEXT.md)、[`docs/README.md`](../../README.md)、[`AGENTS.md`](../../../AGENTS.md)

## 背景与目标

原 `AI_CONTEXT.md` 仍是 TODO，现有接口文档混有旧域名迁移信息，且 `next-session.md` 是短期交接而不是长期更新日志。目标是以当前工作树、yikaltd 接口来源和 CodeGraph 为依据建立项目专属快照、文档可信边界与按日期归档的维护机制。

## 变更内容

| 文件或模块 | 变更 |
| --- | --- |
| `AI_CONTEXT.md` | 填写花盆 PC 管理后台定位、路由/菜单/权限链、接口来源、风险和跨项目边界。 |
| `AGENTS.md` | 增加知识来源、CodeGraph 同步、历史记录和跨环境交接要求。 |
| `docs/README.md` | 为现有结构、接口和交接文档声明状态与可信边界。 |
| `docs/history/` | 建立按月归档的一次性操作记录与模板。 |

## 关键决策

- 不覆盖正在修改的接口文档、路由、用户产品图片或 `.env`；通过新索引标明其当前状态。
- yikaltd Swagger 是当前外部接口来源，boltfox 内容只保留为迁移追溯，待后续拆分。
- CodeGraph 管理当前源码关系，Active/Tracking 管理当前契约，Historical 管理修改原因。

## 外部操作

没有调用后台写接口、部署或迁移数据，也没有读取或记录 `.env` 的实际值。

## 验证结果

- `codegraph sync .`：Already up to date。
- `codegraph status .`：114 files、1,341 nodes、3,817 edges，索引为最新。
- CodeGraph 已确认登录、后端菜单、本地静态路由和 `v-permission` 的分层关系。
- 本次仅修改新的治理文档与原 TODO AI_CONTEXT/AGENTS；未运行应用构建。
- 新增治理文档的相对链接检查通过；未发现粘贴凭证或行尾空白。
- `git diff --check`：通过；任务开始前已有的业务、接口和环境改动保持不变。

## 未完成项与风险

- 本次任务开始前已有 `.env`、接口文档、路由、用户产品图片和删除 API 文件等未提交改动，本次未覆盖或恢复。
- README、混合来源接口清单、遗留页面和主包管理器仍待在当前迁移任务中统一收口。

## 回滚或恢复

本次新增内容均为 Markdown，可按文件回退。回退时不得影响任务开始前已有的业务与环境改动。
