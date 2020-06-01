<template>
  <div>
    <top-msg header-name="实名认证" />
    <div class="con_body">
      <div class="form_cells form_cells_form  mgb20">
        <p style="margin-top: 55px; text-align: center;">
          <img src="../../../static/img/success-blue.png" alt="" style="width: 100px;"><br>
          恭喜您！实名认证成功！
        </p>
      </div>

      <div class="btn_warp">
        <button class="btn btn_submit" @click="gotoHome">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import topMsg from '@/components/topMsg'
import chooseCard from '@/components/chooseCard'
import FunComponentsInput from '@/components/FunComponentsInput'
import { Picker } from 'vant'
import { Toast } from 'vant'
import 'vant/lib/picker/style'
import axios from 'axios'
export default {
  name: 'AuthenticationSuccess',
  components: { },
  /* data必须是函数*/
  data: function() {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.thisTitle()
  },
  methods: {
    /* 设置标题*/
    thisTitle: function() {
      document.title = '个人实名认证'
    },
    gotoHome(_url) {
      this.$router.replace('/home')
    }
  }
}
</script>

<style lang="less" scoped>
.form_cells {
  border-top: 0.01rem solid #eeeeee;
}
.form_cell .form_cellHd {
  width: 223px;
}
.btn_getCode {
  padding: 5px 11px;
  font-size: 28px;
  line-height: normal;
  color: #2e51ff;
  background: transparent;
  border-radius: 15px;
  border: 0.01rem solid #2e51ff;
}
.btn_stay {
  padding: 5px 11px;
  font-size: 28px;
  line-height: normal;
  color: #999999;
  background: transparent;
  border-radius: 15px;
  border: 0.01rem solid #999999;
}
.btn_warp > .btn_submit {
  width: 400px;
  height: 74px;
}
.form_cell .form_cellBd .form_input {
  color: #666666;
}
</style>

