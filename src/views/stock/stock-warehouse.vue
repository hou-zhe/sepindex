<template>
  <div class="stock-inbound">
    <div class="stock-inbound-top">
      <div class="stock-inbound-lft">
        <div class="stock-inbound-top-item">
          <span style="flex-shrink: 0;margin-right: 10px;">物品种类</span>
          <el-select v-model="search.type" placeholder="请选择物品种类" style="width: 200px;" @change="onSearch">
            <el-option v-for="(item, index) in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="stock-inbound-top-item">
          <span style="flex-shrink: 0;margin-right: 10px;">物品名称</span>
          <el-input v-model="search.name" style="width: 200px;" placeholder="请输入物品名称" @keyup.enter.native="onSearch"></el-input>
        </div>
        <div class="stock-inbound-top-item">
          <span style="flex-shrink: 0;margin-right: 10px;">日期选择</span>
          <el-date-picker
            v-model="search.time"
            style="width: 270px;margin-right: 20px;"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onSearch"
            :clearable="false"
          ></el-date-picker>
        </div>
        <div class="stock-inbound-top-item"><el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button></div>
        <div class="stock-inbound-top-item"><el-button type="primary" @click="onSearchZero" icon="el-icon-refresh">重置</el-button></div>
        <div class="stock-inbound-top-item"><el-button type="primary" icon="el-icon-download" @click="onExport">导出</el-button></div>
        
      </div>


      <div class="stock-inbound-rgt">
        <div class="stock-inbound-top-item">
        	<el-button type="primary" @click="onSummary">盘点</el-button>
        </div>
        <div class="stock-inbound-top-item">
        	<el-button type="primary" @click="onSummaryHis">盘点历史</el-button>
        </div>
      </div>
    </div>
    <el-table class="table-fixed" :data="list" stripe border fit highlight-current-row :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" v-loading="loading">
      <el-table-column align="center" label="物品类型" style="max-width: 250px;" width="200">
        <template slot-scope="{ row }">
          {{ row.cur_date }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物品名称">
        <template slot-scope="{ row }">
          {{ row.receivables }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位">
        <template slot-scope="{ row }">
          {{ row.discount_amount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存量" width="100">
        <template slot-scope="{ row }">
          {{ row.refund_amount }}
        </template>
      </el-table-column>
    </el-table>
    <Costompagination
      :page="pages.page"
      :pageSize="pages.pageSize"
      :pageSizes="pages.pageSizes"
      :total="pages.total"
      @onSizeChange="onSizeChange"
      @onCurrentChange="onCurrentChange"
      class="myPagination"
    ></Costompagination>
    <!-- <p class="tishi">  应收总计：房费+商品，应收款的总和</p>
    <p class="tishi">  实收总计：房费+商品，实际到账的总和，含通联实收、现金实收、团购实收</p>
    <p class="tishi">  优惠总计：房费+商品，优惠总和</p>
    <p class="tishi"> 退款总计：房费+商品，实际退款总和</p>
    <p class="tishi"> 实收总计=应收总计-优惠总计-退款总计</p> -->
  </div>
</template>

<script>
import { getToken } from '../../utils/auth.js';
import { addAll } from '../../utils/index.js';
import { goodscategoryselect } from '../../api/api.js';
export default {
  name: 'StockWarehouse',
  data() {
    return {
      pages: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        total: 400
      },
      search: {
        type: '',
        name:'',
        time: []
      },
      loading: false,
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
      typeList: [],
      list: [],
      header: {}
    };
  },

  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      // await storeselect(this.id).then(res => {
      //   this.storefrontList = res.result;
      //   this.search.storefront = res.result[0].id;
      // });
      // await roomtypeselect(this.id).then(res => {
      //   this.typeList = addAll(res.result);
      // });
      // await cashierroomselect(this.id).then(res => {
      //   this.roomList = addAll(res.result);
      // });
      await this.getTime(0);
    },
    getCategory() {
      goodscategoryselect(this.id).then((res) => {
        this.typeList = addAll(res.result);
      });
    },
    getTime(e) {
      this.loading = true;
      if (e == 0) {
        let data = new Date();
        let year = data.getFullYear();
        let month = Number(data.getMonth() + 1) < 10 ? '0' + Number(data.getMonth() + 1) : Number(data.getMonth() + 1);

        let day = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();

        let time = year + '-' + month + '-' + day;

        this.search.time.push(time, time);
      }

      // cashierreportdaily(this.id, this.search.type, this.search.room, this.search.time[0], this.search.time[1], this.pages.page, this.pages.pageSize).then(res => {
      //   this.loading = false;
      //   this.list = res.result.data;
      //   this.header = res.result.header;
      //   this.pages.total = res.result.total;
      // });
    },
    onInbound(){

    },
    onSearch() {
      this.pages.page = 1;
      this.getTime(1);
    },
    onSearchZero() {
      this.search.type = '';
      this.search.name = '';
      this.search.time = [];
      this.pages.page = 1;
      this.pages.pageSize = 10;
      this.getTime(0);
    },
    onExport() {
      let href =
        process.env.VUE_APP_BASE_API +
        '/cashier/report/daily/export?store_id=' +
        this.id +
        '&room_type_id=' +
        this.search.type +
        '&room_id=' +
        this.search.room +
        '&start=' +
        this.search.time[0] +
        '&end=' +
        this.search.time[1] +
        '&limit=' +
        this.pages.total;
      window.location.href = href;
      this.$message.success('导出收银流水' + this.search.time[0] + '~' + this.search.time[1] + '区间' + this.pages.total + '条数据成功');
    },
    onSummary(){

    },
    onSummaryHis(){

    },
    onSizeChange(val) {
      this.pages.pageSize = val;
      this.getTime(1);
    },
    onCurrentChange(val) {
      this.pages.page = val;
      this.getTime(1);
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-info {
  font-size: 20px;
  margin-right: 10px;
}
.myPagination {
  margin-bottom: 30px !important;
}

.tishi {
  // color: rgb(245, 108, 108);
  line-height: 24px;
  margin: 0;
  font-size: 14px;
}

.stock-inbound {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .table-fixed {
    ::v-deep .el-table__fixed-right {
      height: 100% !important;
    }
    ::v-deep .el-table__fixed {
      height: 100% !important;
    }
  }

  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  ::v-deep input[type='number'] {
    line-height: 1;
    -moz-appearance: textfield !important;
  }
  ::v-deep {
    table {
      width: 100% !important;
    }
  }
  .stock-inbound-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .stock-inbound-lft {
      display: flex;
      align-items: center;
    }
    .stock-inbound-rgt {
      display: flex;
      align-items: center;
    }
    .stock-inbound-top-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 20px;
      margin-right: 20px;
    }
  }
}
</style>
