/**
 * 登录模块接口列表
 */

import request from '@/utils/request'

const login = {
  /* 用户登录*/
  loginFun(data) {
    return request({
      method: 'POST',
      url: '/anonymous/login',
      data: data
    })
  },
  /* */
  smsConfirmPay(data) {
    return request({
      method: 'POST',
      url: '/trade/smsConfirmPay',
      data: data
    })
  },
  /* 用户注册*/
  userRegister(data) {
    return request({
      method: 'POST',
      url: '/anonymous/register',
      data: data
    })
  },
  /* 获取验证码*/
  getCode(data) {
    return request({
      method: 'POST',
      url: '/anonymous/sms/code',
      data: data
    })
  },
  /* 重置密码*/
  retrievePassword(data) {
    return request({
      method: 'POST',
      url: '/anonymous/password/retrieve',
      data: data
    })
  },
  /* 检查更新
  * http://120.79.74.34:6062/upgrade/swagger-ui.html#/upgrade-controller/getVersionUsingPOST
  * */
  checkUpApp(data) {
    return request({
      method: 'POST',
      url: '/upgrade/version/get',
      data: data
    })
  },
  /*
  * 1.获取用户分享的qrcode url
  * */
  getQrcodeUrl(data) {
    return request({
      method: 'POST',
      url: '/user/qrcode/user/get',
      data: data
    })
  },
  /* 获取显示配置*/
  getclientTextShowConfig(params) {
    return request({
      method: 'GET',
      url: '/market/clientTextShowConfig/get',
      params
    })
  }

}

export default login
