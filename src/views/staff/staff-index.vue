<template>
  <div class="staff-index" v-loading="loading">
    <fieldset
      style="
        width: 70%;
        position: relative;
        border-radius: 10px;
        padding: 20px 0px 20px 20px;
        border: 1px solid #dcdfe6;
        background-color: #fff;
      "
    >
      <legend style="font-size: 20px;">收银咨客</legend>
      <div class="staff-item-wrapper">
        <div class="staff-item">
          <div class="staff-index-name">管理员登陆名</div>
          <el-input v-model="zike.username" disabled  class="staff-input"></el-input>
        </div>
          <div class="staff-item">
            <div class="staff-index-name1">员工姓名</div>
            <el-input v-model="zike.name" disabled class="staff-input" ></el-input></strong>
          </div>
          <el-button type="primary" size="mini" @click="onDialog(zike,0)">{{app.length > 0?'修改':'新增'}}</el-button>
      </div>
        <div class="staff-item-wrapper">
          <div class="staff-item">
            <div class="staff-index-name">普通员工登陆名</div>
            <el-input v-model="zike.username1" disabled  class="staff-input"></el-input>
          </div>
          <div class="staff-item">
            <div class="staff-index-name1" >员工姓名</div>
            <el-input v-model="zike.name1" disabled class="staff-input" ></el-input>
          </div>
          <el-button type="primary" size="mini" @click="onDialog(zike,1)">{{app.length > 0?'修改':'新增'}}</el-button>
        </div>

    </fieldset>

    <fieldset
      style="
        width: 70%;
        position: relative;
        border-radius: 10px;
        padding: 20px 0px 20px 20px;
        border: 1px solid #dcdfe6;
        margin-top: 50px;
        background-color: #fff;
      "
    >
      <legend style="font-size: 20px;">后台系统</legend>
      <div class="staff-item-wrapper">
        <div class="staff-item">
          <div class="staff-index-name">管理员登陆名</div>
          <el-input v-model="admin.username" disabled  class="staff-input"></el-input>
        </div>
        <div class="staff-item">
          <div class="staff-index-name1" >员工姓名</div>
          <el-input v-model="admin.name" disabled class="staff-input" ></el-input>
        </div>

        <el-button type="primary" size="mini" @click="onDialog(admin,2)">{{admin.length > 0?'修改':'新增'}}</el-button>
      </div>
        <div class="staff-item-wrapper">
          <div class="staff-item">
            <div class="staff-index-name">普通员工登陆名</div>
            <el-input v-model="admin.username1" disabled  class="staff-input"></el-input>
          </div>
          <div class="staff-item">
            <div class="staff-index-name1">员工姓名</div>
            <el-input v-model="admin.name1" disabled class="staff-input" ></el-input>
          </div>
          <el-button type="primary" size="mini" @click="onDialog(admin,3)">{{admin.length > 0?'修改':'新增'}}</el-button>
        </div>

    </fieldset>
    <el-dialog :title="dialogText" :visible.sync="dialogVal" :close-on-click-modal="false" width="500px" >
    	<el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" @keyup.enter.native="isSave?'': onConfirm()">
    		<el-form-item  label="用户名" prop="username"><el-input ref="diainput" v-model="temp.username" :placeholder="'请输入' + dialogText + '登录名'" style="width:300px;"/></el-form-item>
    		<el-form-item  label="姓名" prop="name"><el-input v-model="temp.name" :placeholder="'请输入' + dialogText + '姓名'" style="width:300px;"/></el-form-item>
        <el-form-item  label="密码" prop="password"><el-input v-model="temp.password" :placeholder="'请输入' + dialogText + '密码'" type="password" style="width:300px;"/></el-form-item>
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
  import { employeelist, employeesave } from '../../api/api.js'
  export default {
    data(){
      return {
        id: 0,
        loading: false,
        zike: {
          username:'',
          name:'',
          username1:'',
          name1:'',
        },
        admin: {
          username:'',
          name:'',
          username1:'',
          name1:'',
        },
        dialogVal: false,
        dialogText: '',
        rules: {
        	username: [{ required: true, message: '登录名不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        },
        temp:{
          username:'',
          name:'',
          password: ''
        },
        app: [],
        admin: [],
        choseId: 0
      }
    },
    mounted() {
    	this.id = JSON.parse(getToken()).store_id
    	this.init()
    },
    methods:{
      init(){
      	// this.loading = true;
      	employeelist(this.id).then(res=>{
      		this.list = res.result
          this.app = res.result.app
          this.admin = res.result.admin
      		this.loading = false
      	})
      },
      onDialog(obj,e) {
        if(e == 0) {
          this.dialogText = '咨客管理员'
        }
        if(e == 1) {
          this.dialogText = '咨客普通员工'
        }
        if(e == 2) {
          this.dialogText = '后台管理员'
        }
        if(e == 3) {
          this.dialogText = '后台普通员工'
        }
        this.dialogVal = true
        this.$nextTick(() => {
        	this.$refs['dataForm'].clearValidate();
          this.$refs.diainput.focus()
        });
      },
      onConfirm(){
        let type = this.dialogText.indexOf('咨客') >= 0 ? 1 : 2
        let role_id = this.dialogText.indexOf('管理员') >= 0 ? 1 : 2
        this.$refs["dataForm"].validate((valid) =>{
          if(valid) {
            employeesave({
              store_id: this.id,
              type,
              id: this.choseId,
              username: this.temp.username,
              name: this.temp.name,
              password: this.temp.password,
              role_id,
            }).then(res=>{
              this.$message.success('修改成功')
              this.$refs['dataForm'].clearValidate();
              this.init()
              this.dialogVal = false
              for (let i in this.temp) {
                this.temp[i] = "";
              }

            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.staff-index {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .staff-item-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

  }
  .staff-item {
    display: flex;
    max-width: 400px;
    align-items: center;
    margin-right: 40px;
  }
    .staff-index-name {
      width: 130px;
    }
    .staff-index-name1 {
      margin-right: 30px;
    }
    .staff-input {
      width: 250px;
    }

}
</style>
