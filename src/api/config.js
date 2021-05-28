import request from '@/itsoftUI/utils/request'
// 获取配置信息
const  baseUrl=process.env.NODE_ENV === 'production' ? '/account/' : '/'
export function getConfig() {
  return request({
    url: baseUrl+'config.json',
    method: 'get'
  })
}

