import request from '@/utils/request'

export function getConfigDataList(params) {
  return request({
    url: '/Common/getConfigDataList',
    method: 'get',
    params
  })
}

export function setConfigDataEdit(data) {
  return request({
    url: '/Common/setConfigDataEdit',
    method: 'post',
    data
  })
}
