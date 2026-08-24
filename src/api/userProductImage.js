import request from '@/utils/request'

export function getUserProductImgList(params) {
  return request({
    url: '/UserProductImg/getUserProductImgList',
    method: 'get',
    params
  })
}

export function getUserProductImgDetail(params) {
  return request({
    url: '/UserProductImg/getUserProductImgDetail',
    method: 'get',
    params
  })
}

export function addUserProductImg(data) {
  return request({
    url: '/UserProductImg/addUserProductImg',
    method: 'post',
    data
  })
}

export function editUserProductImg(data) {
  return request({
    url: '/UserProductImg/editUserProductImg',
    method: 'post',
    data
  })
}

export function deleteUserProductImg(data) {
  return request({
    url: '/UserProductImg/deleteUserProductImg',
    method: 'post',
    data
  })
}
