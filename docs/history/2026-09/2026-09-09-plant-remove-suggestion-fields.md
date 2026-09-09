# 植物资料删除四条建议字段

> 文档类型：Historical Change Record
> 日期：2026-09-09
> 环境：SSH 开发机
> 分支与起始版本：main / c140b26
> 范围：`src/views/sms/productPlant/ProductPlantFormDialog.vue`、文档
> 当前权威文档：`AI_CONTEXT.md`、`docs/api-integration-progress.md`

## 背景与目标

产品要求在植物资料的新增 / 编辑 / 详情页面删除四个字段：光照建议、需水建议、空气温度建议、湿度建议。
这四个字段是 2026-09-08（`60eee3a`）随植物分类一起加的，只存在了一天。

## 变更内容

三种模式共用 `ProductPlantFormDialog.vue`，改一处即三处生效。删除 `lightingSuggestions`、`waterSuggestion`、
`temperatureSuggestion`、`humiditySuggestion` 的全部代码：

- `defaultForm()` 里的四个初始值，以及注释中关于「四条建议是纯文案」的描述。
- `rules` 里四条 150 字长度校验和它们的选填说明注释。
- `buildPayload()` 里的四个提交字段：**新增和编辑都不再提交这四个字段**。
- 模板里四个 `el-col :span="6"` 表单项。
- 「植物分类」原来和四条建议并排占 `:span="6"`，四条删掉后同行只剩它一个窄块，改为 `:span="12"`，
  与同区的「浇水频率」「生长特点」对齐。

`categoryType`（植物分类）**保留**：它下发进设备 DP 161（`plant_type`），是设备侧养护策略的输入，不在本次删除范围内。

## 关键决策

- **彻底删除，不保留「原样回传」**。此前「所属产品」和产品表单精简七字段时都保留了详情回填后原样回传，
  避免清空后端已有数据；这次不需要，理由见下一节：后端契约里根本没有这四个字段。

## 外部操作

只读拉取 `https://api.yikaltd.com/v2/api-docs` 核对契约，**确认整份 Swagger 里没有任何 `*Suggestion*` 字段**：

- `ProductPlantAddApiIn`（新增 / 编辑共用）属性只有：`alias`、`careInstructions`、`categoryType`、
  `difficultyMaintenance`、`growthCharacteristics`、`introduction`、`lightingRequirements`、`optimalHumidity`、
  `optimalTemperature`、`plantImg`、`plantName`、`productPlantId`、`scientificName`、`tuYaRemark`、
  `userToken`、`wateringFrequency`。
- `ProductPlantDetailApiOut`、`ProductPlantApiOut` 同样没有这四个字段。

也就是说这四个输入框从加上那天起就是空转的：填了存不进去，详情也回不来。删除同时消除了这个「以为填了其实没生效」的坑。
未调用任何写接口。

## 验证结果

- `NODE_OPTIONS=--max-old-space-size=1024 npx vite build` 通过，43.60s。
- `grep` 复查 `src/` 下四个字段名与四个中文标签均已归零。
- 项目无 test / lint / type-check 脚本；**未在浏览器中实机验证**，等用户实测。

## 未完成项与风险

1. 若后端后续真的补上了这四个字段并要求前端提交，需要重新加回表单项与 payload；本文件和 `60eee3a`
   的历史记录可作为恢复依据。
2. 若某个环境的后端版本与线上 Swagger 不一致、已经存了这四个字段的数据，本次改动之后这些值在管理后台
   既看不到也改不了（数据本身不受影响，前端不提交就不会覆盖）。

## 回滚或恢复

`git revert` 本次提交即可恢复四个字段与校验；恢复前建议先确认后端契约是否已经支持。
