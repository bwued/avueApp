<template>
  <div>
    <top-msg header-name="设置" />
    <div class="con_body">
      <router-link to="/editPassword" class="line flex-row-between">
        <span>修改密码</span>
        <i class="iconfont icon-Path" />
      </router-link>
      <router-link to="/receivingAddress" class="line flex-row-between">
        <span>收货地址</span>
        <i class="iconfont icon-Path" />
      </router-link>
      <div v-show="checkFlag" class="line flex-row-between">
        <span>版本信息</span>
        <!--<i class="iconfont icon-Path" />-->
        <span>{{ version }}</span>
      </div>
      <div v-show="checkFlag" class="line flex-row-between" @click="upgrade">
        <span>检查更新</span>
        <i class="iconfont icon-Path" />
      </div>
    </div>
    <div class="btn_footer" @click="outLogin">
      退出登录
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import axios from 'axios'
import { Toast } from 'vant'
export default {
  name: 'Set',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      isLoading: '', // 加载loading
      checkFlag: true,
      version: ''
    }
  },
  created() {
    this.thisTitle()
    this.version = this.STATIC_INFO.appVersion
    //    alert(this.version)
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '设置'
    },
    // 获取最新版本升级接口
    upgrade() {
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      const params = {
        agentId: 1000,
        terminalType: isAndroid ? 1 : 2 // 终端类型 1安卓 2IOS
      }
      const that = this
      axios.post('http://120.79.74.34:6062/upgrade/version/get', params).then(res => {
        const data = res.data
        console.log('app升级接口......')
        console.log(data)
        if (res.data.data.url) {
          //
          that.download(res.data.data.version, res.data.data.url, res.data.data.remark)
        } else {
          // Toast(data.message);
        }
      }).catch(err => {
        console.log(err)
        Toast('服务异常')
      })
    },

    /* 下载更新*/
    download(version, url, remark) {
      const that = this
      if (this.version === version) {
        Toast('当前版本' + version + '是最新版了')
        return
      }
      that
        .$dialog({
          title: 'APP升级更新',
          message: '版本号:' + version + '<br>更新内容:' + remark,
          //          message: '更新内容:' + remark,
          showCancelButton: true,
          confirmButtonText: '确定升级',
          cancelButtonText: '再想想',
          className: 'dialog',
          closeOnClickOverlay: true
        })
        .then(res => {
          if (res === 'confirm') {
            if (url) {
              window.location.href = url
              return
            } else {
              window.location.href = 'https://fir.im/zhihuiren'
              return
            }
            var u = navigator.userAgent
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
            if (isiOS) {
              // var message = {
              //   title: '下载',
              //   url: url,
              //   referer: 'http://www.zhsc198.com/'
              // }
              // window.webkit.messageHandlers.OpenWechat.postMessage(message) // TODO ios 微信支付
              that.$router.push({ path: '/iframe', query: { url: url, title: '下载' }})
            } else {
              window.location.href = url
              //
            }
          }
        })
    },
    /* 登出系统*/
    outLogin() {
      const that = this
      that.$dialog({
        title: '是否退出系统',
        message: '退出系统后需重新登录',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '再想想',
        className: 'dialog',
        closeOnClickOverlay: true
      }).then(res => {
        if (res === 'confirm') {
          that.$store.dispatch('LogOut').then(() => {
            this.$store.commit('SET_CURRENT_DEBIT_CARD', '')
            this.$store.commit('SET_CURRENT_CREDIT_CARD', '')
            that.$router.replace('/login')
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .con_body{
    padding: 0 24px;
    box-sizing: border-box;
  }
  .line{
    margin-top: 24px;
    padding: 0 24px;
    box-sizing: border-box;
    width:702px;
    height:88px;
    line-height: 88px;
    background:rgba(255,255,255,1);
    box-shadow:0px 10px 20px rgba(14,66,128,0.08);
    opacity:1;
    border-radius:10px;
  }
  .line>i{
    font-size: 24px;
    color: #cccccc;
  }
  .btn_footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
    background: #bf9761;
    color: #ffffff;
    font-size: 30px;
    line-height: 100px;
    text-align: center;
    &:active {
      opacity: .7;
    }
  }
  .btn_footer>div{
    width: 100%;
    height: 100px;
  }
</style>
