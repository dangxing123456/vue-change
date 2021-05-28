<template>
	<div class="login">
		<div class="welcome" v-show="!titleShow">
			<span>智慧后勤<i>4.0</i>欢迎您</span>
		</div>
		<transition name="el-zoom-in-center">
			<el-form ref="loginForm" :model="loginForm" :rules="loginRules" autocomplete="off" class="login-form" v-show="titleShow">
				<div class="title">
					<span>修改初始化密码</span>
					<p><i class="el-icon-info"></i>初始用户需要重新修改密码，修改完重新登录</p>
				</div>
				<el-form-item prop="schoolName">
					<el-input v-model="loginForm.name" ref="account" type="text" disabled placeholder="请选择学校" style="font-weight:bold;">
						<svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
						<span slot="suffix" style="line-height:45px; font-weight: normal;padding-right:10px;">{{loginForm.account}}</span>
					</el-input>
				</el-form-item>
				<el-form-item prop="mobile">
					<el-input v-model="loginForm.mobile" ref="mobile" type="text" auto-complete="off" placeholder="账户登记所留手机号码">
						<svg-icon slot="prefix" icon-class="role" class="el-input__icon input-icon" />
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input ref="password" v-model="loginForm.password" type="password" auto-complete="off" placeholder="新密码,6-20位数字、大小写字母以及特殊字符中四选二"
					 @keyup.enter.native="handleLogin">
						<svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
					</el-input>
					<el-progress :percentage="passwordPercent" style="width:100%; margin-top:2px;" :status="passwordPercentFormat"></el-progress>
				</el-form-item>
				<el-form-item prop="password2">
					<el-input ref="password2" type="password" v-model="loginForm.password2" auto-complete="off" placeholder="重新输入密码"
					 @keyup.enter.native="handleLogin">
						<svg-icon slot="prefix" icon-class="yanzhengma" class="el-input__icon input-icon" />
					</el-input>

				</el-form-item>
				<el-form-item style="width:100%;">
					<el-button size="medium" style="float: left;width:100px;" @click.native.prevent="funLogout">
						取消
					</el-button>
					<div style="float:left; margin-left:30px;">
						<timer :remain-time="300" @countDowmEnd="funLogout"></timer>
						<i style="font-style: normal; font-size:12px; color:#999999;  "> 后系统自动退出</i>
					</div>
					<el-button :loading="loading" size="medium" type="primary" style="float: right;width:100px;" @click.native.prevent="handleLogin">
						确定
					</el-button>
				</el-form-item>



			</el-form>

		</transition>

	</div>
</template>

<script>
	import {
		changePsw
	} from "@/api/login";
	import timer from "@/views/timer";

	export default {
		name: "initpsw",
		components: {
			timer
		},
		data() {
			return {
				loginForm: {
					account: "",
					name: "",
					mobile: "",
					password: "",
					password2: "",
				},
				loginRules: {
					mobile: [{
						required: true,
						validator: this.validateConfirmMobile,
						trigger: 'blur'
					}],
					password: [{
						required: true,
						validator: this.validatePassword,
						trigger: ['blur', 'change']
					}],
					password2: [{
						required: true,
						validator: this.validateConfirmPassword,
						trigger: ['blur', 'change']
					}]
				},
				loading: false,
				titleShow: false,
				userInfo: null,
				passwordPercent: 0,
				passwordPercentFormat: 'exception'
			};
		},
		created() {
			this.getUserInfo()
			this.show()

		},
		methods: {
			show() {
				let that = this
				setTimeout(function() {
					that.titleShow = true
					that.$refs.mobile.focus()
				}, 1500);
			},
			getUserInfo() {
				this.$itsoftUI.getUserInfo().then(
					res => {
						this.userInfo = res
						this.loginForm.account = res.account
						this.loginForm.name = res.name
						this.loginForm.id = res.id
					});
			},
			funLogout() {
				this.$itsoftUI.logout()

			},
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						this.loading = true;
						changePsw(
							this.loginForm.id,
							this.loginForm.password,
						).then(() => {
							this.$message.success("密码成功修改，请重新登录")
							this.funLogout()
						})

					}
				});
			},

			validatePassword(rule, value, callback) {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					//6-20位包含字符、数字和特殊字符
					let ls = 0;
					if (this.loginForm.password !== '') {
						if (this.loginForm.password.match(/([a-z])+/)) {
							ls++;
						}
						if (this.loginForm.password.match(/([0-9])+/)) {
							ls++;
						}
						if (this.loginForm.password.match(/([A-Z])+/)) {
							ls++;
						}
						if (this.loginForm.password.match(/([\W])+/) && !this.loginForm.password.match(/(![\u4E00-\u9FA5])+/)) {
							ls++;
						}
						if (this.loginForm.password.match(/([\u4E00-\u9FA5])+/)) {
							callback(new Error('不能包含中文字符'));
							ls = 0;
						}
						if (this.loginForm.password.length < 6 || this.loginForm.password.length > 20) {
							callback(new Error('要求6-20位,包含数字、小写字母、大写字母以及特殊字符中四选二'));
							ls = 0;
						}
						this.passwordPercentFormat = "exception"
						switch (ls) {
							case 0:
								this.passwordPercent = 0;
								callback(new Error('要求6-20位,包含数字、小写字母、大写字母以及特殊字符中四选二'));
								break;
							case 1:
								this.passwordPercent = 33;
								callback(new Error('要求6-20位,包含数字、小写字母、大写字母以及特殊字符中四选二'));
								break;
							case 2:
								// this.passwordPercent = 66;
								// callback(new Error('要求6-20位,包含数字、小写字母、大写字母以及特殊字符中四选三'));
								this.passwordPercentFormat = "success"
								this.passwordPercent = 100;
								break;
							case 3:
							case 4:
								this.passwordPercentFormat = "success"
								this.passwordPercent = 100;
								break;
							default:
								this.passwordPercent = 0;
								break;
						}
					}
					callback();
				}
			},
			validateConfirmPassword(rule, value, callback) {
				if (value === '') {
					callback(new Error('请重新输入密码'));
				} else {
					if (value !== this.loginForm.password) {
						callback(new Error('两次输入的密码不一致'));
					}
					callback();
				}
			},
			validateConfirmMobile(rule, value, callback) {
				if (value === '') {
					callback(new Error('请重新注册时所留手机号码'));
				} else {
					if (value !== this.userInfo.mobile) {
						callback(new Error('手机号码有误'));
					}
					callback();
				}
			},

		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		background-color: #606266;
		background-size: cover;
	}

	.title {
		margin: 0px auto 10px auto;
		text-align: center;

		span {
			font-size: 16px;
			font-weight: bold;
			color: #707070;
		}

		p {

			font-size: 12px;
			color: #999999;
		}
	}


	.welcome {
		border-radius: 6px;
		background: #ffffff;
		width: 300px;
		height: 50px;
		padding: 20px 25px 5px 25px;
		text-align: center;

		span {

			font-weight: bold;
			font-size: 20px;
			color: #707070;
		}

		i {
			margin-left: 3px;
			margin-right: 3px;
			color: #888;
			font-size: 13px;
		}
	}

	.login-form {
		border-radius: 6px;
		background: #ffffff;
		width: 400px;
		height: 410px;
		padding: 20px 25px 5px 25px;
		position: relative;

		.el-input {
			height: 45px;

			input {
				height: 45px;
			}
		}

		.input-icon {
			height: 45px;
			width: 14px;
			margin-left: 4px;
		}
	}

	.psw-progress-msg {
		float: left;
		font-size: 12px;
		line-height: 10px;
	}
</style>
