<template>
  <div class="mgb110 recommend-page">
    <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="$router.push('/consult')">
      <div class="text">
        {{ title }}
      </div>
      <!-- <div class="fenxiang" @click="Z_Sharer()">
        分享
      </div> -->
      <div class="fenxiang" @click="B_Sharer()">
        分享
      </div>
    </div>
    <!-- <div style="height:100vh;">
      <iframe src="http://device.shijianxiaogui.com/mobile/#/index?deviceld=100164" frameborder="0" width="100%" height="100%" />
    </div> -->
    <div v-if="z_Show" class="z_toop" @click="qxSharer()" />
    <div v-if="z_Show" class="hello">
      <!-- <p class="z_lj">
        立即分享给好友
      </p> -->


      <!-- TODO 分享 遮罩层问题？ -->
      <ul class="fengxiong">
        <li>
          <img src="../../../static/img/icon_wechat.png" @click="z1_onShareSelect()"><div>微信朋友</div>
        </li>
        <li><img src="../../../static/img/icon_zhifubao.png" @click="z2_onShareSelect"><div>朋友圈</div></li>
      </ul>
      <p class="z_lj" @click="qxSharer()">
        取消
      </p>
    </div>
    <van-actionsheet
      v-model="isShareSheet"
      style="position: fixed;bottom:0;"
      :actions="shareActions"
      @select="onShareSelect"
    />
  </div>
</template>

