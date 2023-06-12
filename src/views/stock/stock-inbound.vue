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
          <el-input
            v-model.trim="search.name"
            placeholder="请输入物品名称"
            style="width: 200px"
            @keyup.enter.native="onSearch"
          ></el-input>
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
      </div>


      <div class="stock-inbound-rgt">
        <div class="stock-inbound-top-item">
        	<el-button type="primary" @click="onInbound">入库</el-button>
        </div>
        <div class="stock-inbound-top-item">
        	<el-button type="primary" icon="el-icon-download" @click="onExport">导出入库记录</el-button>
        </div>
      </div>
    </div>
    <el-table class="table-fixed" :data="list" stripe border fit highlight-current-row :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" v-loading="loading">
      <el-table-column align="center" label="入库仓库" style="max-width: 250px;" width="200">
        <template slot-scope="{ row }">
          {{ row.warehouse }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物品名称">
        <template slot-scope="{ row }">
          {{ row.goods_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="物品种类">
        <template slot-scope="{ row }">
          {{ row.goods_type_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="入库数量" width="100">
        <template slot-scope="{ row }">
          {{ row.storage_quantity }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="入库后库存量" width="200">
        <template slot-scope="{ row }">
          {{ row.inv_quantity }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="入库时间">
        <template slot-scope="{ row }">
          {{ row.created_at }}
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
      title="入库"
      :visible.sync="dialogGoods"
      :close-on-click-modal="false"
      width="55%"
    >
      <div style="display: flex; margin: -20px 0 30px">
        <el-select
          v-model="goods.type"
          placeholder="请选择物品种类"
          style="width: 30%"
          @change="onSearchGoods"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          v-model="goods.name"
          placeholder="搜索物品名称"
          style="width: 30%; margin-left: 20px"
          @keyup.enter.native="onSearchGoods"
        ></el-input>
      </div>
      <div style="display: flex; justify-content: space-between">
        <fieldset
          style="
            width: 45%;
            border-radius: 10px;
            padding: 20px 10px 10px 10px;
            position: relative;
            border: 1px solid #dcdfe6;
          "
        >
          <legend>未选择</legend>
          <el-button
            size="mini"
            plain
            type="success"
            style="margin-bottom: 20px"
            @click="onChoseNotAll"
            >全选</el-button
          >
          <el-table
            :data="notChoseGoodsList"
            stripe
            border
            fit
            highlight-current-row
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            row-key="id"
            height="400"
          >
            <el-table-column align="center" label="物品名称">
              <template slot-scope="{ row }">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="计量单位">
              <template slot-scope="{ row }">
                {{ row.unit }}
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <el-button type="primary" size="mini" @click="onChoseNot(row)"
                  >选择</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
        <fieldset
          style="
            width: 45%;
            position: relative;
            border-radius: 10px;
            padding: 20px 10px 10px 10px;
            border: 1px solid #dcdfe6;
          "
        >
          <legend>已选择</legend>
          <el-button
            size="mini"
            plain
            type="danger"
            style="margin-bottom: 20px"
            @click="onChoseDelAll(1)"
            >全部删除</el-button
          >
          <el-table
            :data="ChoseGoodsList"
            stripe
            border
            fit
            highlight-current-row
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            row-key="id"
            height="400"
          >
            <el-table-column align="center" label="物品名称">
              <template slot-scope="{ row }">
                {{ row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="计量单位">
              <template slot-scope="{ row }">
                {{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column align="center" >
              <template slot="header">
                <el-popover placement="top-start" title="" width="80" trigger="hover" content="双击修改数量">
                    <i slot="reference" style="position: absolute;right: 5px;top: 0px;" class="el-icon-warning"></i>
                  </el-popover>
                数量
              </template>
              <template slot-scope="{ row }">
                <template v-if="row.isEdit">

                  <div style="width:100%;height: 100%;position: relative;" @dblclick="row.isEdit = false">
                    {{row.num}}
                  </div>
                </template>
                <template v-if="!row.isEdit">
                  <el-input
                    type="number"
                    v-model="row.num"
                    @blur="row.isEdit = true"
                    oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')"
                    @keyup.enter.native="isSave ? '' : onConfirmNum(row)"
                  ></el-input>
                </template>


              </template>

            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <el-button type="danger" size="mini" @click="onChoseDel(row, 1)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </fieldset>
      </div>

      <span slot="footer" sstyle="margin: 0 auto;">
        <el-button @click="dialogGoods = false">取消</el-button>
        <el-button type="primary" @click="onGoodsConfirm">完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '../../utils/auth.js';
import { addAll } from '../../utils/index.js';
import { goodscategoryselect, storagelist,storageadd, storageexport, storageunselected } from '../../api/api.js';
export default {
  name: 'StockInbound',
  data() {
    return {
      pages: {
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        total: 400
      },
      id: 0,
      search: {
        type: '',
        name: '',
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
      goodsNameList:[],
      list: [],
      header: {},


      dialogGoods: false,
      goods: {
        name:'',
        type: ''
      },
      notChoseGoodsList: [],
      ChoseGoodsList: [],
      isSave:false
    };
  },

  created() {
    this.id = JSON.parse(getToken()).store_id;
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
     await goodscategoryselect(this.id).then((res) => {
        this.typeList = addAll(res.result);
      });
      await this.getTime(0);
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
      storagelist(this.id,this.search.type,this.search.name,this.search.time[0], this.search.time[1],this.pages.page, this.pages.pageSize).then(res=>{
        this.loading = false
        this.list = res.result.data
        this.pages.total = res.result.total
      })
    },
    async onInbound(){
      this.goods.type = "";
      this.goods.name = "";
      let newList = [];
      await storageunselected(
        this.id,
        [],
        this.goods.type,
        this.goods.name
      ).then((res) => {
        res.result.data.forEach(item => {
          this.$set(item,'num',1)
          this.$set(item,'isEdit',true)
        })
        newList = res.result.data;
      });
      if (this.ChoseGoodsList.length > 0) {
        this.notChoseGoodsList = newList.filter((v) => {
          return this.ChoseGoodsList.every((e) => e.id != v.id);
        });
      } else {
        this.notChoseGoodsList = newList;
      }
      this.dialogGoods = true;
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
        '/cashier/storage/export?store_id=' +
        this.id +
        '&good_type_id=' +
        this.search.type +
        '&goods_id=' +
        this.search.room +
        '&start=' +
        this.search.time[0] +
        '&end=' +
        this.search.time[1] +
        '&limit=' +
        this.pages.total;
      window.location.href = href;
      this.$message.success('导出入库记录' + this.search.time[0] + '~' + this.search.time[1] + '区间' + this.pages.total + '条数据成功');
    },

    async onSearchGoods(){
      let newList = [];
      await storageunselected(
        this.id,
        [],
        this.goods.type,
        this.goods.name
      ).then((res) => {
        newList = res.result.data;
      });
      if (this.ChoseGoodsList.length > 0) {
        this.notChoseGoodsList = newList.filter((v) => {
          return this.ChoseGoodsList.every((e) => e.id != v.id);
        });
      } else {
        this.notChoseGoodsList = newList;
      }
    },
    onChoseNotAll(){
      this.notChoseGoodsList.forEach((item) => {
        this.ChoseGoodsList.push(item);
      });
      this.notChoseGoodsList = [];
    },
    onChoseNot(obj){
      let index = this.notChoseGoodsList.indexOf(obj);
      this.notChoseGoodsList.splice(index, 1);
      this.ChoseGoodsList.push(obj);
      this.$forceUpdate()
    },
    onChoseDel(row, e) {
      if (e == 0) {
        this.ChoseGoodsList = this.ChoseGoodsList.filter((item) => {
          return item.id != row.id;
        });
        this.goodsList = this.goodsList.filter((item) => {
          return item.id != row.id;
        });
      } else {
        // 第二个弹窗的删除商品
        this.ChoseGoodsList = this.ChoseGoodsList.filter((item) => {
          return item.id != row.id;
        });

        this.notChoseGoodsList.push(row);
      }
    },
    onChoseDelAll(e) {
      if (e == 0) {
        this.goodsList = [];
        this.ChoseGoodsList = [];
      } else {
        this.ChoseGoodsList.forEach((item) => {
          this.notChoseGoodsList.push(item);
        });
        this.ChoseGoodsList = [];
      }
    },
    onConfirmNum(obj){
    },
    onGoodsConfirm(){
      let goods = []
      goods =  this.ChoseGoodsList.map(item =>{
        return {
          good_id: item.id,
          storage_quantity: Number(item.num)
        }
      })
      if(goods.length > 0) {
        storageadd({
          store_id: this.id,
          goods: goods
        }).then(res=>{
          this.$message.success('入库成功')
          this.dialogGoods = false
          this.getTime(1)
          this.ChoseGoodsList = []
          this.goods.name = ''
          this.goods.type = ''
        })
      }
    },
    onSizeChange(val) {
      this.pages.pageSize = val;
      this.getTime(1);
    },
    onCurrentChange(val) {
      this.pages.page = val;
      this.getTime(1);
    },


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
