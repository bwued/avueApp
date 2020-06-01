import api from '../api'
import router from '../router'
import store from '../store'
import { Dialog } from 'vant'
import 'vant/lib/dialog/style'
import { Toast } from 'vant'
import 'vant/lib/toast/style'

/* 发起支付请求，判断认证情况 */
export default {
  payment: function() {
    const orderData = store.state.orderData
    const channel_code = orderData.channel_code
    const u = navigator.userAgent
    // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    api.proceeds.tradePay(orderData).then(res => {
      Toast.clear()
      res = res.data
      if (res.code === '200000') {
        if (res.data.pay_url) {
          // window.location.href = res.data.pay_url
          if (channel_code === 'ZMF_JK_HB_001' && isiOS) {
            // window.location.href = res.data.pay_url
            var message = {
              title: '支付宝',
              url: res.data.pay_url
            }
            // alert(res.data.pay_url)
            window.webkit.messageHandlers.OpenAlipay.postMessage(message) // TODO
          } else {
            router.push({ path: '/iframetx', query: { title: '支付', url: res.data.pay_url }})
          }
          return
        }
        if (res.data.channel_msg) {
          Toast({
            message: res.data.channel_msg,
            duration: 2500,
            forbidClick: true
          })
        } else {
          // Toast({
          //   message: '交易处理中',
          //   duration: 2500,
          //   forbidClick: true
          // })
          // router.push('/home')
          // router.push('/receipt') // 跳回到收款记录页面 TODO 待优化：接口没有

          Dialog({
            title: '交易处理中，详细状态可到“收款记录”查看', // DOTO  收银台 》 套现，跳H5 HgwnLi 20/11
            showCancelButton: true,
            confirmButtonText: '收款记录',
            cancelButtonText: '收银台',
            className: 'dialog',
            closeOnClickOverlay: true
          }).then(() => {
            router.replace('/receipt')
          }).catch(() => {
            router.replace('/proceeds')
          })
        }
      }
    }).catch(error => {
      Toast.clear()
      const res = error.data

      // 补充认证
      if (res.code === '922002') {
        Dialog({
          title: '提示',
          message: '该通道需要补充认证资料请补充后继续使用',
          showCancelButton: true,
          confirmButtonText: '去补充',
          cancelButtonText: '返回',
          className: 'dialog',
          closeOnClickOverlay: true
        }).then(res => {
          if (res === 'confirm') {
            router.push('/supplementaryCertification')
          }
        })
        return
      }
      // 未绑卡
      if (res.code === '921006' || res.code === '921010') {
        router.push({
          path: '/bindCard',
          query: {
            cardId: orderData.deposit_bank_id,
            channelCode: orderData.channel_code
          }
        })
        return
      }

      // 绑卡中
      if (res.code === '921008') {
        Toast({
          message: res.msg,
          duration: 2500,
          forbidClick: true
        })
        return
      }

      // 绑卡失败
      if (res.code === '921009') {
        Toast({
          message: res.msg + '...请重新编辑',
          duration: 2500,
          forbidClick: true
        })
        router.push({
          path: '/bindCard',
          query: {
            cardId: orderData.deposit_bank_id,
            channelCode: orderData.channel_code
          }
        })
        return
      }

      Toast({
        message: res.msg,
        duration: 3000,
        forbidClick: true
      })
      return
    })
  }
}

