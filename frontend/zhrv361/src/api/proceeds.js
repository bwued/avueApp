/**
 * 收款模块接口列表
 */

import request from '@/utils/request'

const proceeds = {
  /* 获取渠道*/
  getChannel(params) {
    return request({
      method: 'get',
      url: '/channel',
      params: params
    })
  },
  getChannelDetail(channelId) {
    return request({
      method: 'get',
      url: '/channel/' + channelId
    })
  },
  /* 获取结算页面 /trade/settle*/
  getSettle(data) {
    return request({
      method: 'post',
      url: '/trade/settle',
      data: data
    })
  },
  /* 支付 /trade/pay*/
  tradePay(data) {
    return request({
      method: 'post',
      url: '/trade/pay',
      data: data
    })
  },
  /* 获取支付方式 */
  getPayProvider() {
    return request({
      method: 'get',
      url: '/trade/pay/provider'
    })
  },
  /* 城市列表 */
  getCityList() {
    return request({
      method: 'get',
      url: '/trade/geo/city'
    })
  },
  /* 获取渠道行业列表 */
  getIndustryList(params) {
    return request({
      method: 'get',
      url: '/trade/geo/industry',
      params: params
    })
  }

}

export default proceeds
