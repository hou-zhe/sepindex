<template>
	<div class="login-container">
    <!-- <img src="../../assets/login-bg.png" class="login-bg" alt=""> -->
		<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" :style="isAni?'top: 50%':''">
			<img src="../../assets/login-logo.png" class="login-logo" alt="">

			<el-form-item prop="username">
				<span class="svg-container"><svg-icon icon-class="user" /></span>
				<el-input ref="username" class="input-item" v-model="loginForm.username" placeholder="请输入账户" name="username" type="text" tabindex="1" auto-complete="on" />
			</el-form-item>

			<el-form-item prop="password">
				<span class="svg-container"><svg-icon icon-class="password" /></span>
				<el-input
          class="input-item"
					:key="passwordType"
					ref="password"
					v-model="loginForm.password"
					:type="passwordType"
					placeholder="请输入账户密码"
					name="password"
					tabindex="2"
					auto-complete="on"
					@keyup.enter.native="handleLogin"
				/>
				<span class="show-pwd" @click="showPwd"><svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" /></span>
			</el-form-item>
      <div style="width: 100%;display: flex;align-items: center;justify-content: center;">
        <el-button :loading="loading" type="primary" class="login-btn" @click.native.prevent="handleLogin">登录</el-button>
      </div>


			<!-- <div class="tips">
				<span style="margin-right:20px;">username: admin</span>
				<span>password: any</span>
			</div> -->
		</el-form>
	</div>
</template>

<script>
import { validUsername } from '@/utils/validate';

export default {
	name: 'Login',
	data() {
		// const validateUsername = (rule, value, callback) => {
		// 	if (!validUsername(value)) {
		// 		callback(new Error('Please enter the correct user name'));
		// 	} else {
		// 		callback();
		// 	}
		// };
		// const validatePassword = (rule, value, callback) => {
		// 	if (value.length < 6) {
		// 		callback(new Error('The password can not be less than 6 digits'));
		// 	} else {
		// 		callback();
		// 	}
		// };
		return {
			loginForm: {
				username: '',
				password: ''
			},
			loginRules: {
				username: [{ required: true, trigger: 'blur', message: '请输入账户' }],
				password: [{ required: true, trigger: 'blur', message: '请输入账户密码' }]
			},
			loading: false,
			passwordType: 'password',
			redirect: undefined,

      isAni: false
		};
	},
	watch: {
		$route: {
			handler: function(route) {
				this.redirect = route.query && route.query.redirect;
			},
			immediate: true
		}
	},
  mounted() {
    setTimeout(()=>{
      this.isAni = true
    },200)

  },
	methods: {
		showPwd() {
			if (this.passwordType === 'password') {
				this.passwordType = '';
			} else {
				this.passwordType = 'password';
			}
			this.$nextTick(() => {
				this.$refs.password.focus();
			});
		},
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true;
					this.$store
						.dispatch('user/login', this.loginForm)
						.then(() => {
							this.$router.push({ path: this.redirect || '/' });
							this.loading = false;
						})
						.catch(() => {
							this.loading = false;
						});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		}
	}
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
	.login-container .el-input input {
		color: $cursor;
	}
}

/* reset element-ui css */
.login-container {


	.el-input {
		display: inline-block;
		height: 47px;
		width: 85%;

		input {
			background: transparent;
			border: 0px;
			// -webkit-appearance: none;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			// color: $light_gray;
      color: #1f2f3d;
			height: 47px;
      outline: none;
			// caret-color: $cursor;

			&:-webkit-autofill {
        // -webkit-text-fill-color:  !important;
        	-webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
          background-color:transparent;
          background-image: none;
          transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
        // transition: background-color 5000s ease-in-out 0s;/*延时渲染背景色来去除背景色*/
				// box-shadow: 0 0 0px 1000px rgba(255,255,255,0.3) inset !important;
				// -webkit-text-fill-color: $cursor !important;
			}
		}
	}

	.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
	}
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  width: 100%;
  height: 100vh;
  background: url(https://sep-admin.oss-cn-beijing.aliyuncs.com/cashier/admin_login-bg.png) no-repeat center center;
  background-size: cover;
  position: relative;
  ::v-deep {
    input::placeholder{
        color: #999;
    }
     /* -webkit- 谷歌浏览器的内核标识码 */
    input::-webkit-placeholder{
        color: #999;
    }
    /* -o- 欧朋浏览器的内核标识码 */
    input::-o-placeholder{
        color: #999;
    }
    /* -moz- 火狐浏览器的内核标识码 */
    input::-moz-placeholder{
        color: #999;
    }
     /* -ms- IE浏览器的内核标识码 */
    input::-ms-placeholder{
        color: #999;
    }
  }
	.login-form {
		position: absolute;
    left: 50%;
    top: -20%;
    transform: translate(-50%,-50%);
    // width: 550px;
    // height: 30%;
    padding: 40px 80px;
    border-radius: 30px;
    box-sizing: border-box;
    background-color: rgba(255,255,255,0.9);
    transition: all 0.5s;
    .login-logo {
      width: 395px;
      height: 75px;
      margin-bottom: 30px;
    }
    .login-btn {
      width: 150px;
      border-radius: 20px;
      background-color: rgba(255, 115, 0, 0.8);
      border: none;
      margin-top: 20px;
    }

    // padding: 83px 40px;
    // box-sizing: border-box;
		// width: 520px;
		// max-width: 100%;
		// padding: 160px 35px 0;
		// margin: 0 auto;
		// overflow: hidden;
	}

	.tips {
		font-size: 14px;
		color: #fff;
		margin-bottom: 10px;

		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}

	.svg-container {
		padding: 6px 5px 6px 15px;
		color: #323442;
		vertical-align: middle;
		width: 30px;
		display: inline-block;
	}

	.title-container {
		position: relative;

		.title {
			font-size: 26px;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
	}

	.show-pwd {
		position: absolute;
		right: 10px;
		top: 7px;
		font-size: 16px;
		color: #323442;
		cursor: pointer;
		user-select: none;
	}
}
</style>
