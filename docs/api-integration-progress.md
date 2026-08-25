# API Integration Progress

Last checked: 2026-08-24

Swagger sources:

- UI: http://120.25.227.36:8601/swagger-ui.html#/
- Machine-readable: http://120.25.227.36:8601/v2/api-docs

Backend prefix: `/ZoneAdmin`

> 2026-08-25：接口地址改用 IP `http://120.25.227.36:8601`（原域名 `https://api.yikaltd.com`
> 在本机 HTTP 被阿里云返回 `Non-compliance ICP Filing` 拦截页、HTTPS 在 TLS 握手阶段被 reset）。
> 改用 IP 后 `swagger-ui.html` 与 `/v2/api-docs` 均可访问；本轮只做地址切换，字段契约尚未重新核对。

Integration rule: only expose and call endpoints whose Swagger tag starts with `管理后台-`.

## Current coverage

The current Swagger contains 8 backend-management groups and 77 endpoints. The local management API wrappers cover all 77 endpoints.

| Area | Swagger tag | Endpoints | Local modules | Status |
| --- | --- | ---: | --- | --- |
| APP version / market | 管理后台-APP版本管理接口 | 12 | `appVersion.js`, `applicationStore.js` | Completed |
| Product version | 管理后台-产品版本控制接口 | 6 | `productVersion.js` | Completed |
| Product / FAQ / user product | 管理后台-产品相关接口 | 11 | `productList.js` | Completed |
| Login | 管理后台-登录 | 1 | `login.js` | Completed |
| Permission / staff / roles / menus / departments | 管理后台-权限 | 32 | `login.js`, `menu.js`, `role.js` | Completed |
| Common / home / config / upload | 管理后台-通用相关接口 | 5 | `home.js`, `config.js`, `oss.js` | Completed |
| User product images | 管理后台-用户产品图片控制接口 | 5 | `userProductImage.js` | Completed on 2026-08-03 |
| Users | 管理后台-用户相关接口 | 5 | `userList.js` | Completed |
| **Total** |  | **77** |  | **Covered** |

上表的 77 个端点来自 2026-08-03 的 Swagger 快照，尚未按最新 Swagger 重新计数。

## 2026-08-24 新增：植物管理（ProductPlant）

来源：`src/assets/智能花盆接口url功能列表清单.xlsx`（PC管理后台 → 运营管理 → 植物管理，添加时间 2026.8.24）。

| 功能 | 方法 | 路径 | 权限编码 | 前端状态 |
| --- | --- | --- | --- | --- |
| 列表 | GET | `/ZoneAdmin/ProductPlant/getProductPlantList` | `Get_ProductPlant_GetProductPlantList` | 已封装 |
| 详情 | GET | `/ZoneAdmin/ProductPlant/getProductPlantDetail` | `Get_ProductPlant_GetProductPlantDetail` | 已封装 |
| 新增 | POST | `/ZoneAdmin/ProductPlant/addProductPlant` | `Post_ProductPlant_AddProductPlant` | 已封装 |
| 编辑 | POST | `/ZoneAdmin/ProductPlant/editProductPlant` | `Post_ProductPlant_EditProductPlant` | 已封装 |
| 启用/禁用 | POST | `/ZoneAdmin/ProductPlant/setProductPlantVerify` | `Post_ProductPlant_SetProductPlantVerify` | 已封装 |

当前只完成请求封装（`src/api/productPlant.js`）、本地路由 `productPlant` 与菜单同步节点，
页面是占位页。入参与返回字段未经 Swagger 核对，实现列表和表单前必须先补齐契约。

功能清单里的 `/Client/*` 植物接口（`getProductPlantList`、`getUserProductPlantList`、
`addUserProductPlant`、`getUserProductPlantDetail`）属于 Flutter 用户端 `flowerpot`，
不在本仓库范围内，也不应加入管理端封装。

## 2026-08-03 changes

- Changed `VITE_APP_API_ORIGIN` from `https://api.boltfox.cn` to `https://api.yikaltd.com`.
- Corrected the user-product-image module to the five endpoints currently exposed by Swagger.
- Removed the unsupported `POST /UserProductImg/setUserProductImgVerify` call and changed status to read-only display.
- Updated image-list filters to `keyword`, `startDate`, `endDate`, `language`, and `userProductId`.
- Split the user-product-image UI into a route container, table component, and form dialog.
- Removed message, waybill, and log entries from the static route table because the new Swagger has no matching management groups.
- Removed the unused legacy `dispatchWork.js` and `freight.js` wrappers.

## Excluded legacy areas

The copied project still contains orphan source for `/Content/*`, `/Waybill/*`, `/Log/*`, and `/Pay/*`. Their routes are removed and the remaining source cleanup is deferred to the next session. `/Goods/*` existed in the latest old-domain Swagger but is absent from the new Swagger, so it is not integrated.

## Verification

2026-08-03：

- `node --check src/router/routes.js`: passed.
- `node --check src/api/userProductImage.js`: passed.
- `npm run build`: could not start because dependencies are not installed (`vite` is unavailable).

2026-08-24：

- `node --check`（ESM 副本）：`src/api/productPlant.js`、`src/router/routes.js` 通过。
- `node --check scripts/sync-admin-menu.mjs` 通过；`--scope=product-plant --help` 与无 token 运行均按预期返回。
- `sass src/styles/index.scss` 独立编译通过。
- `npm run build` 通过（先修复了 `Upload` 组件在 Linux 上的大小写导入问题）。
- 菜单同步脚本未对后端执行，`--apply` 待可访问接口的环境再跑。

See [next-session.md](./next-session.md) for the handoff checklist.
