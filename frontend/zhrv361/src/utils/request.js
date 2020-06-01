import { Toast } from 'vant'
import axios from 'axios'
import store from '../store'
import { getToken } from '@/utils/auth'
import router from '../router'
import qs from 'qs'
import { codes } from '@/utils/code'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 60000 // 请求超时时间
})

/* 提示函数*/
const tip = msg => {
  Toast({
    message: msg,
    duration: 2500,
    forbidClick: false
  })
}

service.defaults.headers.common['Content-Type'] = 'application/json'

// request拦截器
service.interceptors.request.use(
  config => {
    // param参数序列化
    config.paramsSerializer = params =>
      qs.stringify(params, { arrayFormat: 'repeat' })

    // 存入token
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}` // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    console.log('=============== 请求参数 =============== \n')
    console.log(config.url)
    console.log('\n')
    console.log(config)
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    console.log('+++++++++++++++++ 响应 +++++++++++++++++ \n')
    console.log(response)
    /**
     * code为非10000是抛错 可结合自己业务进行修改
     */
    const res = response.data

    if (response.headers.authorization) {
      return response
    }

    if (res.code !== '200000') {
      tip(res.msg)
    } else {
      return response
    }
  },
  error => {
    console.log('******************** 报错 ******************** \n')
    console.log(error)
    const { response } = error
     console.warn(response.data)
     // alert(JSON.stringify(response.data))
     //  alert(response.data.msg)


    if (!response) {
      Toast.clear()
      tip('抱歉！无法连接网络，请稍后再试！')
      return Promise.reject(error)
    }

    if (response.data.code === '403000') {
      store.dispatch('LogOut').then(() => {
        tip('登录信息已失效,请重新登录')
        router.push('/login')
      })
      return Promise.reject(response)
    }

    if (codes[response.data.code]) {
      tip(codes[response.data.code])
      return Promise.reject(response)
    }

    if (response.status === 500) {
      tip('抱歉！系统繁忙，请稍后再试！')
      return Promise.reject(response)
    }

    Toast.clear()
    if (response.data && response.data.msg) {
      tip(response.data.msg)
    } else if (error.message) {
      tip(error.message)
    }

    return Promise.reject(response)
  }
)

export default service
