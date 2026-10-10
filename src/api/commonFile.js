import request from '@/utils/request'

// 当前 Swagger 的列表路径为 CommonFile，沿用与增删改一致的拼写。
export function getCommonFileList(params) {
  return request({ url: '/CommonFile/getCommonFileList', method: 'get', params })
}

export function addCommonFile(data) {
  return request({ url: '/CommonFile/addCommonFile', method: 'post', data })
}

export function editCommonFile(data) {
  return request({ url: '/CommonFile/editCommonFile', method: 'post', data })
}

export function delCommonFile(data) {
  return request({ url: '/CommonFile/delCommonFile', method: 'post', data })
}
