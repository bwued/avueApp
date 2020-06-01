/**
 * 还款金
 */
import request from '@/utils/request'

const repay = {
  /* 查询用户所有失败计划*/
  listFailPlans(params) {
    return request({
      method: 'get',
      url: '/repay/listFailPlans',
      params: params
    })
  },
  /* 查询用户智慧金*/
  getZhihuijin(params) {
    return request({
      method: 'get',
      url: '/refund/user/a/get',
      params: params
    })
  },
  /* 查询智慧金明细*/
  getZhihuijinList(params) {
    return request({
      method: 'get',
      url: '/refund/repay/get',
      params: params
    })
  },
  /* 提取智慧金记录*/
  getZhihuijinTq(params) {
    return request({
      method: 'get',
      url: '/refund/withdrew/user/get',
      params: params
    })
  },
  /* 手动还款*/
  manualRepay(data) {
    return request({
      method: 'post',
      url: '/repay/manualRepay',
      data: data
    })
  },

  /* 确认提取智慧金*/
  zhjwithdraw(data) {
    return request({
      method: 'post',
      url: '/refund/withdraw',
      data: data
    })
  },
  /* 查询单个失败计划*/
  getSinglePlan(params) {
    return request({
      method: 'get',
      url: '/repay/getSinglePlan',
      params: params
    })
  }
}
export default repay
