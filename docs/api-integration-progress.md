# API Integration Progress

Last checked: 2026-08-25

Swagger sources:

- UI: https://api.yikaltd.com/swagger-ui.html#/
- Machine-readable: https://api.yikaltd.com/v2/api-docs

Backend prefix: `/ZoneAdmin`

> 2026-08-25：接口地址一度改用 IP `http://120.25.227.36:8601`（原域名 `https://api.yikaltd.com`
> 在当时的机器上被 ICP 备案页或 TLS reset 拦截）。本轮已重新读取 `/v2/api-docs`，并用真实只读响应核对
> 植物列表、详情和产品下拉数据；认证参数仅用于当次请求，未写入源码或文档。
>
> 2026-09-08：接口地址改回域名 `https://api.yikaltd.com`。SSH 开发机上实测 `/v2/api-docs` 返回 200，
> 与 IP 返回同一份契约（仅 `host` 字段不同）。改动只落在 `.env` 的 `VITE_APP_API_ORIGIN` 和
> `scripts/sync-admin-menu.mjs` 的 `DEFAULT_API_BASE`。

Integration rule: only expose and call endpoints whose Swagger tag starts with `管理后台-`.

## Current coverage

当前 Swagger 包含 8 个管理后台分组和 77 个端点。源码路径核对显示 77 个端点均有本地包装；
`/Common/setFileUpload` 通过 `src/api/oss.js` 的动态 URL 生成，因此不出现在静态字符串扫描结果中。

| Area | Swagger tag | Endpoints | Local modules | Status |
| --- | --- | ---: | --- | --- |
| APP version / market | 管理后台-APP版本管理接口 | 12 | `appVersion.js`, `applicationStore.js` | Completed |
| Product plant | 管理后台-产品植物相关接口 | 5 | `productPlant.js` | Completed on 2026-08-25 |
| Product version | 管理后台-产品版本控制接口 | 6 | `productVersion.js` | Completed |
| Product / FAQ / user product | 管理后台-产品相关接口 | 11 | `productList.js` | Completed |
| Login | 管理后台-登录 | 1 | `login.js` | Completed |
| Permission / staff / roles / menus / departments | 管理后台-权限 | 32 | `login.js`, `menu.js`, `role.js` | Completed |
| Common / home / config / upload | 管理后台-通用相关接口 | 5 | `home.js`, `config.js`, `oss.js` | Completed |
| Users | 管理后台-用户相关接口 | 5 | `userList.js` | Completed |
| **Total** |  | **77** |  | **Covered** |

上表按 2026-08-25 的 Swagger 重新计数。`/ZoneAdmin/UserProductImg/*` 已不在当前契约中；
仓库仍保留对应包装、页面与路由，属于待清理的遗留实现，不应新增或恢复后端菜单。

## 2026-08-24 新增：植物管理（ProductPlant）

来源：`src/assets/智能花盆接口url功能列表清单.xlsx`（PC管理后台 → 运营管理 → 植物管理，添加时间 2026.8.24）。

| 功能 | 方法 | 路径 | 权限编码 | 前端状态 |
| --- | --- | --- | --- | --- |
| 列表 | GET | `/ZoneAdmin/ProductPlant/getProductPlantList` | `Get_ProductPlant_GetProductPlantList` | 已封装 |
| 详情 | GET | `/ZoneAdmin/ProductPlant/getProductPlantDetail` | `Get_ProductPlant_GetProductPlantDetail` | 已封装 |
| 新增 | POST | `/ZoneAdmin/ProductPlant/addProductPlant` | `Post_ProductPlant_AddProductPlant` | 已封装 |
| 编辑 | POST | `/ZoneAdmin/ProductPlant/editProductPlant` | `Post_ProductPlant_EditProductPlant` | 已封装 |
| 启用/禁用 | POST | `/ZoneAdmin/ProductPlant/setProductPlantVerify` | `Post_ProductPlant_SetProductPlantVerify` | 已封装 |

已完成请求封装（`src/api/productPlant.js`）、本地路由 `productPlant`、分页筛选列表、
新增/编辑/详情表单、图片上传、启用/禁用，以及对应按钮权限控制。页面按现有项目模式拆分为：

- `src/views/sms/productPlant/index.vue`：查询、分页、产品选项与接口协调。
- `src/views/sms/productPlant/ProductPlantTable.vue`：列表展示和操作事件。
- `src/views/sms/productPlant/ProductPlantFormDialog.vue`：新增、编辑、详情、上传和字段校验。

Swagger 已确认列表筛选为 `pageIndex`、`pageSize`、`keyword`、`startDate`、`endDate`、
`language`、`productId`、`verify`；详情使用 `id`；状态接口提交 `{ id, verify }`；
新增/编辑共用 `ProductPlantAddApiIn`，编辑时额外提交 `productPlantId`。

2026-08-25 已对系统 `1` 执行 `product-plant` 菜单同步：新增「运营管理」分组、
「植物管理」导航和新增/详情/编辑/启用禁用 4 个操作权限，共 6 个节点。随后执行完整
`checklist --apply --update`，将植物管理与清单中的另外三个既有前端模块一起纳入最终菜单树。

功能清单里的 `/Client/*` 植物接口（`getProductPlantList`、`getUserProductPlantList`、
`addUserProductPlant`、`getUserProductPlantDetail`）属于 Flutter 用户端 `flowerpot`，
不在本仓库范围内，也不应加入管理端封装。

## 2026-08-25 清单菜单对接

Excel 的 PC 管理后台范围共有四个模块：植物管理、APP 版本管理、基础信息配置和管理员权限。
植物管理是本轮唯一需要新增完整页面的模块；其余三个模块的 API 包装、路由和页面已存在，
本轮只修复或生成对应后端菜单与按钮权限。

- 「运营管理」下现有 `productPlant`、`appVersion`、`config` 三个导航。
- 「系统管理」下现有 `menuList`（管理员权限）导航及 10 个相关操作权限。
- APP 版本的 6 个旧节点从「APP管理」迁移到「运营管理」，权限码由旧 `Content` 前缀更新为当前 `AppVersion` 前缀。
- 迁移后为空的旧「APP管理」仅设为非导航，没有删除；左侧菜单接口已确认不再返回该空分组。
- 清单同步共新增 14、更新 8（包含旧空分组收尾）；最终 26 个声明节点均无配置差异。

普通角色仍需在角色管理中勾选新权限并重新登录。其他环境应使用
`npm run menu:sync:checklist` 先预览，再按需执行 `-- --apply --update`。

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

2026-08-25：

- 只读解析 `src/assets/智能花盆接口url功能列表清单.xlsx`，确认 PC 管理后台清单范围为植物管理、APP 版本管理、基础信息配置和管理员权限；只有植物管理需要新增页面。
- 最新 Swagger 重新计数：8 个管理后台分组、77 个端点；植物管理入参和输出模型已核对。
- 真实只读接口核验：植物列表、植物详情和产品列表均返回 `retCode: 200`。
- `node --check src/api/productPlant.js` 通过。
- `npm run build` 通过（Vite 5.4.21，2419 个模块）。
- `npm run menu:sync:product-plant -- --apply` 成功新增 6 个节点；再次预览全部为“存在”。
- `npm run menu:sync:checklist -- --apply --update` 新增 14、更新 7；旧空分组收尾另更新 1 个节点。
- 最终清单预览 26 个节点均为“存在”且零差异；`getLeftMenus` 返回的层级和本地路由名一致。
- 本地开发服务可访问，但当前会话没有可连接的浏览器实例，未完成截图级人工视觉回归。

See [next-session.md](./next-session.md) for the handoff checklist.
