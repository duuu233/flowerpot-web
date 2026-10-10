# 运营管理新增文件管理

> 文档类型：Historical Change Record
> 日期：2026-10-10
> 环境：办公室
> 分支与起始版本：main / df9f74c
> 范围：文件管理接口、页面、路由、后端菜单与权限
> 当前权威文档：docs/common-file-management.md、docs/dynamic-menu-sync.md

## 背景与目标

在运营管理新增文件管理，支持列表、新增、编辑、删除，并复用声明式菜单脚本自动调用接口生成菜单。
当前 Swagger 的列表路径为 CommonFile/getCommonFileList，需求中的 ConmonFile 拼写与契约不一致。

## 变更内容

- src/api/commonFile.js 封装四个接口。
- src/views/sms/commonFile 的列表容器、筛选、表格、表单分别处理分页 / 接口、关键词与日期、记录与操作、编辑与校验。
- 路由 /sms/commonFile，路由名 / 组件名 commonFile；列表字段 fileId、fileName、filePath、joinTime。
- 新增不传 fileId，编辑带 fileId，删除提交 id；名字 1–20 字符，地址 1–120 字符，提交前 trim。
- 菜单脚本增加 common-file scope 与 npm 命令，完整 checklist 也包含文件管理。
- 更新当前上下文、文档入口、架构说明、接口进度、菜单指南和历史索引。

## 关键决策

- 按当前管理端 Swagger 接入，不使用需求中的 ConmonFile 路径。
- 列表返回所有编辑字段，直接回填，不额外添加详情接口或功能。
- 文件地址用文本输入，只为 HTTP / HTTPS 绝对地址提供打开链接，未扩展上传接口。
- 删除需确认，取消 / 关闭不请求；删掉当前页最后一条会退到上一页。
- 保存失败保留表单，保存期间禁止重复提交、编辑和关闭。
- 浏览器检查发现 reactive 模型 form 与同名 template ref 冲突，改为 fileForm 引用；修改后重新构建及浏览器复验。

## 外部操作

- 开始前当前 main 成功 pull --ff-only origin main；原有 dist.zip 经授权仅暂存、同步后立即恢复。
- 读取当前 https://api.yikaltd.com/v2/api-docs，核验四个管理后台文件端点及模型。
- 使用当次临时凭据只读预览系统 1 菜单，确认运营管理已存在；只新增文件管理 + 新增 / 编辑 / 删除，共 4 节点，更新 0。
- 再次只读预览全部存在且无差异；getLeftMenus 已返回运营管理下的 commonFile。
- 真实 getCommonFileList 请求成功，分页与行字段一致；未输出或记录业务记录、认证参数。

## 验证结果

- node --check：新 API、路由、菜单脚本通过。
- npm run build：通过，最终构建 29.46 秒；依赖中既有 PURE 注释告警不影响产物。
- 隔离本地示例浏览器验证：入口、列表、分页、必填、20 / 120 长度限制、新增不带 ID、编辑回填 / 带 ID、保存失败保留数据并恢复操作、取消删除无请求、确认删除使用 id、第二页最后一条删除回退第一页。
- 实际示例请求日志核验关键词按地址查询、日期 startDate / endDate 和重置后清空筛选。
- 最终表单引用修正后刷新页面再验证必填；CodeGraph sync / status 最新，diff 格式及新增内容信息隔离检查通过。

## 未完成项与风险

- 未对真实文件做新增、编辑或删除，真实写接口仅核对契约；交互增删改使用本地示例数据。
- 普通角色需绑定新增权限后重新登录；没有自动给角色分配权限。
- 前端尚未部署；原有未提交 dist.zip 保持原状，未纳入提交，未重新打 ZIP。

## 回滚或恢复

代码可回退本轮提交。后端新增四节点可在菜单管理按本次权限码定位处理；回退前端时可先将文件管理设为非导航。
本次没有更新或删除原有菜单，没有调整角色绑定。
