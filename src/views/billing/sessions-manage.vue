<template>
	<div class="sessions-manage">
		<div class="sessions-manage-top">
			<div class="sessions-manage-top-lft">
				<div class="sessions-manage-top-item">
					<span style="margin-right: 10px;">场次名称</span>
					<el-input v-model="search.name" style="width: 200px;" placeholder="请输入场次名称" @keyup.enter.native="onSearch"></el-input>
				</div>
				<div class="sessions-manage-top-item" >
					<span style="margin-right: 10px;">状态</span>
					<el-select v-model="search.status" style="width: 130px;" placeholder="请选择状态" @change="onSearch">
						<el-option v-for="(item,index) in statusList1" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</div>
        <el-button type="primary" @click="onSearch" icon="el-icon-search" >查询</el-button>
        <el-button type="primary" @click="onSearchZero" icon="el-icon-refresh">重置</el-button>
			</div>
			<el-button type="primary" @click="onAdd" icon="el-icon-plus">新增</el-button>
		</div>
		<el-table :data="list" border stripe highlight-current-row @row-dblclick="onEdit" :header-cell-style="{background:'#f5f7fa',color:'#606266'}">
			<el-table-column align="center" prop="date" label="场次代码" width="150" >
				<template slot-scope="{ row }">
					{{row.id}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="场次名称">
				<template slot-scope="{ row }">
					{{row.name}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="开始时间" width="150">
				<template slot-scope="{ row }">
					{{row.start_time}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="结束时间" width="150">
				<template slot-scope="{ row }">
					{{row.end_time}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="状态" width="150">
				<template slot-scope="{ row }">
					{{row.status == 1?'上架':'下架'}}
				</template>
			</el-table-column>
			<el-table-column align="center" prop="name" label="操作" width="250" >
				<template slot-scope="{ row }">
          <el-popconfirm :confirm-button-text="row.status == 1? '下架':'上架'" cancel-button-text='取消' icon="el-icon-info"  :icon-color="row.status== 1 ? 'red':'green'"
            :title="row.status == 1?'下架此场次会影响房费录入、计费套餐关联数据':'确定上架吗'" @onConfirm="onStatus(row)" >
            <el-button slot="reference" :type="row.status==1?'info':'success'" size="mini">{{row.status==1?'下架':'上架'}}</el-button>
          </el-popconfirm>

					<!-- <el-button :type="row.status==1?'info':'success'" size="mini" @click="onStatus(row)">{{row.status==1?'下架':'上架'}}</el-button> -->
					<el-button type="primary" size="mini" @click="onEdit(row)" style="margin-left: 10px;">修改</el-button>
					<el-button type="danger" size="mini" @click="onDel(row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<Costompagination :page="pages.page" :pageSize="pages.pageSize" :pageSizes="pages.pageSizes" :total="pages.total"
			@onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange" :note="'注：最多录入5个场次'"
		></Costompagination>

		<el-dialog :title="dialogText" :visible.sync="dialogVal" :close-on-click-modal="false" width="500px">
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" @keyup.enter.native="isSave?'': onConfirm()">
				<el-form-item  label="场次名称" prop="name"><el-input ref="diainput" v-model="temp.name" placeholder="请输入名称" style="width:300px;"/></el-form-item>
				<el-form-item  label="开始时间" required>
					<div style="display: flex;">
						<el-form-item prop="start_hour">
							<el-select v-model="temp.start_hour" style="width: 120px;margin-right: 5px;" size="small">
								<el-option v-for="(item,index) in 24" :key="index" :label="index < 10? '0' + index:index" :value="index"> </el-option>
							</el-select>
							<span class="session-hour-min">时</span>
						</el-form-item>
						<el-form-item prop="start_minute">
							<el-select v-model="temp.start_minute" style="width: 120px;margin-right: 5px;" size="small">
								<el-option v-for="(item,index) in minuteList" :key="item" :value="item" :label="item"></el-option>
							</el-select>
							<span class="session-hour-min">分</span>
						</el-form-item>
					</div>

				</el-form-item>
				<el-form-item  label="结束时间" required>
					<div style="display: flex;">
						<el-form-item  prop="end_hour">
							<el-select v-model="temp.end_hour" style="width: 120px;margin-right: 5px;" size="small">
								<el-option v-for="(item,index) in 24" :key="index" :label="index < 10? '0' + index:index" :value="index"> </el-option>
							</el-select>
							<span class="session-hour-min">时</span>
						</el-form-item>
						<el-form-item  prop="end_minute">
							<el-select v-model="temp.end_minute" style="width: 120px;margin-right: 5px;" size="small">
								<el-option v-for="(item,index) in minuteList" :key="item" :value="item" :label="item"></el-option>
							</el-select>
							<span class="session-hour-min">分</span>
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
  import { getToken } from '../../utils/auth.js'
import { periodlist,periodadd, periodinfo, periodupdate, perioddelete, periodstatus, periodselect } from '../../api/api.js'
export default {
	name:'SessionsManage',
	data() {
		return {
			id: 0,
			loading: false,
			choseId: 0,

			rules: {
				name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
				status:[{ required: true, message: '状态不能为空', trigger: 'change' }],
				start_hour:[{ required: true, message: '开始时间的小时不能为空', trigger: 'change' }],
				start_minute:[{ required: true, message: '开始时间的分钟不能为空', trigger: 'change' }],
				end_hour:[{ required: true, message: '结束时间的小时不能为空', trigger: 'change' }],
				end_minute:[{ required: true, message: '结束时间的分钟不能为空', trigger: 'change' }],
			},
			pages:{
				page:1,
				pageSize:10,
				pageSizes:[10,20,30,50,100],
				total:400,
			},
			search:{
				name:'',
				status: ''
			},
			temp:{
				name: '',
				start_hour:'',
				start_minute:'00',
				end_hour:'',
				end_minute:'00',
				status:''
			},
      statusList1:[
      	{id: 0,name:'全部'},{id:1,name:'上架'},{id:2,name:'下架'}
      ],
			statusList:[
				{id:1,name:'上架'},{id:2,name:'下架'}
			],

			dialogVal:false,
			dialogText:'新增场次',

			list:[],
			minuteList:['00','05','10','15','20','25','30','35','40','45','50','55'],
      isSave: false
		};
	},
	created() {
		this.id = JSON.parse(getToken()).store_id
		this.init()
	},
	methods:{
		init(){
			this.loading = true;
			periodlist(this.id,this.search.name,this.search.status,this.pages.page,this.pages.pageSize).then(res=>{
				this.loading = false
				this.pages.total = res.result.total;
				this.list = res.result.data
			})
		},
		onSearch(){
			this.pages.page = 1;
			this.init()
		},
    onSearchZero(){
      this.pages.page = 1;
      this.pages.pageSize = 10;
      this.search.name = ''
      this.search.status = ''
      this.init()
    },
		onAdd(){
      if(this.list.length >= 5) {
        if(document.getElementsByClassName('el-message').length > 0) return false
        this.$message.warning('最多录入5个场次')
        return false
      }
			Object.keys(this.temp).forEach(key=>{this.temp[key]=''})
      this.temp.status = 1
      this.temp.start_minute = '00'
      this.temp.end_minute = '00'
			this.choseId = 0
			this.dialogText = '新增场次'
			this.dialogVal = true

			this.$nextTick(() => {
        this.$refs.diainput.focus()
				this.$refs['dataForm'].clearValidate();
			});
		},
		onEdit(obj) {
			this.choseId = obj.id
			periodinfo(obj.id).then(res=>{
				let obj = res.result.data;
				this.temp.name = obj.name;
				this.temp.start_hour = obj.start_time.split(':')[0]
				this.temp.start_minute = obj.start_time.split(':')[1]
				this.temp.end_hour = obj.end_time.split(':')[0]
				this.temp.end_minute = obj.end_time.split(':')[1]
				this.temp.status = obj.status

				this.dialogText = '编辑场次'
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
          let start_hour = this.temp.start_hour
          let end_hour = this.temp.end_hour

          if(this.temp.start_hour.length > 1) {
            if(Number(this.temp.start_hour) < 10) {
              start_hour = this.temp.start_hour
            }
          }else {
            if(Number(this.temp.start_hour) < 10) {
              start_hour = '0' + this.temp.start_hour
            }
          }


          if(this.temp.end_hour.length > 1) {
            if(Number(this.temp.end_hour) < 10) {
              end_hour = this.temp.end_hour
            }
          }else {
            if(Number(this.temp.end_hour) < 10) {
              end_hour = '0' + this.temp.end_hour
            }
          }

					if(this.choseId > 0) {
						periodupdate({
							id: this.choseId,
							name: this.temp.name,
							start_time: start_hour + ':' + this.temp.start_minute,
							end_time: end_hour + ':' + this.temp.end_minute,
							status: this.temp.status
						}).then(res=>{
							this.$message.success('编辑成功')
							this.dialogVal = false
							this.choseId = 0
							this.init()
							this.$nextTick(() => {
								this.$refs['dataForm'].clearValidate();
							});
              this.isSave = false
						}).catch(err=>{
              this.isSave = false
            })
					}else {
						periodadd({
							store_id: this.id,
							name: this.temp.name,
							start_time: start_hour + ':' + this.temp.start_minute,
							end_time: end_hour + ':' + this.temp.end_minute,
							status: this.temp.status
						}).then(res=>{
							this.$message.success('新增成功')
							this.dialogVal = false
							this.init()
							this.$nextTick(() => {
								this.$refs['dataForm'].clearValidate();
							});
              this.isSave = false
						}).catch(err=>{
              this.isSave = false
            })
					}
				}
			})
		},
		onStatus(obj){
			let status = 0
			if(obj.status == 1) {
				status = 2
			}else {
				status = 1
			}
			periodstatus({
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
		onDel(id){
			this.$confirm('删除此场次会影响房费录入、计费套餐关联数据！', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				perioddelete({id}).then(res=>{
					if(res.code == 0) {
						this.$message.success('删除成功')
						this.init()
					}
				})
			})
		},
		onSizeChange(val){
			this.pages.pageSize = val
			this.init()
		},
		onCurrentChange(val){
			this.pages.page = val
			this.init()
		},
	}
};
</script>

<style lang="scss" scoped>

.sessions-manage {
	width: 100%;
	padding: 20px;
	box-sizing: border-box;
  ::v-deep {
    table {
      width: 100% !important;
    }
  }

	.sessions-manage-top {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30px;
		.sessions-manage-top-lft {
			display: flex;
			align-items: center;
			.sessions-manage-top-item {
				display: flex;
				align-items: center;
				margin-right: 20px;
				span {
					flex-shrink: 0;
					font-size: 14px;
					margin-right: 10px;
				}
			}
			.sessions-manage-top-item:not(:first-child) {
				width: 200px;
			}
		}
	}
	.session-hour-min {
		font-size: 14px;
		margin: 0 15px 0 5px;
	}
}
</style>
