import axios from 'axios'

export const countryListTestUrl =
  'https://api.yikaltd.com/Client/Basic/getCountryList'

// 测试客户端国家列表接口；不复用后台 /ZoneAdmin 请求实例及其签名拦截器。
export function getCountryListForTest() {
  return axios.get(countryListTestUrl, { timeout: 15000 })
}
