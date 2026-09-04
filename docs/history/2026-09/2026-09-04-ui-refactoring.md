# 基于 SKILL.md 与 LOGO 配色的项目视觉风格与交互体验全面重构

> 文档类型：Historical Change Record
> 日期：2026-09-04
> 环境：Windows 本机开发环境
> 分支与起始版本：main / d1da0bf
> 范围：全局样式系统、布局导航、公共组件与核心页面
> 当前权威文档：`AI_CONTEXT.md`、`docs/README.md`、`SKILL.md`

## 背景与目标

依据用户指令要求，仔细阅读项目文档 `AGENTS.md`、`AI_CONTEXT.md`、`SKILL.md`（Anti-Slop 前端品味与极简实用设计规范），结合 `src/assets/images/logo.png` 的真实色彩与产品定位（YSplanter 智能花盆硬件与运维管理后台），对全站进行“简约大气、不失美观、通透呼吸”的视觉与交互重构，并在全程保持中文规范。

## 变更内容

### 1. LOGO 色彩提取与全局样式系统
- **色阶与对比度重构 (`src/styles/variables.scss`, `src/styles/index.scss`)**：
  - 对 `logo.png` 提取柔和薄荷浅端 `#c7e3d8`、天青中端 `#86bfc0` 与青绿主体 `#48999f`，色相锁定在 185°。
  - 主色设为 `#20656c`，白字在其上对比度达到 5.8:1，全面满足 WCAG AA 无障碍标准；
  - 建立色相浸润的环境微阴影体系（`--app-shadow-*`），彻底清理低透明度纯黑阴影；
  - 加入全局超薄极简植物学滚动条（6px 平滑圆角轨道与呼吸悬停态）；
  - 全局注入触觉微物理按压反馈（`:active { transform: translateY(1px) scale(0.982); }`）与输入框光环聚焦（`box-shadow: 0 0 0 1px var(--brand-500) inset, 0 0 0 3px rgba(32, 101, 108, 0.14)`）。

### 2. 布局与顶栏、侧边栏、标签页 (`src/layout/`)
- **主布局容器 (`src/layout/index.vue`)**：优化背景为轻盈环境光微渐变（极低透明度薄荷环境色），页面过渡更自然；
- **顶栏 (`src/layout/components/TopNav.vue`)**：
  - 增加 LOGO 旁 "YSplanter / 管理中心" 品牌文字组合，提升系统统一形象；
  - 导航项增加渐变高光指示条（呼应 LOGO 薄荷至青绿）；
  - 头像与通知铃铛加入更优雅的悬停微动效；
- **左侧导航栏 (`src/layout/components/Sidebar.vue`)**：
  - 栏目小标题指示条升级为青绿渐变细条；
  - 激活二级菜单项优化为浅薄荷微胶囊底色搭配青绿描边与文字；
- **多标签栏 (`src/layout/components/TagsView/index.vue`)**：
  - 升级为毛玻璃磨砂半透工具栏（`backdrop-filter: blur(12px)`）；
  - 激活标签采用白底微凸起胶囊卡片搭配微型脉冲指示圆点，右键菜单融入微阴影与圆角。

### 3. 公共基础组件 (`src/components/`)
- **`PageSection/index.vue`**：标题区增加方形浅色微倒角图标衬底，层次清晰；
- **`PageHeader/index.vue`**：强化面包屑卡片的圆角、微边框与呼吸感；
- **`SearchPanel/index.vue`**：消除表单底部多余间距，右侧按钮组严格对齐；
- **`PaginationBar/index.vue`**：分页按钮增加微圆角与品牌悬停色，与表格底部无缝衔接。

### 4. 核心特色视图 (`src/views/`)
- **登录页面 (`src/views/login/index.vue`)**：
  - 双层微光外壳（Double-Bezel）卡片，融入高斯模糊毛玻璃与立体质感；
  - 居中展示官方 `logo.png` 品牌标志与微阴影，搭配大气的文字排版；
  - 输入框与主登录按钮增加触觉按压反馈与平滑交互。
- **首页仪表盘 (`src/views/home/index.vue`)**：
  - 欢迎卡片加入动态时段问候语（“早上好 / 下午好 / 晚上好”）与在线状态指示环；
  - 便当盒 Bento 风格的 5 块指标卡片，支持等宽数字排版与悬停微上浮；
  - 用户注册趋势条优化为青绿渐变进度条与交互悬浮高亮行。
- **404 页面 (`src/views/404.vue`)**：
  - 优化居中节奏感、环境光晕与大标题字距。

### 5. 第二阶段：去线条化与苹果（Apple）官网大气极简风格二次重构
- **核心诉求**：解决首次重构中“样式过度、线条过多、视觉杂乱”的问题，脱离原约束，对标 Apple 官网/macOS 纯净大气设计语言。
- **变量与表面体系 (`variables.scss`, `index.scss`)**：
  - 画布底色设为 Apple 标志性极简冷灰 `$pageBg: #f5f5f7`，表面采用纯白 `$surface: #ffffff`，形成纯净开阔的留白分层。
  - 边框采用隐形微级 `$border: rgba(0, 0, 0, 0.04)`，彻底消除厚重黑线与彩色发光描边。
  - 字体采用炭黑 `#1d1d1f` 与冷灰 `#86868b`，卡片圆角扩展至 16px 温润微弧（Squircle）。
- **顶栏 (`TopNav.vue`)**：
  - 升级为黑曜石雾面通透顶栏（`rgba(22, 22, 23, 0.88)` + `backdrop-filter: saturate(180%) blur(20px)`）。
  - **彻底移除** 导航高亮项底部的发光彩色线条（Neon Bar），改为纯净平滑文字高光。
  - 移除右侧分隔竖线与强对比阴影，打造通透极简质感。
