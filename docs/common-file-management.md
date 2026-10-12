# 表情列表

> 文档类型：当前接口与操作约定
> 状态：Active
> 最后核验：2026-10-12（文案与显示）；接口和真实只读数据核验仍为 2026-10-10
> 来源：源码与产品命名要求；接口沿用此前 Swagger 和真实只读响应核验

## 页面与接口

「运营管理 → 表情列表」使用本地路由和组件名 `commonFile`，路径 `/sms/commonFile`。
页面、筛选、列表、表单、成功/失败提示及删除确认统一称为表情；表单标题为「新增表情」「编辑表情」。
分页复用 `usePagedList`，编辑直接回填列表记录（列表已返回所有可编辑字段，无独立详情接口）。

| 操作 | 方法 | 接口（公共前缀 /ZoneAdmin） | 权限码 |
| --- | --- | --- | --- |
| 列表 | GET | /CommonFile/getCommonFileList | Get_CommonFile_GetCommonFileList |
| 新增 | POST | /CommonFile/addCommonFile | Post_CommonFile_AddCommonFile |
| 编辑 | POST | /CommonFile/editCommonFile | Post_CommonFile_EditCommonFile |
| 删除 | POST | /CommonFile/delCommonFile | Post_CommonFile_DelCommonFile |

原需求列表路径 `ConmonFile` 与 Swagger 不同；采用此前实际只读验证的 `CommonFile`。
认证与签名由请求层统一补齐，页面和接口模块不保存凭据。模块更名不修改接口、路由或权限标识。

## 字段约定

- 列表查询：pageIndex / pageSize、keyword（表情名称或地址）、startDate / endDate；契约还支持 language，页面沿用后台默认语言。
- 列表响应：retData.pageData、recordCount；行字段 fileId、fileName、filePath、joinTime。
- 显示名称：「表情名称」对应 fileName，「表情地址」对应 filePath；内部字段保留。
- 新增：fileName 必填且最长 20 字符，提交上传返回的原始名称，不截断或重命名；filePath 为 1–120 字符，不传 fileId。
- 编辑：相同字段并带当前行 fileId。
- 删除：传 id，值为当前行 fileId；确认后才请求，取消 / 关闭不删除。
- 地址作为文本输入，仅 http / https 绝对地址显示为可打开链接，其它地址作为纯文本；上传自动回填后仍可编辑地址。

## 上传与原始名称

「上传表情」复用 `POST /Common/setFileUpload`（公共前缀 /ZoneAdmin），multipart 的 `fileParam` 传文件，查询参数 `isSaveOldFileName=1` 保留原始文件名。
成功从 retData 的文件结果取 name → fileName、url → filePath，兼容既有上传结果标准化；缺少名称时使用所选文件的原始名称。

表情名称始终只读，包括编辑回填的存量名称；通过重新上传更换，不允许手工改名。新增必须先上传取得名称。
上传失败或响应缺少地址时保留原值；上传期间禁用保存、取消、再次上传、地址编辑及关闭弹窗。
上传不自动保存表情记录，仍需保存调用新增或编辑接口。名称或地址超过现有后端字段限制时阻止提交，不截断规避。
原始名称参数仅本模块传 1，其它上传和缩略图调用保持原行为。

保存期间防止重复提交、关闭和表单编辑；失败保留表单。新增回第一页，编辑刷新当前页，删除最后一行时回退上一页；重置清空关键词和日期。

## 菜单维护

系统 1 于 2026-10-10 创建了此前称为「文件管理」的菜单和三个操作节点。现有 commonFile 和四个权限码继续复用。
2026-10-12 本地路由及菜单声明改为「表情列表 / 新增表情 / 编辑表情 / 删除表情」；侧栏对 commonFile 使用路由标题显示，因此后端保留旧名称时也会立即显示新文案，且不修改原菜单数据或影响其它菜单。

本轮没有改写远端菜单。需要同步后台节点名称时，先执行 `npm run menu:sync:common-file` 预览，再执行 `npm run menu:sync:common-file -- --apply --update`；更新已有节点而非重复创建。
普通角色仍需原操作权限，脚本不自动分配权限、不删除节点。

## 验证与边界

2026-10-12 生产构建和 JavaScript 语法检查通过；实际首页、侧栏隔离 SSR 核对两项统计、欢迎文案、旧菜单名兼容、其它菜单与原数据保留、稳定权限码及新操作名称通过。
渲染检查仅验证输出文本和数据边界，未启动真实页面会话或请求后端；原 radio 用 label 充当 value 的 Element Plus 弃用提示仍存在。
2026-10-10 的真实只读列表、菜单核验及上传参数/交互验收见历史记录；本轮未重复操作真实数据。未真实上传、新增、编辑、删除、远端菜单写入或部署。
