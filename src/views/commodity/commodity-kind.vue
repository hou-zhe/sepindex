<template>
	<div class="commoduty-kind">
		<div class="commoduty-kind-top">
			<div class="commoduty-kind-top-lft">
				<div class="commoduty-kind-top-item">
					<span style="margin-right: 10px;">物品种类名称</span>
					<el-input v-model.trim="search.name" style="width: 200px;"  @keyup.enter.native="onSearch" placeholder="请输入物品名称"></el-input>
				</div>
				<div class="commoduty-kind-top-item">
					<span style="margin-right: 10px;">状态</span>
					<el-select v-model="search.status" placeholder="请选择状态" style="width: 130px;" @change="onSearch">
						<el-option v-for="(item,index) in statusList1" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</div>
				<el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="onSearchZero" icon="el-icon-refresh">重置</el-button>
			</div>
			<el-button type="primary" @click="onAdd" icon="el-icon-plus">新增</el-button>
		</div>
		<el-table :data="list" stripe border fit highlight-current-row @row-dblclick="onEdit" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" row-key="id" v-loading="loading">
			<el-table-column align="center" label="物品种类代码" width="150">
				<template slot-scope="{ row }">
					{{row.code}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="物品种类名称">
				<template slot-scope="{ row }">
					{{row.name}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="排序" width="80">
				<template slot-scope="{ row }">
					{{row.sort}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="物品种类用途">
				<template slot-scope="{ row }">
					{{row.use ==1?'原材料':row.use == 2?'耗品':'卖品'}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="状态" width="80">
				<template slot-scope="{ row }">
					{{row.status == '1'?'上架':'下架'}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="240">
				<template slot-scope="{ row }">
          <el-popconfirm :confirm-button-text="row.status == 1? '下架':'上架'" cancel-button-text='取消' icon="el-icon-info"  :icon-color="row.status== 1 ? 'red':'green'"
            :title="row.status == 1?'下架此物品种类会影响物品和物品套餐关联数据':'确定上架吗'" @onConfirm="onStatus(row)" >
            <el-button slot="reference" :type="row.status==1?'info':'success'" size="mini">{{row.status==1?'下架':'上架'}}</el-button>
          </el-popconfirm>
					<!-- <el-button :type="row.status==1?'info':'success'" size="mini" @click="onStatus(row)">{{row.status==1?'下架':'上架'}}</el-button> -->
					<el-button type="primary" size="mini" @click="onEdit(row)" style="margin-left: 10px;">修改</el-button>
					<el-button type="danger" size="mini" @click="onDel(row.id)" >删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<Costompagination :page="pages.page" :pageSize="pages.pageSize" :pageSizes="pages.pageSizes" :total="pages.total"
			@onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange"
		></Costompagination>

		<el-dialog :title="dialogText" :visible.sync="dialogVal" :close-on-click-modal="false" width="600px" class="commoduty-kind-dialog">
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px"  @keyup.enter.native="isSave?'':onConfirm()">
				<el-form-item  label="物品种类代码" prop="code"><el-input ref="diainput" maxlength="6" oninput="if(value.length > 6) value=value.slice(0, 6)" v-model.trim="temp.code" type="number"  placeholder="请输入物品种类代码" style="width:300px;"/></el-form-item>
				<el-form-item label="物品种类名称" prop="name"><el-input v-model.trim="temp.name" placeholder="请输入物品种类名称" style="width:300px;"/></el-form-item>
				<el-form-item  label="排序" prop="order"><el-input @input="temp.order = temp.order.replace(/[^0-9]/g,'')" v-model.trim="temp.order" placeholder="请输入排序" type="number" style="width:300px;"/></el-form-item>

				<el-form-item label="物品各类用途" prop="purpose">
					<el-select v-model="temp.purpose" placeholder="请选择用途" style="width:300px;">
						<el-option v-for="(item,index) in purposeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="temp.status" placeholder="请选择状态" style="width:300px;">
						<el-option v-for="(item,index) in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>

				<div style="display: flex;">
					<el-form-item label="要求">
						<el-select v-model="temp.requestVal" multiple placeholder="请选择要求" value-key="id" style="width: 300px;">
							<el-option v-for="(item,index) in requestList" :key="item.id" :label="item.name" :value="item.name"></el-option>
						</el-select>
					</el-form-item>
					<div style="display: inline;">
						<el-popover  placement="right" trigger="click" @show="onKouwei">
							<el-button type="primary" size="mini" style="margin-bottom: 10px;" @click="onAddFlavor">新增</el-button>
							<el-table border :data="requestList" max-height="400">
								<el-table-column width="150" label="口味要求">
									<template slot-scope="{ row }">
										{{row.name}}
									</template>
								</el-table-column>
								<el-table-column width="100" label="操作">
									<template slot-scope="{ row }">
										<el-button type="danger" size="mini" @click="onDelFlavor(row.id)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
							<div class="commoduty-kind-table-add" v-if="isAddFlavor">
								<el-input v-model.trim="flavorNew" placeholder="请输入口味要求,回车键完成" @keyup.enter.native="isEnter?'':addFlavorConfirm()" style="margin-bottom: 5px;"></el-input>
								<!-- div style="width: 100px;display: inline;">
									<el-button style="display: inline;" type="primary" size="mini">确定</el-button>
								</div> -->
             				   <span style="color: #F56C6C;font-size: 14px;">注：回车键完成</span>
							</div>
							<el-button style="display: inline;margin: 5px 0 0 5px;padding: 0 10px;height: 30px;" size="mini" slot="reference"><i class="el-icon-more"></i></el-button>
						</el-popover>
					</div>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVal = false">取消<span style="font-size: 12px;">(Esc)</span></el-button>
				<el-button type="success" @click="isSave?'': onConfirm()" v-no-more-click>保存<span style="font-size: 12px;">(Enter)</span></el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import { getToken } from '../../utils/auth.js'
	import Sortable from 'sortablejs'
	import { goodscategorylist, goodscategoryadd, goodscategoryinfo, goodscategoryupdate, goodscategorydelete, goodscategorystatus, requirementlist, requirementadd, requirementdelete } from '../../api/api.js'
export default {
	name:'CommodityKind',
	data() {
		return {
			id: 0,
			loading: false,
			search:{name:'',status:''},
			choseId: 0,

			statusList1:[
				{id: 0,name:'全部'},{id: 1,name:'上架'},{id: 2,name:'下架'}
			],
      statusList:[
      	{id: 1,name:'上架'},{id: 2,name:'下架'}
      ],

			pages:{
				page:1,
				pageSize:10,
				pageSizes:[10,20,30,50,100],
				total:400,
			},
			dialogText: '新增',
			dialogVal:false,

			list:[],


			rules: {
				name: [{ required: true, message: '物品种类名称不能为空', trigger: 'blur' }],
				code:[{ required: true, message: '物品种类代码不能为空', trigger: 'blur' }],
				order:[{ required: true, message: '排序不能为空', trigger: 'blur' }],
				status:[{ required: true, message: '状态不能为空', trigger: 'change' }],
        purpose:[{ required: true, message: '物品各类用途必须选择', trigger: 'change' }]
			},
			temp:{
				code: '',
				name:'',
				status: 1,
				purpose:3,
				order:'',
				requestVal:''
			},


			requestList:[],
			purposeList:[
				{id: 1,name:'原材料'},{id:2,name:'耗品'},{id: 3,name:'卖品'}
			],

			isAddFlavor:false,
			flavorNew:'',			//新增单位名称

      isSave: false,
      isEnter: false
		};
	},
	mounted() {
		this.id = JSON.parse(getToken()).store_id
		// this.rowDrop()
		this.init()
    this.getRequest()
	},
	methods:{
		init(){
			this.loading = true
			goodscategorylist(this.id,this.search.name,this.search.status).then(res=>{
				this.pages.total = res.result.total;
				this.list = res.result.data
				this.loading = false
			})
		},
		onSearch(){
			this.pages.page = 1
			this.init()
		},
    onSearchZero(){
      this.pages.page = 1
      this.pages.pageSize = 10
      this.search.name = ''
      this.search.status = ''
      this.init()
    },
		onAdd(){
			Object.keys(this.temp).forEach(key=>{this.temp[key]=''})
      this.temp.status = 1
      this.temp.purpose = 3
			this.choseId = 0
			this.dialogText = '新增物品种类'
			this.dialogVal = true
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate();
        this.$refs.diainput.focus()
			});
		},
		async onEdit(obj){
			this.choseId = obj.id
			goodscategoryinfo(obj.id).then(res=>{
				let reda = res.result.data
				this.temp.code = reda.code
				this.temp.name = reda.name
				this.temp.order = reda.sort
				this.temp.status = reda.status
				this.temp.purpose = reda.use
        if(reda.requirements.length > 0) {
          this.temp.requestVal = reda.requirements.split(',')
        }

				this.$forceUpdate()
				this.dialogText = '修改物品种类'
				this.dialogVal = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate();
          this.$refs.diainput.focus()
				});

			})
		},
		onDel(id){
			this.$confirm('删除此物品种类会影响物品和物品套餐关联数据！', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				goodscategorydelete({id}).then(res=>{
					if(res.code == 0) {
						this.$message.success('删除成功')
						this.init()
					}
				})
			})
		},

		getRequest(){
			requirementlist(this.id).then(res=>{
				this.requestList = res.result.data
			})
		},
		onStatus(obj){
			let status = 0
			if(obj.status == 1) {
				status = 2
			}else {
				status = 1
			}
			goodscategorystatus({
				id: obj.id,
				status: status
			}).then(res=>{
				if(obj.status == 1) {
					this.$message.success('下架成功')
					this.init()
				}else {
					this.$message.success('上架成功')
					this.init()
				}
			})
		},
		// 单位
		onAddFlavor(){
			this.isAddFlavor = true
		},
    onKouwei(){
      this.isAddFlavor = false
      this.flavorNew = ''
      this.$forceUpdate()
    },
		onDelFlavor(id){
			this.$confirm('是否确认删除此口味？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				requirementdelete({id}).then(res=>{
					if(res.code == 0) {
						this.$message.success('删除成功')
						this.getRequest()
					}
				})
			})
		},
		addFlavorConfirm(){
      if(this.flavorNew.length > 0) {
        this.isEnter = true
        requirementadd({store_id: this.id,name:this.flavorNew}).then(res=>{
        	this.isAddFlavor = false
          this.flavorNew = ''
        	this.$message.success('新增口味成功')
        	this.getRequest()
        	this.$forceUpdate()
          this.isEnter = false
        }).catch(err=>{
          this.isEnter = false
        })
      }else {
        this.$message.warning('输入内容不能为空')
      }

		},



		onConfirm(){
			this.$refs['dataForm'].validate((valid) =>{
				if(valid) {
          this.isSave = true
					let requirements = this.temp.requestVal.toString()
					if(this.choseId > 0) {
						goodscategoryupdate({
							id: this.choseId,
							code: this.temp.code,
							name: this.temp.name,
							sort: this.temp.order,
							status: this.temp.status,
							requirements:requirements,
							use: this.temp.purpose
						}).then(res=>{
							this.$message.success('编辑物品种类成功')
							this.dialogVal = false
							this.init()
							this.choseId = 0
							this.$nextTick(()=>{
								this.$refs['dataForm'].clearValidate()
							})
              this.isSave = false
						}).catch(err=>{
              this.isSave = false
            })
					}else {
						goodscategoryadd({
							store_id:this.id,
							code: this.temp.code,
							name: this.temp.name,
							sort: this.temp.order,
							status: this.temp.status,
							requirements:requirements,
							use: this.temp.purpose
						}).then(res=>{
							this.$message.success('新增物品种类成功')
							this.dialogVal = false
							this.init()
							this.$nextTick(()=>{
								this.$refs['dataForm'].clearValidate()
							})
              this.isSave = false
						}).catch(err=>{
              this.isSave = false
            })
					}

				}
			})
		},
		rowDrop(){
			let tbody = document.querySelector('.el-table__body-wrapper tbody')
			let _this = this
			Sortable.create(tbody, {
			  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
			  group: {
				name: 'words',
				pull: true,
				put: true
			  },
			  animation: 150, // ms, number 单位：ms，定义排序动画的时间
			  onAdd: function (evt) { // 拖拽时候添加有新的节点的时候发生该事件
				// console.log('onAdd.foo:', [evt.item, evt.from])
			  },
			  onUpdate: function (evt) { // 拖拽更新节点位置发生该事件
				// console.log('onUpdate.foo:', [evt.item, evt.from])
			  },
			  onRemove: function (evt) { // 删除拖拽节点的时候促发该事件
				// console.log('onRemove.foo:', [evt.item, evt.from])
			  },
			  onStart: function (evt) { // 开始拖拽出发该函数
				// console.log('onStart.foo:', [evt.item, evt.from])
			  },
			  onSort: function (evt) { // 发生排序发生该事件
				// console.log('onUpdate.foo:', [evt.item, evt.from])
			  },
			  onEnd ({ newIndex, oldIndex }) { // 结束拖拽
				let currRow = _this.list.splice(oldIndex, 1)[0]
				_this.list.splice(newIndex, 0, currRow)
				console.log(newIndex,oldIndex)
			  }
			})
		},
		onSizeChange(val) {
			this.pages.pageSize = val;
			this.init()
		},
		onCurrentChange(val) {
			this.pages.page = val;
			this.init()
		},
	}
};
</script>

<style lang="scss" scoped>
.commoduty-kind {
	width: 100%;
	padding: 20px;
	box-sizing: border-box;
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
  .min-table-scroll {
    max-height: 200px;
    overflow-y: scroll;
  }
	.commoduty-kind-top {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30px;
		.commoduty-kind-top-lft {
			display: flex;
			align-items: center;
			.commoduty-kind-top-item {
				display: flex;
				align-items: center;
				margin-right: 20px;
				span {
					flex-shrink: 0;
					font-size: 14px;
					margin-right: 10px;
				}
			}
			.commoduty-kind-top-item:not(:first-child) {
				width: 200px;
			}
		}
	}
	.commoduty-kind-dialog {
		.commoduty-kind-item {
			display: flex;
			justify-content: space-between;
		}
	}
}
.commoduty-kind-table-add {
	width: 100%;
	height: 55px;
	border: 1px solid EBEEF5;
	margin-top: 10px;
	::v-deep .el-input__inner{
		border: 1px solid #7B7D84;
	}
}
</style>
