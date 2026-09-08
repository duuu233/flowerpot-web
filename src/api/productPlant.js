import request from '@/utils/request'

/**
 * 管理后台 - 植物管理（/ZoneAdmin/ProductPlant/*）
 *
 * 接口路径来自《智能花盆接口url功能列表清单.xlsx》（PC管理后台 → 运营管理 → 植物管理，2026.8.24）。
 * 与其他模块一致：路径省略公共前缀 /ZoneAdmin，由 VITE_APP_API_PREFIX 与请求层补齐；
 * 签名、randomString、userToken 由 src/utils/request.js 统一注入。
 *
 * 2026-08-25 已按 Swagger（https://api.yikaltd.com/v2/api-docs）和真实只读响应核对：
 * 列表返回 productPlantId 分页记录，详情使用 id 查询，状态接口提交 { id, verify }；
 * 新增/编辑共用 ProductPlantAddApiIn，编辑时额外提交 productPlantId。
 */

// 植物列表（分页）
export function getProductPlantList(params) {
  return request({
    url: '/ProductPlant/getProductPlantList',
    method: 'get',
    params
  })
}

// 植物详情
export function getProductPlantDetail(params) {
  return request({
    url: '/ProductPlant/getProductPlantDetail',
    method: 'get',
    params
  })
}

// 植物新增
export function addProductPlant(data) {
  return request({
    url: '/ProductPlant/addProductPlant',
    method: 'post',
    data
  })
}

// 植物编辑
export function editProductPlant(data) {
  return request({
    url: '/ProductPlant/editProductPlant',
    method: 'post',
    data
  })
}

// 植物启用/禁用
export function setProductPlantVerify(data) {
  return request({
    url: '/ProductPlant/setProductPlantVerify',
    method: 'post',
    data
  })
}
