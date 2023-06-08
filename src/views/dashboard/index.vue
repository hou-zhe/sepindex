<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">欢迎{{ name }}登陆</div> -->
    <div class="dash-top" style="margin-bottom: 20px;width: 100%;height: 60px;">
      <el-row :gutter="20">
        <el-col :span="4"><el-card shadow="always">实收总计：{{today.total_amount}}</el-card></el-col>
        <el-col :span="4"><el-card shadow="always">退款总计：{{today.total_refund}}</el-card></el-col>
        <el-col :span="4"><el-card shadow="always">招待总计：{{today.total_entertain}}</el-card></el-col>
        <el-col :span="4"><el-card shadow="always">开房批次：{{today.open_batch}}</el-card></el-col>
      </el-row>
    </div>
    <div class="dash-time" style="width: 100%;display: flex;justify-content: flex-end;">
      <el-date-picker
        v-model="time"
        style="width: 270px;"
        type="daterange"
        value-format="yyyy-MM-dd"
        placeholder="请选择日期"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="onChangeTime()"
        :clearable="false"
      ></el-date-picker>
    </div>
    <el-row style="padding:16px 16px 0;margin-bottom:32px;"><line-chart :chart-data="lineData" /></el-row>
    <!-- <Bar></Bar> -->
    <el-row :gutter="32" style="display: flex;justify-content: space-between;">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper"><raddar-chart /></div>
      </el-col> -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper"><pie-chart :chartdata="pieData" /></div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper"><bar-chart :chartdata="barData" /></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getToken } from '../../utils/auth.js';
import LineChart from './components/LineChart';
import RaddarChart from './components/RaddarChart';
import PieChart from './components/PieChart';
import BarChart from './components/BarChart';
import Bar from './components/bar.vue';
import { reportmaintoday, reportmaindaily, reportmainrepurchase, reportmainopenrate } from '../../api/api.js';
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
};
export default {
  name: 'Dashboard',
  components: { RaddarChart, PieChart, BarChart, LineChart, Bar },
  data() {
    return {
      name: '',
      id: '',
      time: [],
      lineChartData: [],
      today: {},


      lineData: [],
      pieData: [],
      barData: {xdata:[],ydata:[]},
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
    };
  },
  computed: {
    // ...mapGetters(['name'])
  },
  mounted() {

  },
  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.name = JSON.parse(getToken()).username;
    this.time = this.getRecentSevenDays()
    this.init()
  },
  methods: {
    async init(){
      await this.initToday()
      await this.reportmaindaily()
      await this.reportmainrepurchase()
      await this.reportmainopenrate()
    },
    onChangeTime(){
      this.lineData = []
      this.pieData = []
      this.barData = {xdata:[],ydata:[]},
      this.init()
    },
    initToday(){
      reportmaintoday(this.id).then(res=>{
        this.today = res.result.data
      })
    },
    reportmaindaily() {
      reportmaindaily(this.id,this.time[0],this.time[1]).then(res=>{
        this.lineData = res.result.data.map((obj) => {
          return [obj.date,obj.total_amount]
        })
      })
    },
    reportmainrepurchase(){
      reportmainrepurchase(this.id,this.time[0],this.time[1]).then(res=>{
        this.pieData = [
          {name:'老用户数量',value:res.result.data.old_user},
          {name:'购买用户总数',value:res.result.data.total_user}
        ]
      })
    },
    reportmainopenrate() {
      reportmainopenrate(this.id,this.time[0],this.time[1]).then(res=>{
        res.result.data.forEach(item=>{
          this.barData.xdata.push(item.date)
          this.barData.ydata.push(item.open_rate)
        })
      })
    },
    getRecentSevenDays() {
      var today = new Date(); // 获取当前日期
      var sevenDaysAgo = new Date(today); // 获取七天前的日期
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      var year = today.getFullYear();
      var month = String(today.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1并补0
      var day = String(today.getDate()).padStart(2, '0'); // 补0使日期两位数

      var formattedToday = year + '-' + month + '-' + day;

      year = sevenDaysAgo.getFullYear();
      month = String(sevenDaysAgo.getMonth() + 1).padStart(2, '0');
      day = String(sevenDaysAgo.getDate()).padStart(2, '0');

      var formattedSevenDaysAgo = year + '-' + month + '-' + day;

      return [formattedSevenDaysAgo, formattedToday];
    }
  }
};
</script>

<style>
.el-table__fixed .is-scrolling-right {
  box-shadow: 0 0 10px rgb(0 0 0 / 12%);
}
.el-table__fixed .el-table__fixed-right {
  box-shadow: 0 0 10px rgb(0 0 0 / 12%);
}
</style>

<style lang="scss" scoped>
.dashboard {
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  &-container {
    min-height: calc(100vh - 100px);
    background-color: #fff;
    // background-color: #121212;
    padding: 20px;
    box-sizing: border-box;
    // margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    // color: #fff;
  }
}
</style>
