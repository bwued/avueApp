import store from '../store'
import { Dialog } from 'vant'
import 'vant/lib/dialog/style'
import { Toast } from 'vant'
import 'vant/lib/toast/style'
import httpApi from '@/api'
import router from '../router'

const doAuth = () => {
// eslint-disable-next-line no-undef
  const ySKAuth = api.require('ySKAuth')
  ySKAuth.startAuth({
    appKey: 'oBRb7EEESRuVZef3Gi2ajx6zLqspaJ1CJocLRA4VzK',
    secretKey: 'EB0FC2857F27636E4AD542620C527FE9',
    traceId: new Date().getTime() + '',
    //   notifyUrl: 'xxx',
    //   extensionInfo: 'xxx',
    needUserGuide: true,
    isOcrFirst: false,
    idCardOperation: {
      mode: 'FRONT_RECOGNIZE_BACK_RECOGNIZE',
      displayInfo: '1,2',
      modifyInfo: '1'
    },
    livenessOperation: {
      actionNum: 3,
      actions: '0,1,2',
      realAuth: true,
      isNeedFaceCompare: true
    }
  }, function(ret, err) {
    if (!err) {
      const idCardFrontInfo = ret.idCardFrontInfo

      // 如果由新身份证信息则替换
      if (ret.newIDCardInfo) {
        idCardFrontInfo.idNo = ret.newIDCardInfo.newIdNo
        idCardFrontInfo.name = ret.newIDCardInfo.newName
      }

      httpApi.center.saveYskAuth({
        id_card_no: idCardFrontInfo && idCardFrontInfo.idNo,
        id_card_name: idCardFrontInfo && idCardFrontInfo.name,
        is_auth: ret.livenessCompareInfo && (ret.livenessCompareInfo.verifyStatus === 1),
        auth_msg: ret.livenessCompareInfo && (ret.livenessCompareInfo.reason || '')
      }).then(() => {
        store.dispatch('GetUserInfo').then(() => {
          if (ret.livenessCompareInfo.verifyStatus === 1) {
            Toast.success('认证完成')
          } else {
            router.push('/authentication')
          }
        })
      })
    } else {
      Toast.fail(err.resultMessage)
      router.push('/authentication')
    }
  })
}

/* 判断用户是否实名认证*/
export default {
  auth: doAuth,
  judgeUserAuth: () => {
    if (store.getters.userInfo.auth_state === 'UNAUTHORIZED') {
      Dialog({
        title: '尚未实名认证',
        message: '使用前需实名认证',
        showCancelButton: true,
        confirmButtonText: '去认证',
        cancelButtonText: '返回',
        className: 'dialog',
        closeOnClickOverlay: true
      }).then(res => {
        if (res === 'confirm') {
          // doAuth()
          router.push('/authentication')
        }
      })
      return false
    } else if (store.getters.userInfo.auth_state === 'AUTHORIZING') {
      Dialog({
        title: '实名认证中',
        message: '使用收款服务前需实名认证',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        className: 'dialog',
        closeOnClickOverlay: true
      })
      return false
    } else if (store.getters.userInfo.auth_state === 'DENIED') {
      Dialog({
        title: '实名认证失败',
        message: '使用收款服务前需实名认证，请重新认证',
        showCancelButton: true,
        confirmButtonText: '重新认证',
        cancelButtonText: '返回',
        className: 'dialog',
        closeOnClickOverlay: true
      }).then(res => {
        if (res === 'confirm') {
          // doAuth()
          router.push('/authentication')
        }
      })
      return false
    } else {
      return true
    }
  }
}

