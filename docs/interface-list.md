# Interface Checklist

> 2026-08-03 update: the active source is `https://api.yikaltd.com/v2/api-docs`. Only tags beginning with `管理后台-` are in scope. The current document exposes 8 management groups and 77 endpoints, all covered by local management wrappers. The copied project's message, waybill, dispatch, log, pay, freight, and goods calls are outside the new Swagger scope. Product-version detail is currently `/ZoneAdmin/ProductVersion/getProductVersionDetail`; user-product-image management has five endpoints and no status mutation. See [api-integration-progress.md](./api-integration-progress.md) for the current status and [next-session.md](./next-session.md) for deferred cleanup.

Source:

- Manual checklist image provided on 2026-06-11.
- Machine-readable Swagger checked on 2026-06-11: `https://api.boltfox.cn/v2/api-docs`.
- Goods and order Swagger contracts plus live read-only response samples rechecked on 2026-08-11.
- Public image library, image category, and AI configuration Swagger contracts rechecked on 2026-08-12.
- Home statistics and user account Swagger contracts plus live read-only samples rechecked on 2026-08-13.
- 2026-09-09 recheck of `https://api.yikaltd.com/v2/api-docs`: 111 paths, of which 71 are `/ZoneAdmin/*` in seven groups — AppVersion, Common, Jurisdiction, Passport, Product, ProductPlant, User. `Goods`, `Order`, `ProductImg`, `AiConfig` and `ProductVersion` are **no longer in the document**. A live read-only probe confirms it for Goods: `GET /ZoneAdmin/Goods/getGoodsList` answers with the container's raw HTTP 500 body, exactly like a made-up path such as `/ZoneAdmin/Nope/nope`, while a mapped route (`/ZoneAdmin/Product/getProductList`) answers HTTP 200 with the app envelope `{"retCode":406,"retMsg":"请重新登录！"}`. The same Goods path on the album backend `https://api.boltfox.cn` returns that envelope, so the module lives there, not here.

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
| Basic public | File upload | Upload file | `POST /ZoneAdmin/Common/setFileUpload` | Done. `src/api/oss.js` appends `userToken` in the URL query, posts `fileParam`, and supports optional query `isUploadThumb`; official gallery original uploads pass `1` and consume returned `urlThumb`. |
| Home | Data aggregate display | User count, bound-device count, order amount, product/FAQ totals, and registration trend | `GET /ZoneAdmin/Common/getUserCount`, `GET /ZoneAdmin/Common/getStatisticsUser` | Done. `getUserCount` displays `userCount`, `userBindProductCount`, `orderAmount`, `productCount`, and `productFaqCount`. |
| User management | User list | Registered user list | `GET /ZoneAdmin/User/getUserList` | Done. Since 2026-09-10 the list no longer shows `totalToken`, `availableToken`, or `consumeToken` (columns removed on product request); country columns stay hidden. The response still carries those fields. |
| User management | User account | Edit available token balance | `POST /ZoneAdmin/User/setUserAccount` | **Not used by the frontend since 2026-09-10.** The editor lived in the removed available-token column; the component and the `setUserAccount` wrapper were deleted with it. The backend interface and the `Post_User_SetUserAccount` permission node are untouched. |
| User management | Account operation log | All users or one user by ID | `GET /ZoneAdmin/User/getOperatUserAccountLog` | Done. Hidden local route: `userAccountLogs`; since 2026-09-10 the only entry point is the user-list toolbar (the per-row button was removed). The page's own 用户ID filter still narrows to one user. |
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
| Commerce | Goods management | Goods list, detail, add, edit, enable/disable | `GET /ZoneAdmin/Goods/getGoodsList`, `GET /ZoneAdmin/Goods/getGoodsDetail`, `POST /ZoneAdmin/Goods/addGoods`, `POST /ZoneAdmin/Goods/editGoods`, `POST /ZoneAdmin/Goods/setGoodsVerify` | Pages exist (routes `goodsList`, `goodsListAdd`, `goodsListEdit`, `goodsListDetail`) but **the endpoints are not on this backend** (2026-09-09 recheck, see Source). They are copied-project leftovers pointing at the album backend's module. Consequence: the four-locale strike-through price (`marketAmount`, `marketAmountEnglish`, `marketAmountFan`, `marketAmountJapanese`) added to the album admin on 2026-09-08 has **no counterpart in the yikaltd contract** — adding those inputs here would be dead UI until this backend ships a Goods module. |
| Product management | Public image library | Image list, detail, add, edit, enable/disable | `GET /ZoneAdmin/ProductImg/getProductImgList`, `GET /ZoneAdmin/ProductImg/getProductImgDetail`, `POST /ZoneAdmin/ProductImg/addProductImg`, `POST /ZoneAdmin/ProductImg/editProductImg`, `POST /ZoneAdmin/ProductImg/setProductImgVerify` | Done. Routes: `productImageList`, `productImageAdd`, `productImageEdit`, `productImageDetail`. |
| Product management | Image categories | Category list, detail, add, edit, enable/disable | `GET /ZoneAdmin/ProductImg/getImgCategoryList`, `GET /ZoneAdmin/ProductImg/getImgCategoryDetail`, `POST /ZoneAdmin/ProductImg/addImgCategory`, `POST /ZoneAdmin/ProductImg/editImgCategory`, `POST /ZoneAdmin/ProductImg/setImgCategoryVerify` | Done. Routes: `imageCategoryList`, `imageCategoryAdd`, `imageCategoryEdit`, `imageCategoryDetail`. |
| Commerce | Order management | Order list and detail | `GET /ZoneAdmin/Order/getOrderList`, `GET /ZoneAdmin/Order/getOrderDetail` | Done. Routes: `orderList`, `orderListDetail`. |
| AI configuration | AI cost configuration | List, edit, enable/disable | `GET /ZoneAdmin/AiConfig/getAiConfigList`, `POST /ZoneAdmin/AiConfig/editAiConfig`, `POST /ZoneAdmin/AiConfig/setAiConfigVerify` | Done. Route: `aiConfigList`; editing uses a list-row dialog because Swagger has no detail endpoint. |
| System settings | Backend permission settings | Permissions, roles, menus, departments | Original function: `/ZoneAdmin/Jurisdiction/*` | Done. |
| System settings | App version settings | App version upgrade | Original function: `/ZoneAdmin/AppVersion/*` | Done. |
