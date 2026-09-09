# 侧栏过滤失效菜单，避免整块左侧菜单渲染中断

> 文档类型：Historical Change Record
> 日期：2026-09-09
> 环境：SSH 开发机
> 分支与起始版本：main / 690a70b
> 范围：`src/layout/components/Sidebar.vue`、文档
> 当前权威文档：`AI_CONTEXT.md`、`docs/dynamic-menu-sync.md`

## 背景与目标

用户点开顶部第二个系统（`getLeftMenus?parentMenuId=2`）后，左侧菜单整块不显示，控制台报：

```
Uncaught (in promise) Error: No match for {"name":"config","params":{}}
    at createRouterError (vue-router.js)
    at Object.resolve (vue-router.js)
    at ComputedRefImpl.fn (vue-router.js)
```

定位：`690a70b` 下线「系统配置」模块时删掉了本地路由 `name: 'config'`（原 `ums` 分组下的 `ums/config`），
但后端菜单表里「基础信息配置」那一行还在（`appUrl=config`，见 `docs/dynamic-menu-sync.md` 的 checklist 范围）。
菜单同步脚本只创建 / 更新、不删除后端菜单行，`690a70b` 的未完成项第 3 条已记过这笔待人工清理的账。

`Sidebar.vue` 直接把 `menuUrl` 当路由 `name` 交给 `RouterLink`，vue-router 4 解析不存在的命名路由会抛错。
这个 throw 发生在 `RouterLink` 的 computed 里，属于渲染期异常，`v-for` 整体中断，所以同分组其它菜单
一起消失，而不是只少一条。

本轮先做前端兜底：后端菜单脏一条不应该把整个侧栏打没。

## 变更内容

`Sidebar.vue` 渲染前先过滤接口数据，新增 `visibleMenus` computed：

- 子项有 `menuUrl` 但 `router.hasRoute(menuUrl)` 为 false 时丢弃，不进模板。
- 没有 `menuUrl` 的节点行为不变，仍渲染成不可点的纯文本。
- 原来散在模板里的 `hideItemList` / `hideSubItemList` 屏蔽逻辑一并收进这个 computed，模板只遍历 `visibleMenus`。
- 过滤后没有可见子项的分组整组不渲染（此前这种情况会留下一个孤立的分组标题）。
- 开发环境对每个失效 `menuUrl` 只 `console.warn` 一次（`warnedMenuUrls` 去重），方便对照着去后台清理；生产环境静默。

路由表在 `createRouter` 时由 `constantRouterMap.concat(asyncRouterMap)` 一次性全量注册，没有登录后 `addRoute`
的时机问题，`hasRoute` 在侧栏渲染时随时可用。

## 关键决策

- 只做前端过滤，不改后端菜单，也不恢复 `config` 路由：模块是产品要求下线的，页面不应该回来。
- 过滤放在渲染层而不是 `app` store 的 `setSidebarRight`：store 里 import router 会和 `router → permission → store`
  形成循环依赖，用组件内的 `useRouter()` 更安全。

## 外部操作

无。未调用任何后端写接口，未改后台菜单数据。

## 验证结果

- `NODE_OPTIONS=--max-old-space-size=1024 npx vite build` 通过，35.36s。
- 项目无 test / lint / type-check 脚本；**未在浏览器中实机验证**，等用户实测。

## 未完成项与风险

1. 后台「菜单列表」里已下线模块的菜单行（基础信息配置 / 用户产品图片 / 产品版本 / 用户产品列表）仍需人工清理或置 `isNav=0`；
   否则管理员在后台仍会看到实际打不开的菜单项，只是不再导致侧栏崩溃。
2. 过滤是静默的：菜单配错 `appUrl` 时生产环境不会有任何提示，只能靠开发环境的 warn 或后台核对发现。
3. 用户直接输入已删除页面的 hash 地址仍会走 vue-router 的未匹配处理，本轮不涉及。

## 回滚或恢复

`git revert` 本次提交即可回到原来的渲染方式；后端菜单行若已清理，回滚后也不会再报这个错。
