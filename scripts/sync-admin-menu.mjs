import { createHash } from 'node:crypto'

const SIGN_SALT = '8e808087-08b3-3e10-8e83-93bf078df4b2'
const DEFAULT_API_BASE = 'https://api.yikaltd.com/ZoneAdmin'

export const commerceMenuTree = [
  {
    appName: '产品管理',
    aliases: ['商品管理'],
    appCode: '#',
    appUrl: '#',
    grade: 5,
    isNav: 1,
    isRefresh: 0,
    children: [
      {
        appName: '商品管理',
        appCode: 'Get_Goods_GetGoodsList',
        appUrl: 'goodsList',
        grade: 3,
        isNav: 1,
        isRefresh: 0,
        children: [
          {
            appName: '详情',
            appCode: 'Get_Goods_GetGoodsDetail',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0,
            children: [
              {
                appName: '新增商品',
                appCode: 'Post_Goods_AddGoods',
                appUrl: '#',
                grade: 0,
                isNav: 0,
                isRefresh: 0
              },
              {
                appName: '编辑商品',
                appCode: 'Post_Goods_EditGoods',
                appUrl: '#',
                grade: 0,
                isNav: 0,
                isRefresh: 0
              }
            ]
          },
          {
            appName: '启用/禁用',
            appCode: 'Post_Goods_SetGoodsVerify',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          }
        ]
      },
      {
        appName: '图库管理',
        appCode: 'Get_ProductImg_GetProductImgList',
        appUrl: 'productImageList',
        grade: 2,
        isNav: 1,
        isRefresh: 0,
        children: [
          {
            appName: '新增',
            appCode: 'Post_ProductImg_AddProductImg',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '详情',
            appCode: 'Get_ProductImg_GetProductImgDetail',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '编辑',
            appCode: 'Post_ProductImg_EditProductImg',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '启用/禁用',
            appCode: 'Post_ProductImg_SetProductImgVerify',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          }
        ]
      },
      {
        appName: '图库分类',
        appCode: 'Get_ProductImg_GetImgCategoryList',
        appUrl: 'imageCategoryList',
        grade: 1,
        isNav: 1,
        isRefresh: 0,
        children: [
          {
            appName: '新增',
            appCode: 'Post_ProductImg_AddImgCategory',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '详情',
            appCode: 'Get_ProductImg_GetImgCategoryDetail',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '编辑',
            appCode: 'Post_ProductImg_EditImgCategory',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '启用/禁用',
            appCode: 'Post_ProductImg_SetImgCategoryVerify',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          }
        ]
      }
    ]
  },
  {
    appName: '订单管理',
    appCode: '#',
    appUrl: '#',
    grade: 4,
    isNav: 1,
    isRefresh: 0,
    children: [
      {
        appName: '订单管理',
        appCode: 'Get_Order_GetOrderList',
        appUrl: 'orderList',
        grade: 0,
        isNav: 1,
        isRefresh: 0,
        children: [
          {
            appName: '详情',
            appCode: 'Get_Order_GetOrderDetail',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          }
        ]
      }
    ]
  },
  {
    appName: 'AI配置',
    appCode: '#',
    appUrl: '#',
    grade: 3,
    isNav: 1,
    isRefresh: 0,
    children: [
      {
        appName: 'AI配置列表',
        appCode: 'Get_AiConfig_GetAiConfigList',
        appUrl: 'aiConfigList',
        grade: 0,
        isNav: 1,
        isRefresh: 0,
        children: [
          {
            appName: '编辑',
            appCode: 'Post_AiConfig_EditAiConfig',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '启用/禁用',
            appCode: 'Post_AiConfig_SetAiConfigVerify',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          }
        ]
      }
    ]
  }
]

export const productPlantMenuTree = [
  {
    // 分组节点：后端已存在同名（或 aliases 中任一名称）的分组时会直接复用，不会重复创建。
    // 若实际后端把植物管理挂在别的分组下，把该分组名加进 aliases 再执行预览即可。
    appName: '运营管理',
    aliases: ['运营', '运营中心'],
    appCode: '#',
    appUrl: '#',
    grade: 2,
    isNav: 1,
    isRefresh: 0,
    children: [
      {
        appName: '植物管理',
        appCode: 'Get_ProductPlant_GetProductPlantList',
        appUrl: 'productPlant',
        grade: 0,
        isNav: 1,
        isRefresh: 0,
        children: [
          {
            appName: '新增',
            appCode: 'Post_ProductPlant_AddProductPlant',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '详情',
            appCode: 'Get_ProductPlant_GetProductPlantDetail',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '编辑',
            appCode: 'Post_ProductPlant_EditProductPlant',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '启用/禁用',
            appCode: 'Post_ProductPlant_SetProductPlantVerify',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          }
        ]
      }
    ]
  }
]

