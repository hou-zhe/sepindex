<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from './mixins/resize';

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData);
    },
    // setOptions({ expectedData, actualData } = {}) {
    //   this.chart.setOption({
    //     backgroundColor: '#1b1b1b',//背景色
    //     xAxis: {
    //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //       boundaryGap: false,
    //       axisTick: {
    //         show: false
    //       },
    //       axisLabel: {
    //         show: true,
    //         textStyle: {
    //           color: '#fff',  //更改坐标轴文字颜色
    //           fontSize : 12      //更改坐标轴文字大小
    //         }
    //       },
    //     },
    //     grid: {
    //       left: 10,
    //       right: 10,
    //       bottom: 20,
    //       top: 30,
    //       containLabel: true
    //     },
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         type: 'cross'
    //       },
    //       padding: [5, 10]
    //     },
    //     yAxis: {
    //       axisTick: {
    //         show: false
    //       },
    //       axisLabel: {
    //         show: true,
    //         textStyle: {
    //           color: '#fff',  //更改坐标轴文字颜色
    //           fontSize : 12      //更改坐标轴文字大小
    //         }
    //       },
    //     },
    //     legend: {
    //       data: ['expected', 'actual'],
    //       textStyle:{
    //           color:'#fff',
    //       }
    //     },
    //     series: [{
    //       name: 'expected', itemStyle: {
    //         normal: {
    //           color: '#FF005A',
    //           lineStyle: {
    //             color: '#FF005A',
    //             width: 2
    //           }
    //         }
    //       },
    //       smooth: true,
    //       type: 'line',
    //       data: expectedData,
    //       animationDuration: 2800,
    //       animationEasing: 'cubicInOut'
    //     },
    //     {
    //       name: 'actual',
    //       smooth: true,
    //       type: 'line',
    //       itemStyle: {
    //         normal: {
    //           color: '#3888fa',
    //           lineStyle: {
    //             color: '#3888fa',
    //             width: 2
    //           },
    //           areaStyle: {
    //             color: 'rgba(0,0,0,0.5)'
    //           }
    //         }
    //       },
    //       data: actualData,
    //       animationDuration: 2800,
    //       animationEasing: 'quadraticOut'
    //     }]
    //   })
    // }
    setOptions(chartdata) {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 50,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          }
        },
        // legend: {
        //   data: ['expected', 'actual']
        // },
        series: [
          {
            name: '日报',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: chartdata,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      });
    }
  }
};
</script>
