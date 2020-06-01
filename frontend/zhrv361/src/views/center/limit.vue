<template>
  <div class="BOX">
    <!-- <top-msg header-name="交易额度" /> -->
    <div class="top">
      <img src="../../../static/img/xiangqing@2x.png" @click="$router.push('/center')">
      <div class="text">
        {{ text }}
      </div>
    </div>

    <div id="zhihuijin">
      <span v-for="(item, index) in tabList" :key="index" class="h_btn " :class="{active:index==guigeSpan}" @click="guige(index)">{{ item.text }}</span>
    </div>
    

    <div id="limit">
      <ul class="list">
        <li v-if="show">
          <limit1 />
        </li>
        <li v-if="!show">
          <limit2 />
        </li>
      </ul>
    </div>
  </div>
  </div>
</template>

<script>
// 引入基本模板
const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')

// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
// import topMsg from '@/components/topMsg'


import limit1 from './limit1.vue'
import limit2 from './limit2.vue'
export default {
  name: 'ECharts',
  components: { limit1, limit2 },
  data() {
    return {
      show: true,
      active: 0,
      guigeSpan: 0,
      tabList: [
        {
          id: 0,
          text: '消费'
        },
        {
          id: 1,
          text: '代付'
        }
      ],
      activeName: 'a',
      echart1: true,
      echart2: true,
      text: '每日小结',
      list: [],
      Test_Time: [], // 时间
      Test_cs: [], // 消费成功数
      Test_csf: [], // 消费失败数
      Test_rss: [], // 结算成功数
      Test_rsf: [] // 结算失败数
    }
  },
  mounted() {
    setTimeout(() => {
      // this.drawLine()
      // this.toggle()
    }, 500)
  },
  created() {
    this.getecharts()
  },
  methods: {
    guige: function(index) { // 当点击时候点亮，同级的span标签删除Class
      this.guigeSpan = index
      console.log(index)
      if (index == 0) {
        // this.getList()
        this.show = true
      }
      if (index == 1) {
        // this.getList2()
        this.show = false
      }
    },
    toggle(i) {
      if (i === 1) {
        this.echart1 === true
        this.echart2 === false
      }
      if (i === 2) {
        this.echart1 === false
        this.echart2 === true
      }
    },
    getecharts() { // 获取图表列表
      this.$api.center.getEcharts().then(res => {
        this.list = res.data.data.daily_summary_resp_vo_list
        console.log('获取图表列表')
        console.log(this.list)
        this.listArr()
      })
    },
    listArr() {
      var ArrTime = '' // 时间
      var Arr_cs = '' // 消费成功数
      var Arr_csf = '' // 消费失败数
      var Arr_rss = '' // 结算成功数
      var Arr_rsf = '' // 结算失败数
      console.log(this.list)
      const that = this
      that.list.forEach(function(e) {
        ArrTime += e.gmt_create.substring(4, 6) + '/' + e.gmt_create.substring(6, 8) + ','
      })
      ArrTime = ArrTime.substring(0, ArrTime.length - 1)
      this.Test_Time = ArrTime.split(',')

      this.list.forEach(function(e) {
        Arr_cs += e.consumer_success + ',' // 消费成功数
        Arr_csf += e.consumer_failed + ',' // 消费失败数
        Arr_rss += e.remission_success + ',' // 结算成功数
        Arr_rsf += e.remission_failed + ',' // 结算失败数
      })
      Arr_cs = Arr_cs.substring(0, Arr_cs.length - 1) // 消费成功数
      this.Test_cs = Arr_cs.split(',')

      Arr_csf = Arr_csf.substring(0, Arr_csf.length - 1) // 消费失败数
      this.Test_csf = Arr_csf.split(',')

      Arr_rss = Arr_rss.substring(0, Arr_rss.length - 1) // 代付成功数
      this.Test_rss = Arr_rss.split(',')

      Arr_rsf = Arr_rsf.substring(0, Arr_rsf.length - 1) // 代付失败数
      this.Test_rsf = Arr_rsf.split(',')
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const eChart = echarts.init(document.getElementById('echart'))
      // 绘制图表
      eChart.setOption({
        // title: {
        //   left: '10%',
        //   subtext: '消费统计'
        // },
        tooltip: {
          trigger: 'axis',
          // showContent: false,
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        legend: {
          data: ['消费失败', '消费成功'],
          // selectedMode: 'single', // 单选
          selected: {
            '代付': false
          }
        },
        yAxis: {
          name: '（日期）',
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          data: this.Test_Time
        },
        grid: {
          left: 60,
          right: 65
        },
        xAxis: {
          name: '（总量）',
          axisLabel: { rotate: 50, interval: 0 },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          }

        },
        series: [
          {
            name: '消费失败',
            type: 'bar',
            stack: '消费',
            label: {
              position: 'right',
              color: '#666',
              show: true
            },
            barMaxWidth: 35,
            itemStyle: {
              normal: {
                color: '#c23531'
              }
            },
            data: this.Test_csf
          }, {
            name: '消费成功',
            type: 'bar',
            stack: '消费',
            label: {
              color: '#666',
              show: true
            },
            barMaxWidth: 35,
            itemStyle: {
              normal: {
                color: '#6ab0b5'
              }
            },
            data: this.Test_cs
          }]
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
  // position: fixed;
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
    margin-top: 0.6rem;
    margin-left: 8rem;
  }
}
#zhihuijin {
  margin: 30px auto 20px;  border: 1px solid #bf9761; width: 60%; border-radius: 10px; height: 60px; line-height: 60px;
  .h_btn{
     color:#bf9761; float: left; display: inline-block;
    width: 50%; text-align: center; cursor: pointer;
  }
  .active{ background: #bf9761; color: #fff;}
}

#limit{
  height: 80%;
  min-height: 56rem;
  ul,li{ height: 100%;}
}
.BOX{
  height: 90%;
  width: 100%;
  .title{ color: #bf9761;text-align: left; border-bottom: 1px dashed #bf9761;  padding: 0.2rem; width: 90%; margin: 0.6rem auto;}
}
.charts_title{margin: 1rem auto; text-align: center; position: relative;
 .name{padding: 0.05rem 0.5rem; background:#6ab0b8; border:1px solid #6ab0b8; color:#fff; margin: 0 1rem;}
}

</style>
