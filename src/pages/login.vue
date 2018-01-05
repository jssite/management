<template>
	<section class="login">
		<article class="content">
			<div class="logo"><img src="/static/image/logo.png"></div>
			<p class="text">智能物流管理系统</p>
			<div class="area">
				<ul class="form">
					<li>
						<input type="text" v-model="form.user" class="input" :class="{error: rule.user}" @input="clearError('user')" placeholder="请输入账号">
						<p class="valid" v-if="rule.user">请输入账号</p>
					</li>
					<li>
						<input type="password" v-model="form.pass" class="input" @input="clearError('pass')" :class="{error:rule.pass}" placeholder="请输入密码">
						<p class="valid" v-if="rule.pass">请输入密码</p>
					</li>
					<li>
						<input type="text" v-model="form.checkCode" class="input check-code" @input="clearError('code')" :class="{error: rule.code}" placeholder="请输入验证码"><img class="code" title="点击刷新" :src="baseUrl" @click="validate">
						<p class="valid" v-if="rule.code">请输入验证码</p>
					</li>
				</ul>
				<a href="javascript:;" class="submit" @click="onSubmit">登录</a>
			</div>
		</article>
	</section>
</template>
<script>
	import { login } from '../api'
	import base from '../api/api'
	import md5 from 'js-md5'
	export default {
		data(){
			return {
				form: {
					user: '',
					pass: '',
					checkCode: ''
				},
				baseUrl: base + '/verifycode/generate/',
				rule: {
					user: false,
					pass: false,
					code: false
				}
			}
		},
		mounted(){
			let _this = this;
			_this.baseUrl = base + '/verifycode/generate/?render=' +Math.random()
			window.onkeyup = function(event){
				var href = location.pathname;
				var e = event || window.event;
				if(href.indexOf('login') >= 0){
					if(e.keyCode == 13){
						_this.onSubmit()
					}
				}
			}
		},
		methods: {
			clearError(ary){
				this.rule[ary] = false;
			},
			validate(){
				this.baseUrl = base + '/verifycode/generate/?render=' +Math.random()
			},
			onSubmit(){
				let _this = this;
				let time = 10000;
				let matchResult = true;
				let params = {
					'loginName': _this.form.user,
					'password':  md5(_this.form.pass).toUpperCase(),
					'verycode':  _this.form.checkCode
				}
				if(_this.form.user == ''){

					this.rule.user = true;
					return ;
				}
				if(_this.form.pass == ''){
					this.rule.pass = true;
					return ;
				}
				if(_this.form.checkCode == ''){
					this.rule.code = true;
					return ;
				}
				if( matchResult ){
					matchResult = false;
					login(params).then((res) => {
						let { token, result, resultType, resultMessage } = res;
						matchResult = true;
						if(resultMessage == '验证码不正确'){
							_this.baseUrl = base + '/verifycode/generate/?render=' +Math.random()
						}
						if( resultType == 'SUCCESS' ){
							let info = {
								logname: result.loginName,
								loginResult: result.loginResult
							}
							sessionStorage.setItem('token', token);
							sessionStorage.setItem('login', JSON.stringify(info));
							sessionStorage.setItem('menu', JSON.stringify(result.sysRights))
							this.$router.push({path: '/index'})
						}
					})
				}
			}
		}
	}
</script>
<style scoped>
.login{
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	background: url(/static/image/login_bg.png) no-repeat center 30%;
	background-size: auto 253px;
}

.login .content{
	width: 460px;
	height: 630px;
	overflow: auto;
	position: absolute;
	left: 50%;
	top: 50%;
	margin: -315px 0 0 -230px;
	background: rgba(255,255,255,0.9);
	border-radius: 10px;
	box-shadow: 18px 32px 80px rgba(68,73,128,0.14);
}
.login .logo {
	margin-top: 110px;
	text-align: center;
}
.login .form {
	margin: 0 40px;
	overflow: hidden;
}
.login .form li {
	margin-bottom: 25px;
	position: relative;
}
.login .form .valid {
	position: absolute;
	left: 20px;
	top: 38px;
	font-size: 14px;
	line-height: 25px;
	color: red;
}
.login .input {
	width: 100%;
	padding: 9px 20px;
	border: #f0f2f7 1px solid;
	border-radius: 20px;
	box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-ms-box-sizing: border-box;
	-o-box-sizing: border-box;
	vertical-align: middle;
	color: #707070;
	line-height: normal;
	line-height: 20px\9;
	font-size: 14px;
}
.login .code {
	height: 38px;
	vertical-align: middle;
	margin-left: 15px;
	display: inline-block;
	cursor: pointer;
}
.login .input:hover {
	border-color: #eaeef9;
}
.login .input:focus{
	border-color: #bdcdfb;
}
.login .input.error {
	border-color: red;
}
.login .check-code {
	width: 225px;
}
.login .text{
	padding: 28px 0 48px;
	text-align: center;
	font-size: 18px;
	color: #399aff;
	font-weight: 700;
}
.login .submit{
	display: block;
	height: 50px;
	border-radius: 20px;
	line-height: 50px;
	color: #fff;
	margin: 25px 40px 0;
	background: #5b83fa;
	text-align: center;
	font-size: 20px;
}
</style>
