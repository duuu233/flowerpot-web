# 后端菜单自动同步指南

> 文档类型：当前操作手册
> 状态：Active
> 最后核验：2026-08-25
> 事实来源：菜单同步脚本、路由、权限 Store 与后台接口契约

本项目的页面可访问性由两部分共同决定：

1. `src/router/routes.js` 提供本地 Vue Router 路由与组件映射。
2. 后端 `/Jurisdiction/*` 接口提供顶部系统、左侧菜单和按钮权限。

仅新增页面不会自动出现在左侧菜单；仅新增后端菜单也无法找到本地组件。两边必须使用同一个稳定的路由 `name` 连接。

## 字段映射

| 后端字段 | 前端含义 | 约定 |
| --- | --- | --- |
| `appName` | 菜单或操作名称 | 面向管理员展示的中文名称 |
| `appCode` | 权限编码 | 与页面 `v-permission` 中的字符串完全一致 |
| `appUrl` | 路由标识 | 导航节点填写 Vue Router 的 `name`；非导航节点填写占位符 `#`，因为后端要求至少 1 个字符 |
| `parentId` | 父权限 ID | 由同步脚本在创建父节点后自动解析 |
| `systemId` | 所属后台系统 | 当前运营管理系统为 `1` |
| `isNav` | 是否展示为菜单 | 列表页为 `1`，详情/按钮权限为 `0` |
| `isRefresh` | 点击是否刷新 | 当前 SPA 页面统一为 `0` |
| `grade` | 排序权重 | 数值越大通常越靠前 |

例如，后端返回 `menuUrl: "goodsList"` 时，侧栏会执行：

```vue
<router-link :to="{ name: 'goodsList' }" />
```

因此本地路由必须存在同名配置：

```js
{
  path: 'goods',
  name: 'goodsList',
  component: () => import('@/views/commerce/goods/index.vue')
}
```

## 声明式菜单范围

`scripts/sync-admin-menu.mjs` 通过 `--scope` 选择需要同步的权限树。`commerce` 范围包含：

```text
产品管理 (#)
├─ 商品管理 (Get_Goods_GetGoodsList, appUrl=goodsList)
   ├─ 详情 (Get_Goods_GetGoodsDetail)
   │  ├─ 新增商品 (Post_Goods_AddGoods)
   │  └─ 编辑商品 (Post_Goods_EditGoods)
   └─ 启用/禁用 (Post_Goods_SetGoodsVerify)
├─ 图库管理 (Get_ProductImg_GetProductImgList, appUrl=productImageList)
│  ├─ 新增 (Post_ProductImg_AddProductImg)
│  ├─ 详情 (Get_ProductImg_GetProductImgDetail)
│  ├─ 编辑 (Post_ProductImg_EditProductImg)
│  └─ 启用/禁用 (Post_ProductImg_SetProductImgVerify)
└─ 图库分类 (Get_ProductImg_GetImgCategoryList, appUrl=imageCategoryList)
   ├─ 新增 (Post_ProductImg_AddImgCategory)
   ├─ 详情 (Get_ProductImg_GetImgCategoryDetail)
   ├─ 编辑 (Post_ProductImg_EditImgCategory)
   └─ 启用/禁用 (Post_ProductImg_SetImgCategoryVerify)

订单管理 (#)
└─ 订单管理 (Get_Order_GetOrderList, appUrl=orderList)
   └─ 详情 (Get_Order_GetOrderDetail)

AI配置 (#)
└─ AI配置列表 (Get_AiConfig_GetAiConfigList, appUrl=aiConfigList)
   ├─ 编辑 (Post_AiConfig_EditAiConfig)
   └─ 启用/禁用 (Post_AiConfig_SetAiConfigVerify)
```

树形层级遵循现有 `/Jurisdiction/getAdminAppliBySys?id=1` 返回结构；只有 `goodsList`、`productImageList`、`imageCategoryList`、`orderList` 和 `aiConfigList` 是左侧导航，其余节点只用于按钮/操作授权。侧栏当前只渲染分组下的一层导航，因此操作权限必须放在导航节点内部，不能再增加一层可见菜单。