export const checklistMenuTree = [
  {
    appName: '运营管理',
    aliases: ['运营', '运营中心'],
    appCode: '#',
    appUrl: '#',
    grade: 2,
    isNav: 1,
    isRefresh: 0,
    children: [
      {
        ...productPlantMenuTree[0].children[0],
        grade: 3
      },
      {
        appName: 'APP版本管理',
        appCode: 'Get_AppVersion_GetAppVersionList',
        legacyCodes: ['Get_Content_GetAppVersionList'],
        allowReparent: true,
        appUrl: 'appVersion',
        grade: 2,
        isNav: 1,
        isRefresh: 0,
        children: [
          {
            appName: '详情',
            appCode: 'Get_AppVersion_GetAppVersionDetail',
            legacyCodes: ['get_Content_GetAppVersionDetail'],
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '新增/编辑',
            appCode: 'Post_AppVersion_SetAppVersionEdit',
            legacyCodes: ['Post_Content_SetAppVersionEdit'],
            allowReparent: true,
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '删除',
            appCode: 'Post_AppVersion_SetAppVersionDelete',
            legacyCodes: ['Post_Content_SetAppVersionDelete'],
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '启用/禁用',
            appCode: 'Post_AppVersion_SetAppVersionVerify',
            legacyCodes: ['Post_Content_SetAppVersionVerify'],
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '设置权重',
            appCode: 'Post_AppVersion_SetAppVersionGrade',
            legacyCodes: ['Post_Content_SetAppVersionGrade'],
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          }
        ]
      },
      {
        appName: '基础信息配置',
        appCode: 'Get_Common_GetConfigDataList',
        appUrl: 'config',
        grade: 1,
        isNav: 1,
        isRefresh: 0,
        children: [
          {
            appName: '编辑',
            appCode: 'Post_Common_SetConfigDataEdit',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          }
        ]
      }
    ]
  },
  {
    appName: '系统管理',
    aliases: ['系统', '权限管理'],
    appCode: '#',
    appUrl: '#',
    grade: 1,
    isNav: 1,
    isRefresh: 0,
    children: [
      {
        appName: '管理员权限',
        appCode: 'Get_Jurisdiction_GetAdminSystems',
        appUrl: 'menuList',
        grade: 1,
        isNav: 1,
        isRefresh: 0,
        children: [
          {
            appName: '系统详情',
            appCode: 'Get_Jurisdiction_getAdminSystemsDetails',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '新增/编辑系统',
            appCode: 'Post_Jurisdiction_setAdminSystems',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '启用/禁用系统',
            appCode: 'Post_Jurisdiction_setAdminSystemsVerify',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '查看员工',
            appCode: 'Get_Jurisdiction_getAdminStaffBySys',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '查询绑定角色',
            appCode: 'Get_Jurisdiction_getRoleBySystem',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '绑定角色',
            appCode: 'Post_Jurisdiction_setAdminSystemBindRoles',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '权限列表',
            appCode: 'Get_Jurisdiction_getAdminAppliBySys',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '设置权限',
            appCode: 'Post_Jurisdiction_setAdminAppli',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '权限详情',
            appCode: 'Get_Jurisdiction_getAdminAppliDetails',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          },
          {
            appName: '删除权限',
            appCode: 'Post_Jurisdiction_setDelAdminAppli',
            appUrl: '#',
            grade: 0,
            isNav: 0,
            isRefresh: 0
          }
        ]
      }
    ]
  }
]

export const userAccountMenuNodes = [
  {
    appName: '编辑用户账户',
    appCode: 'Post_User_SetUserAccount',
    appUrl: '#',
    grade: 1,
    isNav: 0,
    isRefresh: 0
  },
  {
    appName: '账户操作日志',
    appCode: 'Get_User_GetOperatUserAccountLog',
    appUrl: '#',
    grade: 0,
    isNav: 0,
    isRefresh: 0
  }
]

const menuScopes = {
  commerce: {
    label: '商品、图库、订单与 AI 配置',
    parentCode: null,
    nodes: commerceMenuTree
  },
  'user-account': {
    label: '用户账户与账户日志',
    parentCode: 'Get_User_GetUserList',
    nodes: userAccountMenuNodes
  },
  'product-plant': {
    label: '运营管理与植物管理',
    parentCode: null,
    nodes: productPlantMenuTree
  },
  checklist: {
    label: '智能花盆后台对接清单',
    parentCode: null,
    nodes: checklistMenuTree,
    existingOnlyNodes: [
      {
        appName: 'APP管理',
        appCode: '#',
        appUrl: '#',
        grade: 1,
        isNav: 0,
        isRefresh: 0,
        requireEmpty: true
      }
    ]
  }
}

