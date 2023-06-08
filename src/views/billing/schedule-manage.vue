<template>
	<div class="schedule-manage">
		<el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="档期" name="first">
				<div class="schedule-manage-top">
          <div></div>
					<el-button type="primary" @click="onAdd()" icon="el-icon-plus">新增</el-button>
				</div>
				<el-table ref="table" :data="list" stripe border fit highlight-current-row @row-dblclick="onEdit1" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" v-loading="loading">
					<el-table-column align="center" label="档期名称" width="150" >
						<template slot-scope="{ row }">
							<span v-if="row.isAdd == 0">{{row.name}}</span>
							<el-input ref="diainput" v-show="row.isAdd > 0" v-model.trim="row.name"></el-input>
						</template>
					</el-table-column>

					<el-table-column align="center" label="类型" width="150" >
						<template slot-scope="{ row }">
							<span v-if="row.isAdd == 0">{{row.type =='1'?'普通档':'节日档'}}</span>
							<el-select v-if="row.isAdd > 0" v-model="row.type" placeholder="请选择类型" @change="onChangeType(row)">
								<el-option v-for="(item,index) in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期一">
						<template slot-scope="{ row,$index }">
              <!-- <el-radio v-model="row.checked.indexOf(1)>=0?true:false" :disabled="row.isEdit || row.type == 2" @change="onCheck(row,'1')"></el-radio> -->
							<el-checkbox border :checked="row.checked.indexOf(1)>=0?true:false" :disabled="row.isEdit || row.type == 2" @change="onCheck(row,'1')" ></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期二">
						<template slot-scope="{ row,$index }">
							<el-checkbox border :checked="row.checked.indexOf(2)>=0?true:false" :disabled="row.isEdit || row.type == 2" @change="onCheck(row,'2')"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期三">
						<template slot-scope="{ row,$index }">
							<el-checkbox :ref="'checkd4'" border :checked="row.checked.indexOf(4)>=0?true:false" :disabled="row.isEdit || row.type == 2" @change="onCheck(row,'4')"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期四">
						<template slot-scope="{ row,$index }">
							<el-checkbox border :checked="row.checked.indexOf(8)>=0?true:false" :disabled="row.isEdit || row.type == 2" @change="onCheck(row,'8')"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期五">
						<template slot-scope="{ row,$index }">
							<el-checkbox border :checked="row.checked.indexOf(16)>=0?true:false" :disabled="row.isEdit || row.type == 2" @change="onCheck(row,'16')"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期六">
						<template slot-scope="{ row,$index }">
							<el-checkbox border :checked="row.checked.indexOf(32)>=0?true:false" :disabled="row.isEdit || row.type == 2" @change="onCheck(row,'32')"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column  align="center" label="星期天">
						<template slot-scope="{ row,$index }">
							<el-checkbox border :checked="row.checked.indexOf(64)>=0?true:false" :disabled="row.isEdit || row.type == 2" @change="onCheck(row,'64')"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column align="center" label="状态" width="150">
						<template slot-scope="{ row }">
							<span v-if="row.isAdd == 0">{{row.status == '1'?'上架':'下架'}}</span>
							<el-select v-if="row.isAdd > 0" v-model="row.status" placeholder="请选择状态">
								<el-option v-for="(item,index) in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="240" >
						<template slot-scope="{ row }" >
							<template v-if="row.isAdd == 1 || row.isAdd == 0">
								<el-button type="info" v-if="!row.isEdit" size="mini" @click="onFail(row)">取消</el-button>
                <el-popconfirm v-if="row.isEdit" :confirm-button-text="row.status == 1? '下架':'上架'" cancel-button-text='取消' icon="el-icon-info"  :icon-color="row.status== 1 ? 'red':'green'"
                :title="row.status == 1?'下架此档期会影响房费录入、计费套餐关联数据':'确定上架吗'" @onConfirm="onStatus(row)" >
                  <el-button slot="reference" :type="row.status==1?'info':'success'" size="mini">{{row.status==1?'下架':'上架'}}</el-button>
                </el-popconfirm>
								<!-- <el-button  v-if="row.isEdit" :type="row.status==1?'info':'success'" size="mini" @click="onStatus(row)">{{row.status==1?'下架':'上架'}}</el-button> -->
								<el-button :type="row.isEdit?'primary':'success'" size="mini" @click="onEdit(row)" :loading="isLoading" style="margin-left: 10px;">{{row.isEdit?'修改':'保存'}}</el-button>
								<el-button type="danger" size="mini" @click="onDel(row.id)">删除</el-button>
							</template>
							<template v-if="row.isAdd == 2">
								<el-button type="info" size="mini" @click="onCancle">取消</el-button>
								<el-button type="success" size="mini" @click="onAddConfirm" :loading="isOver">完成</el-button>
							</template>
						</template>
					</el-table-column>
				</el-table>

				<Costompagination :page="pages.page" :pageSize="pages.pageSize" :pageSizes="pages.pageSizes" :total="pages.total"
					@onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange" :note="'注：最多录入4个档期'"
				></Costompagination>

			</el-tab-pane>
		    <el-tab-pane label="节日" name="second">
				<div class="schedule-manage-top">
          <div></div>
					<el-button type="primary" @click="onAddFest()" icon="el-icon-plus">新增</el-button>
				</div>
				<el-table ref="table1" :data="festivalList" stripe border fit highlight-current-row @row-dblclick="onEditFest1" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" v-loading="loadingHoliday">
					<el-table-column align="center" label="节日名称" width="150">
						<template slot-scope="{ row }">
							<span v-if="row.isAdd == 0">{{row.holiday}}</span>
							<el-input v-if="row.isAdd > 0" v-model="row.holiday"></el-input>
						</template>
					</el-table-column>

					<el-table-column align="center" label="开始日期">
						<template slot-scope="{ row }">
							<el-date-picker style="width: 150px" v-model="row.start" value-format='yyyy-MM-dd' format='yyyy-MM-dd' type="date" placeholder="选择日期时间" :disabled="row.isEdit"></el-date-picker>
						</template>
					</el-table-column>
					<el-table-column align="center" label="结束日期">
						<template slot-scope="{ row,$index }">
							<el-date-picker style="width: 150px" v-model="row.end" value-format='yyyy-MM-dd' format='yyyy-MM-dd' type="date" placeholder="选择日期时间" :disabled="row.isEdit" @change="onChoseEnd(row)"></el-date-picker>
						</template>
					</el-table-column>
					<el-table-column align="center" label="状态" width="150">
						<template slot-scope="{ row }">
							<span  v-if="row.isAdd == 0">{{row.status == '1'?'上架':'下架'}}</span>
							<el-select v-if="row.isAdd > 0" v-model="row.status" placeholder="请选择状态">
								<el-option v-for="(item,index) in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="240" fixed="right">
						<template slot-scope="{ row }" >
							<template v-if="row.isAdd == 1 || row.isAdd == 0">
								<el-button type="info" v-if="!row.isEdit" size="mini" @click="onFail1(row)">取消</el-button>
                <el-popconfirm v-if="row.isEdit" :confirm-button-text="row.status == 1? '下架':'上架'" cancel-button-text='取消' icon="el-icon-info"  :icon-color="row.status== 1 ? 'red':'green'"
                  :title="row.status == 1?'确定下架吗':'确定上架吗'" @onConfirm="onStatus1(row)" >
                  <el-button slot="reference" :type="row.status==1?'info':'success'" size="mini">{{row.status==1?'下架':'上架'}}</el-button>
                </el-popconfirm>
								<!-- <el-button  v-if="row.isEdit" :type="row.status==1?'info':'success'" size="mini" @click="onStatus1(row)">{{row.status==1?'下架':'上架'}}</el-button> -->
								<el-button :type="row.isEdit?'primary':'success'" size="mini" @click="onEditFest(row)" :loading="isLoading1" style="margin-left: 10px;">{{row.isEdit?'修改':'保存'}}</el-button>
								<el-button type="danger" size="mini"  @click="onDel1(row.id)">删除</el-button>
							</template>
							<template v-if="row.isAdd == 2">
								<el-button type="info" size="mini" @click="onCancleFest">取消</el-button>
								<el-button type="success" size="mini" @click="onAddFestConfirm" :loading="isOver1">完成</el-button>
							</template>
						</template>
					</el-table-column>
				</el-table>
				<Costompagination :page="pages1.page" :pageSize="pages1.pageSize" :pageSizes="pages1.pageSizes" :total="pages1.total"
					@onSizeChange="onSizeChange1" @onCurrentChange="onCurrentChange1"
				></Costompagination>
			</el-tab-pane>
		</el-tabs>

	</div>
