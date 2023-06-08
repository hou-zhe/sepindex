<template>
  <div class="cashier-flow">
    <div class="cashier-flow-top">
      <div class="cashier-flow-top-item">
        <span style="flex-shrink: 0; margin-right: 10px">店面选择</span>
        <el-select
          v-model="search.storefront"
          placeholder="请选择店面"
          style="width: 200px"
          @change="onSearch"
        >
          <el-option
            v-for="(item, index) in storefrontList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>

        <!-- <span style="flex-shrink: 0;">商品订单号：</span> -->
        <!-- <el-input v-model="search.order" placeholder="请输入有效的商品订单号" @keyup.enter.native="onSearch" ></el-input> -->
      </div>
      <div class="cashier-flow-top-item">
        <span style="flex-shrink: 0; margin-right: 10px">房型</span>
        <el-select
          v-model="search.type"
          placeholder="请选择房型"
          style="width: 200px"
          @change="onSearch"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>

      <div class="cashier-flow-top-item">
        <span style="flex-shrink: 0; margin-right: 10px">房台</span>
        <el-select
          v-model="search.room"
          placeholder="请选择房台"
          style="width: 200px"
          @change="onSearch"
        >
          <el-option
            v-for="(item, index) in roomList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>

      <div class="cashier-flow-top-item">
        <span style="flex-shrink: 0; margin-right: 10px">日期</span>
        <el-date-picker
          v-model="search.time"
          style="width: 400px; margin-right: 20px"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          placeholder="请选择日期"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onSearch"
          :clearable="false"
        ></el-date-picker>
      </div>
      <div class="cashier-flow-top-item cashier-flow-top-item2">
        <span style="flex-shrink: 0; margin-right: 10px">单据类型</span>
        <el-select
          v-model="search.invoice"
          placeholder="请选择房型"
          style="width: 200px"
          @change="onSearch"
        >
          <el-option
            v-for="(item, index) in invoiceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="cashier-flow-top-item">
        <el-button type="primary" icon="el-icon-search" @click="onSearch"
          >查询</el-button
        >
      </div>
      <div class="cashier-flow-top-item">
        <el-button type="primary" @click="onSearchZero" icon="el-icon-refresh"
          >重置</el-button
        >
      </div>
      <div class="cashier-flow-top-item">
        <el-button type="primary" icon="el-icon-download" @click="onExport"
          >导出</el-button
        >
      </div>
    </div>

    <div class="cashier-flow-ctr-wrapper">
      <div class="cashier-flow-ctr">
        <div   @click="onNoteDialog">
        <el-popover
          placement="bottom"
          title="字段解释"
          width="280"
          trigger="hover"
        >
        <div >
          <p class="tishi">应收总计：应收款的总和</p>
          <p class="tishi"> 实收总计：实际到账的总和</p>
          <p class="tishi">  优惠总计：实际优惠总和</p>
          <p class="tishi"> 退款总计：实际退款总和</p>
          <p class="tishi"> 实收总计=应收总计-优惠总计-退款总计</p>
          </div>
          <div  slot="reference"><i class="el-icon-info icon-info"></i></div>
        </el-popover>
       </div> 
        <div class="cashier-flow-ctr-item">
          应收总计：<span class="cashier-money">{{ header.total_price }}</span>
          元
        </div>
        <div class="cashier-flow-ctr-item">
          实收总计：<span class="cashier-money">{{ header.total_amount }}</span>
          元
        </div>
        <div class="cashier-flow-ctr-item">
          优惠总计：<span class="cashier-money">{{ header.total_discount }}</span> 元
        </div>
        <div class="cashier-flow-ctr-item">
          退款总计：<span class="cashier-money">{{ header.total_refund }}</span> 元
        </div>
        <div class="cashier-flow-ctr-item">
          通联实收：<span class="cashier-money">{{ header.allin_amount }}</span>
          元
        </div>
        <div class="cashier-flow-ctr-item">
          现金实收：<span class="cashier-money">{{ header.cash_amount }}</span>
          元
        </div>
        <div class="cashier-flow-ctr-item">
          团购实收：<span class="cashier-money">{{
            header.groupon_amount
          }}</span>
          元
        </div>
 
      </div>
    </div>

    <el-table
      class="table-fixed"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      v-loading="loading"
    >
      <el-table-column
        align="center"
        label="单号"
        style="max-width: 250px"
        width="200"
        
      >
        <template slot-scope="{ row }">
          <i
            class="el-icon-warning"
            v-if="row.status == 941"
            style="color: #f56c6c"
          ></i>
          {{ row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="门店" width="180">
        <template slot-scope="{ row }">
          <div style="min-width: 200px">
            {{ row.store_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="房型">
        <template slot-scope="{ row }">
          {{ row.room_type_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="房号" width="100">
        <template slot-scope="{ row }">
          {{ row.room_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="单据类型" width="100">
        <template slot-scope="{ row }">
          {{ row.status_text }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="计费类型" width="100">
        <template slot-scope="{ row }">
          {{ row.charge_type_text }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" width="100">
        <template slot-scope="{ row }">
          {{ row.pay_type_text }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="应收" width="120">
        <template slot-scope="{ row }">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠" width="120">
        <template slot-scope="{ row }">
          {{ row.discount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="退款" width="120">
        <template slot-scope="{ row }">
          {{ row.refund }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实收" width="120">
        <template slot-scope="{ row }">
          {{ row.total_fee }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="交易单号" width="180">
        <template slot-scope="{ row }">
          {{ row.transaction_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付时间" width="180">
        <template slot-scope="{ row }">
          {{ row.paid_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="退款时间" width="180">
        <template slot-scope="{ row }">
          {{ row.refunded_at }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="操作"
        fixed="right"
        width="240"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            :disabled="!row.returnable"
            @click="onDel(row.id)"
            >退款</el-button
          >
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
    <!-- <p class="tishi">  应收总计：应收款的总和</p>
    <p class="tishi"> 实收总计：实际到账的总和</p>
    <p class="tishi">  优惠总计：实际优惠总和</p>
    <p class="tishi"> 退款总计：实际退款总和</p>
    <p class="tishi"> 实收总计=应收总计-优惠总计-退款总计</p>
   -->
  </div>
</template>

<script>
import { getToken } from "../../utils/auth.js";
import { addAll } from "../../utils/index.js";
import {
  cashierreportpartyorder,
  storeselect,
  roomtypeselect,
  cashierroomselect,
  partyrefund,
} from "../../api/api.js";
export default {
  name:'CashierFlow',
  data() {
    return {
      pages: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        total: 400,
      },
      loading: false,
      search: {
        storefront: "",
        type: "",
        room: "",
        time: [],
        invoice: "",
      },
      invoiceList: [
        { name: "正常单", id: 1 },
        { name: "退款单", id: 4 },
        { name: "退款失败", id: 941 },
      ],
      roomList: [],
      typeList: [],
      storefrontList: [],

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },

      list: [],
      header: {},
    };
  },
  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.init();
  },
  methods: {
    onNoteDialog() {
      this.$alert(`<strong>应收总计：应收款的总和</strong><br/>
                  <strong>实收总计：实际到账的总和</strong><br/>
                  <strong>优惠总计：实际优惠总和</strong><br/>
                  <strong>退款总计：实际退款总和</strong><br/>
                  <strong>实收总计=应收总计-优惠总计-退款总计</strong><br/>
                  `, '字段解释', {
                          confirmButtonText: '确定',
                          dangerouslyUseHTMLString: true,
      });
      
     },
    onDel(id) {
      this.$confirm("您确定要退款吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        partyrefund({ id, store_id: this.id }).then((res) => {
          if (res.code == 0) {
            this.$message.success("退款成功");
            this.init();
          }
        });
      });
    },
    async init() {
      await storeselect(this.id).then((res) => {
        this.storefrontList = res.result;
        this.search.storefront = res.result[0].id;
      });
      await roomtypeselect(this.id).then((res) => {
        this.typeList = addAll(res.result);
      });
      await cashierroomselect(this.id).then((res) => {
        this.roomList = addAll(res.result);
      });
      await this.getTime(0);
    },
    getTime(e) {
      this.loading = true;
      if (e == 0) {
        let data = new Date();
        let year = data.getFullYear();
        let month =
          Number(data.getMonth() + 1) < 10
            ? "0" + Number(data.getMonth() + 1)
            : Number(data.getMonth() + 1);

        let day = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();

        let time = year + "-" + month + "-" + day + " 00:00:00";
        let timeend = year + "-" + month + "-" + day + " 23:59:59";

        console.log("time============", time);

        this.search.time.push(time, timeend);
      }

      cashierreportpartyorder(
        this.id,
        this.search.type,
        this.search.room,
        this.search.invoice,
        this.search.time[0],
        this.search.time[1],
        this.pages.page,
        this.pages.pageSize
      ).then((res) => {
        this.loading = false;
        this.list = res.result.data;
        this.header = res.result.header;
        this.pages.total = res.result.total;
      });
    },
    onSearch() {
      this.pages.page = 1;
      this.getTime(1);
    },
    onSearchZero() {
      this.search.invoice = "";
      this.search.type = "";
      this.search.room = "";
      this.search.time = [];
      this.pages.page = 1;
      this.pages.pageSize = 10;
      this.getTime(0);
    },
    onChangeTime() {
      // console.log(this.search.time,'time')
    },
    onSizeChange(val) {
      this.pages.pageSize = val;
      this.getTime(1);
    },
    onCurrentChange(val) {
      this.pages.page = val;
      this.getTime(1);
    },
    onExport() {
      let href =
        process.env.VUE_APP_BASE_API +
        "/cashier/report/party-order/export?store_id=" +
        this.id +
        "&room_type_id=" +
        this.search.type +
        "&room_id=" +
        this.search.room +
        "&status=" +
        this.search.invoice +
        "&start=" +
        this.search.time[0] +
        "&end=" +
        this.search.time[1] +
        "&limit=" +
        this.pages.total;
      window.location.href = href;
      this.$message.success(
        "导出房费流水" +
          this.search.time[0] +
          "~" +
          this.search.time[1] +
          "区间" +
          this.pages.total +
          "条数据成功"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.myPagination{
  margin-bottom: 30px !important; 

}
.icon-info{

font-size:20px;
margin-right: 10px;
}

.tishi{
  color: rgb(245, 108, 108);
  line-height: 24px;
  margin: 0;
  font-size: 14px;
}

.cashier-flow {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  ::v-deep input[type="number"] {
    line-height: 1;
    -moz-appearance: textfield !important;
  }
  ::v-deep {
    table {
      width: 100% !important;
    }
  }
  .table-fixed {
    ::v-deep .el-table__fixed-right {
      height: 100% !important;
    }
    ::v-deep .el-table__fixed {
      height: 100% !important;
    }
  }
  .cashier-flow-top {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .cashier-flow-top-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 20px;
      margin-right: 20px;
    }
    // .cashier-flow-top-item2 {
    //   margin-right: 220px;
    // }
  }
  .cashier-flow-ctr-wrapper {
    width: 100%;
    background-color: #fff;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 10px;
    margin-bottom: 20px;
    .cashier-flow-ctr {
      width: 100%;
      background: #f2f2f2;
      padding: 10px 10px;
      box-sizing: border-box;
      color: #666;
      font-size: 14px;
      line-height: 22px;
      word-break: break-all;
      white-space: pre-wrap;
      border-left: 5px solid #323442;
      display: flex;
      flex-wrap: wrap;
      .cashier-flow-ctr-item {
        margin-right: 20px;
      }
      .cashier-money {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
<style>
.el-picker-panel__footer .el-picker-panel__link-btn.el-button--text {
  display: none;
}
</style>
