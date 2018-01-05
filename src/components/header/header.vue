<template>
	<section class="header clearfix">
		<div class="logo">
			<img src="/static/image/login_b.png" width="115" height="40" alt="ecez">
		</div>
		<div class="name">
			<em>Intelligent Logistics Management</em>
			<span>智能物流管理系统</span>
		</div>
		<div class="user">
			<span>{{username}}</span>
			<em class="loginout" @click="loginout"></em>
		</div>
	</section>
</template>
<script>
import { logout } from '../../api'
	export default {
		data(){
			return {

			}
		},
		computed: {
			username(){
				let data = JSON.parse(sessionStorage.getItem('login'));
				return data.logname;
			}
		},
		methods: {
			loginout(){
				this.$confirm('确定退出系统吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					logout().then(res => {
						let { resultType } = res;
						if(resultType == 'SUCCESS') {
							sessionStorage.removeItem('token');
							sessionStorage.removeItem('login');
							sessionStorage.removeItem('menu');
							this.$router.replace({
								path: '/login'
							})
						}
					})
				}).catch(() => {
				});
			}
		}
	}
</script>
<style scoped>
.header {
	width: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 10;
	background: #399aff;
}
.header .logo {
	float: left;
	padding-top: 25px;
	box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-ms-box-sizing: border-box;
	-o-box-sizing: border-box;
	width: 270px;
	height: 90px;
	background: #476bd4;
	text-align: center;
}
.header .name {
	float: left;
	padding: 15px 0 0 50px;
	display: block;
	color: #fff;
	line-height: 26px;
}
.header .name span {
	display: block;
	padding-top: 3px;
	font-size: 24px;
}
.header .name em {
	font-size: 14px;
	display: block;
	font-family: "Arial";
}
.header .user {
	float: right;
	height: 58px;
	padding-top: 32px;
	color: #fff;
	font-size: 18px;
	line-height: 25px;
}
.header .loginout {
	display: inline-block;
	width: 23px;
	height: 25px;
	margin: 0 55px 0 25px;
	vertical-align: top;
	background: url(/static/image/loginout.png) no-repeat;
	background-size: cover;
	cursor: pointer;
}
.header .loginout:hover {
	background: url(/static/image/loginout_hover.png) no-repeat;
	background-size: cover;
}
</style>