function parseOptions(args) {
  const options = {
    apply: false,
    update: false,
    scope: process.env.BOLTFOX_MENU_SCOPE || 'commerce',
    systemId: Number(process.env.BOLTFOX_SYSTEM_ID || 1),
    apiBase: process.env.BOLTFOX_API_BASE || DEFAULT_API_BASE,
    token: process.env.BOLTFOX_USER_TOKEN || ''
  }

  for (const argument of args) {
    if (argument === '--apply') options.apply = true
    else if (argument === '--update') options.update = true
    else if (argument.startsWith('--scope=')) {
      options.scope = argument.slice('--scope='.length)
    }
    else if (argument.startsWith('--system-id=')) {
      options.systemId = Number(argument.slice('--system-id='.length))
    } else if (argument.startsWith('--api-base=')) {
      options.apiBase = argument.slice('--api-base='.length)
    } else if (argument === '--help' || argument === '-h') {
      options.help = true
    } else {
      throw new Error(`未知参数：${argument}`)
    }
  }

  if (!Number.isInteger(options.systemId) || options.systemId < 1) {
    throw new Error('system-id 必须是大于 0 的整数')
  }
  if (options.update && !options.apply) {
    throw new Error('--update 必须与 --apply 一起使用')
  }
  if (!menuScopes[options.scope]) {
    throw new Error(`scope 必须是以下值之一：${Object.keys(menuScopes).join(', ')}`)
  }

  return options
}

function printHelp() {
  console.log(`
幂等同步管理后台菜单与操作权限

环境变量：
  BOLTFOX_USER_TOKEN   必填，当前管理员 userToken
  BOLTFOX_SYSTEM_ID    可选，默认 1
  BOLTFOX_API_BASE     可选，默认 ${DEFAULT_API_BASE}
  BOLTFOX_MENU_SCOPE   可选，默认 commerce

参数：
  --scope=<scope>      同步范围：commerce、user-account、product-plant 或 checklist
  --apply              实际新增缺失节点；省略时只预览
  --update             同时更新已存在但配置漂移的节点（必须搭配 --apply）
  --system-id=<id>     覆盖系统 ID
  --api-base=<url>     覆盖管理后台 API 根地址
  --help               显示帮助
`)
}

function createRandomString() {
  let value =
    new Date().toLocaleDateString().split('/').join('') +
    Math.floor(Math.random() * 10).toString()
  if (value.length === 7) {
    value += Math.floor(Math.random() * 10).toString()
  }
  return value
}

function createSignature(randomString) {
  return createHash('md5')
    .update(`${randomString}${SIGN_SALT}`)
    .digest('hex')
}

function createAdminClient(options) {
  const apiBase = options.apiBase.replace(/\/$/, '')

  async function request(path, requestOptions = {}) {
    const method = requestOptions.method || 'GET'
    const randomString = createRandomString()
    const authFields = {
      randomString,
      sign: createSignature(randomString),
      userToken: options.token
    }
    const url = new URL(`${apiBase}/${path.replace(/^\//, '')}`)
    const fetchOptions = {
      method,
      headers: { Accept: 'application/json' }
    }

    if (method === 'GET') {
      const params = { ...(requestOptions.params || {}), ...authFields }
      for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined && value !== '') {
          url.searchParams.set(key, String(value))
        }
      }
    } else {
      fetchOptions.headers['Content-Type'] = 'application/json'
      fetchOptions.body = JSON.stringify({
        ...(requestOptions.data || {}),
        ...authFields
      })
    }

    const response = await fetch(url, fetchOptions)
    const responseText = await response.text()
    let result
    try {
      result = JSON.parse(responseText)
    } catch (error) {
      throw new Error(`接口返回了非 JSON 数据（HTTP ${response.status}）`)
    }

    if (!response.ok || result.retCode !== 200) {
      throw new Error(result.retMsg || `接口请求失败（HTTP ${response.status}）`)
    }
    return result
  }

  return {
    getMenuTree(systemId) {
      return request('/Jurisdiction/getAdminAppliBySys', {
        params: { id: systemId }
      })
    },
    saveMenu(data) {
      return request('/Jurisdiction/setAdminAppli', {
        method: 'POST',
        data
      })
    }
  }
}

