import request from '@/utils/request'

// 公共图库列表
export function getProductImgList(params) {
  return request({
    url: '/ProductImg/getProductImgList',
    method: 'get',
    params
  })
}

// 公共图库详情
export function getProductImgDetail(params) {
  return request({
    url: '/ProductImg/getProductImgDetail',
    method: 'get',
    params
  })
}

// 新增公共图库图片
export function addProductImg(data) {
  return request({
    url: '/ProductImg/addProductImg',
    method: 'post',
    data
  })
}

// 编辑公共图库图片
export function editProductImg(data) {
  return request({
    url: '/ProductImg/editProductImg',
    method: 'post',
    data
  })
}

// 公共图库图片启用/禁用
export function setProductImgVerify(data) {
  return request({
    url: '/ProductImg/setProductImgVerify',
    method: 'post',
    data
  })
}

// 图库分类列表
export function getImgCategoryList(params) {
  return request({
    url: '/ProductImg/getImgCategoryList',
    method: 'get',
    params
  })
}

// 图库分类详情
export function getImgCategoryDetail(params) {
  return request({
    url: '/ProductImg/getImgCategoryDetail',
    method: 'get',
    params
  })
}

// 新增图库分类
export function addImgCategory(data) {
  return request({
    url: '/ProductImg/addImgCategory',
    method: 'post',
    data
  })
}

// 编辑图库分类
export function editImgCategory(data) {
  return request({
    url: '/ProductImg/editImgCategory',
    method: 'post',
    data
  })
}

// 图库分类启用/禁用
export function setImgCategoryVerify(data) {
  return request({
    url: '/ProductImg/setImgCategoryVerify',
    method: 'post',
    data
  })
}
