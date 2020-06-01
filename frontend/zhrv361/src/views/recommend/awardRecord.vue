<template>
  <div>
    <top-msg header-name="奖励记录" />
    <div class="con_body">
      <div class="items">
        <!-- <div class="item">
          <div class="item_top flex-row-between size28 bold">
            <span class="color666">xxx活动</span>
            <span class="colorED02">
              第十名
            </span>
          </div>
          <div class="item_msg_1 flex-row-center">
            <i class="iconfont icon-jingpin" />
            <span class="size26 bold color666">奖品信息</span>
          </div>
          <div class="msg_1 size24 color999">
            奖品奖品奖品奖品奖品奖品奖品奖品奖品奖品奖品奖品奖品奖
            品奖品奖品奖品奖品奖品奖品
          </div>
          <div class="item_msg_2 flex-row-center">
            <i class="iconfont icon-shouhuoxinxi" />
            <span class="size26 bold color666">奖品信息</span>
          </div>
          <div class="msg_2 size24 color666">
            <div class="flex-row-center">
              <span>陆仁佳</span>
              <span class="ml24">13000110000</span>
            </div>
            <div class="mt14">
              广东省 广州市 番禺区 小谷围街道大学城中六路街1号广州大学城信息枢纽楼702D
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item_top flex-row-between size28 bold">
            <span class="color666">xxx活动</span>
            <span class="colorED02">
              第十名
            </span>
          </div>
          <div class="item_msg_1 flex-row-center">
            <i class="iconfont icon-jingpin" />
            <span class="size26 bold color666">奖品信息</span>
          </div>
          <div class="msg_1 size24 color999">
            奖品奖品奖品奖品奖品奖品奖品奖品奖品奖品奖品奖品奖品奖
            品奖品奖品奖品奖品奖品奖品
          </div>
          <div class="item_msg_2 flex-row-center">
            <i class="iconfont icon-shouhuoxinxi" />
            <span class="size26 bold color666">奖品信息</span>
          </div>
          <div class="msg_2 size24 color666">
            <div class="flex-vertical-centering">
              <router-link :to="{path: '/receivingAddress', query: {id: 'item.id' }}" class="flex-row-center">
                <i class="iconfont icon-jia" />
                <span class="color0F5">去添加收货信息</span>
              </router-link>
            </div>
          </div>
        </div> -->
        <van-list
          v-model="listLoading"
          :finished="listFinished"
          :error.sync="listError"
          finished-text="已加载完毕"
          error-text="请求失败，点击重新加载"
          @load="getListFun"
        >
          <template v-if="haveContent">
            <div
              v-for="item in list"
              :key="item.id"
              class="item"
            >
              <div class="item_top flex-row-between size28 bold">
                <span class="color666">{{ item.campaign_name }}</span>
                <span class="colorED02">
                  第{{ item.rank }}名
                </span>
              </div>
              <div class="item_msg_1 flex-row-center">
                <i class="iconfont icon-jingpin" />
                <span class="size26 bold color666">奖品信息</span>
              </div>
              <div class="msg_1 size24 color999">
                {{ item.prize_description }}
              </div>
              <div class="item_msg_2 flex-row-center">
                <i class="iconfont icon-shouhuoxinxi" />
                <span class="size26 bold color666">收货信息</span>
              </div>
              <div v-if="item.address_info.address" class="msg_2 size24 color666">
                <div class="flex-row-center">
                  <span>{{ item.address_info.name }}</span>
                  <span class="ml24">{{ item.address_info.phone }}</span>
                </div>
                <div class="mt14">
                  {{ item.address_info.area }} {{ item.address_info.address }}
                </div>
              </div>
              <div v-else class="msg_2 size24 color666">
                <div class="flex-vertical-centering">
                  <router-link :to="{path: '/receivingAddress', query: {id: item.id }}" class="flex-row-center">
                    <i class="iconfont icon-jia" />
                    <span class="color0F5">去添加收货信息</span>
                  </router-link>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="unContent">
              <div class="unContent_img">
                <img src="../../../static/img/pic_nonelike.png">
              </div>
              <div>
                <span>没有相关记录</span>
              </div>
            </div>
          </template>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'AwardRecord',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true, //

      list: [], // 用户数据
      listLoading: false, // loading
      listFinished: false, // 列表的finished
      listError: false, // 列表的error
      listPage: 0, // 列表的页数

      haveContent: false // 是否有内容
    }
  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '推荐'
    },
    getListFun() {
      const that = this
      that.$api.recommend
        .getPrize({
          page: that.listPage,
          size: 10
        })
        .then(res => {
          console.log(res)
          if (res.data.data.content) {
            // 有内容
            that.list = that.list.concat(res.data.data.content)
            that.haveContent = true
            if (res.data.data.has_next) {
              // 有下一页
              that.listPage++
              that.listLoading = false
            } else {
              // 无下一页
              that.listLoading = false
              that.listFinished = true
            }
          } else {
            // 无内容
            that.haveContent = false
            that.listLoading = false
            that.listFinished = true
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .con_body{
    overflow: hidden;
    padding: 0 24px 24px 24px;
    box-sizing: border-box;
  }
  .item{
    margin-top: 24px;
    width:702px;
    /* height:486px; */
    background:rgba(255,255,255,1);
    box-shadow:0px 10px 20px rgba(14,66,128,0.08);
    opacity:1;
    border-radius:10px;
    padding-bottom: 24px;
    box-sizing: border-box;
  }
  .item_top{
    padding:16px 24px;

    border-bottom: 1px solid #eeeeee;
  }
  .item_msg_1{
    padding:20px 24px 16px 24px;
    box-sizing: border-box;
  }
  .item_msg_1>i{
    margin-right: 10px;
    font-size: 32px;
    color: @mainColorD;
  }
  .msg_1{
    padding:0 24px;
    box-sizing: border-box;
  }
  .item_msg_2{
    padding:48px 24px 10px 24px;
    box-sizing: border-box;
  }
  .item_msg_2>i{
    margin-right: 10px;
    font-size: 32px;
    color: @mainColorB;
  }
  .msg_2{
    margin: 0 24px;
    padding:18px 24px;
    box-sizing: border-box;
    background:rgba(248,248,248,1);
  }
  .mt14{
    margin-top: 14px;
  }
  .ml24{
    margin-left: 24px;
  }
  .msg_2 i{
    font-size: 40px;
    color: @mainColorA;
    margin-right: 6px;
  }
</style>
