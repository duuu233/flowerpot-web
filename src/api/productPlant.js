import request from '@/utils/request'

/**
 * 管理后台 - 植物管理（/ZoneAdmin/ProductPlant/*）
 *
 * 接口路径来自《智能花盆接口url功能列表清单.xlsx》（PC管理后台 → 运营管理 → 植物管理，2026.8.24）。
 * 与其他模块一致：路径省略公共前缀 /ZoneAdmin，由 VITE_APP_API_PREFIX 与请求层补齐；
 * 签名、randomString、userToken 由 src/utils/request.js 统一注入。
 *
 * 入参与返回字段尚未按 Swagger（http://120.25.227.36:8601/v2/api-docs）核对：
 * 本机访问该域名被阿里云 ICP 备案拦截，暂时取不到机器可读契约。
 * 因此这里只固定「路径 + HTTP 方法」，具体字段由调用方按 Swagger 传入。
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
