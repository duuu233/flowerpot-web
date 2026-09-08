import request from '@/utils/request'

// 产品列表
export function getProductList(params) {
  return request({
    url: '/Product/getProductList',
    method: 'get',
    params
  })
}

// 产品详情
export function getProductDetail(params) {
  return request({
    url: '/Product/getProductDetail',
    method: 'get',
    params
  })
}

// 产品启用/禁用
export function setProductVerify(data) {
  return request({
    url: '/Product/setProductVerify',
    method: 'post',
    data
  })
}

// 产品新增
export function addProduct(data) {
  return request({
    url: '/Product/addProduct',
    method: 'post',
    data
  })
}

// 产品编辑
export function editProduct(data) {
  return request({
    url: '/Product/editProduct',
    method: 'post',
    data
  })
}

// 常见问题列表
export function getProductFaqList(params) {
  return request({
    url: '/Product/getProductFaqList',
    method: 'get',
    params
  })
}

// 常见问题详情
export function getProductFaqDetail(params) {
  return request({
    url: '/Product/getProductFaqDetail',
    method: 'get',
    params
  })
}

// 常见问题启用/禁用
export function setProductFaqVerify(data) {
  return request({
    url: '/Product/setProductFaqVerify',
    method: 'post',
    data
  })
}

// 常见问题新增
export function addProductFaq(data) {
  return request({
    url: '/Product/addProductFaq',
    method: 'post',
    data
  })
}

// 常见问题编辑
export function editProductFaq(data) {
  return request({
    url: '/Product/editProductFaq',
    method: 'post',
    data
  })
}
