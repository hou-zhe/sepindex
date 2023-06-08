<template>
  <div class="founding">
    <div class="founding-top">
      <div class="founding-top-item">
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

      
      </div>
      <div class="founding-top-item">
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
      <div class="founding-top-item">
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

      <div class="founding-top-item">
        <span style="flex-shrink: 0; margin-right: 10px">物品种类</span>
        <el-select
         multiple 
          v-model="search.goodtype"
          placeholder="请选择物品种类"
          style="width: 200px"
          @change="onSearch"
        >
        <el-checkbox
                v-model="check"
                class="m-l-20"
                @change="selectAll"
              >
                全选
        </el-checkbox>
        <el-option
            v-for="(item, index) in goodsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        ></el-option>
        </el-select>
      </div>

      <div class="founding-top-item">
        <span style="flex-shrink: 0; margin-right: 10px">下单时间</span>
        <el-date-picker
          class="my-picker"
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

      <div class="founding-top-item">
        <el-button type="primary" icon="el-icon-search" @click="onSearch"
          >查询</el-button
        >
      </div>
      <div class="founding-top-item">
        <el-button type="primary" @click="onSearchZero" icon="el-icon-refresh"
          >重置</el-button
        >
      </div>
      <div class="founding-top-item">
        <el-button type="primary" icon="el-icon-download" @click="onExport"
          >导出</el-button
        >
      </div>
    </div>


    <el-table
      class="table-fixed"
      ref="salesTab"
      :data="list"
      @sort-change="onSort"
      stripe
      border
      fit
      highlight-current-row
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      v-loading="loading"
    >
      <el-table-column
        align="center"
        label="物品种类"
        style="max-width: 250px"
      >
        <template slot-scope="{ row }">
          {{ row.good_type_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物品名称" >
        <template slot-scope="{ row }">
          <div style="min-width: 200px">
            {{ row.goods_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="sort-class" align="center" label="超市销量" sortable="custom"  :sort-orders="sortorder"  width="300"   prop="goods_num" >
        <template slot-scope="{ row }">
          {{ row.goods_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="赠送销量" sortable="custom"  :sort-orders="sortorder" width="300"  prop="present_num" >
        <template slot-scope="{ row }">
          {{ row.present_num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="总销量" sortable="custom"  :sort-orders="sortorder"  prop="total_num"   width="300">
        <template slot-scope="{ row }">
          {{ row.total_num }}
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
    <div class="analysis-tips">
      <p class="tishi">  注：超市销量：超市售卖数量总计</p>
    <p class="tishi"> 注：赠送销量：“赠送的商品”与“开房套餐含的商品”与“物品套餐含的商品”的总计</p>
    </div>

   
  </div>
</template>

<script>
import { getToken } from "../../utils/auth.js";
import { addAll } from "../../utils/index.js";
import {

  storeselect,
  roomtypeselect,
  goodscategoryselect,
  cashierroomselect,
  goodsrefund,
  outboundgoods,
} from "../../api/api.js";
export default {
  name:'ProductSales',
  data() {
    return {
     
      pages: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        total: 0,
      },
      loading: false,
      search: {
        storefront: "",
        type: "",
        room: "",
        time: [],
        goodtype:[],
        invoice: "",
      },
      roomList: [],
      invoiceList: [
        { name: "正常单", id: 1 },
        { name: "退款单", id: 4 },
        { name: "退款失败", id: 941 },
      ],
      goodsList: [],
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
      sort_field: '',
      sort_position: '',
      sortorder:['descending', 'ascending', null] 
    };
  },
  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.init();
  },
  methods: {
    onSort(e) { 
      console.log('排序', e);
      if (e.order == 'descending') {
        this.sort_position = 'desc'
        this.sort_field =e.prop
      } else if(e.order == 'ascending') {
        this.sort_position = 'asc'
        this.sort_field =e.prop
      } else {
        this.sort_position = ''
        this.sort_field =''
      }
      
      this.onSearch()
    },
    selectAll(checked) {
      console.log('selectAll',this.goodsList);
      if (checked) {
       this.search.goodtype = this.goodsList.map(d => d.id)
        console.log('this.test.code ',  this.search.goodtype );
      } else {
        this.search.goodtype = []
      }
      this.onSearch()
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
      await goodscategoryselect(this.id).then((res) => {
        console.log('物品数据',res.result);
        this.goodsList = res.result;
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
        console.log("time, timeend", time, timeend);
        this.search.time.push(time, timeend);
      }
      let params = {
        store_id: this.id,
        room_type_id: this.search.type,
        good_type_ids:  this.search.goodtype.join(','),
        room_id:  this.search.room,
        start: this.search.time[0],
        end:this.search.time[1],
        page:this.pages.page,
        limit:this.pages.pageSize
      }
      if (this.sort_field) {
        params.sort_field = this.sort_field
        params.sort_position = this.sort_position
      }
      console.log('params-------',params);
      outboundgoods(
       params
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
      this.search.goodtype = [];
      this.search.time = [];
      this.pages.page = 1;
      this.pages.pageSize = 10;
      this.sort_position = ''
      this.sort_field =''
      this.$refs.salesTab.clearSort() 
      this.getTime(0);
    },
    onChangeTime() {
      console.log(this.search.time, "time");
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
        "/cashier/report/sale-goods/export?store_id=" +
        this.id +
        "&room_type_id=" +
        this.search.type +
        "&room_id=" +
        this.search.room +
        "&good_type_ids=" +
        this.search.goodtype.join(',')+
        "&start=" +
        this.search.time[0] +
        "&end=" +
        this.search.time[1] +
        "&limit=" +
        this.pages.total;
      window.location.href = href;
      this.$message.success(
        "导出商品流水" +
          this.search.time[0] +
          "~" +
          this.search.time[1] +
          "区间" +
          this.pages.total +
          "条数据成功"
      );
    },
  },
  computed: {
    check: {
      get () {
        if (this.search.goodtype.length === this.goodsList.length) {
          return true
        }
        return false
      },
      set () {}
    }
  },
 
};
</script>

<style lang="scss" scoped>
// .el-picker-panel__footer{

// }
.el-table{
  ::v-deep .sort-caret.ascending {
    border-bottom-color: #C0C4CC;
    top: 5px !important; ;
}
::v-deep  .sort-caret {
  width: 0;
    height: 0;
    position: absolute;
    left: 7px;
}
  ::v-deep  .sort-caret.descending {
  
    bottom: 7px !important; ;
}
//   ::v-deep  .sort-caret {
//     width: 0;
//     height: 0;
//     border: 5px solid transparent;
//     position: absolute;
//     left: 7px;
// }

	
}


.analysis-tips{
  position: absolute;
  bottom: 56px;
  left: 30px;
}
.myPagination{
  margin-bottom: 30px !important; 

}


.tishi{
  color: rgb(245, 108, 108);
  line-height: 24px;
  margin: 0;
  font-size: 14px;
}

.founding {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
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
  .founding-top {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .founding-top-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 30px;
      margin-right: 20px;
    }
  }
  .founding-ctr-wrapper {
    width: 100%;
    background-color: #fff;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 10px;
    margin-bottom: 20px;
    .founding-ctr {
      width: 100%;
      background: #f2f2f2;
      padding: 10px 30px;
      box-sizing: border-box;
      color: #666;
      font-size: 14px;
      line-height: 22px;
      word-break: break-all;
      white-space: pre-wrap;
      border-left: 5px solid #323442;
      display: flex;
      flex-wrap: wrap;
      .founding-ctr-item {
        margin-right: 20px;
      }
      .cashier-money {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
.m-l-20{
  margin-left: 20px;
}
</style>
<style>
.el-picker-panel__footer .el-picker-panel__link-btn.el-button--text {
  display: none;
}
</style>
