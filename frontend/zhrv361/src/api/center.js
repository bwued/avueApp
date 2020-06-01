/**
 * 个人中心模块接口列表
 */

import request from '@/utils/request'

const center = {
  /* 获取柱状图   2020 05 18*/
  getEcharts(params) {
    return request({
      method: 'get',
      url: '/daily/summary/getMonth',
      params
    })
  },
  /* 获取积分   2020 03 30*/
  getBalance(params) {
    return request({
      method: 'get',
      url: '/userPoints/balance',
      params
    })
  },
  /* 申请积分兑换   2020 03 30*/
  applyBalance(pointsAmount) {
    return request({
      method: 'POST',
      url: '/userPoints/apply/' + pointsAmount
    })
  },
  /* 获取订单列表*/
  getTradeList(params) {
    return request({
      method: 'get',
      url: '/trade',
      params
    })
  },
  /* 分润分页列表*/
  getProfitsList(params) {
    return request({
      method: 'get',
      url: '/market/profits',
      params
    })
  },
  /* 提成分页列表*/
  getWithdrawList(params) {
    return request({
      method: 'get',
      url: '/market/balance/withdrawal',
      params
    })
  },
  /* 获取奖金列表*/
  getBonusList(params) {
    return request({
      method: 'get',
      url: '/market/bonus',
      params
    })
  },
  /* 获取积分列表*/
  getPointsList(params) {
    return request({
      method: 'get',
      url: '/market/points',
      params
    })
  },
  /* 获取佣金列表*/
  getUpgradeList(params) {
    return request({
      method: 'get',
      url: '/market/profits/upgrade',
      params
    })
  },
  /* 获取用户信息*/
  getUserInfo() {
    return request({
      method: 'get',
      url: '/market/users/me'
    })
  },
  /* 实名认证  /user/auth*/
  authenticationBw(data) {
    return request({
      method: 'POST',
      url: '/authUser/cfca',
      data: data
    })
  },
  /* 实名认证  /user/auth*/
  authentication(data) {
    return request({
      method: 'POST',
      // url: '/user/auth/identify',
      url: '/auth/bank4Needs/hkj/auth', // 银行四要素
      data: data
    })
  },
  saveYskAuth(data) {
    return request({
      method: 'POST',
      url: '/user/yskAuth',
      data: data
    })
  },
  /* 获取用户实名认证的信息 /user/auth*/
  getAuthentication() {
    return request({
      method: 'get',
      url: '/user/auth/identify'
    })
  },
  /* 获取订单详情 /trade/{tradeNo}*/
  getOrderDetail(tradeNo) {
    return request({
      method: 'get',
      url: '/trade/' + tradeNo
    })
  },
  /* 修改密码 /user/password*/
  editPassword(data) {
    return request({
      method: 'put',
      url: '/user/password',
      data: data
    })
  },
  /* 发起提现 */
  x_postWithdrawal(data) {
    return request({
      method: 'post',
      url: '/market/balance/withdrawal/order',
      data: data
    })
  },
  /* 用户地址列表 */
  getUserAddress() {
    return request({
      method: 'get',
      url: '/user/deliveryAddress/list/me'
    })
  },
  /* 用户默认地址*/
  getDefaultAddress() {
    return request({
      method: 'get',
      url: '/user/deliveryAddress/default/get'
    })
  },
  /* 添加收货地址 */
  addUserAddress(data) {
    return request({
      method: 'post',
      url: '/user/deliveryAddress',
      data: data
    })
  },
  /* 编辑收货地址 */
  editUserAddress(data, id) {
    return request({
      method: 'put',
      url: '/user/deliveryAddress/' + id,
      data: data
    })
  },
  /* 删除用户地址 */
  delUserAddress(id) {
    return request({
      method: 'delete',
      url: '/user/deliveryAddress/' + id
    })
  },
  /* 设置默认地址 */
  setDefault(id) {
    return request({
      method: 'post',
      url: '/user/deliveryAddress/setDefault/' + id
    })
  },
  /* 提交agentId生成二维码 */
  postAgentId(agentId) {
    return request({
      method: 'post',
      url: '/market/agent/' + agentId + '/me'
    })
  },
  /* 获取代理二维码 */
  getqrcode() {
    return request({
      method: 'get',
      url: '/market/agent/me'
    })
  },
  /* 获取提现每日统计 */
  getWithdrawalDailyList(params) {
    return request({
      method: 'get',
      url: '/market/balance/withdrawal/dailyList',
      params
    })
  },
  /* 获取积分每日统计 */
  getPointsDailyList(params) {
    return request({
      method: 'get',
      url: '/market/points/dailyList',
      params
    })
  },
  /* 获取分润每日统计 */
  getProfitsDailyList(params) {
    return request({
      method: 'get',
      url: '/market/profits/dailyList',
      params
    })
  },
  /* 获取奖金每日统计 */
  getBonusDailyList(params) {
    return request({
      method: 'get',
      url: '/market/bonus/dailyList',
      params
    })
  },
  /* 获取佣金每日统计 */
  getUpgradeDailyList(params) {
    return request({
      method: 'get',
      url: '/market/rankUpgradeProfits/dailyReport',
      params
    })
  }
}

export default center
