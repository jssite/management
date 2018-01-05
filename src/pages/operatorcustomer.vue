<template>
	<section class="system" :style="{height: winHeight + 'px'}">
		<article class="user">
			<el-form :model="rule" :rules="rules" ref="rule" label-width="86px">
				<el-form-item label="新密码" prop="pass">
					<el-input type="password" v-model="rule.pass"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="rule.checkPass"></el-input>
				</el-form-item>
			</el-form>
			<p class="text">
				密码设置说明：<br>
				6-16位英文、数字和符号中至少两种的组合，不允许有空格；
			</p>
			<div class="footer">
				<button type="button" @click="resetForm('rule')" class="button close">重置</button>
				<button type="button" class="button" @click="submitForm('rule')">保存</button>
			</div>
		</article>
	</section>
</template>
<script>
	import { modpwd } from '../api'
	import md5 from 'js-md5'
	export default {
		data(){
			var validatePass = (rule, value, callback) => {
				let re = /^((?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[^\s0-9a-zA-Z])|(?=.*[a-zA-Z])(?=.*[^\s0-9a-zA-Z]))[^\s]{6,16}$/;
				if (value === '') {
					callback(new Error('必填项'));
				} else if( value.length < 6 || value.length > 16 ){
					callback(new Error('密码长度为6-16位字符'));
				} else if( !re.test(value) ){
					callback(new Error('密码必须包含字母、数字、符号中至少2种组合'));
				} else {
					callback();
				}
			};
			var validateCheckPass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('必填项'));
				} else if (value !== this.rule.pass) {
					callback(new Error('两次输入密码不一致'));
				} else {
					callback();
				}
			};
			return {
				winHeight: window.innerHeight - 247,
				rule: {
					pass: '',
					checkPass: ''
				},
				rules: {
					pass: [{required: true, validator: validatePass, trigger: 'blur' }],
					checkPass: [{required: true, validator: validateCheckPass, trigger: 'blur' }]
				}
			}
		},
		methods: {
			submitForm(formName) {
				let _this = this;
				let query = {
					newPassword: md5(_this.rule.pass).toUpperCase()
				}
				_this.$refs[formName].validate((valid) => {
					if (valid) {
						modpwd(query).then(res => {
							let { resultType } = res;
							if( resultType == 'SUCCESS' ){
								_this.$notify({
									title: '成功',
									message: '密码修改成功',
									type: 'success'
								});
								_this.rule = {
									pass: '',
									checkPass: ''
								}
							}
							isBool = true;
						})
					} else {
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>
<style scoped>
.system .form-item-label{
	width: 85px;
}
.system .form-item-inner {
	width: 515px;
}
.system .form-item {
	margin-right: 0;
}
.system .user {
	width: 600px;
	padding-top: 95px;
	margin: auto;
}

.system .user .text {
	font-size: 12px;
	padding-left: 85px;
	color: #888888;
	line-height: 26px;
}
.system .user .footer {
	margin-top: 42px;
	text-align: right;
}

</style>
