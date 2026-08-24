import request from '@/utils/request'

// 商品列表
export function getGoodsList(params) {
  return request({
    url: '/Goods/getGoodsList',
    method: 'get',
    params
  })
}

// 商品详情
export function getGoodsDetail(params) {
  return request({
    url: '/Goods/getGoodsDetail',
    method: 'get',
    params
  })
}

// 新增商品
export function addGoods(data) {
  return request({
    url: '/Goods/addGoods',
    method: 'post',
    data
  })
}

// 编辑商品
export function editGoods(data) {
  return request({
    url: '/Goods/editGoods',
    method: 'post',
    data
  })
}

// 商品启用/禁用
export function setGoodsVerify(data) {
  return request({
    url: '/Goods/setGoodsVerify',
    method: 'post',
    data
  })
}
