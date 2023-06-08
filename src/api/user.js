import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/cashier/login',
    method: 'post',
    data
  })
}

export function arealist() {
  return request({
    url: '/cashier/area/list',
    method: 'get',
  })
}
// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout() {
  return request({
    url: '/cashier/logout',
    method: 'post'
  })
}
