<template>
  <div class="repayment-page">
    <top-msg header-name="智慧金明细" />

    <div>
      <ul class="list" v-if="show">
        <li v-for="(item,index) in list" :key="index" class="item">
          <div class="box">
            <div class="title flex-row-between" style="padding-bottom: 25px;">
              <span class="lt time flex-row-center">
                 <img src="../../../static/img/zhihuijinlist.png" style="width: 25px; height: 25px; padding-right: 5px; padding-top: 10px;">
                <span>{{ item.card_no}}</span>
              </span>
              <span :class="{'rt':true}" style="padding-right: 10px; font-weight: bold;" >{{item.fee_refund_money}}</span>
            </div>

            <div class="clear" style="margin-top: -25px;  padding-left: 40px; padding-bottom: 5px; font-weight: bold; font-size: 13px;"><span>{{ item.channel_code}}</span></div>

            <div class="clear msg">
              <span class="lt text">计划单号：{{ item.plan_no }} </span>
            </div>
            <div class="clear msg">
              <span class="lt text">产生时间：{{ item.gmt_create | timeToFormatDate }}  </span>
            </div>
          </div>
          <!--<i class="iconfont icon-gengduo icon" />-->
        </li>

        <template v-if="list.length == 0">
          <div class="unContent">
            <div class="unContent_img">
              <img src="../../../static/img/pic_nonelike.png">
            </div>
            <div>
              <span>没有相关记录</span>
            </div>
          </div>
        </template>

      </ul>

    </div>






  </div>
