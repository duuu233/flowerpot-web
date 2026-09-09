# 首页用户注册增长趋势改用 ECharts 柱状图

> 文档类型：Historical Change Record
> 日期：2026-09-09
> 环境：SSH 开发机
> 分支与起始版本：main / 61f8e76
> 范围：`src/views/home/index.vue`、`src/views/home/RegistrationTrendChart.vue`、`vite.config.js`、`package.json`、文档
> 当前权威文档：`AI_CONTEXT.md`

## 背景与目标

首页「用户注册增长趋势」原来是手写的横向条形列表：每行一个日期、一条按最大值算宽度的 `div` 进度条和一个人数。
用户要求改成柱状图，并同意必要时引入 ECharts。

## 变更内容

### 新增依赖

- `npm install echarts --save --no-package-lock`，装到 `echarts@^6.1.0`。
- **只写了 `package.json`**：`yarn.lock`、`pnpm-lock.yaml` 都没动，也没有新增 `package-lock.json`。
  仓库的主包管理器至今未确认（README 推荐 yarn，仓库里躺着 pnpm 和 yarn 两份锁文件），不适合由这次改动替它做决定。
  代价是**其他环境拉到本次提交后必须重新安装依赖**，锁文件里查不到 echarts。
- `vite.config.js` 的 `manualChunks` 增加 `echarts` / `zrender` 分支，单独拆包，不并进已经 1.1MB 的 `vendor`。

### 新增组件 `src/views/home/RegistrationTrendChart.vue`

- 按需引入：`echarts/core` + `BarChart` + `GridComponent` / `TooltipComponent` / `DataZoomComponent` + `CanvasRenderer`，
  不 import 整包。构建产物 `echarts` chunk 523.94 kB（gzip 178.09 kB）。
- 只接一个 `list` prop，就是 `getStatisticsUser` 的 `retData`（`[{ queryDate, userCount }]`），不自己发请求，
  周期切换仍由首页的 `statisticsQueryType` 控制。
- 柱子用品牌色竖向渐变（`--brand-400` → `--brand-500`）、顶部圆角、`barMaxWidth: 28`；文字和网格线颜色一律
  从 CSS 变量读（`cssVar()` 带兜底值），换配色时图表跟着走。
- `queryDate` 在 Swagger 里是「日期或周期」字符串，粒度由后端定：`YYYY-MM-DD` 显示成 `MM-DD`，`YYYY-MM` 显示成
  `N月`，其他串原样输出，配合 `hideOverlap` 避免标签打架。
- Y 轴 `minInterval: 1`，注册人数不会出现 0.5 这样的刻度。
- 数据点超过 40 个（近一年这种长周期）自动加 `inside` + `slider` 两个 dataZoom，默认停在最近 40 个点。
- `setOption(option, true)` 整份替换，避免切换周期后数据变短时残留旧柱子；`ResizeObserver` 跟随容器宽度
  `resize()`；`onBeforeUnmount` 里 `disconnect()` + `dispose()`。图表实例放普通变量而不是 `ref`，
  不让 Vue 的 Proxy 包住 echarts 内部对象。

### 首页 `src/views/home/index.vue`

- `trend-list` 那段 `v-for` 模板换成 `<RegistrationTrendChart v-if="statisticsList.length" :list="statisticsList" />`；
  空数据仍走原来的 `el-empty`，卡片头部的周期切换、`v-loading` 都不变。
- 删掉只为旧进度条服务的 `maxRegistrationCount` computed 和 `getBarWidth()`，以及
  `.trend-list` / `.trend-row` / `.trend-date` / `.trend-track` / `.trend-bar` / `.trend-count` 六段样式和
  媒体查询里的 `.trend-row` 覆盖。卡片本身的 `.trend-card` / `.trend-header` 样式保留。

## 关键决策

- 抽成独立组件而不是塞进 `index.vue`：首页已经 500 多行，且图表的生命周期管理（init / resize / dispose）
  和页面的数据加载是两回事。与 `productPlant` 的「容器 + 组件」拆法一致。
- 渐变色用 option 里的字面量对象而不是 `echarts.graphic.LinearGradient`，少依赖一个按需导出。
- 没有引入 `LegendComponent`、`TitleComponent`：卡片头部已经有标题，单系列也不需要图例。

## 外部操作

只读拉取 `https://api.yikaltd.com/v2/api-docs` 核对 `GET /ZoneAdmin/Common/getStatisticsUser` 契约：
入参 `queryType`（0 近一周 / 1 近一个月 / 2 近一年），出参 `StatisticsUserApiOut` = `queryDate`（日期或周期）+
`userCount`（注册数量）。未调用任何写接口。

## 验证结果

- `NODE_OPTIONS=--max-old-space-size=1024 npx vite build` 通过，44.13s；新增 `echarts` chunk 523.94 kB（gzip 178.09 kB）。
- 项目无 test / lint / type-check 脚本；**未在浏览器中实机验证**，等用户实测。

## 未完成项与风险

1. 近一年的实际粒度没有实测数据佐证：Swagger 只说 `queryDate` 是「日期或周期」。若后端按天返回 365 条，
   靠 dataZoom 兜住；若返回的是「第 N 周」这类中文串，标签会原样显示，需要按实际返回再调 `formatAxisLabel`。
2. 其他环境（家里 / 公司电脑）拉到本次提交后必须重新安装依赖，否则 `echarts` 找不到、构建失败。
3. 图表只做了浅色主题，项目当前也只有浅色；将来做深色模式时需要在 CSS 变量之外补 tooltip 背景等硬编码的白色。

## 回滚或恢复

`git revert` 本次提交可回到原来的条形列表；`package.json` 里的 echarts 依赖会一并回退，node_modules 可留着不动。
