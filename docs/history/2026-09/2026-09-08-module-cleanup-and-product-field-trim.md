# 下线四个模块，精简产品与植物表单字段

> 文档类型：Historical Change Record
> 日期：2026-09-08
> 环境：SSH 开发机
> 分支与起始版本：main / 7bb1f8b
> 范围：`src/router/routes.js`、`src/views/sms/{userProductList,userProductImage,productVersion}`、`src/views/ums/config`、`src/api/{productVersion,userProductImage,config}.js`、`src/views/sms/productPlant/*`、`src/views/sms/productList/*`、`scripts/sync-admin-menu.mjs`、文档
> 当前权威文档：`AI_CONTEXT.md`、`docs/api-integration-progress.md`

## 背景与目标

产品要求下线四个不再使用的模块，并精简产品与植物表单里用不到的字段。

## 变更内容

### 下线模块（含新增/编辑/详情）

- **用户设备**（路由 `userProductList`，菜单名「用户产品列表」）、**用户产品图片**（`userProductImage`）、**产品版本**（`productVersion` + 详情）、**系统配置**（`ums/config`，即「基础配置 → 系统配置」）：路由、页面目录、以及只服务于它们的接口封装 `api/productVersion.js`、`api/userProductImage.js`、`api/config.js` 一并删除；`api/productList.js` 里只被「用户设备」列表用到的 `getUserProductList` 也删了。
- `scripts/sync-admin-menu.mjs` 去掉「基础信息配置」节点（appUrl 指向已删除的 `config`）。脚本只创建/更新菜单，**不会删除后端已有的菜单行**，后台那几条需要人工清理。
- **产品列表保留**（用户本轮确认），只按下一节精简字段。

### 植物管理去掉「所属产品」

表单（新增/编辑/详情共用 `ProductPlantFormDialog`）删掉「所属产品」下拉与它的必填规则；列表页的同名筛选项、表格列以及为它拉产品下拉的 `loadProducts` 一并删除——字段既然不能再设置，留着筛选和列只会让人以为还能用。提交体仍保留 `productId` 字段：编辑既有植物时原样回传，不会把后端已有的归属清空。

### 产品表单精简

- 新增/编辑/详情去掉：形状类型、屏幕方向、尺寸(cm)（宽/高）、广播ID、轮播间隔(分钟)、横向旋转度数、竖向旋转度数，连同它们的校验规则、选项数组与尺寸样式。
- 列表去掉「形状」「尺寸(cm)」两列。
- **编辑时这些值不丢**：详情返回的字段仍会进入 `formData` 并在保存时原样回传，只是界面上不再展示。新增时不再提交它们。

## 关键决策

- 产品列表第 1 条与第 3 条互相矛盾（一个说删模块、一个说改它的编辑页），已与用户确认：**保留模块、只精简字段**。
- 「系统设置」经用户确认是「基础配置 → 系统配置」，即 `ums/config`。

## 外部操作

只读拉取 `https://api.yikaltd.com/v2/api-docs` 核对接口契约，未调用任何写接口。

## 验证结果

- `npx vite build`（`NODE_OPTIONS=--max-old-space-size=1024`）通过，31.92s。
- 项目无 test / lint / type-check 脚本；页面未在浏览器中实机验证。

## 未完成项与风险

1. **平台邮箱**：系统配置页下线后，「基础信息配置」只能在后端/数据库维护；APP 的「意见反馈」仍从 `/Client/Basic/getBasicData` 读取，不受影响。
2. **广播ID**：它是后台产品与涂鸦 PID 的映射来源，界面上去掉后，新建产品不会再提交这个字段；若后端把它当必填，新增会失败——需要后端确认，或改由后端/数据库维护。
3. 后台已存在的菜单行（用户产品图片、产品版本、基础信息配置等）需要人工在「菜单列表」里清理。
4. 植物表单不再提交新的 `productId`；若后端把它当必填，新增植物会失败，需要后端确认。

## 回滚或恢复

四个模块与两处字段精简互相独立，`git revert` 本次提交即可整体恢复。
