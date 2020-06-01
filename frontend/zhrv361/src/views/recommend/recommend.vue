<template>
  <div class="mgb110 recommend-page">
    <top-msg header-name="推荐" />
    <div class="con_body position_re">
      <div class="box">
        <img src="../../../static/img/home-bg-up.png">
      </div>
      <router-link to="/rankingActivities" class="activities size24">
        <div>排行</div>
        <div>活动</div>
      </router-link>
      <div class="rankingList_warp bgfff">
        <div class="rankingList_title cen">
          <h5 class="maincolor size36 bold">
            <i>·</i><span> 收益排行榜 </span><i>·</i>
          </h5>
        </div>
        <div class="rankingList_items">
          <div v-for="(item,index) in recommendList" :key="index" class="rankingList_item flex-row-between">
            <div v-if="index==0" class="item_img">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-yi" />
              </svg>
            </div>
            <div v-if="index==1" class="item_img">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-er" />
              </svg>
            </div>
            <div v-if="index==2" class="item_img">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-san" />
              </svg>
            </div>
            <div v-if="index>2" class="item_img">
              <i class="item_imgs size24">{{ index + 1 }}</i>
            </div>
            <div class="flex1">
              <div class="flex-row-between size30 bold">
                <span class="color333">{{ item.id_card_name }}</span>
                <span class="colorED02">{{ item.total_earnings }}</span>
              </div>
              <div class="flex-row-between mt5 size24 color999">
                <span>成功推荐{{ item.recommend_effective_count }}人</span>
                <span>累计收入(元)</span>
              </div>
            </div>
          </div>
          <router-link to="/revenueList" class="w100 cen size24 color999 more">
            查看更多
          </router-link>
        </div>
      </div>
      <div class="recommend_img" @click="gotoRecommendImg">
        <img src="../../../static/img/pic_tuijan.png">
      </div>
    </div>
    <tabbar :recommend-index="msg" />
  </div>
</template>

<script>
import tabbar from '@/components/tabbar'
import topMsg from '@/components/topMsg'
export default {
  name: 'Recommend',
  components: { tabbar, topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true, //
      recommendList: '' // 用户数据
    }
  },
  created() {
    this.thisTitle()
    this.getUserListShortFun()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '推荐'
    },
    /* 去选择推荐二维码的样式背景图*/
    gotoRecommendImg() {
      const that = this
      that.$router.push('/selectImg')
    },
    /* 获取用户排行榜（短） */
    getUserListShortFun() {
      const that = this
      that.$api.recommend.getUserListShort().then(res => {
        console.log(res)
        this.recommendList = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-page{
  margin-bottom: 130px;
  .con_body{
    overflow: hidden;
    .box{
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translate(-50%,0);
      .bgGradient(135deg,@gradientA,@gradientB);
      width: 200%;
      height: 70%;
      border-radius: 50%;
      z-index: 1;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        top: -6%;
        left: 0;
      }
    }
  }
  .rankingList_warp{
    position: relative;
    width: 93.6%;
    max-height:58vh;
    padding: 20px 0 20px;
    margin: 60px auto 22px;
    box-sizing: border-box;
    z-index: 2;
    border-radius: 15px;
    box-shadow:0px 10px 20px rgba(46,82,255,0.1);
    overflow: scroll;
  }

  .rankingList_title{
    margin: 25px auto;
  }
  .rankingList_item{
    display: flex;
    padding: 20px;
    border-bottom: 0.01 solid #eeeeee;
  }
  .rankingList_item:last-child{
    border-bottom: 0;
  }
  .item_img>svg{
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
  .item_imgs{
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-left: 5px;
    margin-right: 10px;
    color: #ffffff;
    background-color: #CCCCCC;
    border-radius: 20px;
    overflow: hidden;
  }
  .more{
    display: inline-block;
    padding-top: 20px;
    box-sizing: border-box;
  }
  .recommend_img{
    width: 702px;
    height: 209px;
    margin: 0 auto;
    .bgGradientA;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .activities{
    position: absolute;
    top: 99px;
    right: 0;
    border-radius:56px 0px 0px 56px;
    padding: 14px 20px 14px 40px;
    background-color: @mainColorD;
    z-index: 10;
    div{
      color: #ffffff;
    }
  }
}
</style>
