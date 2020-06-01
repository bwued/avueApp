<template>
  <div>
    <!--会员费率表 start-->
    <van-dialog
      v-model="rateDialog"
      :show-confirm-button="showFalse"
      :before-close="beforeClose"
      close-on-click-overlay
    >
      <div class="rate_table">
        <div class="table_title">
          <h5 class="z_h5">{{ feeDetailMsg.rank.rank_name }}费率表</h5>
        </div>
           <!-- <span class="z_right">
            <select class="z_fl" >
                <option value="收款">收款</option>
                <option value="代还">代还</option>
              </select>
          </span> -->
        <div class="table_content">
          <div class="con_tr flex flex_align">
            <span class="con_th w40">通道名称</span>
            <span class="con_th w30 cen">费用</span>
            <span class="con_th w30 textalign_right">结算</span>
          </div>
          <div
            v-for="(item,index) in feeDetailMsg.channel_list"
            :key="index"
            class="con_tr flex flex_align"
          >
            <span class="con_td w40 textEllipsis">{{ item.channel_name }}</span>
            <span class="con_td w30 cen">{{ computeRate(item.big_decimal) }}%</span>
            <span class="con_td w30 textalign_right">{{ computeFee(item.fee) }}元/笔</span>
          </div>
        </div>
        <div class="cen">
          <button type="button" class="btn btn_confirm" @click="closeDialog">知道了</button>
        </div>
      </div>
    </van-dialog>
    <!--会员费率表 end-->
  </div>
</template>

<script>
export default {
  name: "FeeList",
  // 接受父组件的值
  props: {
    feeDetailMsg: {
      type: Object,
      default: () => {}
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  /* data必须是函数*/
  data: function() {
    return {
      hello:"費率",
      rateDialog: true, // 会员费率表
      showFalse: false // 是否显示弹框的确认按钮，false
    };
  },
  created() {},
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = "费率表";
    },
    /* 在弹框关闭前的函数*/
    beforeClose(action, done) {
      done();
      this.$emit("valueClose", false);
    },
    /* 点击关闭*/
    closeDialog() {
      this.$emit("valueClose", false);
    },
    /* 计算rate*/
    computeRate(item) {
      return item ? (item * 100).toFixed(2) : 99;
    },
    /* 计算fee*/
    computeFee(item) {
      return item ? (item / 100).toFixed(2) : 99;
    }
  }
};
</script>

<style lang="less" scoped>
.z_right{
  position: relative;
  top: -1.2rem;
  left: 14rem;
}
/* 费率表 start*/
.table_title {
  padding-top: 30px;
  font-size: 36px;
  color: #333333;
  text-align: center;
}
.table_content {
  height: 400px;
  margin: 30px 0 30px;
  padding: 0 30px 0;
  overflow-y: scroll;
}
.con_tr {
  line-height: 64px;
  border-bottom: 0.01rem solid #eeeeee;
}
.con_th {
  font-size: 26px;
  color: #333333;
}
.con_td {
  font-size: 24px;
  color: #666666;
}
.btn_confirm {
  width: 510px;
  height: 70px;
  /* margin-bottom: 30px; */
  background: linear-gradient(
    90deg,
    rgba(246, 197, 126, 1),
    rgba(222, 170, 89, 1)
  );
  border-radius: 15px;
}
/* 费率表 end*/
</style>
<style>
/* vant样式修改 */
.van-hairline--top:after {
  border-top-width: 0;
}
</style>
