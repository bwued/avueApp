<template>
  <div class="mgb110 recommend-page">
    <!-- <top-msg header-name="咨询" /> -->
    <share-box>
      <template>
        <img slot="topImg" src="../../../static/img/zixu.png" alt />
      </template>

      <template>
        <span slot="rengdian" class="b_topbj">
          <ul>
            <li>
              <img src="../../../static/img/index1.png" />
              <p>资讯</p>
            </li>
            <li>
              <img src="../../../static/img/index2.png" />
              <p>新闻</p>
            </li>
            <li>
              <img src="../../../static/img/index3.png" />
              <p>热点</p>
            </li>
          </ul>
          <span class="advertise" @click="$router.push('/noticeList')">
            <span class="toutiao">
              <img src="../../../static/img/toutiao.png" />
            </span>
            <span class="text">重要</span>
            <span class="text dec" style="font-size: 15px;">{{ notice.title }}</span>
            <span class="gd">更多</span>
          </span>
        </span>
      </template>

      <template>
        <div slot="shareBox" class="box">
          <div
            v-for="(item,index) in list"
            :key="index"
            class="item flex-row-between"
             @click="openLinks(item.url,item.name)"
          >
            <div class="main flex-column">
              <span class="title">{{ item.name }}</span>
              <span class="content textEllipsis">{{ item.sub_name }}</span>
            </div>
            <i class="iconfont icon-Path" />
          </div>
        </div>
        
      </template>
    </share-box>
    <tabbar :shopping-mall="msg" />
  </div>
</template>

<script>
import tabbar from "@/components/tabbar";
import shareBox from "@/components/shareBox";
// import topMsg from '@/components/topMsg'
export default {
  name: "Consult",
  components: { tabbar, shareBox },
  /* data必须是函数*/
  data: function() {
    return {
      msg: true, //
      list: [],
       notice: {},
       title:'',
       url:'',
    };
  },
  created() {
    // this.thisTitle()
    this.getListInfo();
    this.announcementNewestFun()  //头条
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = "咨询";
    },
    getListInfo() {
      this.$api.recommend.listInfo().then(res => {
        console.log(res);
        this.list = res.data.data;
      });
    },
       announcementNewestFun() {
      this.$api.home.announcementNewest().then(res => {
        // console.log(res)
        this.notice = res.data.data
      })
    },
    openLinks(url,name){
       const that = this;
       that.url=url;
       that.title=name
       console.log(that.url)
      console.log(that.title)
      // that.$router.push("/iframe");
      that.$router.push({path:'/iframe',query:{url:that.url,title:that.title}})
    }
  }
};
</script>

<style lang="less" scoped>
.recommend-page {
  margin-bottom: 130px;
}
.b_iframe{
  width: 500px;
  height: 100%;
}
</style>
