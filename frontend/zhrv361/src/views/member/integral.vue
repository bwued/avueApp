<template>
  <div>
    <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="$router.push('/center')">
      <div class="text">
        平台积分
      </div>
    </div>
    <!-- 积分查询 -->
    <div class="member_head">
      <div class="present">
        当前积分
      </div>
      <div style="margin-top:20px;font-size:1.6rem" class="present">
        {{ pointsBalance ||0 }}
      </div>
    </div>
    <!-- 申请积分多少 -->
    <div class="z_integral">
      <span>兑换积分:</span>
      <!-- <input v-model.trim="z_pointsBalance" oninput="if(value.length>16)value=value.slice(0,16)" class="form_input" type="number" placeholder="请输入兑换积分"> -->
      <input v-model.trim="z_pointsBalance" class="form_input" type="tel" maxlength="15" placeholder="请输入兑换积分">
    </div>

    <!-- 确认申请 -->
    <div class="z_bottom">
      <button v-if="pointsBalance!==0" class="btn_footer" @click="confirmWithdraw">
        确认兑换
      </button>
      <button v-else class="btn_unUpgrate">
        确认兑换
      </button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
export default {
  data: function() {
    return {
      z_pointsBalance: '', // 输入积分
      pointsBalance: '', // 查询积分
      //   grade: 1,
      sum: {
        pointsAmount: ''
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 查询积分接口
    getInfo() {
      this.$api.center.getBalance().then(res => {
        console.log('8888899999')
        console.log(res.data.data.pointsBalance)
        this.pointsBalance = res.data.data.pointsBalance
      })
    },
    // 点击确认申请
    confirmWithdraw() {
      const that = this
      const tip = msg => {
        return that.$dialog({
          title: msg,
          showCancelButton: false,
          confirmButtonText: '确定',
          className: 'dialog',
          closeOnClickOverlay: true
        })
      }
      if (!that.z_pointsBalance) {
        tip('请输入积分')
      } else if (that.z_pointsBalance > that.pointsBalance) {
        Toast('兑换积分不能大于当前积分')
        // tip('兑换积分不能大于当前积分')
      } else {
        that
          .$dialog({
            title: '确定要申请积分吗？',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            className: 'dialog',
            closeOnClickOverlay: true
          }).then(() => {
            that.$api.center.applyBalance(that.z_pointsBalance).then(res => {
              if (res.data.code === '200000') {
                Toast(res.data.data.msg)
              }
              this.getInfo()
              this.z_pointsBalance = ''
            })
          }).catch(() => {

          })
      }
    }
  }
}
</script>
<style lang="less" scoped>
//头部返回
.top {
  display: flex;
  flex-flow: row;
  background: #fff;
  padding-bottom: 0.8rem;
  // position: fixed;
  width: 100%;
  img {
    width: 1.1rem;
    height: 1.2rem;
    margin-top: 0.8rem;
    margin-left: 1rem;
  }
  .text {
    color:#333;
    font-size: 1.3rem;
    margin-top: 0.6rem;
    margin-left: 8rem;
  }
}
//积分申请余额
.member_head {
  height: 200px;
  margin: 30px 30px 30px 30px;
  background: linear-gradient(to right, #8a6333, #d4b988);
  box-shadow: 0px 10px 20px rgba(153, 153, 153, 0.3);
  border-radius: 10px;
  padding: 11px 1rem 15px 1rem;
  box-sizing: border-box;
  .present {
    color: white;
    text-align: center;
    font-size: 1.1rem;
    margin-top: 0.8rem;
  }
}
//申请多少积分
.z_integral {
  margin: 30px;
  height: 2.8rem;
  line-height: 2.8rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 10px 20px rgba(184, 185, 187, 0.08);
  opacity: 1;
  border-radius: 10px;
  span {
    padding-left: 1rem;
    color: #333;
    font-size: 1.1rem;
  }
  .form_input {
    border: none;
    outline: 0;
    font-size: 1.1rem;
    background: transparent;
    color: #666;
    margin-left: 1rem;
  }
}

// 确认申请
.btn_footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: #bf9761;
  color: #ffffff;
  font-size: 30px;
  line-height: 100px;
  text-align: center;
  border: none;
}
.btn_unUpgrate{
    position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(
    -90deg,
    rgba(219, 219, 219, 0.8),
    rgba(197, 197, 197, 0.8)
  );
  color: #ffffff;
  font-size: 30px;
  line-height: 100px;
  text-align: center;
  border: none;
}
</style>
