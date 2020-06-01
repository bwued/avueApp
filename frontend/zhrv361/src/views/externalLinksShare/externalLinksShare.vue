<template>
<!-- TODO 微课、视频 分享朋友圈 3/10 hgwnli -->
  <div class="mgb110 recommend-page">
    <top-msg :header-name="title" share-show="true" @shareSheet="shareSheet()" />

    <!-- <div style="height:100vh;">
      <iframe src="http://device.shijianxiaogui.com/mobile/#/index?deviceld=100164" frameborder="0" width="100%" height="100%" />
    </div> -->

      <van-actionsheet 
      v-model="isShareSheet"
      :actions="shareActions"
      @select="onShareSelectT"
    />
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import 'vant/lib/image-preview/style'
export default {
  name: 'ExternalLinksShare',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      flag:true,
      title: '',
      url: '',
      type:'',
      isShareSheet: false, // 分享
      shareActions: [
        { key: 'session', name: '微信朋友' },
        { key: 'timeline', name: '微信朋友圈' }
      ]
    }
  },
  created() {
    this.title = this.$route.query.title
    this.url = this.$route.query.url
    this.type = this.$route.query.type
    this.thisTitle()
    this.openFrameInit()
  },
  destroyed() {
    api.closeFrame({
      name: 'externalShareFrame'
    })
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = this.title
    },
    close() {
      // alert(11)
    },
     /* 分享*/
    shareSheet() {
      var that = this;
      this.isShareSheet = true;
      this.openFrame();
      // if(this.isShareSheet){
      //   this.openFrame();
      // }else{
      //   this.openFrameInit();
      // }
      setTimeout(function(){
        that.openFrameInit()
        that.$router.go(0);
      },3000)

    },
    onShareSelectT(item) {
      const that = this
      const wx = api.require('wx')
      // alert(that.type)
      if(that.type == 1){
        wx.shareWebpage({
				apiKey : 'wx02df33802d384b32',
				scene : item.key,
				title : that.title,
				description : '分享网页的描述',
				// thumb : 'widget://res/iconfont-touxiang.png',
				contentUrl : that.url
			}, function(ret, err) {
				if (ret.status) {
            that.$toast({
              message: '分享成功',
              position: 'middle',
              duration: 2000
            })
          
				} else {
          // alert(JSON.stringify(err))
          that.$toast({
            message: err.code,
            position: 'middle',
            duration: 2000
          })
				}
      });

      }else{
        wx.shareVideo({
				apiKey : 'wx02df33802d384b32',
				scene : item.key,
				title : that.title,
				description : '分享内容的描述',
				// thumb : 'widget://res/iconfont-touxiang.png',
				contentUrl : that.url
			}, function(ret, err) {
				if (ret.status) {
            that.$toast({
              message: '分享成功',
              position: 'middle',
              duration: 2000
            })
				} else {
          // alert(JSON.stringify(err))
          that.$toast({
            message: err.code,
            position: 'middle',
            duration: 2000
          })
				}
      });
      }
      
      this.isShareSheet = false

    },
    openFrameInit() {
      api.openFrame({
        name: 'externalShareFrame',
        url: this.url,
        bgColor: '#fff',
        historyGestureEnabled: true,
        rect: { 
          x: 0,
          y: 42,
          w: api.winWidth,
          h: api.winHeight
        },
        animation: {
          type: 'none'
        }
      })
    },
    openFrame() {
      api.openFrame({
        name: 'externalShareFrame',
        url: this.url,
        bgColor: '#fff',
        historyGestureEnabled: true,
        rect: { 
          x: 0,
          y: 42,
          w: api.winWidth,
          h: api.winHeight - 142
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
.recommend-page{
  margin-bottom: 130px;
}

</style>