`user-account` 范围只在现有 `Get_User_GetUserList` 节点下维护两个非导航权限，不会创建或改写用户管理父级：

```text
用户列表 (Get_User_GetUserList, appUrl=userList)
├─ 编辑用户账户 (Post_User_SetUserAccount)
└─ 账户操作日志 (Get_User_GetOperatUserAccountLog)
```

账户日志页面使用本地隐藏路由 `userAccountLogs`，2026-09-10 起只从用户列表工具栏进入（行级「账户日志」按钮已下线）；权限节点本身不展示为左侧菜单。同日下线可用星币列后，`Post_User_SetUserAccount` 在前端已经没有调用方，**但这两个权限节点与后端接口都保持原样**，脚本声明不动——删节点属于后台数据变更，需要单独指令。

`product-plant` 范围是 2026-08-24 新增的植物管理（对应功能清单「PC管理后台 → 运营管理 → 植物管理」）：

```text
运营管理 (#)
└─ 植物管理 (Get_ProductPlant_GetProductPlantList, appUrl=productPlant)
   ├─ 新增 (Post_ProductPlant_AddProductPlant)
   ├─ 详情 (Get_ProductPlant_GetProductPlantDetail)
   ├─ 编辑 (Post_ProductPlant_EditProductPlant)
   └─ 启用/禁用 (Post_ProductPlant_SetProductPlantVerify)
```

「运营管理」是分组节点（`appCode` 为 `#`），脚本按 `appName` 与 `aliases` 查重，
后端已存在同名分组时会直接复用。**执行 `--apply` 前必须先看只读预览**：
如果后端把植物管理归在别的分组下，或分组用了别的名字，先把该名字加进
`scripts/sync-admin-menu.mjs` 里 `productPlantMenuTree` 的 `aliases`，避免建出重复分组。
分组 `grade` 目前是 2，排在现有「产品管理 / 订单管理 / AI配置」之后，需要靠前就调高该值。

`checklist` 是智能花盆接口清单在本仓库的完整 PC 管理后台范围，推荐新环境直接使用：

```text
运营管理 (#)
├─ 植物管理 (Get_ProductPlant_GetProductPlantList, appUrl=productPlant)
│  └─ 新增 / 详情 / 编辑 / 启用禁用
├─ APP版本管理 (Get_AppVersion_GetAppVersionList, appUrl=appVersion)
│  └─ 详情 / 新增编辑 / 删除 / 启用禁用 / 设置权重
└─ 基础信息配置 (Get_Common_GetConfigDataList, appUrl=config)
   └─ 编辑 (Post_Common_SetConfigDataEdit)

系统管理 (#)
└─ 管理员权限 (Get_Jurisdiction_GetAdminSystems, appUrl=menuList)
   └─ 系统详情 / 新增编辑 / 启用禁用 / 查看员工 / 查询与绑定角色 /
      权限列表 / 设置权限 / 权限详情 / 删除权限
```

该范围会识别旧 APP 版本菜单的 `/Content/*` 权限码，并在 `--update` 下把已有节点迁移到
「运营管理」，不会重复创建。迁移完成后，脚本只在旧「APP管理」分组确实没有子节点时将其设为
非导航；不会删除节点，也不会隐藏仍含业务子项的分组。

> 后端状态核验（2026-08-25）：系统 `1` 先通过 `product-plant --apply` 新增 6 个节点，随后
> 通过 `checklist --apply --update` 新增 14 个节点、更新 7 个已有节点，并额外将迁移后为空的
> 旧「APP管理」分组设为非导航。最终只读预览 26 个声明节点均为“存在”且无配置差异，
> `/Jurisdiction/getLeftMenus` 返回「运营管理」下的植物管理、APP版本管理、基础信息配置，
> 以及「系统管理」下的管理员权限。普通角色仍需绑定权限并重新登录。

## 执行同步

脚本不会把 token 写入代码、配置或日志。请把当前管理员 `userToken` 临时放在进程环境变量中。

PowerShell：

