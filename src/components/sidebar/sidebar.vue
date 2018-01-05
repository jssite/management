<template>
	<section class="side">
		<!-- <el-menu theme="dark" router :default-active="$route.path" class="menu-vertical"> -->
		<el-menu theme="dark" router :default-active="activeIndex" @select="handleSelect" class="menu-vertical">
			<el-menu-item index="/index"><i class="iecez el-icon-shouye"></i>首页</el-menu-item>
			<template v-for="(item,index) in menus" >
				<el-submenu :index="(index + 2) + ''" >
					<template slot="title"><i class="iecez" :class="item.groupIcon"></i>{{item.groupName}}</template>
					<el-menu-item v-for="(menu,x) in item.menuList" :index="menu.actionPath" :key="x">{{menu.moduleName}}</el-menu-item>
				</el-submenu>
			</template>
			<!-- <el-submenu index="2">
				<template slot="title"><i class="iecez el-icon-piechart"></i>运营管理</template>
				<el-menu-item index="/customercardmanage">卡信息管理</el-menu-item>
				<el-menu-item index="/userRecharge">客户账户充值</el-menu-item>
				<el-menu-item index="/autochargemanage">自动充值设置</el-menu-item>
			</el-submenu>
			<el-submenu index="3">
				<template slot="title"><i class="iecez el-icon-shuju"></i>统计查询</template>
				<el-menu-item index="/cardchargehistory">自动充值查询</el-menu-item>
			</el-submenu>
			<el-submenu index="4">
				<template slot="title"><i class="iecez el-icon-shezhi"></i>系统设置</template>
				<el-menu-item index="/operatorcustomer">客户账户管理</el-menu-item>
			</el-submenu> -->
		</el-menu>
	</section>
</template>
<script>
	export default {
		data(){
			return {
		        activeIndex: '/index'
		    }
		},
		created(){
			var pathname = location.pathname;
			if(pathname.indexOf('/customernewcard') >= 0 || pathname.indexOf('/customereditcard') >= 0){
		    		pathname = '/customercardmanage'
		    	}
			this.activeIndex = pathname;
		},
		computed: {
			menus() {
				let menus = JSON.parse(sessionStorage.getItem('menu'));
				return menus;
			}
		},
		methods: {
			handleSelect(url) {
		        this.activeIndex = url;
		    }
		},
		watch: {
		    $route(to, from) {
		    	var pathname = to.path;
		    	if(pathname.indexOf('/customernewcard') >= 0 || pathname.indexOf('/customereditcard') >= 0){
		    		pathname = '/customercardmanage'
		    	}
		        this.handleSelect(pathname)
		    }
		}
	}
</script>
<style scoped>
.side {
	width: 100%;
	padding-top: 20px;
	color: #fff;
}
/*.side .menus {
	color: #fff;
	line-height: 40px;
	margin: 0 25px 0 20px;
}
.side .menus .title {
	font-size: 14px;
	padding-left: 55px;
	cursor: pointer;
}
.side .menus a {
	padding-left: 45px;
	color: #fff;
	display: block;
	text-align: left;
	border-radius: 30px;
}
.side .menus a:hover {
	background: #343c4d;
}*/
.menu-vertical {
	margin: 0 20px;
}
.is-active .iecez {
	color: #fff;
}
</style>
