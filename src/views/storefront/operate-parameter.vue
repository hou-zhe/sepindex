<template>
	<div class="operate">
		<div class="operate-top">
			<div class="operate-top-lft">
				<div class="operate-top-item">
					<span style="flex-shrink: 0;margin-right: 10px;">店面选择</span>
					<el-select v-model="storefront" placeholder="请选择店面" style="width: 75%;" @change="onChange">
						<el-option v-for="(item,index) in storefrontList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</div>
			</div>
			<div class="operate-top-rgt">
				<el-button type="success" @click="onSave" :loading="isSave">保存</el-button>
				<el-button type="info" @click="onMessage">信息下发中转</el-button>
			</div>
		</div>
		<el-tabs v-model="activeName" @tab-click="handleClick">

		    <el-tab-pane label="运营参数" name="first" v-loading="loading">
				<el-row :gutter="24">
					<el-col :span="12">
						<div class="operate-item-time">
							<span class="operate-item-text">日营业开始时间</span>
							<el-select v-model="hour" style="width: 100px;margin-right: 5px;" size="mini">
								<el-option v-for="(item,index) in 24" :key="index" :label="index < 10? '0' + index:index" :value="index"> </el-option>
							</el-select>
							<span class="operate-item-text">时</span>
							<el-select v-model="minute" style="width: 100px;margin-right: 5px;" size="mini">
								<el-option v-for="(item,index) in 60" :key="index" :value="index < 10? '0' + index : index" :label="index < 10? '0' + index: index"></el-option>
							</el-select>
							<span class="operate-item-text">分</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="operate-item-time">
							<span class="operate-item-text">日营业截止时间</span>
							<el-select v-model="hour1" style="width: 100px;margin-right: 5px;" size="mini">
								<el-option v-for="(item,index) in 24" :key="index" :label="index < 10? '0' + index:index" :value="index"> </el-option>
							</el-select>
							<span class="operate-item-text">时</span>
							<el-select v-model="minute1" style="width: 100px;margin-right: 5px;" size="mini">
								<el-option v-for="(item,index) in 60" :key="index" :value="index < 10? '0' + index : index" :label="index < 10? '0' + index: index"></el-option>
							</el-select>
							<span class="operate-item-text">分</span>
						</div>
					</el-col>
				</el-row>
			<!-- 	<el-row :gutter="24" style="margin-top: 20px;">
					<el-col :span="12">
						<div class="operate-item-time">
							<span class="operate-item-text">收银APP登陆名</span>
							<el-input v-model.trim="username" style="width: 62%;" size="mini"></el-input>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="operate-item-time">
							<span class="operate-item-text">收银APP登陆密码</span>
							<el-input v-model.trim="password" style="width: 54%;" size="mini"></el-input>
						</div>
					</el-col>
				</el-row> -->
				<!-- 计费相关 -->
				<fieldset style="border: 1px solid #DCDFE6;width: 100%;margin: 20px 0;">
					<legend>计费相关</legend>
					<el-row :gutter="24" style="margin-top: 10px;">
						<el-col :span="11" :offset="1">
							<div class="operate-item-time">
								<el-checkbox v-model="charge_status" style="margin-right: 10px;"></el-checkbox>
								<span>计费起钟时长</span>
								<!-- <el-input v-model="charge.charge_time" size="mini" style="width: 60px;margin: 0 10px;"></el-input> -->
                <el-select :disabled="!charge_status" v-model="charge.charge_time" style="width: 70px;margin: 0 10px;" size="mini" placeholder="">
                	<el-option v-for="(item,index) in 60" :key="index" :value="index < 10? '0' + index : index" :label="index < 10? '0' + index: index"></el-option>
                </el-select>
								<span>分钟</span>
							</div>
						</el-col>
						<el-col :span="11">
							<span>即超过免收时长后，不满起钟时长按起钟时长收费</span>
						</el-col>
					</el-row>

					<!-- <el-row :gutter="20" style="margin-top: 10px;">
						<el-col :span="9" :offset="1">
							<div class="operate-item-time">
								<el-checkbox v-model="unit_status" style="margin-right: 10px;"></el-checkbox>
								<span>单价计时-最小计费单位</span>
								<el-input v-model="charge.unit_time" size="mini" style="width: 60px;margin: 0 10px;"></el-input>
								<span>分钟</span>
							</div>

						</el-col>
						<el-col :span="9">
							<span style="color: #606266;">如果是10分钟，消费21~29分钟，都按30分钟计时收费。</span>
						</el-col>
					</el-row> -->
					<el-row :gutter="24" style="margin-top: 10px;">
						<el-col :span="23" :offset="1">
							<div class="operate-item-time">
								<el-checkbox v-model="begin_status" style="margin-right: 10px;"></el-checkbox>
								<span>计费套餐-本场次开始前</span>
								<!-- <el-input v-model="charge.begin_time" size="mini" style="width: 60px;margin: 0 10px;"></el-input> -->
                <el-select :disabled="!begin_status" v-model="charge.begin_time" style="width: 70px;margin: 0 10px;" size="mini" placeholder="">
                	<el-option v-for="(item,index) in 60" :key="index" :value="index < 10? '0' + index : index" :label="index < 10? '0' + index: index"></el-option>
                </el-select>
								<span>分钟，可以购买本场次套餐</span>
							</div>
						</el-col>
					</el-row>

					<el-row :gutter="24" style="margin-top: 10px;display: flex;align-items: center;">
						<el-col :span="11" :offset="1">
							<el-checkbox v-model="open_status" style="margin-right: 10px;"></el-checkbox>
							<span>开房-计费类型，启用包场</span>
						</el-col>
						<el-col :span="12">
							<div class="operate-item-time">
								<span>本场开始前</span>
								<!-- <el-select v-model="charge.open_time" style="width: 100px;margin:0 10px;" size="mini">
									<el-option v-for="(item,index) in 60" :key="item" :value="item" :label="item"></el-option>
								</el-select> -->
                <el-select :disabled="!open_status" v-model="charge.open_time" style="width: 70px;margin: 0 10px;" size="mini" placeholder="">
                	<el-option v-for="(item,index) in 60" :key="index" :value="index < 10? '0' + index : index" :label="index < 10? '0' + index: index"></el-option>
                </el-select>
								<span>分钟，可购买本包场开房</span>
							</div>
						</el-col>
					</el-row>

					<!-- <el-row :gutter="24" style="margin-top: 10px;">
						<el-col :span="23" :offset="1">
							<el-checkbox v-model="open_pay_status" style="margin-right: 10px;"></el-checkbox>
							<span>开房-支付方式，启用”后付费</span>
						</el-col>
					</el-row> -->
					<el-row :gutter="24" style="margin-top: 10px;">
						<el-col :span="23" :offset="1">
							<el-checkbox v-model="open_cash_status" style="margin-right: 10px;"></el-checkbox>
							<span>开房-收款方式，启用”现金”，支付上限</span>
							<el-input :disabled="!open_cash_status" type="number" v-model.trim="charge.open_cash_time" size="mini" style="width: 60px;margin: 0 10px;"></el-input>
							<span>元/日。超过后当日则禁用现金收款。</span>
						</el-col>
					</el-row>
				</fieldset>
				<span style="font-size: 14px;color: #F56C6C;">注：选中代表生效启用，反之则不启用</span>
				<!-- 打印相关 -->
				<fieldset style="border: 1px solid #DCDFE6;width: 100%;margin: 20px 0;">
					<legend>打印相关</legend>
					<el-row :gutter="24" style="margin-top: 10px;">
						<el-col :span="10" :offset="1">
							
								<span class="operate-item-text">前台打印机IP</span>
								
								<el-input
								class="room-manage-ip"
								type="number"
								maxlength="3"
								oninput="value=value.replace(/[^\d.]/g,'');if(value.length > 3) value=value.slice(0, 3)"
								v-model="ip.rip.num1"
								@keyup.native.190="onInput(0)"
								/>
								<sub
								style="font-weight: bold; vertical-align: baseline; margin: 0 5px"
								>·</sub
								>
							
						
								<el-input
								class="room-manage-ip"
								type="number"
								maxlength="3"
								v-model="ip.rip.num2"
								oninput="value=value.replace(/[^\d.]/g,'');if(value.length > 3) value=value.slice(0, 3)"
								ref="num2"
								@keyup.native.190="onInput(1)"
								/>
								<sub
								style="font-weight: bold; vertical-align: baseline; margin: 0 5px"
								>·</sub
								>
						
							
								<el-input
								class="room-manage-ip"
								type="number"
								maxlength="3"
								v-model="ip.rip.num3"
								oninput="value=value.replace(/[^\d.]/g,'');if(value.length > 3) value=value.slice(0, 3)"
								ref="num3"
								@keyup.native.190="onInput(2)"
								/>
								<sub
								style="font-weight: bold; vertical-align: baseline; margin: 0 5px"
								>·</sub
								>
							
							
								<el-input
								class="room-manage-ip"
								type="number"
								oninput="value=value.replace(/[^\d.]/g,'');if(value.length > 3) value=value.slice(0, 3)"
								maxlength="3"
								v-model="ip.rip.num4"
								ref="num4"
								/>
								
						</el-col>
						<el-col :span="11" :offset="1">
							
								<span class="operate-item-text">出品打印机IP</span>
								
								<el-input
								class="room-manage-ip"
								type="number"
								maxlength="3"
								oninput="value=value.replace(/[^\d.]/g,'');if(value.length > 3) value=value.slice(0, 3)"
								v-model="ip.oip.num1"
								@keyup.native.190="onInput(0)"
								/>
								<sub
								style="font-weight: bold; vertical-align: baseline; margin: 0 5px"
								>·</sub
								>
							
						
								<el-input
								class="room-manage-ip"
								type="number"
								maxlength="3"
								v-model="ip.oip.num2"
								oninput="value=value.replace(/[^\d.]/g,'');if(value.length > 3) value=value.slice(0, 3)"
								ref="num12"
								@keyup.native.190="onInput(1)"
								/>
								<sub
								style="font-weight: bold; vertical-align: baseline; margin: 0 5px"
								>·</sub
								>
						
							
								<el-input
								class="room-manage-ip"
								type="number"
								maxlength="3"
								v-model="ip.oip.num3"
								oninput="value=value.replace(/[^\d.]/g,'');if(value.length > 3) value=value.slice(0, 3)"
								ref="num13"
								@keyup.native.190="onInput(2)"
								/>
								<sub
								style="font-weight: bold; vertical-align: baseline; margin: 0 5px"
								>·</sub
								>
							
							
								<el-input
								class="room-manage-ip"
								type="number"
								oninput="value=value.replace(/[^\d.]/g,'');if(value.length > 3) value=value.slice(0, 3)"
								maxlength="3"
								v-model="ip.oip.num4"
								ref="num14"
								/>
								
						</el-col>
					
					</el-row>

				</fieldset>
				
			</el-tab-pane>
		    <el-tab-pane label="房态设置" name="second" v-loading="roomLoading">
				<!-- <div class="disc">
					<div class="disc" style="margin-left: 30px;width: 300px;">
						<el-checkbox v-model="room.wait_status" style="margin-right: 10px;"></el-checkbox>
						<span>到时自动转待洁房</span>
					</div>
					<div class="operate-item-time">
						<span>等待时间</span>
						<el-select v-model="room.wait_time" style="width: 100px;margin:0 10px;" size="mini">
							<el-option v-for="(item,index) in 60" :key="item" :value="item" :label="item"></el-option>
						</el-select>
						<span>分钟</span>
					</div>
				</div> -->
				<div class="disc" style="margin: 10px 0;">
					<div class="disc" style="margin-left: 30px;width: 300px;">
						<el-checkbox v-model="room.vacant_status" style="margin-right: 10px;"></el-checkbox>
						<span>洁房中自动转空房</span>
					</div>
					<div class="operate-item-time">
						<span>等待时间</span>
						<!-- <el-select v-model="room.vacant_time" style="width: 100px;margin:0 10px;" size="mini">
							<el-option v-for="(item,index) in 60" :key="item" :value="item" :label="item"></el-option>
						</el-select> -->
            <el-select :disabled="!room.vacant_status" v-model="room.vacant_time" style="width: 100px;margin: 0 10px;" size="mini" placeholder="">
            	<el-option v-for="(item,index) in 60" :key="index" :value="index < 10? '0' + index : index" :label="index < 10? '0' + index: index"></el-option>
            </el-select>
						<span>分钟</span>
					</div>
				</div>
				<!-- <div class="disc">
					<div class="disc" style="margin-left: 30px;width: 300px;">
						<el-checkbox v-model="room.zike_status" style="margin-right: 10px;"></el-checkbox>
						<span>咨客到时提醒列表显示</span>
					</div>
					<div class="operate-item-time">
						<span>等待时间</span>
						<el-select v-model="room.zike_time" style="width: 100px;margin:0 10px;" size="mini">
							<el-option v-for="(item,index) in 60" :key="item" :value="item" :label="item"></el-option>
						</el-select>
            <el-select :disabled="!room.zike_status" v-model="room.zike_time" style="width: 100px;margin: 0 10px;" size="mini" placeholder="">
            	<el-option v-for="(item,index) in 60" :key="index" :value="index < 10? '0' + index : index" :label="index < 10? '0' + index: index"></el-option>
            </el-select>
						<span>分钟</span>
					</div>
				</div> -->
				<div class="disc" style="margin: 10px 0;">
					<div class="disc" style="margin-left: 30px;width: 300px;">
						<el-checkbox v-model="room.vod_status" style="margin-right: 10px;"></el-checkbox>
						<span>到时提醒VOD消息</span>
					</div>
					<div class="operate-item-time">
						<span>提前时间</span>
						<!-- <el-select v-model="room.vod_time" style="width: 100px;margin:0 10px;" size="mini">
							<el-option v-for="(item,index) in 60" :key="item" :value="item" :label="item"></el-option>
						</el-select> -->
            <el-select :disabled="!room.vod_status" v-model="room.vod_time" style="width: 100px;margin: 0 10px;" size="mini" placeholder="">
            	<el-option v-for="(item,index) in 60" :key="index" :value="index < 10? '0' + index : index" :label="index < 10? '0' + index: index"></el-option>
            </el-select>
						<span>分钟</span>
					</div>
				</div>
				<div class="disc">
					<div class="disc" style="margin-left: 30px;width: 300px;">
						<el-checkbox v-model="room.test_status" style="margin-right: 10px;"></el-checkbox>
						<span>测机时长</span>
					</div>
					<div class="operate-item-time">
						<span>等待时间</span>
						<!-- <el-select v-model="room.test_time" style="width: 100px;margin:0 10px;" size="mini">
							<el-option v-for="(item,index) in 60" :key="item" :value="item" :label="item"></el-option>
						</el-select> -->
            <el-select :disabled="!room.test_status" v-model="room.test_time" style="width: 100px;margin: 0 10px;" size="mini" placeholder="">
            	<el-option v-for="(item,index) in 60" :key="index" :value="index < 10? '0' + index : index" :label="index < 10? '0' + index: index"></el-option>
            </el-select>
						<span>分钟</span>
					</div>
				</div>

			</el-tab-pane>
		    <el-tab-pane label="阳光VOD" name="third" v-loading="vodLoading" v-if="vodshow">
				<div class="disc dogmi">
					<div class="disc" style="margin-left: 0px;width: 400px;">
						<!-- <el-checkbox v-model="vod.wechat_status" style="margin-right: 10px;"></el-checkbox> -->
						<span style="flex-shrink: 0;width: 100px;margin-right: 20px;text-align: right;">微信点歌</span>
						<el-date-picker style="width: 200px" disabled v-model="vod.wechat_time" size="small" type="datetime" placeholder="选择日期时间" ></el-date-picker>
						<span v-if="new Date(vod.wechat_time) < new Date()" style="color: #F56C6C;margin-left: 10px;">已过期</span>
					</div>
					<div class="operate-item-time" style="margin-left: 50px;">

						<span style="width: 150px;text-align: right;margin-right: 20px;">
              <span style="color: #F56C6C;margin: 7px 3px 0 0;font-size: 18px;">*</span>
              加密狗
            </span>
						<el-input size="small" style="width: 200px;" disabled v-model.trim="vod.dognum"></el-input>
					</div>
				</div>
				<div class="disc" style="margin: 20px 0;">
					<div class="disc" style="margin-left: 0px;width: 400px;">
						<!-- <el-checkbox v-model="vod.voice_status" style="margin-right: 10px;"></el-checkbox> -->
						<span style="flex-shrink: 0;width: 100px;margin-right: 20px;text-align: right;">小美语音</span>
						<el-date-picker style="width: 200px" disabled v-model="vod.voice_time" size="small" type="datetime" placeholder="选择日期时间" ></el-date-picker>
						<span v-if="new Date(vod.voice_time) < new Date()" style="color: #F56C6C;margin-left: 10px;">已过期</span>
					</div>
					<div class="operate-item-time" style="margin-left: 50px;">

						<span style="width: 150px;text-align: right;margin-right: 20px;">
              <span style="color: #F56C6C;margin: 7px 3px 0 0;font-size: 18px;">*</span>
              加密狗过期日期
            </span>
						<el-date-picker style="width: 200px" disabled v-model="vod.dog_time" size="small" type="datetime" placeholder="选择日期时间" ></el-date-picker>
						<span v-if="new Date(vod.dog_time) < new Date()" style="color: #F56C6C;margin-left: 10px;">已过期</span>
					</div>
				</div>
				<div class="disc">
					<!-- <div class="disc" style="margin-left: 30px;width: 400px;">
						<el-checkbox v-model="vod.danger_status" style="margin-right: 10px;"></el-checkbox>
						<span style="flex-shrink: 0;margin-right: 10px;">风险歌曲</span>
					</div> -->
					<div class="operate-item-time">
						<span style="width: 100px;margin-right: 20px;text-align: right;">
              <span style="color: #F56C6C;margin: 7px 3px 0 0;font-size: 18px;">*</span>
              云过期日期
            </span>
						<el-date-picker style="width: 200px" disabled v-model="vod.cloud_time" size="small" type="datetime" placeholder="选择日期时间" ></el-date-picker>
						<span v-if="new Date(vod.cloud_time) < new Date()" style="color: #F56C6C;margin-left: 10px;">已过期</span>
					</div>
				</div>
				<!-- <div class="disc" style="margin-top: 10px;">
					<div class="disc" style="margin-left: 30px;width: 400px;">
						<el-checkbox v-model="vod.copyright_status" style="margin-right: 10px;"></el-checkbox>
						<span style="flex-shrink: 0;margin-right: 10px;">版权歌曲</span>
					</div>
				</div> -->
			</el-tab-pane>
		  </el-tabs>
	</div>
