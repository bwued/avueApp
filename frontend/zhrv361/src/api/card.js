/**
 * 银行卡模块接口列表
 * cardType 银行卡类型  ：CREDIT 信用卡  DEBIT 储蓄卡
 * cardId
 */

import request from '@/utils/request'

const card = {
  /* 解绑银行卡*/
  deleteCard(cardId, cardType) {
    return request({
      method: 'DELETE',
      url: '/trade/cards/' + cardId + '/' + cardType
    })
  },
  /* 编辑银行卡*/
  editCard(cardId, cardType, data) {
    return request({
      method: 'PUT',
      url: '/trade/cards/' + cardId + '/' + cardType,
      data: data
    })
  },
  x_editCard(cardId, cardType, data) {
    return request({
      method: 'PUT',
      url: '/x/trade/cards/' + cardId + '/' + cardType,
      data: data
    })
  },
  /* 部分编辑银行卡*/
  partEditCard(cardId, cardType, data) {
    return request({
      method: 'PATCH',
      url: '/trade/cards/' + cardId + '/' + cardType,
      data: data
    })
  },
  /* 获取银行卡列表*/
  getCardList(cardType) {
    return request({
      method: 'get',
      url: '/trade/cards/' + cardType
    })
  },
  /* 获取推荐通道列表 20200603*/
  getChannel(cardId) {
    return request({
      method: 'get',
      url: '/repayment/recommend/channel/' + cardId
    })
  },

  /* 根据银行卡id 获取银行卡信息 20200603*/
  getCredItInfo(cardId) {
    return request({
      method: 'get',
      url: '/trade/cards/CREDIT/' + cardId
    })
  },
  /* 获取自选通道列表 20200603*/
  getListCode(creditCardId) {
    return request({
      method: 'get',
      url: '/repayment/recommend/channelList/' + creditCardId
    })
  },
  /* 获取推荐自选通道 20200603*/
  getZxChannel(creditCardId) {
    return request({
      method: 'get',
      url: '/repayment/recommend/channelList/' + creditCardId
    })
  },
  /* 绑定银行卡*/
  bindCard(cardType, data) {
    return request({
      method: 'POST',
      url: '/trade/cards/' + cardType,
      data: data
    })
  },
  x_bindCard(cardType, data) {
    return request({
      method: 'POST',
      url: '/x/trade/cards/' + cardType,
      data: data
    })
  },
  /* TODO  检查信用卡在该渠道是否进行绑卡 》 套现专用  /trade/cards/{cardId}/{channelCode}  cardId 卡id channelCode 渠道代码*/
  txCheck(channelCode, cardId, cardType) {
    return request({
      method: 'POST',
      url: '/trade/cards/tx/check/' + channelCode + '/' + cardId + '/' + cardType
    })
  },
  /* 绑定银行卡*/
  authBindCard(cardType, data) {
    return request({
      method: 'POST',
      url: '/trade/card/auth/bind/' + cardType,
      data: data
    })
  },
  /* 查询渠道绑卡状态 /trade/cards/{cardId}/{channelCode}  cardId 卡id channelCode 渠道代码*/
  demandChannelCard(cardType, cardId, channelCode) {
    return request({
      method: 'POST',
      url: '/trade/cards/binding/' + cardType + '/' + cardId + '/' + channelCode
    })
  },
  /* 渠道绑卡 /trade/cards/{cardType}/{cardId}/{channelCode} cardType 卡类型 CREDIT, DEBIT   cardId 卡id channelCode 渠道代码*/
  bindChannelCard(cardType, cardId, channelCode) {
    return request({
      method: 'POST',
      url: '/trade/cards/binding/' + cardType + '/' + cardId + '/' + channelCode
    })
  },

  /* 检查是否签约接口 signType = 3 汇卡通道 lhwsoft 19/12*/
  bbbindChannelCard(channelCode, cardId, cardType) { //
    return request({
      method: 'POST',
      url: '/trade/cards/check/' + channelCode + '/' + cardId + '/' + cardType
    })
  },
  bbbindChannelCardtx(channelCode, cardId, cardType) { // 套现检查
    return request({
      method: 'POST',
      url: '/trade/cards/tx/check/' + channelCode + '/' + cardId + '/' + cardType
    })
  },
  /* 渠道绑卡确认 /trade/cards/{cardId}/{channelCode}/confirm */
  bindChannelCardConfirm(cardType, cardId, channelCode, orderNo, data) {
    return request({
      method: 'POST',
      url: '/trade/cards/binding/' + cardType + '/' + cardId + '/' + channelCode + '/' + orderNo + '/confirm',
      data: data
    })
  },
  // 注册渠道接口判断 chenzq 2019/11/30
  registjudge(channelCode) {
    return request({
      method: 'POST',
      url: '/trade/cards/register/check/' + channelCode
    })
  },
  // todo 注册渠道接口判断 lihw 2020/3/4 new
  registjudgeNew(channelCode, cardId, cardType) {
    return request({
      method: 'POST',
      url: '/trade/cards/register/check/' + channelCode + '/' + cardId + '/' + cardType
    })
  },
  // 注册渠道
  regchannel(cardType, cardId, channelCode) { // 注册渠道
    return request({
      method: 'POST',
      url: '/trade/cards/binding/' + cardType + '/' + cardId + '/' + channelCode
    })
  },
  /* 获取银行列表*/
  getBankList() {
    return request({
      method: 'get',
      url: '/trade/banks'
    })
  },
  /* 获取银行卡 */
  getCard(cardType, cardId) {
    return request({
      method: 'get',
      url: '/trade/cards/' + cardType + '/' + cardId
    })
  },
  x_getCard(cardType, cardId) {
    return request({
      method: 'get',
      url: '/x/trade/cards/' + cardType + '/' + cardId
    })
  },
  /* 获取验证码 */
  getVerificationCode(cardType, data) {
    return request({
      method: 'POST',
      url: '/trade/card/auth/sms/' + cardType,
      data: data
    })
  },
  /* 注册渠道信息 */
  registrationChannels(data) {
    return request({
      method: 'POST',
      url: '/trade/init',
      data: data
    })
  }
}

export default card
