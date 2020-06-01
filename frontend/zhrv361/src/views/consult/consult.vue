<template>
  <div class="mgb110 recommend-page">
    <div class="title">
      商学院
    </div>
    <div class="nav">
      <div class="nav-item" @click="type = 0">
        <span
          class="nav-text"
          :class="{
            selected: type === 0
          }"
        >智慧学堂</span>
      </div>
      <div class="nav-item" @click="type = 1">
        <span
          class="nav-text"
          :class="{
            selected: type === 1
          }"
        >视频教程</span>
      </div>
    </div>
    <!-- 使用APICloud云打包 -->
    <div v-if="J_udge==='APICloud'">
      <div v-for="(itemg,index) in test" v-show="type === 0" :key="index" class="school clear" @click="$openLinks(itemg.url,itemg.name,1)">
        <div class="school-img">
          <img :src="itemg.image.url" alt="智慧学堂">
        </div>
        <div class="school-main">
          <div class="school-title">
            {{ itemg.name }}
          </div>
          <div class="school-desc">
            {{ itemg.sub_name }}
          </div>
        </div>
      </div>
    </div>
    <!-- 视频 -->
    <div v-if="J_udge==='APICloud'" v-show="type !== 0" class="box">
      <div v-for="(item1,index) in list" :key="index" class="z_shipi" @click="$openLinks(item1.url,item1.name,2)">
        <div class="z_min">
          <span class="z_title">{{ item1.name }}</span>
        </div>
        <i class="iconfont icon-Path" />
      </div>
    </div>

    <!-- 使用原生离线打包 -->
    <div v-if="J_udge==='APIyun'">
      <div v-for="(itemg,index) in test" v-show="type === 0" :key="index" class="school clear" @click="openWebView(itemg.url,itemg.name,11)">
        <div class="school-img">
          <img :src="itemg.image.url" alt="智慧学堂">
        </div>
        <div class="school-main">
          <div class="school-title">
            {{ itemg.name }}
          </div>
          <div class="school-desc">
            {{ itemg.sub_name }}
          </div>
        </div>
      </div>
    </div>
    <!-- 视频 -->
    <div v-if="J_udge==='APIyun'" v-show="type !== 0" class="box">
      <div v-for="(item1,index) in list" :key="index" class="z_shipi" @click="openWebView(item1.url,item1.name)">
        <div class="z_min">
          <span class="z_title">{{ item1.name }}</span>
        </div>
        <i class="iconfont icon-Path" />
      </div>
    </div>
    <tabbar :shopping-mall="msg" />
  </div>
</template>

<script>
import tabbar from '@/components/tabbar'
// import shareBox from "@/components/shareBox";
// import topMsg from '@/components/topMsg'
export default {
  name: 'Consult',
  components: { tabbar },
  /* data必须是函数*/
  data: function() {
    return {
      // J_udge: 'APICloud',
      J_udge: 'APIyun',
      msg: true, //
      type: 0,
      list: [],
      test: [],
      title: '',
      url: '',
      // 商学院
      iconitem: [
        {
          img: require('../../../static/img/img_shangxueyuan_01.png'),
          text: '智慧人APP上线啦',
          time: '2019-09-24',
          content:
            ' 终于等到你, 智慧人APP正式上线啦!前往APP Store即可下载全新智慧人APP正式上线啦! 前往APP Store即可下载全新…终于等到你'
        }
      ]
    }
  },
  activated() {
    api.setStatusBarStyle({
      color: '#ffffff',
      style: 'dark',
      animated: false
    })
  },
  created() {
    this.z_pack()
    // this.thisTitle()
    this.getListFun()
    this.getListInfo()
  },
  mounted() {
    // api.setStatusBarStyle({
    //   color: '#ffffff',
    //   style: 'dark',
    //   animated: false
    // })
  },
  methods: {
    // 获取打包方式
    z_pack() {
      this.$api.login.getclientTextShowConfig({ name: 'APP打包方式' }).then(res => {
        if (res.data.data && res.data.data['APP打包方式']) {
          this.J_udge = res.data.data['APP打包方式']
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /* 设置标题*/
    thisTitle: function() {
      document.title = '咨询'
    },

    openWebView(url, title) {
      var u = navigator.userAgent
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) {
        //            baiwangxinxi.OpenWebview(url)
        //            baiwangxinxi.showShare("webView标题###我是分享标题###我是分享内容###我是地址url");
        baiwangxinxi.OpenWebview(title + '###智慧人###智慧学堂###' + url)
      }
      if (isiOS) {
        var message = {
          webviewTitle: '智慧人',
          title: title,
          content: '智慧学堂',
          url: url
        }
        console.log(message)
        window.webkit.messageHandlers.openWebview.postMessage(message)
      }
    },
    getListFun() {
      this.$api.recommend.listLessonList().then(res => {
        this.test = res.data.data
      })
    },
    getListInfo() {
      this.$api.recommend.listVideo().then(res => {
        this.list = res.data.data
      })
    }
    // open(url, name) {
    //   alert(55)
    //   console.log('9999')
    //   console.log(url)
    //   const that = this
    //   that.url = url
    //   that.title = name
    //   that.$router.push({
    //     path: '/C_iframe',
    //     query: { url: that.url, title: that.title }
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.recommend-page {
  margin-bottom: 130px;
}
.title {
  background-color: #ffffff;
  font-size: 36px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-weight: 500;
  padding: 16px 0 23px 0;
  color: #000000;
}
.nav {
  display: flex;
  background-color: #ffffff;
  height: 90px;
  padding: 22px 0 0 0;
  box-sizing: border-box;
  .nav-item {
    flex: 1;
    text-align: center;
  }
  .nav-text {
    display: inline-block;
    color: #999999;
    font-size: 32px;
    height: 46px;
    line-height: 46px;
    letter-spacing: 3px;
    padding-bottom: 22px;
    font-weight: 500;
    &.selected {
      color: #bf9761;
      border-bottom: 1px solid #bf9761;
    }
  }
}
.school {
  padding: 30px;
  background: #ffffff;
  margin: 30px 0 0 0;
  display: flex;
  .school-img {
    padding-right: 23px;
    img {
      width: 240px;
      height: 150px;
    }
  }
  .school-main {
    flex: 1;
    box-sizing: border-box;
  }
  .school-title {
    font-size: 30px;
    line-height: 1.3;
    color: #bf9761;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .school-time {
    color: #999999;
    font-size: 22px;
    padding: 7px 0 20px 0;
  }
  .school-desc {
    width: 80%;
    color: #666666;
    font-size: 26px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: .4rem;
  }
}
.box {
  .z_shipi {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    background: #ffffff;
    margin-top: .7rem;
    .z_min{
      width: 85%;
         overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    .z_title {
      margin-left: .5rem;
      color: #999;
    }
    }
    .iconfont {
      margin-right: .5rem;
        color: #999;
    }
  }
}
</style>
