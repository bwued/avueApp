<template>
  <div class="mgb110 recommend-page">
    <top-msg :header-name="title" />
    <!-- <div style="height:100vh;">
      <iframe src="http://device.shijianxiaogui.com/mobile/#/index?deviceld=100164" frameborder="0" width="100%" height="100%" />
    </div> -->
    <ul v-if="recommendList" class="list">
      <li v-for="(item,index) in recommendList" :key="index" class="item flex-column-center" @click="openLinks(item.url,item.name)">
        <img :src="item.image_item && item.image_item.url">
        <div class="subtitle">
          {{ item.name }}
        </div>
        <div class="text">
          {{ item.sub_name }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'ExternalSecondLinks',
  components: { topMsg },
  /* data必须是函数*/
  data: function() {
    return {
      title: '',
      url: '',
      id: '',
      recommendList: []
    }
  },
  created() {
    this.id = this.$route.query.id
    this.title = this.$route.query.title
    this.url = this.$route.query.url
    this.type = this.$route.query.type
    this.thisTitle()
    if (this.id) {
      this.getSecondContentFun(this.id)
    } else {
      console.log('this.url: ', this.url);

      const that = this;
      api.openFrame({
        name: 'externalSecondUrlFrame',
        url: this.url, //'https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=wx131839097598776853dccfe01032337600&package=3868351291', //'http://bidefu.tatakeji.cn/jump/to.html?q=https%3A%2F%2Fwx.tenpay.com%2Fcgi-bin%2Fmmpayweb-bin%2Fcheckmweb%3Fprepay_id%3Dwx131839097598776853dccfe01032337600%26package%3D3868351291',
        bgColor: '#fff',
        rect: {
          x: 0,
          y: 42,
          w: api.winWidth,
          h: api.winHeight - 42
        },
        animation: {
          type: 'none',
          duration: 0
        },
        headers: {
          referer: 'http://www.zhsc198.com/', // 发给微信支付平台 TODO 2019/9 hgwn
        }
      })
      if (this.type !== '2') { // 不是 快捷支付升级
        setTimeout(function() {
          that.$router.go(-1);
        }, 5000);
      }
      // const checkappexist=api.require('checkappexist');
      // let param = {packagename:"com.tencent.mm"};
      // checkappexist.checkAppExist(param, function(ret) {
      //   console.log('checkAppExist ret: ', ret);
      //   if (ret.isExist == 1) {
          
      //   } else {
      //     api.alert({
      //       title: '提示',
      //       msg: '请安装微信',
      //     }, function(ret, err) {

      //     });
      //   }
      // })
    }
  },
  destroyed() {
    api.closeFrame({
      name: 'externalSecondUrlFrame'
    })
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = this.title
    },
    openFrame() {
      api.openFrame({
        name: 'externalSecondUrlFrame',
        url: this.url,
        bgColor: '#fff',
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
    },
    // 获取第三方链接二级链接
    getSecondContentFun(id) {
      const that = this
      that.$api.recommend.getSecondContent(id).then(res => {
        console.log(res)
        this.recommendList = res.data.data
        if (this.recommendList.length === 0) {
          this.openFrame()
        }
      })
    },
          openLinks(url,name){
       const that = this;
       that.url=url;
       that.title=name
       console.log(that.url)
      console.log(that.title)
      // that.$router.push("/iframe");
      that.$router.push({path:'/s_iframe',query:{url:that.url,title:that.title}})
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-page{
  margin-bottom: 130px;
  .list{
    display: flex;
    justify-content: space-around;
    padding: 40px 0;
    box-sizing: border-box;
    flex-wrap: wrap;
    .item{
      flex: 1 0 25%;
      text-align: center;
      img{
        width: 92px;
        height: 92px;
        margin: 0 0 13px 0;
      }
      .subtitle{
        height: 33px;
        line-height: 33px;
        font-size: 24px;
        font-weight: 500;
        color: #333333;
      }
      .text{
        font-size: 24px;
        color: @lightGrey;
      }
      &:nth-of-type(4) ~ .item {
        margin: 80px 0 0 0;
      }
    }
  }
}

</style>