- **侧边栏 (`Sidebar.vue`, `sidebar.scss`)**：
  - **彻底删除** 分组标题左侧彩色竖线 `<i class="line" />`；
  - **彻底删除** 菜单项目之间的 `border-bottom` 分割线，改用 Apple macOS Settings 风格的排版节奏与静默次级字号；
  - 激活项采用无边框的软圆角浅胶囊底色（`rgba(32, 101, 108, 0.09)`），悬停采用自然微灰底。
- **标签页 (`TagsView/index.vue`)**：
  - 采用 Apple 分段控件（Segmented Control）药丸式卡片设计；
  - **彻底删除** 激活标签内部的荧光绿点（`::before`）与彩色边框，以白色浮起微卡片呈现焦点，极富呼吸感。
- **公共组件 (`PageHeader`, `PageSection`)**：
  - 去除图标周围的渐变背景色块与彩色线框，保留纯净矢量图标，突出版面标题层级。
- **登录页面 (`login/index.vue`)**：
  - 去除双层外壳嵌套（Double-Bezel），重构为 Apple 产品发布会风格的单层居中高透磨砂悬浮卡片；
  - 去除 LOGO 容器的倾斜抖动与厚重渐变阴影，突出极简品牌辨识度。
- **首页 (`home/index.vue`)**：
  - 欢迎横幅去线条化，简化微胶囊状态，采用纯净等宽数字与 6px 极细微进度条；
  - Bento 卡片悬停去除发光彩色外圈，采用 Apple 标准微浮动阴影。

### 6. 第三阶段：用户细节反馈优化（菜单层级、列表边框重叠、操作按钮与图标色彩）
- **左侧一级菜单层级重构 (`Sidebar.vue`)**：
  - 调整 `.title` 一级菜单（如用户管理、产品管理、系统管理）字号提升至 `13.5px`，字重加粗至 `650`，颜色采用深炭黑 `var(--app-ink)`，外边距增加呼吸留白；
  - 二级子菜单采用 `12.5px`、字重 `450`、次级灰 `#555558`，形成极强的一二级主从层级秩序，解决了“一级字号比二级还小、像附录”的问题。
- **列表页面边框与边距重叠彻底消除 (`index.scss`, `ListToolbar/index.vue`)**：
  - `PaginationBar`（`.pagination-container`）改为独立浮动卡片（`margin-top: 12px`），四角统一为 16px 圆角且带有独立完整微边框，彻底消除过去粘连在表格底部导致圆角切线与缺少顶边框的重叠断裂感；
  - `.table-container` 消除 VXETable 自身的外层 `.vxe-table--borderLine`，消除双重边框；
  - 表格整体间距、内边距严格规范化。
- **操作栏布局与新增按钮图标高亮 (`ListToolbar/index.vue`, `PageSection/index.vue`, `index.scss`)**：
  - 重构 `ListToolbar`：操作按钮区（如“新增产品”、“导出用户”等）直接紧随左侧标题排列（`gap: 10px; margin-left: 16px;`），符合用户聚焦直觉；
  - 修复 `PageSection` 深度选择器 `.page-section__header :deep(.el-icon)` 污染插槽按钮内部图标颜色的 bug（之前导致绿色背景上的图标也被染成绿色而“隐形”）；
  - 全局强化 `.el-button--primary` 内部所有图标（`.el-icon`, `svg`, `i`）的样式规则：强制纯白高亮 `color: #ffffff !important; fill: #ffffff !important;`，确保在深青绿底色上 100% 清晰可见。
- **登录页清理测试功能 (`login/index.vue`)**：
  - 彻底移除“测试国家列表接口”按钮及其关联的 `handleCountryApiTest` 方法、`countryApiTesting` 响应式变量、`getCountryListForTest` API 引用及 `.login-footer-actions` 样式，使登录页保持最纯净的 Apple ID 式沉浸登录体验。

## 关键决策

1. **去线条化（De-lineation）**：界面层级不靠到处画线与彩色边框区分，转而依靠大面积留白（Whitespace）、微弱明度差与平滑柔和的软阴影自然分层，回归苹果官网的大气典雅。
2. **坚持无障碍与对比度优先**：LOGO 浅绿色虽然清爽，但文字对比度不足。因此遵循设计工程规范，浅色仅用于背景底衬与微渐变指示条，真正承载文字和主按钮的颜色均严格保证可读性（> 5.5:1）。
3. **遵循单色系原则与形状一致性锁**：全站卡片统一 16px，控件统一 8px，徽章 6px，全站只保留一个青绿主色相作为画龙点睛的行动点，杜绝杂乱的渐变与色调跳跃。
4. **零业务侵入**：不改变任何 Pinia 状态树、路由鉴权、请求签名或现有接口参数。

## 外部操作

无外部 API 或系统配置改动。

## 验证结果

- `npm run build`：成功构建通过（最新耗时 19.49s），零警告报错。
- `codegraph sync .`：成功增量同步变更文件（3 个文件，14 个节点）。
- `codegraph status .`：验证状态正常（166 文件，1849 节点，5075 关联，全绿通过）。

## 未完成项与风险

- 遗留的已弃用模块（如 `UserProductImg` 等）未在此次视觉重构中进行删除，依然遵循项目原有事实边界。
- 部署到生产或远程环境时，前端刷新即可见全新视觉效果，无需改动后端接口。

## 回滚或恢复

若需回滚本次视觉与交互重构，可使用 Git 恢复本次提交前的状态：
```bash
git checkout d1da0bf -- src/
```
