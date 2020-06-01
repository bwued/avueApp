import router from '../router'
import { Dialog } from 'vant'
import 'vant/lib/dialog/style'
export const go = function(url) {
  if (url === '#') {
    Dialog({
      title: '提示',
      message: '即将上线，敬请期待！',
      confirmButtonText: '确定'
    })
  } else {
    window.location.href = url
  }
}

export const openWin = function(url) {
  // eslint-disable-next-line no-undef
  if (url === '#') {
    Dialog({
      title: '提示',
      message: '即将上线，敬请期待！',
      confirmButtonText: '确定'
    })
  } else {
    api.openWin({
      name: 'externalUrlFrame',
      url: url,
      bgColor: '#fff',
      animation: {
        type: 'none'

      }
    })
  }
}

export const openLinks = function(url, title, type) {
  // eslint-disable-next-line no-undef
  if (url === '#') {
    Dialog({
      title: '提示',
      message: '即将上线，敬请期待！',
      confirmButtonText: '确定'
    })
  } else if (url.indexOf('#') > -1 && url.indexOf('#') < 2 && url !== '#') {
    router.push(url.replace('#', ''))
  } else {
    router.push({ path: '/externalLinks', query: { url: url, title: title, type: type }})
  }
}

export const openShareLinks = function(url, title, type) { // TODO 微课、视频 分享 朋友圈 hgwnli 3/10
  // eslint-disable-next-line no-undef
  if (url && title) {
    router.push({ path: '/externalLinksShare', query: { url: url, title: title, type: type }})
  }
}

export const openThirdLinks = function(id, url, title, type) {
  // eslint-disable-next-line no-undef
  if (url === '#') {
    Dialog({
      title: '提示',
      message: '即将上线，敬请期待！',
      confirmButtonText: '确定'
    })
  } else if (url.indexOf('#') > -1 && url.indexOf('#') < 2 && url !== '#') {
    router.push(url.replace('#', ''))
  } else {
    router.push({ path: '/externalSecondLinks', query: { id: id, url: url, title: title, type: type }})
  }
}
