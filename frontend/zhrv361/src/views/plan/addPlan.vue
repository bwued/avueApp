<template>
  <div class="add-plan-page">
    <top-msg header-name="添加计划" />
    <ul class="list">
      <!-- <li class="item intelligence" @click="$router.push('/intelligence?code='+code)"> -->

<!--      智能还款计划-->
      <li class="item intelligence" @click="Intell" style="display: block;" v-if="show1">
        <img class="img" src="../../../static/img/011.png">
      </li>

<!--      懒人计划 暂不对接 2019/12/4 lhwsoft-->
      <li  class="item custom" @click="IntellV2('/intelligence2')" style="display: block;" v-if="show2">
        <img class="img" src="../../../static/img/03.png">
      </li>

      <!--todo 计划可以配置化  lhwsoft 20200324 -->
    <!--  <li class="item intelligence" @click="IntellV2(item.go_router)" v-for="(item,index) in listRouter" :key="index" >
        <img class="img" :src="item.go_router" >
        <p style="display: block;">{{item.function_name}}</p>
      </li>-->

    </ul>
  </div>
</template>
<script>
import topMsg from '@/components/topMsg'
export default {
  name: 'AddPlan',
  components: { topMsg },
  data() {
    return {
        show1: true,
        show2: true,
      code: '',
      z_user_rate: '',
//      listRouter: [{groupName:'', functionName:'智能还款计划', goRouter:'/intelligence', backRouter:'', enable:'on'}], // 数组可以配置 todo
        listRouter:[],
      code: this.$route.query.code,
      z_user_rate: this.$route.query.z_user_rate
    }
  },
  created() {
    console.log(this.code)
    console.log(this.z_user_rate)
    document.title = '添加计划'
    this.getshow1()
    this.getshow2()
  },
  mounted(){
      this.init('添加计划')
  },
  methods: {
    getshow1(){
        const that  = this
        this.$api.plan.getFunction({groupName:'添加计划' ,functionName:'智能计划'}).then(res => {
            console.log(res)
            if(res.data.data[0].enable === 'on') {
                that.show1 = true
            }else{
                that.show1 = false
            }

        })
    },
      getshow2(){
          const that  = this
          this.$api.plan.getFunction({groupName:'添加计划' ,functionName:'懒人计划'}).then(res => {
              console.log(res)
              if(res.data.data[0].enable === 'on') {
                  that.show2 = true
              }else {
                  that.show2 = false
              }
          })
      },
    init(groupName){
        const that = this
        this.$api.plan.getFunction({groupName:groupName ,functionName:''}).then(res => {
            console.log(res)
            that.listRouter = res.data.data
            for(let i = 0; i< that.listRouter.length; i++){
                that.listRouter[i].src = '../../../static/img'+that.listRouter[i].go_router+'.png'
            }
            console.warn('start....')
            console.warn(JSON.stringify(that.listRouter))
            console.log(that.listRouter)
            console.info('end')
        })
    },

    Intell() {
      const that = this
      console.log(that.code)
      console.log(that.z_user_rate)
      that.$router.push({ path: '/intelligence', query: { code: that.code, z_user_rate: that.z_user_rate }})
    },


    IntellV2(goRouter) {
        if(!goRouter) {
            alert('请联系系统管理员!')
            return
        }
        const that = this
        console.log(that.code)
        console.log(that.z_user_rate)
        that.$router.push({ path: '/intelligenceV2', query: { code: that.code, z_user_rate: that.z_user_rate }})
//        that.$router.push({ path: goRouter, query: { code: that.code, z_user_rate: that.rate }})
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/common.less';
.add-plan-page{
  min-height: 100%;
  background: #ffffff;
  .list{
    padding: 30px;
    box-sizing: border-box;
    .item{
      position: relative;
      width: 100%;
      height: 390px;
      background-color: #fff;
      margin-bottom: 30px;
      .img{
        width: 100%;
        height: 100%;
      }
      .img-btn{
        position: absolute;
        width: 110px;
        height: 110px;
        font-size: 120px;
        color:@mainColorB;
        bottom: 24px;
        right: 24px;
      }
    }
  }
}
</style>

