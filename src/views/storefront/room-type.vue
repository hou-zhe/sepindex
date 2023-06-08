<template>
	<div class="region-manage">
		<div class="region-manage-top">
      <div></div>
			<el-button type="primary" @click="onAdd" icon="el-icon-plus">新增</el-button>
		</div>
		<el-table :data="list" fit border highlight-current-row @row-dblclick="onEdit" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" row-key="id" v-loading="loading">
			<el-table-column align="center" prop="date" label="类型代码" width="80">
				<template slot-scope="{ row }">
					{{row.id}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="名称">
				<template slot-scope="{ row }">
					{{row.name}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="排序" width="150">
				<template slot-scope="{ row }">
					{{row.sort}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="人数" width="150">
				<template slot-scope="{ row }">
					{{row.people_min}}
					<span>-</span>
					{{row.people_max}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="状态" width="150">
				<template slot-scope="{ row }">
					{{row.status == 1?'上架':'下架'}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="操作"  width="240">
				<template slot-scope="{ row }">
          <el-popconfirm :confirm-button-text="row.status == 1? '下架':'上架'" cancel-button-text='取消' icon="el-icon-info"  :icon-color="row.status== 1 ? 'red':'green'"
            :title="row.status == 1?'下架此房台类型会影响房台、房费录入、计费套餐关联数据':'确定上架吗'" @onConfirm="onStatus(row)" >
              <el-button slot="reference" :type="row.status==1?'info':'success'" size="mini">{{row.status==1?'下架':'上架'}}</el-button>
          </el-popconfirm>
					<el-button type="primary" size="mini" @click="onEdit(row)" style="margin-left: 10px;">修改</el-button>
					<el-button type="danger" size="mini" @click="onDel(row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<Costompagination :page="pages.page" :pageSize="pages.pageSize" :pageSizes="pages.pageSizes" :total="pages.total"
			@onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange"
		></Costompagination>

		<el-dialog :title="dialogText" :visible.sync="dialogVal" :close-on-click-modal="false" width="500px">
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="70px" @keyup.enter.native="isSave?'': onConfirm()">
				<el-form-item label="名称" prop="name"><el-input ref="diainput" v-model="temp.name" placeholder="请输入名称" style="width:300px;"/></el-form-item>
				<el-form-item label="排序" prop="order"><el-input @input="temp.order = temp.order.replace(/[^0-9]/g,'')" v-model.trim="temp.order" type="number" placeholder="请输入排序" style="width:300px;"/></el-form-item>
				<el-form-item label="人数" required>
          <div style="display: flex;">
            <el-form-item prop="min_num">
              <el-input type="number" placeholder="最小容纳人数" @input="temp.min_num = temp.min_num.replace(/[^0-9]/g,'')" v-model="temp.min_num" style="width:137px;"/>
              <span style="margin: 0 10px;">-</span>
            </el-form-item>
            <el-form-item prop="max_num">
              <el-input type="number" placeholder="最大容纳人数" @input="temp.max_num = temp.max_num.replace(/[^0-9]/g,'')" v-model="temp.max_num" style="width:137px;"/>
              <span style="margin-left: 5px;">人</span>
            </el-form-item>
          </div>

				</el-form-item>

				<el-form-item label="状态" prop="status">
					<el-select v-model="temp.status" placeholder="请选择状态" style="width:300px;">
						<el-option v-for="(item,index) in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVal = false">取消<span style="font-size: 12px;">(Esc)</span></el-button>
				<el-button type="success" @click="isSave?'': onConfirm()" v-no-more-click>保存<span style="font-size: 12px;">(Enter)</span></el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import Sortable from 'sortablejs'
  import { getToken } from '../../utils/auth.js'
	import { roomtypelist, roomtypeadd, roomtypeinfo, roomtypeupdate, roomtypedelete, roomtypestatus } from '../../api/api.js'
export default {
	name:'RoomType',
	data() {
		return {
			rules: {
				name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
				order: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
				status:[{ required: true, message: '状态不能为空', trigger: 'change' }],
        min_num: [{ required: true, message: '最小人数不能为空', trigger: 'blur' }],
        max_num: [{ required: true, message: '最大人数不能为空', trigger: 'blur' }],
			},
			pages:{
				page:1,
				pageSize:10,
				pageSizes:[10,20,30,50,100],
				total:400,
			},

			temp:{
				name:'',
				order: '',
				status: 0,
				min_num:'',
				max_num:''
			},

			statusList:[
				{id:1,name:'上架'},{id:2,name:'下架'}
			],

			dialogVal:false,
			dialogText:'新增房台类型',

			list:[],
			id: 0,
			loading: false,
			choseId:0,

      isSave: false
		};
	},
	mounted() {
		this.id = JSON.parse(getToken()).store_id
		this.init()
		// this.rowDrop()
	},
	methods:{
		init(){
			this.loading = true
			roomtypelist(this.id,this.pages.page,this.pages.pageSize).then(res=>{
				this.list = res.result.data
				this.loading = false
				this.pages.total = res.result.total
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
		onAdd(){
			Object.keys(this.temp).forEach(key=>{this.temp[key]=''})
      this.temp.status = 1
			this.choseId = 0
			this.dialogVal = true
			this.dialogText = '新增房台类型'
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate();
        this.$refs.diainput.focus()
			});
		},
		onEdit(obj) {
			this.choseId = obj.id
			roomtypeinfo(this.choseId).then(res =>{
				this.temp.name = res.result.data.name;
				this.temp.order = res.result.data.sort;
				this.temp.min_num = res.result.data.people_min
				this.temp.max_num = res.result.data.people_max
				this.temp.status = res.result.data.status
				this.dialogText = '编辑房台类型'
				this.dialogVal = true

				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate();
          this.$refs.diainput.focus()
				});
			})
		},
		onConfirm(){
			this.$refs['dataForm'].validate((valid) =>{
				if(valid) {
          this.isSave = true
					if(this.choseId > 0) {
						roomtypeupdate({
							id: this.choseId,
							name: this.temp.name,
							sort: this.temp.order,
							people_min: this.temp.min_num,
							people_max: this.temp.max_num,
							status: this.temp.status
						}).then(res=>{
							this.$message.success('编辑' + this.temp.name + '房台类型成功')
							this.dialogVal = false
							for(let i in this.temp) {
								this.temp[i] = ''
							}
							this.init()
							this.$nextTick(()=>{
								this.$refs['dataForm'].clearValidate()
							})
              this.isSave = false
						}).catch(err=>{
              this.isSave = false
            })
					}else {
						roomtypeadd({
							store_id: this.id,
							name: this.temp.name,
							sort: this.temp.order,
							people_min: this.temp.min_num,
							people_max: this.temp.max_num,
							status: this.temp.status
						}).then(res=>{
							this.$message.success('新增房台类型成功')
							this.dialogVal = false
							for(let i in this.temp) {
								this.temp[i] = ''
							}
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
		onDel(id){
			this.$confirm('删除此房台类型会影响房台、房费录入、计费套餐关联数据！', '提示', {
			  confirmButtonText: '确定',
			  cancelButtonText: '取消',
			  type: 'warning'
			}).then(() => {
				roomtypedelete({id}).then(res=>{
					if(res.code == 0) {
						this.$message.success('删除成功')
						this.init()
					}
				})
			})
		},
		onStatus(obj){
			let status = 0
			obj.status == 1? status = 2: status = 1
			roomtypestatus({
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
		onSizeChange(val){
			this.pages.pageSize = val
			this.init()
		},
		onCurrentChange(val){
			this.pages.page = val
			this.init()
		}
	}
};
</script>

<style lang="scss" scoped>

.region-manage {
	width: 100%;
	padding: 20px;
	box-sizing: border-box;
  ::v-deep {
    table {
      width: 100% !important;
    }
  }
	::v-deep input::-webkit-outer-spin-button,::v-deep input::-webkit-inner-spin-button{
	  -webkit-appearance: none !important;
	}
	::v-deep input[type='number']{
	  line-height: 1;
	  -moz-appearance: textfield !important;
	}
	.region-manage-top {
		margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
	}

}
</style>
