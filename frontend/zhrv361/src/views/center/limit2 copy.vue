<template>
  <div class="BOX">
    <div id="echart2" style="width: 100%;height: 90%; padding-top: .6rem" />
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
export default {
  name: 'ECharts',
  // components: {
  //   topMsg
  // },
  data() {
    return {
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
      this.drawLine()
    }, 500)
  },
  created() {
    this.getecharts()
  },
  methods: {
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
      const eChart = echarts.init(document.getElementById('echart2'))
      // 绘制图表
      const option = {
        baseOption: {
        // title: {
        //   left: '10%',
        //   subtext: '代付统计'
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
            data: ['代付失败', '代付成功'],
            // selectedMode: 'single', // 单选
            selected: {
              '代付失败': true
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
              name: '代付失败',
              type: 'bar',
              stack: '代付',
              label: {
                color: '#666',
                show: true
              },
              barMaxWidth: 35,
              itemStyle: {
                normal: {
                  color: '#c23531'
                }
              },
              data: this.Test_rsf
            },
            {
              name: '代付成功',
              type: 'bar',
              stack: '代付',
              label: {
                color: '#666',
                show: true
              },
              barMaxWidth: 35,
              itemStyle: {
                normal: {
                  color: '#6ab0b8'
                }
              },
              data: this.Test_rss
            }]
        },
        media: [
          {
            option: {
              legend: {
                right: 'center',
                bottom: 0,
                orient: 'horizontal'
              },
              series: [
                {
                  name: '代付失败',
                  type: 'bar',
                  stack: '代付',
                  label: {
                    color: '#666',
                    show: true
                  },
                  barMaxWidth: 35,
                  itemStyle: {
                    normal: {
                      color: '#c23531'
                    }
                  },
                  data: this.Test_rsf
                },
                {
                  name: '代付成功',
                  type: 'bar',
                  stack: '代付',
                  label: {
                    color: '#666',
                    show: true
                  },
                  barMaxWidth: 35,
                  itemStyle: {
                    normal: {
                      color: '#6ab0b8'
                    }
                  },
                  data: this.Test_rss
                }
              ]
            }
          },
          {
            query: {
              minAspectRatio: 1
            },
            option: {
              legend: {
                right: 'center',
                bottom: 0,
                orient: 'horizontal'
              },
              yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
              },
              xAxis: {
                type: 'category',
                data: this.Test_Time
              },
              series: [
                {
                  name: '代付失败',
                  type: 'bar',
                  stack: '代付',
                  label: {
                    color: '#666',
                    show: true
                  },
                  barMaxWidth: 35,
                  itemStyle: {
                    normal: {
                      color: '#c23531'
                    }
                  },
                  data: this.Test_rsf
                },
                {
                  name: '代付成功',
                  type: 'bar',
                  stack: '代付',
                  label: {
                    color: '#666',
                    show: true
                  },
                  barMaxWidth: 35,
                  itemStyle: {
                    normal: {
                      color: '#6ab0b8'
                    }
                  },
                  data: this.Test_rss
                }
              ]
            }
          },
          {
            query: {
              maxAspectRatio: 1 // maxAspectRatio: 1           // 当长宽比小于1时。
            },
            option: {
              legend: {
                // right: 'center',
                // bottom: 0,
                // orient: 'horizontal'
              },
              yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
              },
              xAxis: {
                type: 'category',
                data: this.Test_Time
              },
              series: [
                {
                  name: '代付失败',
                  type: 'bar',
                  stack: '代付',
                  label: {
                    color: '#666',
                    show: true
                  },
                  barMaxWidth: 35,
                  itemStyle: {
                    normal: {
                      color: '#c23531'
                    }
                  },
                  data: this.Test_rsf
                },
                {
                  name: '代付成功',
                  type: 'bar',
                  stack: '代付',
                  label: {
                    color: '#666',
                    show: true
                  },
                  barMaxWidth: 35,
                  itemStyle: {
                    normal: {
                      color: '#6ab0b8'
                    }
                  },
                  data: this.Test_rss
                }
              ]
            }
          },
          {
            query: {
              maxWidth: 500
            },
            option: {
              title: {
                // text: '结算统计',
                // subtext: ''
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                left: 'center',
                top: '1%',
                // orient: 'vertical'
              },
              yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
              },
              xAxis: {
                type: 'category',
                data: this.Test_Time
              },
              series: [
                {
                  name: '代付失败',
                  type: 'bar',
                  stack: '代付',
                  label: {
                    color: '#666',
                    show: true
                  },
                  barMaxWidth: 35,
                  itemStyle: {
                    normal: {
                      color: '#c23531'
                    }
                  },
                  data: this.Test_rsf
                },
                {
                  name: '代付成功',
                  type: 'bar',
                  stack: '代付',
                  label: {
                    color: '#666',
                    show: true
                  },
                  barMaxWidth: 35,
                  itemStyle: {
                    normal: {
                      color: '#6ab0b8'
                    }
                  },
                  data: this.Test_rss
                }
              ]
            }
          }
        ]
      }
      eChart.setOption(option)
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
.BOX{
  height: 90%;
  width: 100%;
}
.charts_title{margin: 1rem auto; text-align: center; position: relative;
 .name{padding: 0.05rem 0.5rem; background:#6ab0b8; border:1px solid #6ab0b8; color:#fff; margin: 0 1rem;}
}

</style>
