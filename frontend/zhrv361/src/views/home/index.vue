<template>
  <div class="home-page">
    <!-- <top-msg header-name="首页" /> -->
    <div class="top">
      <div class="box">
        <img src="../../../static/img/img_home_background.png">
      </div>
      <ul class="type">
        <li class="item" @click="paymentCode">
          <img src="../../../static/img/home_icon_sytj.png" class="img" alt>
          <div class="text">
            商户收款
          </div>
        </li>
        <li class="item" @click="$router.push('/proceeds')">
          <img src="../../../static/img/home_icon_zxsk.png" class="img" alt>
          <div class="text">
            在线收款
          </div>
        </li>
        <li class="item" @click="goto('/planList')">
          <img src="../../../static/img/home_icon_xykgj.png" class="img" alt>
          <div class="text">
            智能管家
          </div>
        </li>
      </ul>
    </div>
    <!-- 公告滚动 start -->
    <!-- <div class="advertise" @click="$router.push('/noticeList')">
      <img src="../../../static/img/img_gfgg.png" class="img" alt="官方">
      <marquee width="100%" behavior="scroll" scrollamount="4" direction="left" bgcolor="#fff">
        <span v-for="(item,index) in noticeList" :key="index" class="text">{{ index+1 }}.{{ item.title }}</span>
      </marquee>
    </div> -->
    <!-- 公告滚动 end -->
    <div class="rec-box disnone">
      <recommend />
    </div>

    <!-- <div style="height: 6.5rem;">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in banner" :key="index" @click="toLink(item)">
          <img v-lazy="item.image_item && item.image_item.url">
        </van-swipe-item>
      </van-swipe>
    </div> -->

    <!-- todo 喜报左右滚 start -->
    <!-- <roll /> -->
    <!-- todo 喜报左右滚 end -->

    <service-recommend class="disnone"/>
    <tabbar :home-page="true" />
	<!-- 弹窗广告 -->
	<notice />
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import recommend from './recommend'
import serviceRecommend from './serviceRecommend'
// import roll from './roll'
import notice from './notice'
import tabbar from '@/components/tabbar'
import setJpush from '@/utils/jpush'
// import topMsg from '@/components/topMsg'
export default {
  name: 'Home',
  components: { 
    swiper, 
    swiperSlide, 
    recommend, 
    tabbar, 
    serviceRecommend, 
    // roll, 
    notice },
  data() {
    return {
      // banner
      swiperOption: {
        autoplay: true,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        loop: true,
        speed: 800,
        autoplay: {
          delay: 1500, // 1秒切换一次
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      },
      banner: [],
      noticeList: [],
      // banner end
      userInfo: {},
      notice: {}
    }
  },
  computed: {},
  watch: {
    //            '$route':'getBanner' //监听路由变化调用方法
  },
  activated() {
    api.setStatusBarStyle({
      color: '#484b6d',
      style: 'light',
      animated: false
    })
  },
  created() {
    this.$store.commit('SET_KEEP_ALIVE', this.$options.name)
    // document.title = '首页'
    this.userInfo = this.$store.getters.userInfo
    this.announcementNewestFun()
    this.getBanner()
    this.announcementListFun()
  },
  mounted() {
    const phone = STORE.get('phone')
    console.log('phone: ', phone)
    if (phone) {
      setJpush(phone)
    }
    //            this.swiper.slideTo(1, 1000, false)

    // api.setStatusBarStyle({
    //   color: '#484b6d',
    //   style: 'light',
    //   animated: false
    // })
  },
  methods: {
    toLink(item) {
      const name = item.name
      const url = item.url
      if (!url || url == '#' || url == '') {
        this.$dialog({
			  title: '提示',
			  message: '即将上线，敬请期待！',
			  confirmButtonText: '确定'
        })
      } else {
		  if(name =='丰e足食' ){
			   this.$router.push({ path: '/sf', query: { title: name, refer: '/home', url: url }})
		  }else{
			  this.openView(name,url)
		  }
      }
    },
	openView(name,url){
		var u = navigator.userAgent
		// var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
		if (isiOS) {
		  var message = {
		    title: name,
		    url: url,
		    referer: 'http://www.zhsc198.com/'
		  }
		  window.webkit.messageHandlers.OpenWechat.postMessage(message) // TODO ios 微信支付
		} else {
		   this.$router.push({ path: '/hiframe', query: { title: name, refer: '/home', url: url }})
		}
	},
    announcementListFun() {
      this.$api.home.announcementList({ size: 10, page: 0 }).then(res => {
        // console.log(res.data.data)
        this.loading = false
        for (const i of res.data.data) {
          this.noticeList.push(i)
        }
      })
    },
    getBanner() {
      this.$api.home.firstPageCarousel().then(res => {
        console.log(res)
        this.banner = res.data.data
      })
    },
    announcementNewestFun() {
      this.$api.home.announcementNewest().then(res => {
        console.log(res)
        this.notice = res.data.data
      })
    },
    paymentCode() {
      this.$dialog({
        title: '提示',
        message: '即将上线，敬请期待！',
        confirmButtonText: '确定'
      })
      //      var url = window.location.href

      //      window.location.href = "http://forex.baiwang168.com.cn/h5/index.html#/?Authorization="+localStorage.getItem("Client-Token") + "&returnUrl=" + url
      //        this.$router.push({path:'/s_iframe',query:{url:"http://forex.baiwang168.com.cn/h5/index.html#/?Authorization="+localStorage.getItem("Client-Token") + "&returnUrl=" + url,title:'测试汇境'}})
    },
    goto(path) {
      if (this.judgeUserAuth()) {
        this.$router.push(path)
      }
    },
    openLink(item) {
      console.log('item: ', item)
      if (item.url === '#') {
        return
      }
      this.$openLinks(item.url, item.name)
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/common.less";
.inner-container {
  animation: myMove 5s linear infinite;
  animation-fill-mode: forwards;
  width: 100%;
}
/*文字无缝滚动*/
@keyframes myMove {
  0% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(-250px);
  }
}

.home-page {
  width: 100%;
  min-height: 100%;
  padding-bottom: 98px;
  box-sizing: border-box;
  background: #ffffff;
  .top {
    width: 100%;
    height: 289px;
    position: relative;
    .box {
      position: absolute;
      width: 100%;
      height: 100%;
      .bgGradient(135deg, @gradientA, @gradientB);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .type {
      display: flex;
      justify-content: space-between;
      padding: 20px 72px 40px 72px;
      // background: #fff;
      border-radius: 15px;
      width: 100%;
      box-sizing: border-box;
      margin: 54px 0 24px;
      z-index: 100;
      position: absolute;
      .item {
        text-align: center;
        .text {
          font-size: 26px;
          font-weight: 500;
          color: #fdf2d4;
        }
        .img {
          width: 104px;
          height: 104px;
          margin: 0 0 20px 0;
        }
      }
    }
    .msg {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 100%;
      z-index: 99;
      padding: 0 132px;
      box-sizing: border-box;
      .item {
        text-align: center;
        .money {
          color: #fff;
          font-size: 38px;
          font-size: bold;
        }
        .text {
          font-size: 26px;
          color: #fff;
        }
      }
    }
  }
  .advertise {
    background: #fff;
    padding: 35px 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .img {
      width: auto;
      height: 25px;
      vertical-align: middle;
      margin-right: 10px;
    }
    .text {
      font-size: 26px;
      height: 29px;
      line-height: 29px;
      font-weight: 400;
      display: inline-block;
      white-space: nowrap;
      padding-right: 20px;
      // margin-left: 180px;
      /*padding-right: 5px;*/
      &.dec {
        color: #999999;
        white-space: nowrap;
        text-overflow: ellipsis;
        /*overflow: hidden;*/
        width: 100%;
      }
    }
  }
  .swiper-container {
    height: 188px;
    img {
      width: 100%;
      height: auto;
    }
  }

  .van-swipe-item {
    height: 188px;
    img {
      width: 100%;
      height: auto;
    }
  }
  .rec-box {
    border-top: 1px solid #f5f5f5;
    // border-bottom: 1px solid #f5f5f5;
    box-sizing: border-box;
    // margin-bottom: 30px;
  }
}
</style>

