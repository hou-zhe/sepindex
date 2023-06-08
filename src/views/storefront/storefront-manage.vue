<template>
	<div class="storefront-manage">
		<div class="storefront-manage-top">
			<div class="storefront-manage-top-lft">
				<div class="storefront-manage-top-item">
					<span style="flex-shrink: 0;margin-right: 10px;">店面选择</span>
					<el-select v-model="search.storefront" placeholder="请选择店面" style="width: 75%;" @change="onChange">
						<el-option v-for="(item,index) in storefrontList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</div>
				<div class="storefront-manage-top-item" style="margin-left: 30px;">
					<span style="flex-shrink: 0;margin-right: 10px;">加密狗号</span>
					<el-input v-model="search.searchVal" placeholder="请输入有效的加密狗号" @keyup.enter.native="onSearch" ></el-input>
				</div>
			</div>
      <div class="storefront-manage-top-rgt">
        <el-button type="primary" @click="onSearch" icon="el-icon-search" >查询</el-button>
        <el-button type="primary" @click="onSearchZero" icon="el-icon-refresh">重置</el-button>
      </div>

		</div>
		<el-table class="table-fixed" :data="list" fit border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" :row-class-name="tableDouble" :row-style="{backgroundColor: '#fefefe'}" v-loading="loading">
			<el-table-column align="center" label="门店名称" width="200" fixed>
				<template slot-scope="{ row }">
					{{row.name}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="加密狗号" width="120" fixed>
				<template slot-scope="{ row }">
					{{row.lock_dog}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="省市区" width="250">
				<template slot-scope="{ row }">
					{{row.province}}{{row.city}}{{row.county}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="店面地址" width="250">
				<template slot-scope="{ row }">
					{{row.region}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="创建时间" width="180">
				<template slot-scope="{ row }">
					{{row.created_at}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="包房" width="120">
				<template slot-scope="{ row }">
					{{row.rooms}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="异常提醒" width="120" >
				<template slot-scope="{ row }">
					<el-popover placement="bottom" width="200" trigger="hover" v-if="row.remind.length > 0">
						<div v-for="(item,index) in row.remind" :key="index" style="margin: 10px 0;">
							<i class="el-icon-warning" style="font-size: 16px;color: #F56C6C;margin-right: 5px;"></i>{{item.name}}
						</div>
						<i class="el-icon-warning" style="font-size: 24px;color: #F56C6C;" slot="reference"><sup style="font-size: 14px;">4</sup></i>
					</el-popover>
					<i class="el-icon-success" style="font-size: 24px;color: #67C23A;" v-else></i>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="300">
				<template slot-scope="{ row }">
					<router-link class="storefront-a" to="../billing/schedule-manage">节日</router-link>
					<router-link class="storefront-a" to="../billing/sessions-manage">场次</router-link>
					<router-link class="storefront-a" to="../billing/fee-entry">计费录入</router-link>
					<router-link class="storefront-a" to="../billing/billing-package">计费套餐</router-link>
					<router-link class="storefront-a" to="../storefront/operate-parameter">运营参数</router-link>
					<router-link class="storefront-a" to="../storefront/room-type">房型</router-link>
					<router-link class="storefront-a" to="../storefront/room-manage">房间</router-link>
				</template>
			</el-table-column>

			<el-table-column align="center" label="导入/导出" width="175" fixed="right">
				<template slot-scope="{ row }">
          <div style="display: flex;align-items: center;">
            <div style="position: relative;display: flex;">
              <input type="file" name="file" @change="upload" accept=".json" id="upload1" class="input-upload">
              <el-button type="primary" size="mini" style="margin-right: 10px;cursor: pointer;">导入</el-button>
            </div>

            <el-dropdown>
            	<el-button type="success" size="mini" icon="el-icon-download">导出<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            	<el-dropdown-menu slot="dropdown">
            		<el-dropdown-item @click.native="onExport(0)">导出全部</el-dropdown-item>
                <el-dropdown-item @click.native="onExport(1)">导出商品信息</el-dropdown-item>

            		<!-- <el-dropdown-item @click.native="onExport(1)">导出档期</el-dropdown-item> -->
            		<!-- <el-dropdown-item>导出运营参数</el-dropdown-item>
            		<el-dropdown-item>导出节日</el-dropdown-item>
            		<el-dropdown-item>导出场次</el-dropdown-item>
            		<el-dropdown-item>导出计费录入</el-dropdown-item>
            		<el-dropdown-item>导出计费套餐</el-dropdown-item>
            		<el-dropdown-item>导出运营参数</el-dropdown-item>
            		<el-dropdown-item>导出物品</el-dropdown-item> -->
            	</el-dropdown-menu>
            </el-dropdown>
          </div>

				</template>
			</el-table-column>
		</el-table>
		<Costompagination :page="pages.page" :pageSize="pages.pageSize" :pageSizes="pages.pageSizes" :total="pages.total"
			@onSizeChange="onSizeChange" @onCurrentChange="onCurrentChange"
		></Costompagination>

	</div>
</template>

<script>
  import $ from 'jquery'
  import { getToken,setToken } from '../../utils/auth.js'
  import axios from 'axios'
	import { storelist, storeselect, storeimport, storeexport } from '../../api/api.js'
export default {
	name:'StorefrontManage',
	data() {
		return {
			pages:{
				page:1,
				pageSize:10,
				pageSizes:[10,20,50,100],
				total:400,
			},
			id: 0,
			storefrontList:[],
			search:{
        storefront: 0,
        searchVal: ''
      },

			loading: false,
			list:[]
		};
	},
	created() {
		this.id = JSON.parse(getToken()).store_id
		this.init()
	},
	methods:{
		async init(){
			this.loading = true
      await storeselect(this.id).then(res=>{
        this.storefrontList = res.result
        this.search.storefront = res.result[0].id
      })
			await storelist(this.id,this.search.searchVal,this.pages.page,this.pages.pageSize).then(res=>{
				this.list = res.result.data
				this.loading = false
				this.pages.total = res.result.total
			})
		},

		tableDouble({row, rowIndex}) {
			if(this.list[rowIndex].remind.length > 0) {
				return 'warning-row';
			}else {
				return 'success-row';
			}
			// if (row.remind.length == 0) {
			//   return 'warning-row';
			// }else {
			// 	return '';
			// }

		},
    onChange(){
      let obj = JSON.parse(getToken())
      obj.store_id = this.search.storefront
      setToken(JSON.stringify(obj))
      this.id = this.search.storefront
    },
		onSearch(){
			this.pages.page = 1
			this.init()
		},
    onSearchZero(){
      this.pages.page = 1
      this.pages.pageSize = 10
      this.search.storefront = ''
      this.search.searchVal = ''
      this.init()
    },
    onImport(){
      storeimport({store_id: this.id}).then(res=>{

      })
    },
    onExport(e){
      let name = this.list[0].name
      if(this.search.storefront) {
        this.list.forEach(item=>{
          if(item.id == this.search.storefront) {
            name = item.name
          }
        })
      }
      storeexport(this.id,e).then(res=>{
         var data = JSON.stringify(res.result)
          //encodeURIComponent解决中文乱码
          let uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
          //通过创建a标签实现
          let link = document.createElement("a");
          link.href = uri;
          //对下载的文件命名
          link.download =  name + ".json";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      })
    },
    upload(e) {
      let filed = e.target.files[0];
      let formData = new FormData();
      if(filed) {
        // console.log(filed,'--------')
        formData.append("data", filed);
        formData.append("store_id", this.id);

        let data = filed
        if(data) {
          storeimport(formData).then(res=>{
            this.$message.success('导入文件成功')
          }).catch(err=>{
            this.$message.error(err,'导入文件失败')
          })
        }else {
          console.log('没有文件')
        }


        // this.$http.get(filed).then(res => {
        //  console.log("json数据为:" + res)//此处的res对象包含了json的文件信息和数据，我们需要的json数据存在于body属性中
        // })
        // console.log(filed)
           // axios.get(filed).then(res=>{
           //   console.log(res,'res')
           // }).catch(err=>{
           //   console.log(err,'err')
           // })
        // var data = new FormData()
        //    data.append('store_id',filed)
        //    $.ajax({
        //        url:'https://test-sepadmin.ikalaok.com/api/cashier/store/import',
        //        type: "Post",
        //        dataType: "application/json",
        //        cache: false,//上传文件无需缓存
        //        processData: false,//用于对data参数进行序列化处理 这里必须false
        //        contentType: false, //必须
        //        data:data,
        //        success:function (res) {
        //            console.log(res);
        //        },
        //        error:function (error) {
        //            console.log(error);
        //        }
        //    })
      }



    },
		onSizeChange(val){
			this.pages.pageSize = val;
			this.init()
		},
		onCurrentChange(val){
			this.pages.page = val;
			this.init()
		}
	}
};
</script>

<style lang="scss" scoped>
.storefront-manage {
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
  
	::v-deep {
    table {
      width: 100% !important;
    }
		.el-table {
			tbody tr {
				&:hover {
					td {
						background-color: transparent;  //颜色必须是rgb
					}
				}
			}
		}
		.success-row {
			background-color: #f0f9eb !important;
		}
	}
	.storefront-manage-top {
		width: 100%;
    // height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
    margin-bottom: 20px;
    // background-color: #fff;
    // padding: 20px 10px;
    // box-sizing: border-box;
		.storefront-manage-top-lft {
			display: flex;
			align-items: center;
			.storefront-manage-top-item {
				display: flex;
				align-items: center;
				font-size: 14px;
			}
		}
	}
	.storefront-a {
		text-decoration: underline;
		margin-right: 10px;
	}
  .input-upload {
    width: 56px;
    height: 28px;
    position: absolute;
    top: 2px;
    z-index: 3;
    opacity: 0;
    cursor: pointer;
    font-size: 0;
  }
	// .storefront-badge {
	// 	::v-ddep {

	// 	}
	// }
}
</style>
