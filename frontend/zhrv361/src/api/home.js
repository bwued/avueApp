/**
 * 首页
 */
import request from '@/utils/request'

const home = {
  /* 首页轮播图*/
  firstPageCarousel(params) {
    return request({
      method: 'get',
      url: '/market/firstPageCarousel',
      params: params
    })
  },
  /* 公告列表*/
  announcementList(params) {
    return request({
      method: 'get',
      url: '/market/announcement/list',
      params: params
    })
  },
  /* 获取公告详情*/
  announcementDetail(params) {
    return request({
      method: 'get',
      url: '/market/announcement/detail',
      params: params
    })
  },
  /* 获取公告详情*/
  announcementNewest(params) {
    return request({
      method: 'get',
      url: '/market/announcement/newest',
      params: params
    })
  },
  /* 喜报列表*/
  SheratonHotel() {
    return request({
      method: 'get',
      url: '/market/announcement/list/' + 'GLADNEWS'
    })
  },
  /* 首页弹窗广告*/
  getPoster() {
    return request({
      method: 'get',
      url: '/market/announcement/getPoster'
    })
  },
  /* 忽略首页弹窗广告*/
  closePoster(params) {
    return request({
      method: 'get',
      url: '/market/announcement/closePoster',
	  params:params
    })
  }
}
export default home