</template>

<script>
  import { getToken } from '../../utils/auth.js'
	import { storeparam, storeparamp,storechargeconfig, storechargeconfigp, storeconfig, storeselect } from '../../api/api.js'
export default {
		name:'OperateParameter',
		data(){
			return {
				id: 0,
				storefront: '',
				storefrontList:[],
				activeName:'first',
				hour:'',
				minute:'',
				loading: false,
				hour1:'',
				minute1:'',
				minuteList:['00','05','10','15','20','25','30','35','40','45','50','55'],


				username:'',
				password:'',
				// 运营参数 计费相关
				charge:{
					free_time: '',
					charge_time:'',
					unit_time:'',
					begin_time:'',
					open_time:'',
					open_cash_time:''
				},
				ip: {
					rip: {
						num1:'',
						num2:'',
						num3:'',
						num4:'',
					},
					oip: {
						num1:'',
						num2:'',
						num3:'',
						num4:'',
					}
				},
				free_status:false,
				charge_status:false,
				unit_status:false,
				begin_status: false,
				open_status: false,
				open_pay_status: false,
				open_cash_status:false,
				// 房态设置
				roomLoading: false,
				room:{
					wait_status: false,
					wait_time:'',
					vacant_status: false,
					vacant_time:'',
					zike_status: false,
					zike_time:'',
					vod_status: false,
					vod_time:'',
					test_status:false,
					test_time:''
				},
				// vod
				vodLoading: false,
				vod:{
					wechat_status: false,
					wechat_time:'2022-12-31 00:00:00',
					dognum: '11223344',
					voice_status: false,
					voice_time: '',
					dog_time:'2023-12-31 00:00:00',
					danger_status:false,
					cloud_time:'',
					copyright_status:false
				},

				isSave: false,
				vodshow:'' 
			}
		},
		created(){
			this.id = JSON.parse(getToken()).store_id
			this.vodshow = JSON.parse(getToken()).scene == 'store'
			console.log('this.vodshow ',this.vodshow );
			this.init()
		},
	methods: {
		onInput(e) {
			if (e == 0) {
				this.$refs.num2.focus();
			} else if (e == 1) {
				this.$refs.num3.focus();
			} else if (e == 2) {
				this.$refs.num4.focus();
			}
			// window.addEventListener('keydown',e=>{
			//   console.log(e.keyCode,'code')
			//   if(e.keyCode == 190) {
			//     this.$refs.num2.focus()

			//   }
			//   this.temp.num2 = ''
			// })
			// if(ind == 0) {
			//   let index = this.temp.num1.indexOf('.')
			//   console.log(index,'iundex')
			//   if(index >= 0) {
			//     this.temp.num1 = this.temp.num1.replace('.','')
			//     this.$refs.num2.focus()
			//   }
			// }
			},	
			async init(){
				this.loading = true
        await storeselect(this.id).then(res=>{
        	this.storefrontList = res.result
          this.storefront = res.result[0].id
        })
				await storeparam(this.id).then(res=>{
					let temp = res.result.data;
					let start = temp.open_time.split(':')
					this.hour = start[0]
					this.minute = start[1]
					let end = temp.close_time.split(':')
					this.hour1 = end[0]
					this.minute1 = end[1]
					// this.username = temp.cashier_login_name
					// this.password = temp.cashier_login_pw
					let config = temp.charge_configs
					this.ip={
					rip: {
						num1:'',
						num2:'',
						num3:'',
						num4:'',
					},
					oip: {
						num1:'',
						num2:'',
						num3:'',
						num4:'',
					}
				}
					if (temp.reception_printer_ip != '') { 
						let rip =  temp.reception_printer_ip.split('.')
						this.ip.rip.num1=rip[0]
						this.ip.rip.num2=rip[1]
						this.ip.rip.num3=rip[2]
						this.ip.rip.num4=rip[3]
					}
					if (temp.outbound_printer_ip != '') { 
						let oip =  temp.outbound_printer_ip.split('.')
						this.ip.oip.num1=oip[0]
						this.ip.oip.num2=oip[1]
						this.ip.oip.num3=oip[2]
						this.ip.oip.num4=oip[3]
					}
					config.forEach(item =>{
						switch (item.code) {
							case 1001:
								item.status == 1?this.free_status = false : this.free_status = true
								item.status == 2?this.charge.free_time = item.value1: this.charge.free_time = ''
								break;
							case 1002:
								item.status == 1?this.charge_status = false:this.charge_status = true
								item.status == 2?this.charge.charge_time = item.value1: this.charge.charge_time = ''
								break;
							case 1003:
								item.status == 1?this.unit_status = false:this.unit_status = true
								item.status == 2?this.charge.unit_time = item.value1: this.charge.unit_time = ''
								break;
							case 1004:
								item.status == 1?this.begin_status = false:this.begin_status = true
								item.status == 2?this.charge.begin_time = item.value1: this.charge.begin_time = ''
								break;
							case 1005:
								item.status == 1?this.open_status = false:this.open_status = true
								item.status == 2?this.charge.open_time = item.value1: this.charge.open_time = ''
								break;
							case 1006:
								item.status == 1?this.open_pay_status = false:this.open_pay_status = true
								break;
							case 1007:
								item.status == 1?this.open_cash_status = false:this.open_cash_status = true
								item.status == 2?this.charge.open_cash_time = item.value1: this.charge.open_cash_time = ''
								break;
						}
					})
					this.loading = false
				})

			},

			onChange(){
				if(this.activeName == 'first') {
					this.init()
				}else if(this.activeName == 'second') {
					this.initSecond()
				}
			},
			onSave(){
        		this.isSave = true
				if(this.activeName == 'first') {
					let obj = [
						{code: 1001,status: this.free_status?'2':'1',value1: this.charge.free_time},
						{code: 1002,status: this.charge_status?'2':'1',value1: this.charge.charge_time},
						{code: 1003,status: this.unit_status?'2':'1',value1: this.charge.unit_time},
						{code: 1004,status: this.begin_status?'2':'1',value1: this.charge.begin_time},
						{code: 1005,status: this.open_status?'2':'1',value1: this.charge.open_time},
						{code: 1006,status: this.open_pay_status?'2':'1',value1: ''},
						{code: 1007,status: this.open_cash_status?'2':'1',value1: this.charge.open_cash_time},
					]
          let hour = this.hour;
          if(this.hour.length > 1) {
            if(Number(this.hour) < 10) {
              hour = this.hour
            }
          }else {
            if(Number(this.hour) < 10) {
              hour = '0' + this.hour
            }
          }

          let hour1 = this.hour1;
          if(this.hour1.length > 1) {
            if(Number(this.hour1) < 10) {
              hour1 = this.hour1
            }
          }else {
            if(Number(this.hour1) < 10) {
              hour1 = '0' + this.hour1
            }
					}
					let reception_printer_ip ='' 
					let outbound_printer_ip ='' 
							if (
					this.ip.rip.num1 &&
					this.ip.rip.num2 &&
					this.ip.rip.num3 &&
					this.ip.rip.num4
				) {
					reception_printer_ip =
					this.ip.rip.num1 +
					"." +
					this.ip.rip.num2 +
					"." +
					this.ip.rip.num3 +
					"." +
					this.ip.rip.num4;
				}
				if (
					this.ip.oip.num1 &&
					this.ip.oip.num2 &&
					this.ip.oip.num3 &&
					this.ip.oip.num4
				) {
					outbound_printer_ip =
					this.ip.oip.num1 +
					"." +
					this.ip.oip.num2 +
					"." +
					this.ip.oip.num3 +
					"." +
					this.ip.oip.num4;
				}
					storeparamp({
						store_id: this.id,
						open_time: hour + ':' + this.minute,
						close_time: hour1 + ':' + this.minute1,
						// cashier_login_name: this.username,
						// cashier_login_pw: this.password,
						charge_configs: obj,
						reception_printer_ip:reception_printer_ip,
						outbound_printer_ip:outbound_printer_ip

					}).then(res=>{
            this.isSave = false
						if(res.code == 0) {
							this.$message.success('保存成功')
							this.init()
						}
					}).catch(err=>{
            this.isSave = false
          })
				}
				if(this.activeName == 'second') {
					let obj = [
						{code: 2001,status: this.room.wait_status?'2':'1',value1: this.room.wait_time},
						{code: 2002,status: this.room.vacant_status?'2':'1',value1: this.room.vacant_time},
						{code: 2003,status: this.room.zike_status?'2':'1',value1: this.room.zike_time},
						{code: 2004,status: this.room.vod_status?'2':'1',value1: this.room.vod_time},
						{code: 2005,status: this.room.test_status?'2':'1',value1: this.room.test_time},
					]
					storechargeconfigp({
						store_id: this.id,
						charge_configs: obj
					}).then(res=>{
						if(res.code == 0) {
							this.$message.success('保存成功')
							this.initSecond()
              this.isSave = false
						}
					}).catch(err=>{
            this.isSave = false
          })
				}
			},
			onMessage(){
        this.$message.warning('暂无下发中转功能')
			},
			initSecond(){
				let id = this.id
				if(this.storefront) {
					id = this.storefront
				}
				this.roomLoading = true
				storechargeconfig(id).then(res=>{
					res.result.data.forEach(item=>{
						switch (item.code) {
							case 2001:
								item.status == 1?this.room.wait_status = false:this.room.wait_status = true
								item.status == 2?this.room.wait_time = item.value1:this.room.wait_time = ''
								break;
							case 2002:
								item.status == 1?this.room.vacant_status = false:this.room.vacant_status = true
								item.status == 2?this.room.vacant_time = item.value1:this.room.vacant_time = ''
								break;
							case 2003:
								item.status == 1?this.room.zike_status = false:this.room.zike_status = true
								item.status == 2?this.room.zike_time = item.value1:this.room.zike_time = ''
								break;
							case 2004:
								item.status == 1?this.room.vod_status = false:this.room.vod_status = true
								item.status == 2?this.room.vod_time = item.value1:this.room.vod_time = ''
								break;
							case 2005:
								item.status == 1?this.room.test_status = false:this.room.test_status = true
								item.status == 2?this.room.test_time = item.value1:this.room.test_time = ''
								break;
						}
					})
					this.roomLoading = false
				})
			},
			handleClick(tab,e){
				console.log(this.activeName)
				if(this.activeName == 'second') {
					this.initSecond()
				}
				if(this.activeName == 'third') {
					this.vodLoading = true
					storeconfig(this.id).then(res=>{
						let temp = res.result.data
						// temp.is_wechat == 1 ? this.vod.wechat_status = true : this.vod.wechat_status = false
						// temp.is_xiaomei == 1 ? this.vod.voice_status = true : this.vod.voice_status = false
						// temp.risk_song == 1? this.vod.danger_status = true : this.vod.danger_status = false
						this.vod.cloud_time = temp.cloud_time
						this.vod.dognum = temp.lock_dog
						this.vod.dog_time = temp.lock_dog_expire
						this.vod.wechat_time = temp.wechat_time
						this.vod.voice_time = temp.xiaomei_time
						this.vodLoading = false
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.operate {
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
	.operate-top {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		.operate-top-lft {
			display: flex;
			align-items: center;
			.operate-top-item {
				display: flex;
				align-items: center;
				font-size: 14px;
			}
		}
		.operate-top-rgt {
			display: flex;
			align-items: center;
		}
	}
	.operate-menu {
		// display: flex;
		// align-items: center;
		// justify-content: center;
	}
	.operate-item-time {
		display: flex;
		align-items: center;
		font-size: 16px;
		.operate-item-text {
			font-size: 16px;
			margin-right: 10px;
		}
	}
	.disc {
		display: flex;
		align-items: center;
	}
	.room-manage-ip {
    width: 70px;
    display: inline-block;
    ::v-deep {
      .el-input__inner {
        height: 30px !important;
        line-height: 30px;
        padding: 0 5px;
      }
    }
  }
  .operate-item-text {
			font-size: 16px;
			margin-right: 10px;
		}
}
</style>
