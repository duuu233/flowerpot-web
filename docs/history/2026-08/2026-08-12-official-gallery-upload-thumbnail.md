# 官方图库上传时生成缩略图

> 文档类型：Historical Change Record
> 日期：2026-08-12
> 环境：本地工作区
> 分支与起始版本：`main` / `985d6a8`
> 范围：公共上传接口、官方图库新增/编辑表单、接口文档
> 当前权威文档：[`AI_CONTEXT.md`](../../../AI_CONTEXT.md)、[`接口接入进度`](../../api-integration-progress.md)、[`接口清单`](../../interface-list.md)

## 背景与目标

官方图库新增和编辑时，上传原图需要由后台同步生成缩略图。当前上传封装只提交 `fileParam`，图库表单也不会消费上传响应中的缩略图地址，编辑时更换原图还可能继续提交旧缩略图。

Swagger 于 2026-08-12 重新核对：`POST /ZoneAdmin/Common/setFileUpload` 接受可选 query 参数 `isUploadThumb`，`1` 表示生成缩略图；成功响应的 `BaseUploadApiOut` 同时提供 `url` 和 `urlThumb`。

## 变更内容

| 文件或模块 | 变更 |
| --- | --- |
| `src/api/oss.js` | `setFileUpload` 接受上传选项，并把 `isUploadThumb` 放入 query。 |
| `src/components/Upload/multiUpload.vue` | 新增语义化 `generateThumbnail` 属性；开启时传入 `isUploadThumb=1`。 |
| `ProductImageForm.vue` | 仅官方图库原图开启缩略图生成，并把返回的 `urlThumb` 同步到缩略图字段。 |
| `useProductImageForm.js` | 提交 `imgThumb` 时支持返回的 `urlThumb`，无缩略图时才回退原图。 |
| `AI_CONTEXT.md`、接口文档 | 写入新的当前契约和验证结果。 |

## 关键决策

- 不对所有上传调用全局追加参数，避免富文本、固件、用户图片和其他上传场景无意生成缩略图。
- 通用组件使用业务语义 `generateThumbnail`，接口参数名只保留在 API/上传实现边界。
- 更换官方图库原图时同步替换原有缩略图，防止编辑提交新原图和旧缩略图的组合。
- 自动生成的缩略图仍可通过独立上传框手动替换；后台未返回 `urlThumb` 时才使用原图 URL 兜底。

## 外部操作

只读获取 `https://api.boltfox.cn/v2/api-docs` 核对 Swagger。没有上传真实文件、调用后台写接口或使用登录凭证。

## 验证结果

- Swagger：确认 `isUploadThumb` 位于 query，取值 `0/1`；响应字段为 `urlThumb`。
- `node --check src/api/oss.js`：通过。
- `node --check src/views/commerce/productImage/useProductImageForm.js`：通过。
- `npm run build`：通过，Vite 转换 2,439 个模块；仅输出依赖中的 Rollup PURE 注释位置警告。
- `codegraph sync .`：同步 2 个已变更的可索引文件。
- `codegraph status .`：159 files、1,713 nodes、4,691 edges，索引为最新。
- 未执行登录后的真实图片上传；该操作会写入后台文件存储，需要在目标环境用测试图片人工验收。

## 未完成项与风险

- 需要在登录环境分别验证新增和编辑：请求 URL 包含 `isUploadThumb=1`、响应包含可访问的 `urlThumb`、最终 `addProductImg/editProductImg` 的 `imgThumb` 与新原图匹配。
- 缩略图尺寸和压缩策略由后台实现控制，当前 Swagger 未声明具体规格。

## 回滚或恢复

回退 `generateThumbnail` 属性、上传选项和图库表单同步逻辑即可恢复原行为；文档应同时回退，避免继续宣称自动生成缩略图。
