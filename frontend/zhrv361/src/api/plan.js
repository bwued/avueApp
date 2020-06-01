/**
 * 计划
 */
import request from '@/utils/request'

const plan = {
  /* 制作计划科配置  todo */
  /* 入参: (groupName, functionName)
url:  -------> /market/switch/function/get
返回值:[{groupName, functionName, goRouter, backRouter, enable}]
  * */
  getFunction(params) {
    return request({
      method: 'get',
      url: '/market/switch/function/get',
      params: params
    })
  },
  /* 用户还款计划列表*/
  userRepayPlanList(params) {
    return request({
      method: 'get',
      url: '/repayment/plan/userRepayPlanList',
      params: params
    })
  },
  /* 智慧金--数字字典自动获取*/
  getRefundName(params) {
    return request({
      method: 'get',
      url: '/repayment/plan/refundName/user/get',
      data: params
    })
  },
  /* 制作计划--获取每天可还款笔数 1~3笔 todo 20200212 hgwn*/
  getRepayCount(params) {
    return request({
      method: 'post',
      url: '/repayment/plan/Count/Repay/Avail/get',
      data: params
    })
  },
  /* 自定义生成代还计划*/
  genCustom(data) {
    return request({
      method: 'post',
      url: '/repayment/plan/genCustom',
      data: data
    })
  },
  /* 添加计划*/
  addRepayPlan(data) {
    return request({
      method: 'post',
      url: '/repayment/plan/addRepayPlan',
      data: data
    })
  },
  /* 智能生成代还计划*/
  genIntelligent(data) {
    return request({
      method: 'post',
      url: '/repayment/plan/v2/genIntelligent',
      data: data
    })
  },
  /* 懒人计划*/
  genIntelligentV2(data) {
    return request({
      method: 'post',
      url: '/repayment/plan/v2/genLayzeRepayPlan',
      data: data
    })
  },
  /* 懒鬼计划 （自选通道）*/
  genIntelligentV3(data) {
    return request({
      method: 'post',
      url: '/repayment/plan/v2/genGhostRepayPlan',
      data: data
    })
  },
  /* 还款计划详情*/
  planDetail(tradeNo, params) {
    return request({
      method: 'get',
      url: '/repayment/plan/planDetail/' + tradeNo,
      params: params
    })
  },
  /* 代还限制*/
  repayConstraint(params) {
    return request({
      method: 'get',
      url: '/repayment/plan/repayConstraint',
      params: params
    })
  },
  /* 终止执行计划*/
  stopRepayPlan(params) {
    return request({
      method: 'get',
      url: '/repayment/plan/stopRepayPlan/' + params,
      params: params
    })
  },
  /* 代还渠道列表*/
  repayChannelList(params) {
    return request({
      method: 'get',
      url: '/repayment/plan/repayChannelList',
      params: params
    })
  },
  /* 渠道代还限制*/
  repayChannelConstraint(amount, channelCode) {
    return request({
      method: 'get',
      url: '/repayment/plan/v2/repayChannelConstraint/' + amount + '/' + channelCode
    })
  },
  /* 渠道代还限制*/
  repayChannelConstraintV2(amount, channelCode, params) {
    return request({
      method: 'get',
      url: '/repayment/plan/v2/repayChannelConstraint/' + amount + '/' + channelCode,
      params: params
    })
  },
  /* 自定义生成代还计划----新*/
  genCustomItem(data) {
    return request({
      method: 'post',
      url: '/repayment/plan/genCustomItem',
      data: data
    })
  },
  /* 删除执行计划*/
  deleteRepayPlan(params) {
    return request({
      method: 'get',
      url: '/repayment/plan/deleteRepayPlan/' + params,
      params: params
    })
  }
}
export default plan