<script>
export default {
  name: 'ExternalLinks',
  /* data必须是函数*/
  data: function() {
    return {
      z_Show: false,
      title: '',
      url: '',
      type: '',
      isShareSheet: false, // 分享
      shareActions: [
        { key: 'session', name: '朋友' },
        { key: 'timeline', name: '朋友圈' }
      ]
    }
  },
  created() {
    this.title = this.$route.query.title
    this.url = this.$route.query.url
    this.type = this.$route.query.type
    this.thisTitle()
    this.openFrame()
  },
  destroyed() {
    api.closeFrame({
      name: 'externalUrlFrame'
    })
  },
  methods: {
    // Z_Sharer(item) {
    //   this.isShareSheet = true
    // },
    B_Sharer() {
      this.z_Show = true
    },
    // z_toop() {
    //   console.log('弹窗')
    //   this.z_Show = false
    // },
    qxSharer() {
      console.log('取消')
      this.z_Show = false
    },
    z1_onShareSelect() {
      const that = this
      if (that.type == 1) {
        const wx = api.require('wx')
        wx.shareText({
          apiKey: 'wx02df33802d384b32',
          scene: 'session',
          title: that.title,
          description: '分享网页的描述',
          contentUrl: that.url
        }, function(ret, err) {
          if (ret.status) {
            that.$toast({
              message: '分享成功',
              position: 'middle',
              duration: 2000
            })
          } else {
            that.$toast({
              message: err.code,
              position: 'middle',
              duration: 2000
            })
          }
        })
      } else {
        const wx = api.require('wx')
        wx.shareVideo({
          apiKey: 'wx02df33802d384b32',
          scene: 'session',
          title: that.title,
          description: '分享内容的描述',
          // thumb : 'widget://res/iconfont-touxiang.png',
          contentUrl: that.url
        }, function(ret, err) {
          if (ret.status) {
            that.$toast({
              message: '分享成功',
              position: 'middle',
              duration: 2000
            })
          } else {
            that.$toast({
              message: err.code,
              position: 'middle',
              duration: 2000
            })
          }
        })
      }
      this.z_Show = false
    },
    z2_onShareSelect() {
      const that = this
      if (that.type == 1) {
        const wx = api.require('wx')
        wx.shareText({
          apiKey: 'wx02df33802d384b32',
          scene: 'session',
          title: that.title,
          description: '分享网页的描述',
          contentUrl: that.url
        }, function(ret, err) {
          if (ret.status) {
            that.$toast({
              message: '分享成功',
              position: 'middle',
              duration: 2000
            })
          } else {
            that.$toast({
              message: err.code,
              position: 'middle',
              duration: 2000
            })
          }
        })
      } else {
        const wx = api.require('wx')
        wx.shareVideo({
          apiKey: 'wx02df33802d384b32',
          scene: 'session',
          title: that.title,
          description: '分享内容的描述',
          // thumb : 'widget://res/iconfont-touxiang.png',
          contentUrl: that.url
        }, function(ret, err) {
          if (ret.status) {
            that.$toast({
              message: '分享成功',
              position: 'middle',
              duration: 2000
            })
          } else {
            that.$toast({
              message: err.code,
              position: 'middle',
              duration: 2000
            })
          }
        })
      }
      this.z_Show = false
    },
    onShareSelect(item) {
      const that = this
      if (that.type == 1) {
        const wx = api.require('wx')
        wx.shareText({
          apiKey: 'wx02df33802d384b32',
          scene: item.key,
          title: that.title,
          description: '分享网页的描述',
          contentUrl: that.url
        }, function(ret, err) {
          if (ret.status) {
            that.$toast({
              message: '分享成功',
              position: 'middle',
              duration: 2000
            })
          } else {
            that.$toast({
              message: err.code,
              position: 'middle',
              duration: 2000
            })
          }
        })
      } else {
        const wx = api.require('wx')
        wx.shareVideo({
          apiKey: 'wx02df33802d384b32',
          scene: item.key,
          title: that.title,
          description: '分享内容的描述',
          // thumb : 'widget://res/iconfont-touxiang.png',
          contentUrl: that.url
        }, function(ret, err) {
          if (ret.status) {
            that.$toast({
              message: '分享成功',
              position: 'middle',
              duration: 2000
            })
          } else {
            that.$toast({
              message: err.code,
              position: 'middle',
              duration: 2000
            })
          }
        })
      }
      this.isShareSheet = false
    },
    /* 设置标题*/
    thisTitle: function() {
      document.title = this.title
    },
    openFrame() {
      api.openFrame({
        name: 'externalUrlFrame',
        url: this.url,
        bgColor: '#fff',
        historyGestureEnabled: true,
        rect: {
          x: 0,
          y: 42,
          w: api.winWidth,
          h: api.winHeight - 42
        },
        animation: {
          type: 'none'
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
//头部返回
.top {
  display: flex;
  flex-flow: row;
  background: white;
  padding-bottom: 0.8rem;
  position: fixed;
  width: 100%;
  img {
    width: 1rem;
    height: 1.5rem;
    margin-top: 0.8rem;
    margin-left: 1rem;
  }
  .text {
    color: #000000ff;
    font-size: 1.3rem;
    margin-top: 0.8rem;
    margin-left: 4.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    width: 50%;
  }
}
.fenxiang{
   color: #000000ff;
    font-size: 1.3rem;
    text-align: center;
    width: 18%;
   position: relative;
   top: .7rem;
   left: 1.2rem;
}
.recommend-page{
  // margin-bottom: 130px;
}
.van-popup .van-popup--bottom /deep/ .van-actionsheet{
 position: fixed;
top:50px;
}
.z_toop{
  height: 100%;
  width: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
}
.hello{
   position: fixed;
    bottom: 0;
    height: 10rem;
    width: 100%;
    background: #f2f3f5;
    .fengxiong{
      display: flex;
    flex-direction:row;
    background: white;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    li{
      width: 50%;
      text-align: center;
      line-height: 2.5rem;
    }
     img{
       width: 3rem;
       height: 3rem;
       margin-top: .7rem;
     }
    }
    .z_lj{
      position: relative;
      top: 1rem;
     height: 3rem;
      text-align: center;
     line-height: 3rem;
     background: white;
    //    border-top-left-radius: 1rem;
    // border-top-right-radius: 1rem;
    }
}
</style>
