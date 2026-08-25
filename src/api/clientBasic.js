import axios from 'axios'

// 与后台接口同源：统一取 VITE_APP_API_ORIGIN，避免再写死域名/IP。
const apiOrigin = (import.meta.env.VITE_APP_API_ORIGIN || '').replace(/\/$/, '')

export const countryListTestUrl = `${apiOrigin}/Client/Basic/getCountryList`

// 测试客户端国家列表接口；不复用后台 /ZoneAdmin 请求实例及其签名拦截器。
export function getCountryListForTest() {
  return axios.get(countryListTestUrl, { timeout: 15000 })
}
