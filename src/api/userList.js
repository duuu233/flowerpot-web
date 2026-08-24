import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/User/getUserList',
    method: 'get',
    params
  })
}

export function getUserDetail(params) {
  return request({
    url: '/User/getUserDetail',
    method: 'get',
    params
  })
}

export function getUserListExcel(params) {
  return request({
    url: '/User/getUserListExcel',
    method: 'get',
    params
  })
}

export function getOperatUserAccountLog(params) {
  return request({
    url: '/User/getOperatUserAccountLog',
    method: 'get',
    params
  })
}

export function setUserVerify(data) {
  return request({
    url: '/User/setUserVerify',
    method: 'post',
    data
  })
}

export function setUserInfo(data) {
  return request({
    url: '/User/setUserInfo',
    method: 'post',
    data
  })
}

export function setUserAccount(data) {
  return request({
    url: '/User/setUserAccount',
    method: 'post',
    data
  })
}
