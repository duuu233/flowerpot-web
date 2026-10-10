# 文件管理

> 文档类型：当前接口与操作约定
> 状态：Active
> 最后核验：2026-10-10
> 来源：当前 https://api.yikaltd.com/v2/api-docs、真实只读响应、源码与菜单同步结果

## 页面与接口

「运营管理 → 文件管理」使用本地路由和组件名 `commonFile`，路径 `/sms/commonFile`。
分页复用 `usePagedList`，编辑直接回填列表记录（列表已返回所有可编辑字段，不调用不存在的详情接口）。

| 操作 | 方法 | 接口（公共前缀 /ZoneAdmin） | 权限码 |
| --- | --- | --- | --- |
| 列表 | GET | /CommonFile/getCommonFileList | Get_CommonFile_GetCommonFileList |
| 新增 | POST | /CommonFile/addCommonFile | Post_CommonFile_AddCommonFile |
| 编辑 | POST | /CommonFile/editCommonFile | Post_CommonFile_EditCommonFile |
| 删除 | POST | /CommonFile/delCommonFile | Post_CommonFile_DelCommonFile |

需求提供的列表路径 `ConmonFile` 与 Swagger 不同；已采用并实际只读验证 `CommonFile`。
认证与签名由请求层统一补齐，页面和接口模块不保存凭据。

## 字段约定

- 列表查询：pageIndex / pageSize、keyword（匹配文件名称或地址）、startDate / endDate；
  契约还支持 language，当前页面沿用后台默认语言。
- 列表响应：retData.pageData、recordCount；行字段 fileId、fileName、filePath、joinTime。
- 新增：fileName（去除首尾空白后 1–20 字符）、filePath（1–120 字符），不传 fileId。
- 编辑：相同字段并带当前行 fileId。
- 删除：传 id，值为当前行 fileId；确认后才请求，取消 / 关闭不删除。
- 地址作为文本输入，兼容后端允许的地址格式；仅 http / https 绝对地址显示为可打开的链接，
  其它内容作为纯文本显示。未在此模块扩展上传接口。

保存期间禁用重复提交、关闭和表单编辑；失败保留表单。新增后回到第一页，
编辑后刷新当前页，删除当前页最后一条时回退上一页。筛选重置同时清空关键词和日期。

## 菜单维护

系统 1 已复用「运营管理」并新增文件管理 + 三个操作节点，共 4 个；未更新已有节点。
随后只读复查无差异，getLeftMenus 已返回 commonFile。新环境使用
`npm run menu:sync:common-file` 先预览，再用 `-- --apply` 写入；完整 checklist 同样包含该模块。
普通角色须在角色管理勾选权限并重新登录刷新菜单。脚本不自动分配权限、不删除节点。

## 验证与边界

生产构建及 JavaScript 语法检查通过；真实文件列表只读请求验证分页和行模型，菜单同步及复查已完成。
浏览器交互验证使用隔离示例数据，实际结果见本次历史记录。
未对真实文件进行新增、编辑或删除，未发布或部署前端。
