import request from '@/utils/request'

export function login(loginForm) {
  return request({
    url: '/jwt/login',
    method: 'post',
    data: loginForm
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}





+
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function startGeetest() {
  return request({
    url: '/geetest/startCaptcha?t=' + (new Date()).getTime(),
    method: 'get'
  })
}
