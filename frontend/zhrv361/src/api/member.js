/**
 * 会员模块接口列表
 *
 */

import request from '@/utils/request'

const member = {
  /* 1.付费升级下单接口 --我的礼包 虚拟礼包 等级 2020/3*/
  userUpgrade(datas) {
    return request({
      method: 'POST',
      url: '/userUpgrade/order',
	  data:datas
    })
  },
  /* 会员中心费用信息 /market/rank/fee*/
  getMemberFeeMsg() {
    return request({
      method: 'get',
      url: '/market/rank/fee'
    })
  },
  /* 付费升级下单 /market/rank/upgrade/order (微信) */
  upgradeOrder(datas) {
    return request({
      method: 'POST',
      url: '/market/rank/upgrade/order',
      data: datas
    })
  },
  /* 付费升级下单 /market/rank/upgrade/order (快捷) */
  x_upgradeOrder(datas) {
    return request({
      method: 'POST',
      url: '/x/market/rank/upgrade/order',
      data: datas
    })
  },
  /* 获取团队情况 */
  getUserTeam() {
    return request({
      method: 'GET',
      url: '/market/team/me'
    })
  },
  /* 获取团队情况 */
  listUserDirectTeam(params) {
    return request({
      method: 'GET',
      url: '/market/team/list/firstChild',
      params
    })
  },
  /* 获取直推列表 */
  listMyDirectTeam(params) {
    return request({
      method: 'GET',
      url: '/market/team/list/firstChild/me',
      params // 有rankOrder就是分级（钻石 黄金。。。），没有则是该用户所有直推
    })
  },
  /* 等级列表信息 */
  getRankListMsg() {
    return request({
      method: 'get',
      url: '/market/rank'
    })
  },
  /* 积分升级团队成员*/
  upgradeUser(data) {
    return request({
      method: 'POST',
      url: '/market/rank/upgrade/points',
      data: data
    })
  }
}

export default member
