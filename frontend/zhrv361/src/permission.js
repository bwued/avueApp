import router from './router'
import store from './store'
import api from './api'

const whiteList = ['/login', '/register', '/forgetPassword', '/agreement', '/home', '/credit'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  console.warn('.................... router.beforeEach ....................')
  console.log('to: ', to)
  console.log('from: ', from)
  if (from) {
    try {
      const name = from.name.toLowerCase()
      window.$$_prev_route_name = name
    } catch (e) {
      console.log('catch beforeEach params from error: ', e)
    }
  }

  console.log('store.getters.userInfo: ', store.getters.userInfo)
  console.log('store.getters.token: ', store.getters.token)
  // 设置推荐人约束
  if (to.query.referrer) {
    store.commit('SET_REFERRER', to.query.referrer)
  }

  // 设置代理信息
  if (to.query.agentId) {
    localStorage.setItem('AGENTID', to.query.agentId)
  } else {
    localStorage.setItem('AGENTID', '')
  }

  // determine if there has token
  if (store.getters.token) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      console.log('store.getters.userInfo: ', store.getters.userInfo)
      // 判断当前用户是否已拉取完user_info信息
      if (!store.getters.userInfo) {
        store.dispatch('GetUserInfo').then((res) => {
          console.log('GetUserInfo one res: ', res)
          console.log('userInfo: ', store.getters.userInfo)
          next({ ...to, replace: true })
        }).then((res) => {
          console.log('GetUserInfo two then res: ', res)
          /* 获取agentId向后端发送请求 */
          if (localStorage.getItem('AGENTID')) {
            console.log('获取agentId向后端发送请求')
            api.center.postAgentId(localStorage.getItem('AGENTID'))
          }
        }).catch((err) => {
          console.error('GetUserInfo err: ', err)
          store.dispatch('LogOut').then(() => {
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})
