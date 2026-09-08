# 接口地址由 IP 改回域名，并删除遗留支付 / 上传配置

> 文档类型：Historical Change Record
> 日期：2026-09-08
> 环境：SSH 开发机
> 分支与起始版本：main / 60eee3a
> 范围：`.env`、`scripts/sync-admin-menu.mjs`、`src/api/productPlant.js` 注释、`AI_CONTEXT.md`、`docs/`
> 当前权威文档：`AI_CONTEXT.md` 第 3 节、`docs/api-integration-progress.md`

## 背景与目标

2026-08-25 因原域名 `https://api.yikaltd.com` 在当时的机器上被阿里云 ICP 备案页 / TLS reset 拦截，接口地址临时改成 IP `http://120.25.227.36:8601`。本轮按要求改回域名。

## 变更内容

- `.env`：`VITE_APP_API_ORIGIN` 由 `http://120.25.227.36:8601` 改为 `https://api.yikaltd.com`。运行时只有这一个地址来源——`src/utils/request.js`、`src/api/clientBasic.js` 都读它，`vite.config.js` 的开发代理在没有 `VITE_APP_PROXY_TARGET` 时也回落到它。
- `scripts/sync-admin-menu.mjs`：`DEFAULT_API_BASE` 由 `http://120.25.227.36:8601/ZoneAdmin` 改为 `https://api.yikaltd.com/ZoneAdmin`（仍可用 `BOLTFOX_API_BASE` 覆盖）。
- 文档与注释里的 Swagger 地址同步改为域名：`AI_CONTEXT.md` 第 3 节、`docs/api-integration-progress.md`、`docs/dynamic-menu-sync.md`、`src/api/productPlant.js` 顶部注释。历史说明保留「曾临时改用 IP」的来龙去脉，不抹掉。

## 关键决策

- **第一步只改 yikaltd 管理端这一个地址**。`.env.development` / `.env.production` 里的 `VITE_APP_BASE_PAY`、`VITE_APP_BASE_UPLOAD`、`VITE_APP_BASE_BIGUPLOAD` 指向另一台服务器 `39.108.153.239:8813/8817`，属于复制项目遗留的支付与上传服务，不在当前 Swagger 范围内，也没有任何文档给出它的域名，当时没有替换（见下方追加：确认不需要后已整体删除）。
- 开发代理已带 `changeOrigin: true`，目标换成 HTTPS 域名后无需额外配置；证书有效（curl 未加 `-k` 即通）。

## 外部操作

只读验证：从 SSH 开发机 `curl https://api.yikaltd.com/v2/api-docs` 返回 200、`application/json`、245411 字节；同时 `curl http://120.25.227.36:8601/v2/api-docs` 返回 200、245414 字节，两者是同一份契约（差异仅 `host` 字段）。没有调用任何写接口。

## 验证结果

- `npx vite build`（`NODE_OPTIONS=--max-old-space-size=1024`）通过。
- 项目没有 test / lint / type-check 脚本，未做页面实机验证；改动只涉及一个环境变量与脚本默认值，没有触及业务逻辑。

## 未完成项与风险

1. 若某台开发机再次被 ICP 备案页拦住，改回 IP 只需改本机 `.env` 的 `VITE_APP_API_ORIGIN`，不必改源码。
2. 遗留支付 / 上传服务仍是 IP，需要产品或后端给出域名后再统一。
3. 生产部署若由构建产物提供，需要重新构建发布才会生效（`dist/` 不在版本控制内）。

## 回滚或恢复

把 `.env` 的 `VITE_APP_API_ORIGIN` 与 `scripts/sync-admin-menu.mjs` 的 `DEFAULT_API_BASE` 改回 IP 即可，或直接 revert 对应提交；支付 / 上传那部分 revert 第二次提交即可整体恢复。
---

## 追加（同日）：删除遗留支付 / 上传配置

确认这部分现在不需要后整体删除，而不是换域名：

- `.env.development` / `.env.production`：删掉 `VITE_APP_BASE_PAY`、`VITE_APP_BASE_UPLOAD`、`VITE_APP_BASE_BIGUPLOAD` 三个变量（连同写在 URL 里的 `sign` / `randomString` 查询串）。两个文件已没有任何分环境覆盖项，只保留一行说明指向根目录 `.env`。
- 删除 `src/utils/requestPay.js`：它的 `baseURL` 就是 `VITE_APP_BASE_PAY`，变量一删这个实例只会打到管理后台自身源站，属于坏路径而不是可用回退。`docs/next-session.md` 原本就把它列在待清理清单里。
- `src/api/log.js`：删掉 `requestPay` 的 import 和 `getPayQuery`、`getPayRefundQuery` 两个封装——全仓库没有任何页面引用它们。`log.js` 其余函数走普通 `request`，仍被 `src/views/log/**` 使用，因此文件保留。
- 文档同步：`AI_CONTEXT.md` 第 3 节、`README.md` 环境变量与请求层说明、`docs/next-session.md` 的待清理项。

删除后 `npx vite build`（1024 MB 堆）再次通过。风险：如果以后要重新接支付查询，需要连同请求实例一起恢复（可从本次提交 revert）。