function getVirtualRoot(tree) {
  const root = tree.find(node => Number(node.id) === 0)
  return root || { id: 0, childs: tree }
}

function findNodeById(nodes, id) {
  for (const node of nodes || []) {
    if (Number(node.id) === Number(id)) return node
    const child = findNodeById(node.childs, id)
    if (child) return child
  }
  return null
}

function findNodeByCode(nodes, appCode) {
  for (const node of nodes || []) {
    if (node.appCode === appCode) return node
    const child = findNodeByCode(node.childs, appCode)
    if (child) return child
  }
  return null
}

function resolveScopeParent(root, scope) {
  if (!scope.parentCode) return root
  const parent = findNodeByCode([root], scope.parentCode)
  if (!parent) {
    throw new Error(`未找到同步范围的父节点权限：${scope.parentCode}`)
  }
  return parent
}

function findMatchingChild(parent, expected) {
  const children = parent?.childs || []
  if (expected.appCode !== '#') {
    const acceptedCodes = [expected.appCode, ...(expected.legacyCodes || [])]
    return children.find(node => acceptedCodes.includes(node.appCode)) || null
  }
  const acceptedNames = [expected.appName, ...(expected.aliases || [])]
  return children.find(node => acceptedNames.includes(node.appName)) || null
}

function findNodeEntryByCodes(nodes, acceptedCodes, parentId = 0) {
  for (const node of nodes || []) {
    if (acceptedCodes.includes(node.appCode)) {
      return { node, parentId: Number(parentId) }
    }
    const child = findNodeEntryByCodes(node.childs, acceptedCodes, node.id)
    if (child) return child
  }
  return null
}

function findRelocatableNode(root, expected) {
  if (!expected.allowReparent || expected.appCode === '#') return null
  const acceptedCodes = [expected.appCode, ...(expected.legacyCodes || [])]
  return findNodeEntryByCodes(root.childs, acceptedCodes, root.id)
}

function normalizedUrl(value) {
  if (value === null || value === undefined) return ''
  if (["''", '""', '“”', '‘’'].includes(String(value))) return ''
  return String(value)
}

function getDrift(node, expected, targetParentId, actualParentId = targetParentId) {
  const fields = ['appName', 'appCode', 'grade', 'isNav', 'isRefresh']
  const drift = fields.filter(field => String(node[field] ?? '') !== String(expected[field] ?? ''))
  if (normalizedUrl(node.appUrl) !== normalizedUrl(expected.appUrl)) drift.push('appUrl')
  if (Number(actualParentId) !== Number(targetParentId)) drift.push('parentId')
  return drift
}

function buildPayload(expected, parentId, systemId, id = 0) {
  return {
    id,
    parentId: Number(parentId),
    systemId,
    appName: expected.appName,
    appCode: expected.appCode,
    appUrl: expected.appUrl,
    grade: expected.grade,
    isNav: expected.isNav,
    isRefresh: expected.isRefresh
  }
}

function printPreview(root, parent, expectedNodes, depth = 0) {
  for (const expected of expectedNodes) {
    const local = parent ? findMatchingChild(parent, expected) : null
    const relocated = !local ? findRelocatableNode(root, expected) : null
    const existing = local || relocated?.node || null
    const actualParentId = local ? parent.id : relocated?.parentId
    const indent = '  '.repeat(depth)
    const marker = relocated ? '待迁移' : existing ? '存在' : '待新增'
    const drift = existing
      ? getDrift(existing, expected, parent?.id, actualParentId)
      : []
    const driftText = drift.length ? `（配置差异：${drift.join(', ')}）` : ''
    console.log(`${indent}- [${marker}] ${expected.appName} <${expected.appCode}>${driftText}`)
    printPreview(root, existing, expected.children || [], depth + 1)
  }
}

function printExistingOnlyPreview(root, expectedNodes) {
  if (!expectedNodes?.length) return
  console.log('\n旧节点收尾：')
  for (const expected of expectedNodes) {
    const existing = findMatchingChild(root, expected)
    if (!existing) {
      console.log(`- [不存在，跳过] ${expected.appName}`)
      continue
    }
    if (expected.requireEmpty && existing.childs?.length) {
      console.log(`- [仍有子节点，保留] ${expected.appName}`)
      continue
    }
    const drift = getDrift(existing, expected, root.id, root.id)
    const marker = drift.length ? '待更新' : '已处理'
    const driftText = drift.length ? `（配置差异：${drift.join(', ')}）` : ''
    console.log(`- [${marker}] ${expected.appName}${driftText}`)
  }
}