</template>
<script>
import { timeToFormatDay, timeToFormatDate } from '@/utils/date'
import topMsg from '@/components/topMsg'
import { Toast } from 'vant'
export default {
  name: 'Zhihuijinlist',
  components: { topMsg },
  filters: {
    timeToFormatDay, timeToFormatDate
  },
  data() {
    return {
      active: 0,
      state: '',
      show:true,
      show_box:false,
      guigeSpan: '-1',
      tabList: [
        {
          id: 0,
          text: '智慧金列表'
        },
        {
          id: 1,
          text: '提取记录'
        }
      ],
      loading: false,
      finished: false,
      isWithdraw: false,
      currPage: 0,
      list: [],
      total_amount: '',
      row: ''
    }
  },
  computed: {
    checkPlanList() {
      const list = this.list
      // <!--       PENDING,PROCESSING,REMITTED,FAIL -->
      // <!-- 0全部 1未提取、2处理中、3已提取、4失败 -->
      var arr = []
      for (const i of list) {
        if (this.active === 0) {
          arr.push(i)
        } else if (this.active === 1 && i.repay_state === 'PENDING') {
          arr.push(i)
        } else if (this.active === 2 && i.repay_state === 'PROCESSING') {
          arr.push(i)
        } else if (this.active === 3 && i.repay_state === 'REMITTED') {
          arr.push(i)
        } else if (this.active === 4 && i.repay_state === 'FAIL') {
          arr.push(i)
        }
      }
      return arr
    }
  },
  created() {
    const id = this.$route.query.user_refund_id || ''
    this.thisTitle()
    this.getList(id)
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '智慧金明细'
    },
    close(){
        this.show_box = false;
        this.isWithdraw = false
    },
    submit(){
        const that = this
        const  params = {
            user_refund_id: this.row.user_refund_id,
            withdraw_money:this.row.can_withdraw_money * 100
        }
        that.isWithdraw = true
        const loading = that.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'spinner',
            message: '请稍候...'
        })
        this.$api.repay.zhjwithdraw(params).then(res => {
            console.log(res.data.data)
            this.show_box = false;
            Toast('数据处理中，请查看提取记录')
            setTimeout(() => {
                that.isWithdraw = false
                loading.clear()
            }, 2000)
        })
    },
    tiqu(row){
      this.show_box = true;
      this.row = row;
  },
      getList(id) {
      this.loading = true
      this.list = []
      const params = {page:1,size:100,userRefundId:id}
        this.$api.repay.getZhihuijinList(params).then(res => {
        console.log(res.data.data)
        this.loading = false
        this.total_amount = res.data.data.total_balance
        this.list = res.data.data.data
        console.warn(1111)
        console.warn(this.list)
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
.unContent{
  text-align: center;
  padding: 24px 0 ;
  .unContent_img{
    width: 100%;
    text-align: center;
    overflow: hidden;
    img{
      width: auto;
      height: 100%;
    }
  }
}
#zhihuijin {
  margin: 10px auto;  border: 1px solid #bf9761; width: 60%; border-radius: 10px; height: 80px; line-height: 80px;
  .h_btn{
     color:#bf9761; float: left; display: inline-block;
    width: 50%; text-align: center; cursor: pointer;
  }
  .active{ background: #bf9761; color: #fff;}
}
#zhj_bg{
  position: fixed; width: 100%; height: 100%; z-index: 999;
  left: 0;  top:0; bottom: 0; right: 0; background: #000; opacity: 0.5;
}
.zhj_box{ position: fixed; width: 90%; height: 560px; top: 50%; left: 50%;  transform: translate(-50%,-50%);
  background: #fff; z-index: 9999; border-radius: 30px;
  .title{ text-align: center; font-weight: bold; font-size: 38px; margin: 35px auto 15px;}
  .h_ul{position: relative; padding: 25px;
    li{ height: 70px; line-height: 70px; border-bottom: 1px solid #eee; margin-bottom: 20px; clear: both; overflow: hidden;}
    .lr{  float: right;}
  }
  .zhj_btn span{ display: inline-block; line-height: 80px; text-align: center; height: 80px; width: 200px; border: 1px solid #ddd; border-radius: 10px; margin-left: 20px; cursor: pointer;
  }
  .zhj_btn .zhj_submit{ float: right;  margin-right: 20px; background: #bf9761; border: 1px solid #bf9761;  color: #fff;}

}
.repayment-page{
  .top{
    position: relative;
    margin-bottom: 19px;
    width: 100%;
    height: 259px;
    overflow: hidden;
    .box-bg{
      height: 100%;
      /*margin: 24px 24px 0 24px;*/
      img {
        width: 100%;
        height: 90%;
      }
    }
    .img{
      width: 100%;
      height: 240px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%,0);
    }
    .box{
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translate(-50%,0);
      padding: 37px 0;
      text-align: center;
      border-radius: 10px;
      width: 702px;
      height: 200px;
      box-sizing: border-box;
      overflow: hidden;
      z-index: 99;
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left:50%;
        transform: translate(-50%,0);
      }
      .title{
        font-size: 28px;
        font-weight: bold;
        color: #ffffff;
      }
      .price{
        margin-top: 24px;
        font-size: 60px;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
  .list-title{
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin: 0 0 10px 0;
    color: #dbdbdb;
    .iconfont{
      font-size: 31px;
      margin-right: 4px;
      color: #dbdbdb;
    }
  }
  /deep/ .van-tabs--line .van-tabs__wrap{
    .van-tabs__nav .van-tabs__line{
      background-color: @mainColorB;
      height: 4px;
    }
    .van-tab{
      color: @lightGrey;
      font-size: 30px;
      &.van-tab--active{
        color: @mainColorB;
      }
    }
  }
  .list{
    padding: 40px 24px 0px;
    box-sizing: border-box;
    .tiqu{
      color: #bf9761;
      border:1px solid #bf9761;
      border-radius: 25px;
      padding: 5px 25px;
      margin-right: 25px;
    }
    .co99 { color: #999;   margin-right: 25px;}
    .item{
      padding: 24px 0 24px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      background:#fff;
      box-shadow:0px 10px 20px rgba(14,66,128,0.05);
      border-radius: 10px;
      align-items: center;
      .box{
        width: 100%;
        .title{
          border-bottom: 3px dashed @moreLightGrey;
          padding: 0 0 21px 24px;
          box-sizing: border-box;
          .time{
            font-size: 26px;
            font-weight: bold;
          }
          .text{
            font-size: 26px;
            color: @green;
            &.noget{
              color: @yellow;
            }
            &.doning{
              color: @mainColorB;
            }
            &.fail{
              color: @red;
            }
          }
        }
        i{
          font-size: 48px;
          color: @mainColorB;
          margin-right: 10px;
        }
        .msg{
          padding: 22px 0 0 24px;
          box-sizing: border-box;
          .text{
            font-size: 28px;
            color: @subTextColor;
          }
        }
      }
      .icon{
        font-size: 16px;
        margin-left: 40px;
        color: @lightGrey;
        color:#999999;
      }
    }
  }
}
</style>

