<template>
  <div class="home-page">
    <!-- <top-msg header-name="首页" /> -->
    <div class="top">
      <div class="box">
        <img src="../../../static/img/img_home_background.png">
      </div>
      <ul class="type">
        <li class="item" @click="paymentCode">
          <img src="../../../static/img/home_icon_sytj.png" class="img" alt="">
          <div class="text">
            商户收款
          </div>
        </li>
        <li class="item" @click="$router.push('/proceeds')">
          <img src="../../../static/img/home_icon_zxsk.png" class="img" alt="">
          <div class="text">
            在线收款
          </div>
        </li>
        <li class="item" @click="goto('/planList')">
          <img src="../../../static/img/home_icon_xykgj.png" class="img" alt="">
          <div class="text">
            智能管家
          </div>
        </li>
      </ul>
    </div>
    <div class="advertise" @click="$router.push('/noticeList')">
      <img src="../../../static/img/img_gfgg.png" class="img" alt="官方">
      <span class="text dec inner-container">{{ notice.title }}</span>
    </div>
    <div class="rec-box">
      <recommend />
    </div>
    <swiper :options="swiperOption" v-if="banner.length > 1" ref="mySwiper">
      <swiper-slide v-for="(item,index) in banner" :key="index">
        <img :src="item.image_item && item.image_item.url" @click="openLink(item)">
      </swiper-slide>
      <div slot="pagination" class="swiper-pagination" />
    </swiper>
    <service-recommend></service-recommend>
    <tabbar :home-page="true" />
  </div>
</template>
<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import recommend from './recommend'
    import serviceRecommend from './serviceRecommend'
    import tabbar from '@/components/tabbar'
    import setJpush from '@/utils/jpush'
    // import topMsg from '@/components/topMsg'
    export default {
        name: 'Home',
        components: { swiper, swiperSlide, recommend, tabbar, serviceRecommend},
        data() {
            return {
                // banner
                swiperOption: {
                    autoplay:true,
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents:true,//修改swiper的父元素时，自动初始化swiper
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
                // banner end
                userInfo: {},
                notice: {}
            }
        },
        computed:{
            swiper(){
                return this.$refs.mySwiper.swiper;
            }
        },
        activated() {
            if(this.banner.length) {
//                alert(11)
                this.$refs.mySwiper.slideNext()
            }
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
        },
        mounted() {
            const phone = STORE.get('phone')
            console.log('phone: ', phone)
            if (phone) {
                setJpush(phone)
            }
            this.swiper.slideTo(1, 1000, false)
            // api.setStatusBarStyle({
            //   color: '#484b6d',
            //   style: 'light',
            //   animated: false
            // })
        },
        watch: {
//            '$route':'getBanner' //监听路由变化调用方法

        },
        methods: {
            getBanner() {
                this.$api.home.firstPageCarousel()
                    .then(res => {
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
                this.$openLinks(item.url,item.name)
            },
        }
    }
</script>
<style lang="less" scoped>
  @import '../../assets/less/common.less';
  .inner-container {
    animation: myMove 5s linear infinite;
    animation-fill-mode: forwards;
  }
  /*文字无缝滚动*/
  @keyframes myMove {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-15px);
    }
  }

  .home-page{
    width: 100%;
    min-height: 100%;
    padding-bottom: 98px;
    box-sizing: border-box;
    background: #ffffff;
    .top{
      width: 100%;
      height: 289px;
      position: relative;
      .box{
        position: absolute;
        width: 100%;
        height: 100%;
        .bgGradient(135deg,@gradientA,@gradientB);
        img{
          width: 100%;
          height: 100%;
        }
      }
      .type{
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
        .item{
          text-align: center;
          .text{
            font-size: 26px;
            font-weight: 500;
            color: #FDF2D4;
          }
          .img{
            width: 104px;
            height: 104px;
            margin: 0 0 20px 0;
          }
        }
      }
      .msg{
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translate(-50%,0);
        width: 100%;
        z-index: 99;
        padding: 0 132px;
        box-sizing: border-box;
        .item{
          text-align: center;
          .money{
            color: #fff;
            font-size: 38px;
            font-size: bold;
          }
          .text{
            font-size: 26px;
            color: #fff;
          }
        }
      }
    }
    .advertise{
      background: #fff;
      padding: 35px 30px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items:center;
      .img{
        width: auto;
        height: 25px;
        vertical-align: middle;
        margin-right: 10px;
      }
      .text{
        font-size: 26px;
        height: 29px;
        line-height: 29px;
        font-weight: 400;
        display: inline-block;
        white-space: nowrap;
        &.dec{
          color: #999999;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          width: 100%;
        }
      }
    }
    .swiper-container{
      height: 188px;
      img{
        width: 100%;
        height: auto;
      }
    }
    .rec-box{
      border-top: 1px solid #f5f5f5;
      // border-bottom: 1px solid #f5f5f5;
      box-sizing: border-box;
      // margin-bottom: 30px;
    }
  }
</style>