async function waitForCreatedNode(client, options, parentId, expected) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await client.getMenuTree(options.systemId)
    const root = getVirtualRoot(response.retData || [])
    const parent = Number(parentId) === 0
      ? root
      : findNodeById([root], parentId)
    const created = findMatchingChild(parent, expected)
    if (created) return created
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  throw new Error(`新增后未能找到菜单节点：${expected.appName}`)
}

async function syncNode(client, options, parentId, expected, depth, stats) {
  const response = await client.getMenuTree(options.systemId)
  const root = getVirtualRoot(response.retData || [])
  const parent = Number(parentId) === 0
    ? root
    : findNodeById([root], parentId)
  if (!parent) throw new Error(`未找到父节点 ID ${parentId}`)

  const indent = '  '.repeat(depth)
  let current = findMatchingChild(parent, expected)
  const relocated = !current ? findRelocatableNode(root, expected) : null
  const actualParentId = current ? parent.id : relocated?.parentId
  if (!current && relocated) current = relocated.node
  if (!current) {
    await client.saveMenu(buildPayload(expected, parentId, options.systemId))
    current = await waitForCreatedNode(client, options, parentId, expected)
    stats.created += 1
    console.log(`${indent}+ 已新增 ${expected.appName} <${expected.appCode}>`)
  } else {
    const drift = getDrift(current, expected, parentId, actualParentId)
    if (drift.length && options.update) {
      await client.saveMenu(
        buildPayload(expected, parentId, options.systemId, Number(current.id))
      )
      current = await waitForCreatedNode(client, options, parentId, expected)
      stats.updated += 1
      console.log(`${indent}~ 已更新 ${expected.appName}（${drift.join(', ')}）`)
    } else {
      stats.existing += 1
      const driftText = drift.length ? `，保留配置差异：${drift.join(', ')}` : ''
      console.log(`${indent}= 已存在 ${expected.appName}${driftText}`)
    }
  }

  for (const child of expected.children || []) {
    await syncNode(client, options, current.id, child, depth + 1, stats)
  }
}

async function syncExistingOnlyNode(client, options, expected, stats) {
  const response = await client.getMenuTree(options.systemId)
  const root = getVirtualRoot(response.retData || [])
  let current = findMatchingChild(root, expected)
  if (!current) {
    console.log(`= 不存在 ${expected.appName}，无需收尾`)
    return
  }
  if (expected.requireEmpty && current.childs?.length) {
    stats.existing += 1
    console.log(`= 保留 ${expected.appName}：仍有 ${current.childs.length} 个子节点`)
    return
  }

  const drift = getDrift(current, expected, root.id, root.id)
  if (drift.length && options.update) {
    await client.saveMenu(
      buildPayload(expected, root.id, options.systemId, Number(current.id))
    )
    current = await waitForCreatedNode(client, options, root.id, expected)
    stats.updated += 1
    console.log(`~ 已收尾 ${expected.appName}（${drift.join(', ')}）`)
    return
  }

  stats.existing += 1
  const driftText = drift.length ? `，保留配置差异：${drift.join(', ')}` : ''
  console.log(`= 已处理 ${expected.appName}${driftText}`)
}

async function main() {
  const options = parseOptions(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }
  if (!options.token) {
    throw new Error('请通过 BOLTFOX_USER_TOKEN 环境变量提供管理员 userToken')
  }

  const client = createAdminClient(options)
  const response = await client.getMenuTree(options.systemId)
  const root = getVirtualRoot(response.retData || [])
  const scope = menuScopes[options.scope]
  const scopeParent = resolveScopeParent(root, scope)

  console.log(`目标系统：${options.systemId}`)
  console.log(`同步范围：${scope.label}`)
  console.log(`执行模式：${options.apply ? '写入' : '只读预览'}`)

  if (!options.apply) {
    printPreview(root, scopeParent, scope.nodes)
    printExistingOnlyPreview(root, scope.existingOnlyNodes)
    console.log('\n未写入任何数据。确认后追加 --apply 执行。')
    return
  }

  const stats = { created: 0, updated: 0, existing: 0 }
  for (const node of scope.nodes) {
    await syncNode(client, options, scopeParent.id, node, 0, stats)
  }
  for (const node of scope.existingOnlyNodes || []) {
    await syncExistingOnlyNode(client, options, node, stats)
  }

  console.log(
    `\n同步完成：新增 ${stats.created}，更新 ${stats.updated}，已存在 ${stats.existing}。`
  )
  console.log('非系统管理员还需要在角色管理中绑定新增权限，重新登录后菜单生效。')
}

main().catch(error => {
  console.error(`菜单同步失败：${error.message}`)
  process.exitCode = 1
})
