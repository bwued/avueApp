<template>
  <div class="bg5C5C5C minHeight100vh">
    <!--<div class="header">
        <div class="header_body">
          <p>选择推荐码样式</p>
        </div>
      </div>
    <div>-->
    <top-msg header-name="分享推广" />
    <div class="con_body">
      <div class="con_swiper">
        <swiper ref="swiperTop" :options="swiperOptionTop" class="gallery-top">
          <swiper-slide v-for="(item,index) in z_img" :key="item.id" :class="'slide-' + index" class="swiperImg">
            <img :src="item.img">
          </swiper-slide>
        </swiper>
        <!-- swiper2 Thumbs -->
        <swiper ref="swiperThumbs" :options="swiperOptionThumbs" class="gallery-thumbs">
          <swiper-slide v-for="(item,index) in z_img" :key="item.id" :class="'slide-' + index" class="swiperImg2">
            <img :src="item.img ">
          </swiper-slide>
        </swiper>
      </div>
      <div class="cen btn_footer">
        <button class="btn btn_next" @click="gotoShareCode">
          下一步
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import topMsg from '@/components/topMsg'

export default {
  name: 'fenxiang',
  components: { swiper, swiperSlide, topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      //划动轮播图
       z_img:[
               {img: require("../../../static/img/fenxiang1.png")
              },
               {img: require("../../../static/img/fenxiang2.png")
              },
               {img: require("../../../static/img/fenxiang3.png")
              },
             {img: require("../../../static/img/fenxiang4.png")
             },
             {img: require("../../../static/img/fenxiang5.png")
             },
           {img: require("../../../static/img/fenxiang6.png")
           },
       ],

      swiperOptionTop: {
        spaceBetween: 10
      },
      swiperOptionThumbs: {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true
      },
      shareImgList: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  created() {
    this.thisTitle()
    this.getShareImgListFun()
  },
  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.swiper
      const swiperThumbs = this.$refs.swiperThumbs.swiper
      swiperTop.controller.control = swiperThumbs
      swiperThumbs.controller.control = swiperTop
    })
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '选择推荐码样式'
    },
    /* 点击下一步*/
    gotoShareCode() {
      const poster = document.querySelector(
        '.swiperImg.swiper-slide-active img'
      ).src
        console.log(poster)
//      this.$router.push({ path: '/shareCode', name: 'shareCode', params: { poster }})
      this.$router.push({ path: '/shareCode', query: { src: poster }})
    },
    /* 获取图片列表*/
    getShareImgListFun() {
      const that = this
      that.$api.recommend.getShareImgList().then(res => {
        console.log(res)
        that.shareImgList = res.data.data
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
.con_body {
  overflow: hidden;
}
.bg5C5C5C {
  background: #5c5c5c;
}
.con_swiper {
  margin-top: 57px;
}
.swiperImg {
  text-align: center;
}
.swiperImg > img {
/*  width: 370px;*/
  height: 100%;
}
.swiperImg2 > img {
/*  width: 200px;*/
  height: 100%;
}
.swiper-slide {
  background-size: cover;
  background-position: center;
}
.gallery-top {
  height: 50vh !important;
  width: 100%;
}
.gallery-thumbs {
  height: 20vh !important;
  box-sizing: border-box;
  /*    padding: 0.1rem 0;*/
  margin: 5vh 0 4vh
}
.gallery-thumbs .swiper-slide {
  width: 25%;
/*  width: 30%;*/
  height: 100%;
  opacity: 0.4;
}
.gallery-thumbs .swiper-slide-active {
  opacity: 1;
}

.btn_footer {
  position: fixed;
  z-index: 999999;
  /*bottom: 54px;*/
  bottom: 4vh;
  left: 50%;
  margin-left: -200px;
}
.btn_next {
  width: 14rem;
  height: 66px;
  .bgGradient(135deg,@gradientA 0%,@gradientB 100%);
  background-blend-mode: normal;
  border-radius: 33px;
}
</style>
