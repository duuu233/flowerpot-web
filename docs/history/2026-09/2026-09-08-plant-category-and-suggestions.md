# 植物资料新增分类与四条建议字段

> 文档类型：Historical Change Record
> 日期：2026-09-08
> 环境：SSH 开发机
> 分支与起始版本：main / d0b64b1
> 当前权威文档：[AI_CONTEXT.md](../../../AI_CONTEXT.md)

## 背景与变更

植物列表进入的新增 / 编辑 / 详情弹窗（`ProductPlantFormDialog.vue`，三种模式共用同一个表单）新增五个字段，放在「生长与养护」分区：

| 字段 | 标签 | 控件 | 说明 |
| --- | --- | --- | --- |
| `categoryType` | 植物分类 | 下拉（1/2/3） | 1 水培、2 适中、3 耐旱 |
| `lightingSuggestions` | 光照建议 | 单行输入，≤150 | 纯展示文案 |
| `waterSuggestion` | 需水建议 | 单行输入，≤150 | 纯展示文案 |
| `temperatureSuggestion` | 空气温度建议 | 单行输入，≤150 | 纯展示文案 |
| `humiditySuggestion` | 湿度建议 | 单行输入，≤150 | 纯展示文案 |

处理口径：

- **五个都是选填**。既有植物资料没有这些值，设成必填会卡住老数据的编辑保存；APP 侧对分类缺失也有明确兜底（取不到就不下发分类），空着不会出错。
- 提交沿用既有的 `cleanPayload`：空串 / null 直接不出现在请求体里，不会把空值写进后端。
- 详情模式跟其余字段一样走 `:disabled="isDetail"` 只读。
- 回填不需要额外代码：`resetForm` 是 `Object.assign(formData, defaultForm(), data)`，后端详情返回同名字段即自动填入。

⚠️ **`categoryType` 不只是展示字段**：APP 端把它下发进设备 DP 161（`plant_type`，枚举 `1`/`2`/`3`），是设备侧养护策略的输入。填错会直接影响设备行为，范围外的值 APP 会当作没配。

⚠️ `humiditySuggestion` 的中文标签取「湿度建议」。需求原文写的是「温度建议」，但字段名是 humidity、且同批已有 `temperatureSuggestion`（空气温度建议），按字段名定标签；如果产品确实要叫「温度建议」，改这一处 label 即可。

## 同步与验证

修改前在当前 main 分支执行 `git pull --ff-only`，未切分支。本机（SSH 开发机）无 CodeGraph 索引，未执行索引同步。

- `npm run build`：通过，2430 个模块，31.89s。
- 未做登录后台的人工验收：新增/编辑/详情三种模式的实际回填与提交、下拉枚举落库值，都还没在真实后端上验证过。

## 外部操作与回滚

本轮无部署、无接口写操作。需要恢复时 revert 本次提交。
