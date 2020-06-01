import 'es6-promise/auto'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import util from './assets/util.js'
import './assets/common.css'
import './assets/reset.css'
import { Dialog } from 'vant'
import 'vant/lib/dialog/style'
import { Uploader } from 'vant'
import 'vant/lib/uploader/style'
import { Toast } from 'vant'
import 'vant/lib/toast/style'
import { Popup } from 'vant'
import 'vant/lib/popup/style'
import { List } from 'vant'
import 'vant/lib/list/style'
import { Loading } from 'vant'
import 'vant/lib/loading/style'
import { Notify } from 'vant'
import 'vant/lib/notify/style'
import { Tab, Tabs } from 'vant'
import 'vant/lib/tab/style'
import 'vant/lib/tabs/style'
import { Area } from 'vant'
import 'vant/lib/area/style'
import { Cell, CellGroup } from 'vant'
import 'vant/lib/cell/style'
import 'vant/lib/cell-group/style'
import { Icon } from 'vant'
import 'vant/lib/icon/style'
import { Picker } from 'vant'
import 'vant/lib/picker/style'
import { RadioGroup, Radio } from 'vant'
import 'vant/lib/radio-group/style'
import 'vant/lib/radio/style'
import { Actionsheet } from 'vant'
import 'vant/lib/actionsheet/style'
import { DatetimePicker } from 'vant'
import { Slider } from 'vant'
import { Stepper } from 'vant'
import VueClipboard from 'vue-clipboard2'
import { Swipe, SwipeItem } from 'vant'
import { Lazyload } from 'vant'
Vue.use(Lazyload)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(VueClipboard)
Vue.use(DatetimePicker)
Vue.use(Slider)
Vue.use(Stepper)

Vue.config.errorHandler = function(err, vm, info) {
  console.log('vue errorHandler err: ', err)
  console.log('vue errorHandler vm: ', vm)
  console.log('vue errorHandler info: ', info)
}

// datePicker
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import { go, openWin, openLinks, openThirdLinks, openShareLinks } from './utils/common'
import { parseAmount } from './utils/amount'

// 接口api
import httpApi from './api'

// 权限控制
import './permission'

// 转换环境变量
import constants from './constants'

// 公共方法，实名认证
import userAuth from '@/utils/userAuth'
Vue.prototype.auth = userAuth.auth
Vue.prototype.judgeUserAuth = userAuth.judgeUserAuth

// 支付
import payment from '@/utils/payment'
Vue.prototype.payment = payment.payment

// bus
const bus = new Vue()
Vue.prototype.bus = bus

Vue.prototype.$util = util
Vue.prototype.$api = httpApi
Vue.prototype.$go = go
Vue.prototype.$openWin = openWin
Vue.prototype.$openLinks = openLinks
Vue.prototype.$openThirdLinks = openThirdLinks
Vue.prototype.$openShareLinks = openShareLinks
Vue.prototype.$parseAmount = parseAmount

// import VConsole from 'vconsole'
// const vconsole = new VConsole()
// Vue.use(vconsole)

Vue.use(constants)
Vue.use(Loading)
Vue.use(List)
Vue.use(Popup)
Vue.use(Toast)
Vue.use(Notify)
Vue.use(Uploader)
Vue.use(Dialog)
Vue.use(Tab).use(Tabs)
Vue.use(Area)
Vue.use(Cell).use(CellGroup)
Vue.use(Icon)
Vue.use(Picker)
Vue.use(RadioGroup).use(Radio)
Vue.use(Actionsheet)
Vue.use(VCalendar, {
  formats: {
    title: 'MMMM YYYY',
    weekdays: 'W',
    navMonths: 'MMM',
    input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
    dayPopover: 'L'
  }
})

Vue.config.productionTip = false

Vue.use(constants)
// function ExitApp() {
//   var ci = 0
//   var time1, time2
//   api.addEventListener({
//     name: 'keyback'
//   }, function(ret, err) {
//     if (ci === 0) {
//       time1 = new Date().getTime()
//       ci = 1
//       api.toast({ msg: '再按一次返回键退出' })
//     } else if (ci === 1) {
//       time2 = new Date().getTime()
//       if (time2 - time1 < 2000) {
//         api.closeWidget({
//           id: api.appId,
//           retData: {
//             name: 'closeWidget'
//           },
//           silent: true
//         })
//       } else {
//         ci = 0
//         api.toast({ msg: '再按一次返回键退出' })
//       }
//     }
//   })
// }

const ua = navigator.userAgent.toLowerCase()// 获取判断用的对象
if (ua.indexOf('apicloud') !== -1) {
  window.apiready = function() {
    api.setStatusBarStyle({
      color: '#484b6d',
      style: 'light',
      animated: false
    })
    // ExitApp()
    const resetStatusBarNames = ['home', 'share']
    Vue.mixin({
      mounted() {
        let name = this.$options.name
        console.log('当前name: ', name)
        if (typeof name === 'string') {
          name = name.toLowerCase()
          if (name !== window.$$_prev_route_name && window.$$ROUTE_NAMES.indexOf(name) !== -1) {
            console.log('window.$$_prev_route_name: ', window.$$_prev_route_name)
            console.log('name: ', name)
            if (resetStatusBarNames.indexOf(window.$$_prev_route_name) !== -1 || resetStatusBarNames.indexOf(name) !== -1) {
              console.warn('设置状态栏颜色')
              if (name === 'home') { // 首页
                api.setStatusBarStyle({
                  color: '#484b6d',
                  style: 'light',
                  animated: false
                })
              } else if (name === 'share') { // 分享
                api.setStatusBarStyle({
                  color: '#3b3d5b',
                  style: 'light',
                  animated: false
                })
              } else {
                api.setStatusBarStyle({
                  color: '#3b3d5b',
                  style: 'light',
                  animated: false
                })
              }
            }
          }
        }
      }
    })

    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')

    api.openWin({
      name: 'index',
      url: 'index.html',
      bounces: false
    })
    api.setStatusBarStyle({
      color: '#484b6d',
      style: 'light'
    })
    window.jpush = api.require('ajpush')
    api.addEventListener({ name: 'appintent' }, function(ret, err) {
      console.log('通知被点击，收到数据：\n' + JSON.stringify(ret)) // 监听通知被点击后收到的数据
      if (ret && ret.appParam.ajpush) {
        var ajpush = ret.appParam.ajpush
        console.warn('ajpush')
        console.log('ajpush: ', ajpush)
        const id = ajpush.id
        const title = ajpush.title
        const content = ajpush.content
        const extra = ajpush.extra
        console.log('id: ', id)
        console.log('title: ', title)
        console.log('content: ', content)
        console.log('extra: ', extra)
        api.alert({
          title: '智慧人',
          msg: content
        }, function(ret, err) {
          console.log('======= app.alert =======')
          console.log('ret: ', ret)
          console.log('err: ', err)
        })
      }
    })
  }
} else {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
