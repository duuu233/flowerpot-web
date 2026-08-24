import request from '@/utils/request'

// AI 配置列表
export function getAiConfigList(params) {
  return request({
    url: '/AiConfig/getAiConfigList',
    method: 'get',
    params
  })
}

// 编辑 AI 配置
export function editAiConfig(data) {
  return request({
    url: '/AiConfig/editAiConfig',
    method: 'post',
    data
  })
}

// AI 配置启用/禁用
export function setAiConfigVerify(data) {
  return request({
    url: '/AiConfig/setAiConfigVerify',
    method: 'post',
    data
  })
}