</template>

<script>
  import { getToken } from '../../utils/auth.js'
	import {
		schedulelist, scheduleadd, scheduleupdate, scheduledelete, schedulestatus, scheduleselect,
		holidaylist, holidayadd, holidayupdate, holidaydelete, holidaystatus
	} from '../../api/api.js'
export default {
		name:'ScheduleManage',
		data(){
			return {
				id: 0,
				loading: false,

				pages:{
					page:1,
					pageSize:10,
					pageSizes:[10,20,30,50,100],
					total:400,
				},
				pages1:{
					page:1,
					pageSize:10,
					pageSizes:[10,20,30,50,100],
					total:400,
				},
				activeName:'first',
				list:[],
				week:{
					mon: true,tue: true,wed: true,thu: true,fri: true,sat: true,sun: true
				},
        weekList:[
          [1,2,4,8],[16,32,64]
        ],
				temp:{
					name:'',
					type:'',
					status: ''
				},
				statusList:[
					{id: 1,name:'上架'},{id: 2,name:'下架'}
				],
				typeList:[
					{id: 1,name:'普通档'},{id: 2,name:'节日档'}
				],

				tempFest:{name:'',status: ''},
				festivalList:[],
				isAdd: 0,						//0为默认，1位编辑，2为新增
				loadingHoliday: false,

        isLoading: false,
        isOver: false,
        isLoading1: false,
        isOver1: false
			}
		},
		created() {
			this.id = JSON.parse(getToken()).store_id
			this.init()
		},
    watch: {
      list(val) {
        this.doLayout(0);
      },
      festivalList(val) {
        this.doLayout(1);
      },
    },
		methods:{
      doLayout(e){
        let that = this
        if(e == 0) {
          this.$nextTick(() => {
            that.$refs.table.doLayout()
          })
        }else {
          this.$nextTick(() => {
            that.$refs.table1.doLayout()
          })
        }
      },
      onPageCancle(){
        if(this.activeName == 'first') {
          if(this.list[this.list.length - 1].isAdd == '2') {
            this.onCancle()
          }
        }
        if(this.activeName == 'second') {
          if(this.festivalList[this.festivalList.length - 1].isAdd == '2') {
            this.onCancleFest()
          }
        }
      },
			handleClick(){
				if(this.activeName == 'second') {
          this.initHoliday()
				}
        if(this.activeName == 'first') {
          this.init()
        }
			},
      deepCopy(obj){
        if (typeof obj !== 'object') return;
          // 根据obj的类型判断是新建一个数组还是一个对象
        var newObj = obj instanceof Array ? [] : {};
        for (var key in obj) {
          // 遍历obj,并且判断是obj的属性才拷贝
          if (obj.hasOwnProperty(key)) {
            // 判断属性值的类型，如果是对象递归调用深拷贝
            newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
          }
        }
        return newObj;
      },
			init(){
				this.loading = true;
				schedulelist(this.id,this.pages.page,this.pages.pageSize).then(res=>{
					this.loading = false
          let weekList = []
					res.result.data.forEach(item=>{
						item.isEdit = true
						item.isAdd = '0'
            weekList.push([])
					})
          // for(let i = 0; i< weekList.length; i++) {
          //   for(let j = 0; j < res.result.data.length; j++) {
          //     for(let k = 0;k < res.result.data[j].checked.length; k++) {
          //       weekList[i].push(res.result.data[j].checked[k])
          //     }
          //   }
          // }
          // console.log(weekList,'list')
					this.pages.total = res.result.total
					this.list = res.result.data
				})
			},
      onChangeType(row){
        if(row.type == 2) {
          // this.$nextTick(()=>{
            let temp = [1,2,4,8,16,32,64]
            for(let k of temp) {
              row.checked = JSON.parse(JSON.stringify(row.checked.filter(item=> {item != k;this.$set(row,item,'')})))
            }
            console.log(row.checked)
            this.$forceUpdate()
          // })
        }
      },
			onStatus(obj){
				let status = 0
				if(obj.status == 1) {
					status = 2
				}else {
					status = 1
				}
				schedulestatus({
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
				this.$confirm('删除此档期会影响房费录入、计费套餐关联数据！', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					scheduledelete({id}).then(res=>{
						if(res.code == 0) {
							this.$message.success('删除成功')
              this.list = []
							this.init()
						}
					})
				})
			},

			onAdd(){

        if(this.list.length >= 4) {
          if(document.getElementsByClassName('el-message').length > 0) return false
          this.$message.warning('档期不能多于4个')
        }else {
          let obj = {
          	name: '',
          	type: '',
          	checked: [],
          	isEdit: false,
          	isAdd: '2',
            status: 1,
            type: 1
          }
          if(this.list.length == 0) {
          	this.list.push(obj)
            this.$nextTick(()=>{
              this.$refs.diainput.focus()
            })
          }else {

            // this.$forceUpdate()
            // console.log(this.list[this.list.length -1].isAdd,'list')
          	if(this.list[this.list.length -1].isAdd != '2') {
              this.list.forEach(item=>{
                  item.isEdit = true
                  item.isAdd = '0'
              })
          		this.list.push(obj)
              this.$nextTick(()=>{
                this.$refs.diainput.focus()
              })
          	}else {
              this.$message.warning('请先完成上一个档期')
            }
          }
        }


			},
			onFail(row){
        this.list = []
        this.init()
			},
			onCancle(){
				this.list.pop()
			},
      onEdit1(obj){
        if(this.list[this.list.length - 1].isAdd == '2') {
          this.onCancle()
        }
        if(obj.isEdit) {
          this.list.forEach(item =>{
            item.isEdit = true;
            item.isAdd = '0'
          })
          obj.isAdd = '1'
          obj.isEdit = false
        }
        this.$nextTick(()=>{
          this.$refs.diainput.focus()
        })
      },
			onEdit(obj){
        if(this.list[this.list.length - 1].isAdd == '2') {
          this.onCancle()
        }
        
				if(obj.isEdit) {
          this.list.forEach(item =>{
            item.isEdit = true;
            item.isAdd = '0'
          })
					obj.isAdd = '1'
					obj.isEdit = false

				}else {
          if(obj.name.length == 0) {
            this.$message.warning('名称不能为空')
            return false
          }
          if(obj.checked.length == 0) {
            if(obj.type == 1) {
              this.$message.warning('编辑普通档时日期不能为空')
              return false
            }
          }
          this.isLoading = true

					scheduleupdate({
						id: obj.id,
						name: obj.name,
						type: obj.type,
						status: obj.status,
						checked: obj.checked
					}).then(res=>{
						obj.isEdit = true
						this.$message.success('修改档期成功')
						this.init()
            this.isLoading = false
					}).catch(err=>{
            this.isLoading = false
          })
				}

			},
			onAddConfirm(){
        let obj = this.list[this.list.length - 1]
        // console.log(obj,'obj')
        this.isOver = true
        if(obj.checked.length == 0) {
          if(obj.type == 1) {
            this.isOver = false
            this.$message.warning('新建普通档时日期不能为空')
            return false
          }
        }
        if(obj.name.length > 0) {
          scheduleadd({
            store_id: this.id,
            name: obj.name,
            type: obj.type,
            status: obj.status,
            checked: obj.checked
          }).then(res=>{
            this.list = []
            this.init()
            this.isOver = false
          }).catch(err=>{
            this.isOver = false
          })
        }else {
          this.$message.warning('名称不能为空')
          this.isOver = false
        }

          // console.log(this.temp,'temp')
          // console.log(this.list[this.list.length - 1],'week')


			},
			onCheck(obj,e){
        let index = obj.checked.indexOf(Number(e))
        if(index >= 0) {
          obj.checked.splice(index,1)
        }else {
          obj.checked.push(Number(e))
        }
			},


			// 节日
			initHoliday(){
				this.loadingHoliday = true
				holidaylist(this.id,this.pages1.page,this.pages1.pageSize).then(res=>{
					this.pages1.total = res.result.total
					res.result.data.forEach(item=>{
						item.isEdit = true
						item.isAdd = '0'
					})
					this.festivalList = res.result.data
					this.loadingHoliday = false
				})
			},
			onAddFest(){
				let obj = {
					holiday: '',
					start: '',
					end: '',
					isEdit: false,
					isAdd: '2',
          status: 1
				}
				if(this.festivalList.length == 0) {
					this.festivalList.push(obj)
				}else {
					if(this.festivalList[this.festivalList.length - 1].isAdd != '2') {
            this.festivalList.forEach(item=>{
                item.isEdit = true
                item.isAdd = '0'
            })
						this.festivalList.push(obj)
					}else {
            this.$message.warning('请先完成上一个节日')
          }
				}
			},
      onEditFest1(obj) {
        if(this.festivalList[this.festivalList.length - 1].isAdd == '2') {
          this.onCancleFest()
        }

        if(obj.isEdit) {
          this.festivalList.forEach(item=>{
            item.isAdd = '0'
            item.isEdit = true
          })
        	obj.isAdd = '1'
        	obj.isEdit = false
        }
      },
			onEditFest(obj){
        if(this.festivalList[this.festivalList.length - 1].isAdd == '2') {
          this.onCancleFest()
        }
				if(obj.isEdit) {
          this.festivalList.forEach(item =>{
            item.isEdit = true;
            item.isAdd = '0'
          })
					obj.isAdd = '1'
					obj.isEdit = false
				}else {
          if(obj.holiday.length == 0) {
            this.$message.warning('名称不能为空')
            return false
          }
          this.isLoading1 = true
					holidayupdate({
						id: obj.id,
						holiday: obj.holiday,
						start: obj.start,
						end: obj.end,
						status: obj.status
					}).then(res=>{
						obj.isEdit = true
						this.$message.success('修改节日成功')
						this.initHoliday()
            this.isLoading1 = false
					}).catch(err=>{
            this.isLoading1 = false
          })
				}
			},
			onFail1(row){
        this.festivalList = []
        this.initHoliday()
				row.isEdit = true
				row.isAdd = 0
			},
			onCancleFest(){
				this.festivalList.pop()
			},
      onChoseEnd(row){
        console.log(row)
        let start = new Date(row.start)
        let end = new Date(row.end)
        if(start > end) {
          row.end = ''
          this.$message.error('开始时间不能大于结束时间')
        }
      },
			onAddFestConfirm(){

				let obj = this.festivalList[this.festivalList.length - 1]
        if(obj.holiday.length == 0) {
          this.$message.warning('名称不能为空')
          return false
        }
        if(!obj.start) {
          this.$message.warning('开始时间不能为空')
          return false
        }
        if(!obj.end) {
          this.$message.warning('结束时间不能为空')
          return false
        }
        this.isOver1 = true
				holidayadd({
					store_id: this.id,
					holiday: obj.holiday,
					start: obj.start,
					end: obj.end,
					status: obj.status,
				}).then(res=>{
					this.festivalList = []
					this.initHoliday()
          this.isOver1 = false
				}).catch(err=>{
          this.isOver1 = false
        })
			},
			onStatus1(obj){
				let status = 0
				if(obj.status == 1) {
					status = 2
				}else {
					status = 1
				}
				holidaystatus({
					id: obj.id,
					status: status
				}).then(res=>{
					if(obj.status == 1) {
						this.$message.success('下架成功')
						this.initHoliday()
					}else {
						this.$message.success('上架成功')
						this.initHoliday()
					}
				})
			},
			onDel1(id){
				this.$confirm('是否确认删除此档期？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					holidaydelete({id}).then(res=>{
						if(res.code == 0) {
							this.$message.success('删除成功')
							this.initHoliday()
						}
					})
				})
			},



			onSizeChange(val) {
				this.pages.pageSize = val
				this.init()
			},
			onCurrentChange(val) {
				this.pages.page= val
				this.init()
			},
			onSizeChange1(val) {
				this.pages1.pageSize = val
				this.initHoliday()
			},
			onCurrentChange1(val) {
				this.pages1.page= val
				this.initHoliday()
			},
		}
	}
</script>

<style lang="scss" scoped>
.schedule-manage {
	width: 100%;
  min-height: 85vh;
	padding: 20px;
	box-sizing: border-box;
  ::v-deep {
    .el-checkbox.is-bordered {
      padding: 10px;
      border: none;
    }
    table {
      width: 100% !important;
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      border-color: #67C23A;
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
      border-color: #67C23A;
    }
  }
	.schedule-manage-top {
		margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
	}
}
</style>
