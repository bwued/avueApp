/**
 * 推荐模块接口列表
 */

import request from '@/utils/request'

const richText = {
  getText(params) {
    return request({
      method: 'get',
      url: '/anonymous/text/rich',
      params: params
    })
  }
}

export default richText
