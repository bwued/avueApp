<template>
  <div id="app">
    <template>
      <keep-alive :include="keepAliveArr">
        <router-view />
      </keep-alive>
    </template>
  </div>
</template>

<script>
import checkUpdate from '@/utils/checkUpdate'

export default {
  name: 'App',
  data() {
    return {
      mode: '',
      transitionName: ''
      // keepAliveArr: ['Recommend', 'Home', 'Center', 'PlanList', 'SelectChannel', 'Intelligence', 'custom', 'RankingActivities', 'Withdraw', 'Bill', 'Team', 'DirectTeam', 'SecondTeam', 'Member', 'MyCard', 'Repayment', 'Agreement']
      // keepAliveArr: ['Recommend', 'Home', 'Center', 'custom', 'RankingActivities', 'Member', 'Agreement']
    }
  },
  computed: {
    keepAliveArr() {
      return this.$store.getters.keepAliveArr
    }
  },
  beforeCreate() {
    const ua = navigator.userAgent.toLowerCase()// 获取判断用的对象
    if (ua.indexOf('micromessenger') !== -1) {
      this.$store.commit('SET_CLIENT_ENV', true)
    } else {
      this.$store.commit('SET_CLIENT_ENV', false)
    }
  },
  created() {
    document.title = document.title || this.STATIC_INFO.appName
    // document.body.style.paddingTop = api.safeArea.top + 'px';
    // document.body.style.paddingBottom = api.safeArea.bottom + 'px';
  },
  mounted() {
    this.$nextTick(() => {
      // VCONSOLE.init()
      checkUpdate()
    })
  }
}
</script>

