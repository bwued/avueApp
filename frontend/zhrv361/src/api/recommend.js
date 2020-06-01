/**
 * 推荐模块接口列表
 */

import request from '@/utils/request'

const recommend = {
  /* 推广海报列表 */
  getShareImgList() {
    return request({
      method: 'get',
      url: '/market/share_posters'
    })
  },
  /* 第三方功能  */
  getThirdPartyContent() {
    return request({
      method: 'get',
      url: '/market/third_party_content'
    })
  },
  /* 第三方功能-二级链接  */
  getSecondContent(id) {
    return request({
      method: 'get',
      url: '/market/third_party_content/' + id + '/second'
    })
  },
  /* 用户排行榜（短）  */
  getUserListShort() {
    return request({
      method: 'get',
      url: '/market/ranking/total/short'
    })
  },
  /* 用户排行榜（长）  */
  getUserListLong() {
    return request({
      method: 'get',
      url: '/market/ranking/total/long'
    })
  },
  /* 获取最近已结束的活动详情 */
  getLatelyEnded() {
    return request({
      method: 'get',
      url: '/campaign/latelyEnded'
    })
  },
  /* 获取最近进行中的活动详情 */
  getLatelyProgressing() {
    return request({
      method: 'get',
      url: '/campaign/latelyProgressing'
    })
  },
  /* 获取奖品记录 */
  getPrize(params) {
    return request({
      method: 'get',
      url: '/campaign/prize',
      params
    })
  },
  /* 获取活动的榜单 */
  getRanking(params) {
    return request({
      method: 'get',
      url: '/campaign/ranking',
      params
    })
  },
  /* 设置奖品收货信息 */
  setReocrd(recordId, data) {
    return request({
      method: 'post',
      url: '/campaign/prize/' + recordId,
      data: data
    })
  },
  /* 资讯内容列表 */
  listInfo() {
    return request({
      method: 'get',
      url: '/market/info_and_video/listInfo'
    })
  },
  /* 视频教学内容列表 */
  listVideo() {
    return request({
      method: 'get',
      url: '/market/info_and_video/listVideo'
    })
  },
  /* 转发图文列表*/
  forwardgraphList(params) {
    return request({
      method: 'get',
      url: '/market/forwardgraph/list',
      params
    })
  },
  /* 微课内容列表 */
  listLessonList() {
    return request({
      method: 'get',
      url: '/market/info_and_video/listLesson'
    })
  },
  /* 分享赚钱内容列表 */
  listInfoMoney() {
    return request({
      method: 'get',
      url: '/market/info_and_video/listInfoMoney'
    })
  }
}

export default recommend
