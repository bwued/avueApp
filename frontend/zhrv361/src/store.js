import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'
import { getToken, setToken, removeToken } from '@/utils/auth'

const KEEP_ALIVE_ARR = ['Recommend', 'Home', 'Center', 'custom', 'RankingActivities', 'Member', 'Agreement']
// const KEEP_ALIVE_ARR = []

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getToken(), // token
    proceedsAmount: 0, // 用户输入的收款金额
    userInfo: '', // 用户信息
    referrer: null, // 推荐人手机号码
    currentDebitCard: '', // 当前选中的储蓄卡
    currentCreditCard: '', // 当前选中的信用卡
    isWechat: '', // 判断是不是微信浏览器，如果是为 true
    settleMsg: null, // 结算页中的信息
    orderData: '', // 下单信息
    bankList: '', // 银行列表
    payProviderCode: '', // 支付方式代码
    agentId: '', // 公众号二维码id判断
    chooseCity: null, // 渠道是否能选择交易城市
    billMsg: {}, // 账单筛选条件
    keepAliveArr: [] // 也买你缓存
  },
  getters: {
    userInfo: (state) => {
      return state.userInfo
    },
    token: (state) => {
      return state.token
    },
    keepAliveArr: (state) => {
      return state.keepAliveArr
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_PROCEEDS_AMOUNT(state, proceedsAmount) {
      state.proceedsAmount = proceedsAmount
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    },
    SET_REFERRER(state, referrer) {
      state.referrer = referrer
    },
    SET_AGENTID(state, agentId) {
      state.agentId = agentId
    },
    SET_CURRENT_DEBIT_CARD(state, debitCard) {
      state.currentDebitCard = debitCard
    },
    SET_CURRENT_CREDIT_CARD(state, creditCard) {
      state.currentCreditCard = creditCard
    },
    SET_CLIENT_ENV(state, clientEnv) {
      state.isWechat = clientEnv
    },
    SET_SETTLE_MSG(state, settleMsg) {
      state.settleMsg = settleMsg
    },
    SET_ORDER_DATA(state, orderData) {
      state.orderData = orderData
    },
    SET_BANK_LIST(state, bankList) {
      state.bankList = bankList
    },
    SET_PAY_PROVIDER_CODE(state, payProviderCode) {
      state.payProviderCode = payProviderCode
    },
    SET_CHOOSE_CITY(state, chooseCity) {
      state.chooseCity = chooseCity
    },
    SET_BILL(state, billMsg) {
      state.billMsg = billMsg
    },
    SET_KEEP_ALIVE_ARR(state) {
      if (!state.keepAliveArr.length) {
        KEEP_ALIVE_ARR.forEach((item) => {
          state.keepAliveArr.push(item)
        })
      }
    },
    SET_KEEP_ALIVE(state, name) {
      const idx = state.keepAliveArr.indexOf(name)
      if (idx === -1) {
        state.keepAliveArr.push(name)
      }
    },
    CLEAR_KEEP_ALIVE_ARR(state) {
      while (state.keepAliveArr.length) {
        state.keepAliveArr.pop()
      }
    },
    CLEAR_KEEP_ALIVE(state, name) {
      const idx = state.keepAliveArr.indexOf(name)
      if (idx !== -1) {
        state.keepAliveArr.splice(idx, 1)
      }
    }
  },
  actions: {
    async GetUserInfo({ commit, state }, params) {
      await new Promise((resolve, reject) => {
        api.center.getUserInfo().then(res => {
          commit('SET_USER_INFO', res.data.data)
          console.log('resolve res: ', res)
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    async SetToken({ commit, state }, params) {
      setToken(params)
      commit('SET_TOKEN', params)
    },
    async LogOut({ commit, state }) {
      removeToken()
      commit('SET_USER_INFO', null)
      commit('SET_TOKEN', null)
    },
    async GetBankList({ commit, state }, params) {
      await new Promise(resolve => {
        api.card.getBankList().then(res => {
          const datas = res.data.data.bank_list
          const bankList = {}
          datas.forEach(function(value, index, arr) {
            bankList[value.bank_no] = value.name
          })
          commit('SET_BANK_LIST', bankList)
          resolve()
        })
      })
    }
  }
})
