import request from '@/utils/request'

// 订单列表
export function getOrderList(params) {
  return request({
    url: '/Order/getOrderList',
    method: 'get',
    params
  })
}

// 订单详情
export function getOrderDetail(params) {
  return request({
    url: '/Order/getOrderDetail',
    method: 'get',
    params
  })
}
