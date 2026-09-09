# 植物资料删除养护建议字段

> 文档类型：Historical Change Record
> 日期：2026-09-09
> 环境：SSH 开发机
> 分支与起始版本：main / 4b8bd13
> 范围：`src/views/sms/productPlant/ProductPlantFormDialog.vue`、文档
> 当前权威文档：`AI_CONTEXT.md`
> 关联：[`2026-09-09-plant-remove-suggestion-fields.md`](2026-09-09-plant-remove-suggestion-fields.md)

## 背景与目标

紧接着删除四条建议字段，产品要求「养护建议」（`careInstructions`）在植物资料的新增 / 编辑 / 详情里也不再需要。

与四条建议不同，`careInstructions` 是后端契约里真实存在的字段：`ProductPlantAddApiIn` 收它，
`ProductPlantDetailApiOut` 和 `ProductPlantApiOut` 都返回它，线上很可能已经有数据。花盆 APP 侧在
2026-09-08（`2903cf7`）已经把首页「今日养护」改成按设备状态轮播的本地中英文案，不再读后台这个字段。

## 变更内容

- 删除模板里 `:span="24"` 的养护建议文本域，以及 `rules` 里 `requiredTextRule('养护建议', 5000)` 这条**必填**校验。
  删掉必填是这次的关键副作用：此前不填养护建议无法保存，现在新增植物不再被它卡住。
- `defaultForm()` 里的 `careInstructions: ''` **保留**，`buildPayload()` 里的 `careInstructions` 也**保留**，两处都加了注释说明原因。

## 关键决策

- **界面删除，提交保留原样回传**，与「所属产品」`productId` 和 2026-09-08 产品表单精简七字段的处理一致：
  `resetForm()` 是 `Object.assign(formData, defaultForm(), data)`，详情返回的养护建议仍会进 `formData`，
  保存时原样回传，**编辑老植物不会把后端已有的养护建议清空**；新增时该值为空串，会被 `cleanPayload` 过滤掉，
  不出现在请求体里。
- 这与上一轮四条建议的「彻底删除」口径不同，原因就是后端契约有没有这个字段：四条建议后端根本不收，
  养护建议后端收且可能有存量数据。

## 外部操作

无。本轮沿用上一轮刚核对过的 Swagger 结论，未再调用接口，也未做任何写操作。

## 验证结果

- `NODE_OPTIONS=--max-old-space-size=1024 npx vite build` 通过，43.84s。
- `grep` 复查：`src/` 下 `careInstructions` 只剩 `defaultForm` 承接与 `buildPayload` 回传两处（均为有意保留），
  界面与校验中已无「养护建议」。
- 项目无 test / lint / type-check 脚本；**未在浏览器中实机验证**，等用户实测。

## 未完成项与风险

1. 管理后台从此看不到也改不了养护建议，存量数据只能在后端 / 数据库维护。若产品之后要「能看不能改」，
   需要单独加只读展示。
2. 如果确实要连提交也一并去掉（让后端把该字段置空），把 `buildPayload()` 里的 `careInstructions` 一行删掉即可，
   但要先确认后端 `EditProductPlant` 对缺省字段的处理是「不更新」还是「置空」。
3. APP 端已改本地文案，本次改动不影响 APP 展示；若将来 APP 要改回读后台字段，需要连带恢复这个表单项。

## 回滚或恢复

`git revert` 本次提交即可恢复表单项与必填校验。
