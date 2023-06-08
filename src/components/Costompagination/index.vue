<template>
	<div class="coustom-pagination-compinentss">
		<span style="color: #F56C6C;font-size: 14px;" v-if="note">{{note}}</span>
    <span style="width: 20px;" v-if="!note"></span>
		<div style="display: flex;align-items: center;">
			<el-pagination background @size-change="handleSizeChange" :current-page="page" @current-change="handleCurrentChange"
				:page-sizes="pageSizes" :page-size="pageSize" layout="total,sizes,prev,pager,next,jumper" :total="total">
			</el-pagination>
			<el-button type="primary" size="mini" style="margin-left: 10px;">确定</el-button>
		</div>

	</div>
</template>

<script>
	export default {
		props:{
			page:{
				type: Number,
				default: 1
			},
			total: {
				type: Number,
				default: 0
			},
			pageSize: {
				type: Number,
				default: 10
			},
			pageSizes: {
				type: Array,
				default: [10]
			},
			note: {
				type: String,
				default: ''
			}
		},
		data(){
			return {

			}
		},
		methods:{
			handleSizeChange(e){
				this.$emit('onSizeChange',e)
			},
			handleCurrentChange(e) {
				this.$emit('onCurrentChange',e)
			}
		}
	}
</script>

<style lang="scss" scoped>
.coustom-pagination-compinentss {
	width: 100%;
	height: 60px;
	border: 1px solid #EBEEF5;
	border-top: none;
	display: flex;
	align-items: center;
	justify-content: space-between;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
	// margin-top: 10px;
	padding: 0 10px;
	box-sizing: border-box;
	::v-deep {
		.el-pagination__total {
			font-size: 14px !important;
		}
	}
}
</style>
