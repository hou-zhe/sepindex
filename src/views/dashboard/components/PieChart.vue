<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      default: '300px'
    },
    chartdata: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartdata: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(){
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartdata);
    },
    setOptions(chartdata) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: [
          {
            top: 10,
        	  bottom: 0,
        	  right: '1%',
        	  left: 0,
        	  containLabel: true
          }
        ],
        legend: {
          left: 'center',
          bottom: '10',
        },
        series: [
          {
            name: '复购率',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '40%'],
            data: chartdata,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
