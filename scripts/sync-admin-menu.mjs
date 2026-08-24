import { createHash } from 'node:crypto'

const SIGN_SALT = '8e808087-08b3-3e10-8e83-93bf078df4b2'
const DEFAULT_API_BASE = 'https://api.boltfox.cn/ZoneAdmin'

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
  --scope=<scope>      同步范围：commerce 或 user-account
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
    return children.find(node => node.appCode === expected.appCode) || null
  }
  const acceptedNames = [expected.appName, ...(expected.aliases || [])]
  return children.find(node => acceptedNames.includes(node.appName)) || null
}

function normalizedUrl(value) {
  if (value === null || value === undefined) return ''
  if (["''", '""', '“”', '‘’'].includes(String(value))) return ''
  return String(value)
}

function getDrift(node, expected) {
  const fields = ['appName', 'appCode', 'grade', 'isNav', 'isRefresh']
  const drift = fields.filter(field => String(node[field] ?? '') !== String(expected[field] ?? ''))
  if (normalizedUrl(node.appUrl) !== normalizedUrl(expected.appUrl)) drift.push('appUrl')
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

function printPreview(parent, expectedNodes, depth = 0) {
  for (const expected of expectedNodes) {
    const existing = parent ? findMatchingChild(parent, expected) : null
    const indent = '  '.repeat(depth)
    const marker = existing ? '存在' : '待新增'
    const drift = existing ? getDrift(existing, expected) : []
    const driftText = drift.length ? `（配置差异：${drift.join(', ')}）` : ''
    console.log(`${indent}- [${marker}] ${expected.appName} <${expected.appCode}>${driftText}`)
    printPreview(existing, expected.children || [], depth + 1)
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
  if (!current) {
    await client.saveMenu(buildPayload(expected, parentId, options.systemId))
    current = await waitForCreatedNode(client, options, parentId, expected)
    stats.created += 1
    console.log(`${indent}+ 已新增 ${expected.appName} <${expected.appCode}>`)
  } else {
    const drift = getDrift(current, expected)
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
    printPreview(scopeParent, scope.nodes)
    console.log('\n未写入任何数据。确认后追加 --apply 执行。')
    return
  }

  const stats = { created: 0, updated: 0, existing: 0 }
  for (const node of scope.nodes) {
    await syncNode(client, options, scopeParent.id, node, 0, stats)
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
