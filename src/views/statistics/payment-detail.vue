<template>
	<div class="bill-detail">
		<div class="bill-detail-top">
        <div class="bill-detail-top-item">
          <span style="flex-shrink: 0;margin-right: 10px;">店面选择</span>
          <el-select v-model="search.storefront" placeholder="请选择店面" style="width: 200px;" @change="onSearch">
          	<el-option v-for="(item,index) in storefrontList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="bill-detail-top-item">
        	<span style="flex-shrink: 0;margin-right: 10px;">房型</span>
        	<el-select v-model="search.type" placeholder="请选择房型" style="width: 200px;" @change="onSearch">
        		<el-option v-for="(item,index) in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        	</el-select>
        </div>

        <div class="bill-detail-top-item">
        	<span style="flex-shrink: 0;margin-right: 10px;">房台</span>
        	<el-select v-model="search.room" placeholder="请选择房型" style="width: 200px;" @change="onSearch">
        		<el-option v-for="(item,index) in roomList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        	</el-select>
        </div>
        <div class="bill-detail-top-item">
        	<span style="flex-shrink: 0;margin-right: 10px;">单据类型</span>
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
        <div class="bill-detail-top-item">
        	<span style="flex-shrink: 0;margin-right: 10px;">备注</span>
        	<el-input v-model="search.desc" placeholder="请输入备注" style="width: 200px;" @keyup.enter.native="onSearch" ></el-input>
        </div>

        <div class="bill-detail-top-item">
        	<span style="flex-shrink: 0;margin-right: 10px;">日期</span>
        	<el-date-picker v-model="search.time" style="width: 270px;margin-right: 20px;"
            type="daterange" value-format="yyyy-MM-dd" placeholder="请选择日期" :picker-options="pickerOptions"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="onSearch" :clearable="false"
          ></el-date-picker>
        </div>
        <div class="bill-detail-top-item">
        	<el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </div>
        <div class="bill-detail-top-item">
          <el-button type="primary" @click="onSearchZero" icon="el-icon-refresh">重置</el-button>
        </div>
        <div class="bill-detail-top-item">
        	<el-button type="primary" icon="el-icon-download" @click="onExport">导出</el-button>
        </div>
		</div>
    <div class="bill-detail-ctr-wrapper">
      <div class="bill-detail-ctr">
        <div>
        <el-popover
          placement="bottom"
          title="字段解释"
          width="280"
          trigger="hover"
        >
        <div >
          <p class="tishi">应收总计：应收款的总和</p>
          <p class="tishi">实收总计：实际到账的总和</p>
          <p class="tishi">优惠总计：实际优惠总和</p>
          <p class="tishi">退款总计：实际退款总和</p>
          <p class="tishi">实收总计=应收总计-优惠总计-退款总计</p>
          </div>
          <div  slot="reference"><i class="el-icon-info icon-info"></i></div>
        </el-popover>
       </div>
        <div class="bill-detail-ctr-item">应收总计：<span class="cashier-money">{{header.total_price}}</span> 元</div>
        <div class="bill-detail-ctr-item">实收总计：<span class="cashier-money">{{header.total_amount}}</span> 元</div>
        <div class="bill-detail-ctr-item">优惠总计：<span class="cashier-money">{{header.total_discount}}</span> 元</div>
        <div class="bill-detail-ctr-item">退款总计：<span class="cashier-money">{{header.total_refund}}</span> 元</div>
        <div class="bill-detail-ctr-item">微信实收：<span class="cashier-money">{{header.total_refund}}</span> 元</div>
        <div class="bill-detail-ctr-item">支付宝实收：<span class="cashier-money">{{header.total_refund}}</span> 元</div>
        <div class="bill-detail-ctr-item">现金实收：<span class="cashier-money">{{header.total_refund}}</span> 元</div>
        <div class="bill-detail-ctr-item">POS机实收：<span class="cashier-money">{{header.total_refund}}</span> 元</div>
        <div class="bill-detail-ctr-item">招待实收：<span class="cashier-money">{{header.total_refund}}</span> 元</div>
        <div class="bill-detail-ctr-item">美团团购：<span class="cashier-money">{{header.total_refund}}</span> 元</div>
        <div class="bill-detail-ctr-item">抖音团购：<span class="cashier-money">{{header.total_refund}}</span> 元</div>
        <div class="bill-detail-ctr-item">其它团购：<span class="cashier-money">{{header.total_refund}}</span> 元</div>
      </div>
    </div>

		<el-table class="table-fixed" :data="list"  stripe border fit highlight-current-row :header-cell-style="{background:'#f5f7fa',color:'#606266'}" v-loading="loading">
			<el-table-column align="center" label="账单日">
				<template slot-scope="{ row }">
					{{row.receivables}}
				</template>
			</el-table-column>
      <el-table-column align="center" label="单号">
				<template slot-scope="{ row }">
					{{row.discount_amount}}
				</template>
			</el-table-column>
      <el-table-column align="center" label="门店" width="100">
				<template slot-scope="{ row }">
					{{row.refund_amount}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="房型">
				<template slot-scope="{ row }">
					{{row.real_amount}}
				</template>
			</el-table-column>
      <el-table-column align="center" label="房号" width="180">
				<template slot-scope="{ row }">
					{{row.allin_amount}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="单据类型" width="100">
				<template slot-scope="{ row }">
					{{row.cash_amount}}
				</template>
			</el-table-column>
      <el-table-column align="center" label="支付方式" width="100">
      	<template slot-scope="{ row }">
      		{{row.groupon_amount}}
      	</template>
      </el-table-column>
      <el-table-column align="center" label="折扣率" width="100">
      	<template slot-scope="{ row }">
      		{{row.groupon_amount}}
      	</template>
      </el-table-column>
      <el-table-column align="center" label="应收" width="100">
      	<template slot-scope="{ row }">
      		{{row.groupon_amount}}
      	</template>
      </el-table-column>
      <el-table-column align="center" label="优惠" width="100">
      	<template slot-scope="{ row }">
      		{{row.groupon_amount}}
      	</template>
      </el-table-column>
      <el-table-column align="center" label="退款" width="100">
      	<template slot-scope="{ row }">
      		{{row.groupon_amount}}
      	</template>
      </el-table-column>
      <el-table-column align="center" label="实收" width="100">
      	<template slot-scope="{ row }">
      		{{row.groupon_amount}}
      	</template>
      </el-table-column>
      <el-table-column align="center" label="交易单号" width="100">
      	<template slot-scope="{ row }">
      		{{row.groupon_amount}}
      	</template>
      </el-table-column>

			<el-table-column align="center" label="支付时间" width="100">
				<template slot-scope="{ row }">
					{{row.groupon_amount}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="退款时间" width="180">
				<template slot-scope="{ row }">
					{{row.party_amount}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="备注" width="180">
				<template slot-scope="{ row }">
					{{row.goods_amount}}
				</template>
			</el-table-column>

			<el-table-column align="center" label="创建时间" width="100">
				<template slot-scope="{ row }">
					{{row.count_batch}}
				</template>
			</el-table-column>
      <el-table-column align="center" label="结账人" width="100">
      	<template slot-scope="{ row }">
      		{{row.count_batch}}
      	</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
      	<template slot-scope="{ row }">
      		<el-button type="primary" size="mini" @click="onBack(row)" style="margin-left: 10px;">退款</el-button>
      	</template>
      </el-table-column>
		</el-table>
		<Costompagination :page="pages.page" :pageSize="pages.pageSize" :pageSizes="pages.pageSizes" :total="pages.total"
			@onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange" class="myPagination"
		></Costompagination>
	</div>
</template>

<script>
  import { getToken } from '../../utils/auth.js'
  import { addAll } from '../../utils/index.js'
  import { storeselect, roomtypeselect, cashierroomselect, reportpayorder, reportpayorderrefund } from '../../api/api.js'
export default {
  name:'BillDetail',
	data() {
		return {

			pages:{
				page:1,
				pageSize:10,
				pageSizes:[10,20,50,100],
				total:400,
			},
			search:{
        storefront: '',
        type: '',
        room: '',
        time: [],
        invoice: '',
        desc: ''
      },
      loading: false,
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
			storeList: [],
      invoiceList: [
        {id:0,name:'全部'},{id:1,name:'正常单'},{id:4,name:'退款单'}
      ],

			roomList:[],


			typeList:[],
      storefrontList:[],


			list:[],
      header: {},


		};
	},

  created() {
    this.id = JSON.parse(getToken()).store_id
    this.init()

  },
  mounted() {
  },
  methods: {
    async init(){
      await storeselect(this.id).then(res=>{
        this.storefrontList = res.result
        this.search.storefront = res.result[0].id
      })
      await roomtypeselect(this.id).then(res=>{
				this.typeList = addAll(res.result)
			})
      await cashierroomselect(this.id).then(res=>{
        this.roomList = addAll(res.result)
      })
      await this.getTime(0)
    },
    getTime(e){
      // this.loading = true
      if(e == 0) {
        let data = new Date()
        let year = data.getFullYear()
        let month = Number(data.getMonth() + 1) < 10 ? '0' + Number(data.getMonth() + 1) : Number(data.getMonth() + 1)

        let day = data.getDate() < 10 ? '0' + data.getDate() : data.getDate()

        let time = year + '-' + month + '-' + day

        this.search.time.push(time,time)
      }

      // reportpayorder(this.id, this.search.type, this.search.room,this.search.invoice, this.search.time[0],this.search.time[1],this.pages.page, this.pages.pageSize).then(res=>{
      //   this.loading = false
      //   this.list = res.result.data
      //   this.header = res.result.header
      //   this.pages.total = res.result.total
      // })
    },
    onSearch(){
      this.pages.page = 1
    	this.getTime(1)
    },
    onSearchZero(){
      this.search.invoice = ''
      this.search.type = ''
      this.search.room = ''
      this.search.time = []
      this.pages.page = 1
      this.pages.pageSize = 10
      this.getTime(0)
    },
    onExport(){
      let href = process.env.VUE_APP_BASE_API + '/cashier/report/pay-order/export?store_id=' + this.id + '&room_type_id=' + this.search.type +
        '&room_id=' + this.search.room + '&status=' + this.search.invoice + '&pay_desc' + this.search.desc + '&start=' + this.search.time[0] + '&end=' + this.search.time[1] + '&limit=' + this.pages.total
      window.location.href = href
      this.$message.success('导出付款明细' + this.search.time[0] + '~' + this.search.time[1]  +'区间' + this.pages.total +  '条数据成功')
    },
    onBack(obj){

    },
		onSizeChange(val) {
      this.pages.pageSize = val
      this.getTime(1)
		},
		onCurrentChange(val) {
      this.pages.page = val
      this.getTime(1)
		},
	}
};
</script>

<style lang="scss" scoped>
.icon-info{

font-size:20px;
margin-right: 10px;
}
.myPagination{
  margin-bottom: 30px !important;

}


.tishi{
  // color: rgb(245, 108, 108);
  line-height: 24px;
  margin: 0;
  font-size: 14px;
}


.bill-detail {
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

	::v-deep input::-webkit-outer-spin-button,::v-deep input::-webkit-inner-spin-button{
	  -webkit-appearance: none !important;
	}
	::v-deep input[type='number']{
	  line-height: 1;
	  -moz-appearance: textfield !important;
	}
  ::v-deep {
    table {
      width: 100% !important;
    }
  }
	.bill-detail-top {
		width: 100%;
		display: flex;
		align-items: center;
    flex-wrap: wrap;
		.bill-detail-top-item {
			display: flex;
			align-items: center;
			font-size: 14px;
			margin-bottom: 20px;
      margin-right: 20px;
		}
	}
  .bill-detail-ctr-wrapper {
    width: 100%;
    background-color: #fff;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 10px;
    margin-bottom: 20px;
    .bill-detail-ctr {
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
      .bill-detail-ctr-item {
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
