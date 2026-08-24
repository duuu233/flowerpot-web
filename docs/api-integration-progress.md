# API Integration Progress

Last checked: 2026-08-03

Swagger sources:

- UI: https://api.yikaltd.com/swagger-ui.html#/
- Machine-readable: https://api.yikaltd.com/v2/api-docs

Backend prefix: `/ZoneAdmin`

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

- `node --check src/router/routes.js`: passed.
- `node --check src/api/userProductImage.js`: passed.
- `npm run build`: could not start because dependencies are not installed (`vite` is unavailable).

See [next-session.md](./next-session.md) for the handoff checklist.
