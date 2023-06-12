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
      <el-table-column align="center" label="物品类型">
        <template slot-scope="{ row }">
          {{ row.goods_type_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物品名称">
        <template slot-scope="{ row }">
          {{ row.goods_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位">
        <template slot-scope="{ row }">
          {{ row.unit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存数量">
        <template slot-scope="{ row }">
          {{ row.inv_quantity }}
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
    <el-dialog
      title="盘点"
      :visible.sync="diaPan"
      :close-on-click-modal="false"
      width="55%"
    >
      <div style="display: flex; align-items: center; margin: -20px 0 30px;justify-content: space-between;">
        <span style="flex-shrink: 0;margin-right: 10px;">单号 {{panCode}}</span>
        <div>
          <span style="flex-shrink: 0;margin-right: 10px;">物品种类</span>
          <el-select
            v-model="pan.type"
            placeholder="请选择物品种类"
            style="width: 200px"
            @change="onSearchPan"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <el-table v-loading="diaPanLoading" :data="panList" stripe border fit highlight-current-row ref="pantable" :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" >
        <el-table-column align="center" label="物品类型">
          <template slot-scope="{ row }">
            {{ row.goods_type_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="物品名称">
          <template slot-scope="{ row }">
            {{ row.goods_name }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="单位">
          <template slot-scope="{ row }">
            {{ row.unit }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="库存数量">
          <template slot-scope="{ row }">
            {{ row.inv_quantity }}
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header">
            <el-popover placement="top-start" title="" width="80" trigger="hover" content="双击修改数量">
                <i slot="reference" style="position: absolute;right: 5px;top: 0px;" class="el-icon-warning"></i>
              </el-popover>
            调整后盘点数量
          </template>
          <template slot-scope="{ row,$index }">
            <template v-if="row.isEdit">
              <div style="width:100%;height: 100%" @dblclick="row.isEdit = false">
                {{row.inv_quantity1}}
              </div>
            </template>
            <template v-if="!row.isEdit">
              <el-input
                type="number"
                v-model="row.inv_quantity1"
                @blur="onConfirmPanNum($index,row)"
                oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')"
                @keyup.enter.native="onConfirmPanNum($index,row)"
              ></el-input>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="盈亏数量">
          <template slot-scope="{ row }">
            {{ row.inv_quantity2 }}
          </template>
        </el-table-column>
      </el-table>
      <Costompagination
        :page="pages1.page"
        :pageSize="pages1.pageSize"
        :pageSizes="pages1.pageSizes"
        :total="pages1.total"
        @onSizeChange="onSizeChange1"
        @onCurrentChange="onCurrentChange1"
        class="myPagination"
      ></Costompagination>
      <span slot="footer" sstyle="margin: 0 auto;">
        <el-button @click="diaPan = false">取消</el-button>
        <el-button type="primary" @click="onConfirmPan">提交</el-button>
      </span>
    </el-dialog>
    <!-- 盘点历史 -->
    <el-dialog
      title="盘点历史"
      :visible.sync="diaHis"
      :close-on-click-modal="false"
      width="79%"
    >
      <div style="display: flex;align-items: center;">
        <fieldset
          style="
            border-radius: 10px;
            padding: 20px 10px 10px 10px;
            box-sizing: border-box;
            position: relative;
            border: 1px solid #dcdfe6;
          "
        >
          <legend>历史订单</legend>
          <div style="display: flex; margin: 0px 0 20px;justify-content: space-between;align-items: center;">
            <div style="display: flex;align-items: center;">
              <span style="flex-shrink: 0;margin-right: 10px;">日期</span>
              <el-date-picker v-model="his.time" style="width: 250px;"
                type="daterange" value-format="yyyy-MM-dd" placeholder="请选择日期" :picker-options="pickerOptions" size="mini"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTime(1)" :clearable="false"
              ></el-date-picker>
            </div>

            <div style="display: flex;align-items: center;">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="getTime(1)">查询</el-button>
              <el-button type="primary" size="mini" icon="el-icon-refresh" @click="onResetHis()">重置</el-button>
            </div>

          </div>

          <el-table
            :data="hisList"
            stripe
            border
            fit v-loading="hisLoading"
            highlight-current-row
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            row-key="id"
            height="400"
          >
            <el-table-column align="center" label="盘点单号" width="100px">
              <template slot-scope="{ row }">
                {{ row.code }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="盘点时间" width="80px">
              <template slot-scope="{ row }">
                {{ row.created_at }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作人" width="80px">
              <template slot-scope="{ row }">
                {{ row.username }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100px">
              <template slot-scope="{ row }">
                <el-button :type="row.isShow?'info':'primary'" size="mini" @click="onHisDetail(row)">{{row.isShow?'收起':'详情'}}</el-button>
                <el-button type="primary" size="mini" @click="onHisExport(row.code)">导出</el-button>
              </template>
            </el-table-column>
          </el-table>
          <Costompagination
            :page="pages2.page"
            :pageSize="pages2.pageSize"
            :pageSizes="pages2.pageSizes"
            :total="pages2.total"
            @onSizeChange="onSizeChange2"
            @onCurrentChange="onCurrentChange2"
            class="myPagination"
          ></Costompagination>
        </fieldset>
        <i class="el-icon-right" style="font-size: 35px;" v-if="isDetail"></i>
        <!-- 详情 -->
        <fieldset
          v-if="isDetail"
          style="
            border-radius: 10px;
            padding: 20px 10px 10px 10px;
            box-sizing: border-box;
            position: relative;
            border: 1px solid #dcdfe6;
          "
        >
          <legend>订单详情</legend>
          <div style="display: flex; margin: 0px 0 20px;justify-content: flex-end;align-items: center;">
            <div style="display: flex;align-items: center;">
              <span style="flex-shrink: 0;margin-right: 10px;">物品种类</span>
              <el-select v-model="hisd.type" placeholder="请选择物品种类" style="width: 130px;margin-right: 20px;" @change="initHisDetail()" size="mini" >
                <el-option v-for="(item, index) in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>

            <div style="display: flex;align-items: center;">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="initHisDetail()">查询</el-button>
              <el-button type="primary" size="mini" icon="el-icon-refresh" @click="onResetHisDetail()">重置</el-button>
            </div>

          </div>

          <el-table
            :data="hisDetailList"
            stripe
            border
            fit v-loading="hisDetailLoading"
            highlight-current-row
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            row-key="id"
            height="490"
          >
            <el-table-column align="center" label="物品类型" width="100px">
              <template slot-scope="{ row }">
                {{ row.goods_type_name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="物品名称" width="100px">
              <template slot-scope="{ row }">
                {{ row.goods_name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="单位" width="50px">
              <template slot-scope="{ row }">
                {{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="库存数量" width="80px">
              <template slot-scope="{ row }">
                {{ row.inv_quantity }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="调整后盘点数量" width="120px">
              <template slot-scope="{ row }">
                {{ row.adjusted_quantity }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="盈亏数量" width="80px">
              <template slot-scope="{ row }">
                {{ row.diff_quantity }}
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '../../utils/auth.js';
import { addAll } from '../../utils/index.js';
import { goodscategoryselect, inventorylist, inventorystocktakinglist, inventorystocktakingadd, inventorystocktakinghistorylist, inventorystocktakinghistoryinfo } from '../../api/api.js';
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
      pages1: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        total: 400
      },
      //  盘点历史的page
      pages2: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        total: 400
      },
      pickerOptions:{
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      search: {
        type: '',
        name:''
      },
      loading: false,

      typeList: [],
      list: [],

      diaPan: false,
      panList: [],
      pan: { type: '' },
      panCode: '',
      diaPanLoading: false,

      // 盘点历史
      hisList: [],
      diaHis: false,
      his: {time: []},
      hisLoading: false,

      isDetail: false,
      hisDetailList: [],
      hisd: {type: ''},
      choseHisCode: {},
      hisDetailLoading: false
    };
  },

  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      await this.getCategory()
      inventorylist(this.id, this.search.type, this.search.name, this.pages.page, this.pages.pageSize).then(res => {
        this.loading = false;
        this.list = res.result.data;
        this.pages.total = res.result.total;
      });
    },
    getCategory() {
      goodscategoryselect(this.id).then((res) => {
        this.typeList = addAll(res.result);
      });
    },
    onSearch() {
      this.pages.page = 1;
      this.init();
    },
    onSearchZero() {
      this.search.type = '';
      this.search.name = '';
      this.pages.page = 1;
      this.pages.pageSize = 10;
      this.init();
    },
    onExport() {
      let href =
        process.env.VUE_APP_BASE_API +
        '/cashier/inventory/stocktaking/history/export?store_id=' +
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
      this.panCode = ''
      this.pan.type = ''
      this.diaPan = true
      this.diaPanLoading = true
      this.inittakinglist()
    },
    inittakinglist(){
      inventorystocktakinglist(this.id,this.pan.type,this.pages1.page,this.pages1.pageSize).then(res => {
        this.panCode = res.result.code
        this.diaPanLoading = false
        this.diaPan = true
        this.pages1.total = res.result.total
        res.result.data.forEach(item => {
          item.isEdit = true;
          item.inv_quantity1 = item.inv_quantity
          item.inv_quantity2 = item.inv_quantity - item.inv_quantity1
        })

        this.panList = res.result.data
      })
    },
    onSummaryHis(){
      this.isDetail = false
      this.his.time = []
      this.getTime(0)
    },
    getTime(e) {
      this.diaHis = true
      this.hisLoading = true;
      if (e == 0) {
        let data = new Date();
        let year = data.getFullYear();
        let month = Number(data.getMonth() + 1) < 10 ? '0' + Number(data.getMonth() + 1) : Number(data.getMonth() + 1);

        let day = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();

        let time = year + '-' + month + '-' + day;

        this.his.time.push(time, time);
      }

      inventorystocktakinghistorylist(this.id,this.his.time[0],this.his.time[1],this.pages2.page,this.pages2.pageSize).then(res=>{
        res.result.data.forEach(item => {
          item.isShow = false
        })
        this.hisList = res.result.data;
        this.pages2.total = res.result.total
        this.hisLoading = false;
      })
    },

    onConfirmPanNum(e,obj){
      this.$set(this.panList[e],'inv_quantity1',obj.inv_quantity1)
      this.$set(this.panList[e],'inv_quantity2',this.panList[e].inv_quantity - this.panList[e].inv_quantity1)
      this.$set(this.panList[e],'isEdit',true)
      this.$refs.pantable.doLayout()
      this.$forceUpdate()
    },
    onSearchPan(){
      this.inittakinglist()
    },
    onConfirmPan(){
      let goods = []
      goods =  this.panList.map(item =>{
        return {
          good_id: item.id,
          adjusted_quantity: Number(item.inv_quantity1)
        }
      })
      inventorystocktakingadd({store_id: this.id, goods: goods}).then(res=>{
        this.$message.success('提交成功')
        this.pan.type = ''
        this.diaPan = false
      })
    },
    // 盘点历史
    onHisDetail(obj) {
      if(obj.isShow) {
        obj.isShow = false
      }else {
        this.hisList.forEach(item =>{
          this.$set(item,'isShow',false)
        })
        obj.isShow = true
      }
      if(obj.isShow) {
        this.isDetail = true
      }else {
        this.isDetail = false
      }
      if(this.isDetail) {
        this.choseHisCode = obj
        this.initHisDetail()
      }

    },
    initHisDetail(){
      inventorystocktakinghistoryinfo(this.id,this.choseHisCode.code,this.hisd.type).then(res => {
        res.result.data.forEach(item =>{
          item.isShow = false
        })
        this.hisDetailList = res.result.data
      })
    },
    onHisExport(code) {
        let href = process.env.VUE_APP_BASE_API + '/cashier/inventory/stocktaking/history/export?store_id=' + this.id + '&stocktaking_code=' + code
        window.location.href = href;
        this.$message.success('导出盘点历史数据成功');
    },
    onResetHis(){
      this.his.time = []
      this.getTime(0)
    },
    onResetHisDetail(){
      this.hisd.type = ''
      this.initHisDetail()
    },
    onSizeChange(val) {
      this.pages.pageSize = val;
      this.init();
    },
    onCurrentChange(val) {
      this.pages.page = val;
      this.init();
    },

    onSizeChange1(val) {
      this.pages1.pageSize = val;
      this.inittakinglist();
    },
    onCurrentChange1(val) {
      this.pages1.page = val;
      this.inittakinglist();
    },
    onSizeChange2(val) {
      this.pages2.pageSize = val;
      this.getTime(1);
    },
    onCurrentChange2(val) {
      this.pages2.page = val;
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