```powershell
$env:BOLTFOX_USER_TOKEN = '<当前管理员 userToken>'

# 只读预览（默认，不会写后端）
npm run menu:sync:commerce

# 新增缺失节点；已有节点保持不变
npm run menu:sync:commerce -- --apply

# 推荐：同时修正旧版“商品管理/商品列表”等名称与权重
npm run menu:sync:commerce -- --apply --update

# 用户账户权限：预览、写入
npm run menu:sync:user-account
npm run menu:sync:user-account -- --apply

# 植物管理：预览、写入
npm run menu:sync:product-plant
npm run menu:sync:product-plant -- --apply

# 完整清单：先预览，再迁移旧节点并补齐缺失节点（推荐）
npm run menu:sync:checklist
npm run menu:sync:checklist -- --apply --update

Remove-Item Env:BOLTFOX_USER_TOKEN
```

其他系统可传入 `--system-id`：

```powershell
npm run menu:sync:commerce -- --system-id=2 --apply
```

脚本的安全特性：

- 默认是只读预览，必须显式传 `--apply` 才写入。
- `commerce`、`user-account`、`product-plant` 与 `checklist` 是独立范围；`checklist` 只维护功能清单内的 PC 管理后台节点。
- 在同一父节点下优先按 `appCode` 查重；编码为 `#` 的分组按 `appName` 查重。
- “产品管理”声明兼容旧版顶级名称“商品管理”，升级时不会重复创建分组；传入 `--update` 后会完成名称迁移。
- `checklist` 对已知旧 APP 版本权限码进行全树查重和安全迁移；旧空分组只改为非导航，不执行删除。
- 每次创建父节点后重新读取权限树，以真实后端 ID 创建子节点。
- 重复执行只会跳过已存在节点，不会重复插入。
- 默认不覆盖已有配置；只有显式传 `--update` 才会修正差异。

## 新模块复用步骤

1. 从 `https://api.yikaltd.com/v2/api-docs` 核对接口路径、HTTP 方法、入参和输出模型。
   （旧域名 `api.boltfox.cn` 已于 2026-08-03 停用；2026-08-25 曾临时改用 IP，2026-09-08 起改回域名，
   脚本的 `DEFAULT_API_BASE` 为 `https://api.yikaltd.com/ZoneAdmin`，可用 `BOLTFOX_API_BASE` 覆盖。）
2. 在 `src/api/<module>.js` 中新增请求封装；路径省略 `/ZoneAdmin`，由环境变量统一补齐。
3. 在 `src/router/routes.js` 注册列表和隐藏的详情/编辑路由，固定路由 `name`。
4. 在菜单同步脚本的适用 scope 中新增节点：导航节点的 `appUrl` 填路由 `name`；若是已有导航下的操作权限，使用 `parentCode` 定位父节点。
5. 页面按钮通过 `v-permission="['对应 appCode']"` 使用同一权限编码。
6. 先执行只读预览，再执行 `--apply`，最后重新读取权限树确认。
7. 非系统管理员需要在“角色管理 → 绑定权限”中勾选新增节点，并重新登录刷新 `getChildAppCodes` 与左侧菜单缓存。
8. 执行 `npm run build`，并在有 `.codegraph/` 的环境运行 `codegraph sync` 更新本地索引。

## 常见问题

### 菜单已创建但左侧不显示

- 检查 `appUrl` 是否与本地路由 `name` 完全一致，注意大小写。
- 检查菜单节点 `isNav` 是否为 `1`。
- 检查当前角色是否绑定了新增节点。
- 退出并重新登录，让顶部菜单、左侧菜单和 `childAppCodes` 重新加载。
- 本地没有同名路由时，侧栏会静默跳过该节点（开发环境 `console.warn` 一次）。已下线模块残留的菜单行属于这种情况，应在「菜单列表」里删除或置 `isNav=0`。

### 菜单可以点击但页面空白或跳转失败

- 本地路由可能尚未注册，或路由组件 import 路径错误。
- 父级路由与子级路由的 path 组合可能不正确。
- route `name` 与组件的 `<script setup name="...">` 应保持一致，以免 `keep-alive` 缓存异常。

### 按钮未显示

- `v-permission` 只检查 `getChildAppCodes` 返回值。
- 确认按钮编码与后端 `appCode` 完全一致，包括 `Get`/`Post` 大小写。
- 系统管理员由指令直接放行；普通管理员必须重新绑定角色权限。
