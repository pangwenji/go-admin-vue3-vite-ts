
import request from '../utils/request'

export interface loginParams {
  username: String;
  password: String;
  rememberMe: boolean;
  code: String;
  uuid: String;
}

// 获取验证码
export  const getCodeImg=()=> {
    return request({
      url: '/api/v1/captcha',
      method: 'get'
    })
}

export const login = (data: loginParams) => {
  return request({
    url: '/api/v1/login',
    method: 'post',
    data
  })
}


// 查询 此接口不在验证数据权限
export const  getSetting =()=> {
  return request({
    url: '/api/v1/app-config',
    method: 'get'
  })
}

