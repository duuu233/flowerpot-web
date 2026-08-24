# Interface Checklist

> 2026-08-03 update: the active source is `https://api.yikaltd.com/v2/api-docs`. Only tags beginning with `管理后台-` are in scope. The current document exposes 8 management groups and 77 endpoints, all covered by local management wrappers. The copied project's message, waybill, dispatch, log, pay, freight, and goods calls are outside the new Swagger scope. Product-version detail is currently `/ZoneAdmin/ProductVersion/getProductVersionDetail`; user-product-image management has five endpoints and no status mutation. See [api-integration-progress.md](./api-integration-progress.md) for the current status and [next-session.md](./next-session.md) for deferred cleanup.

Source:

- Manual checklist image provided on 2026-06-11.
- Machine-readable Swagger checked on 2026-06-11: `https://api.boltfox.cn/v2/api-docs`.

Comparison result:

- Current Swagger exposes 78 `/ZoneAdmin/*` backend endpoints.
- Local `src/api` already covered all current Swagger `/ZoneAdmin/*` endpoints at the time of comparison.
- The manual checklist lists one newer route that current Swagger did not expose when checked: `/ZoneAdmin/ProductVersion/getUserDeviceVersionDetail`. The code follows the manual checklist for product version detail.

Backend prefix:

- Runtime API prefix is `/ZoneAdmin`.
- Code API wrappers omit this prefix because `VITE_APP_API_PREFIX` supplies it through `src/utils/request.js`.

## PC Admin Backend

| Area | Module | Feature | Interface / handling | Current status |
| --- | --- | --- | --- | --- |
| Basic public | File upload | Upload file | `POST /ZoneAdmin/Common/setFileUpload` | Done. `src/api/oss.js` appends `userToken` in the URL query and posts `fileParam`. |
| Home | Data aggregate display | Daily/weekly/monthly users, device activations, shares | `GET /ZoneAdmin/Common/getUserCount`, `GET /ZoneAdmin/Common/getStatisticsUser` | Done. |
| User management | User list | Registered user list | Original interface: `GET /ZoneAdmin/User/getUserList` | Done. |
| User management | User device list | Activated device list by user dimension | `GET /ZoneAdmin/Product/getUserProductList` | Done. Route: `userProductList`. |
| Product management | Product list | Product list | Original interface: `GET /ZoneAdmin/Product/getProductList` | Done. |
| Product management | Product management | Add product | `POST /ZoneAdmin/Product/addProduct`; add `broadcastId`, remove old `productContent` and `productFile` params | Done. |
| Product management | Product management | Edit product | Original function: `POST /ZoneAdmin/Product/editProduct` | Done. |
| Product management | Product management | Enable/disable product | Original function: `POST /ZoneAdmin/Product/setProductVerify` | Done. |
| Product management | Product management | Product detail | Original function: `GET /ZoneAdmin/Product/getProductDetail` | Done. |
| Device version | Device version settings | Version list | `GET /ZoneAdmin/ProductVersion/getProductVersionList` | Done. |
| Device version | Device version settings | Version detail | `GET /ZoneAdmin/ProductVersion/getUserDeviceVersionDetail` | Done. This follows the manual checklist; current Swagger still listed `getProductVersionDetail` when checked. |
| Device version | Device version settings | Add version | `POST /ZoneAdmin/ProductVersion/addProductVersion` | Done. |
| Device version | Device version settings | Edit version | `POST /ZoneAdmin/ProductVersion/editProductVersion` | Done. |
| Device version | Device version settings | Enable/disable version | `POST /ZoneAdmin/ProductVersion/setProductVersionVerify` | Done. |
| Help management | Help content list | Upload/edit/delete by device dimension | Original interface set: `GET /ZoneAdmin/Product/getProductFaqList`, `GET /ZoneAdmin/Product/getProductFaqDetail`, `POST /ZoneAdmin/Product/addProductFaq`, `POST /ZoneAdmin/Product/editProductFaq`, `POST /ZoneAdmin/Product/setProductFaqVerify` | Done. |
| System settings | Backend permission settings | Permissions, roles, menus, departments | Original function: `/ZoneAdmin/Jurisdiction/*` | Done. |
| System settings | App version settings | App version upgrade | Original function: `/ZoneAdmin/AppVersion/*` | Done. |
