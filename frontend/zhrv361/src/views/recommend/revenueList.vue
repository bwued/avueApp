<template>
  <div>
    <top-msg header-name="收益排行榜" />
    <div class="con_body position_re">
      <div class="con_bg" />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'RevenueList',
  components: { topMsg },
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
      document.title = '收益排行榜'
    },
    /* 获取用户排行榜（长） */
    getUserListShortFun() {
      const that = this
      that.$api.recommend.getUserListLong().then(res => {
        console.log(res)
        this.recommendList = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';
  .con_body{
    overflow: hidden;
  }
  .con_bg{
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

  .rankingList_warp{
    position: relative;
    width: 93.6%;
    padding: 20px 0 20px;
    margin: 60px auto 22px;
    z-index: 2;
    border-radius: 15px;
    box-shadow:0px 10px 20px rgba(46,82,255,0.1);
  }

  .rankingList_title{
    margin: 40px auto;
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
    padding-top: 20px;
    box-sizing: border-box;
  }
  .recommend_img{
    width: 100%;
  }
  .recommend_img >img{
    width: 100%;
  }

</style>
