<template>
	<section class="home">
		<v-header></v-header>
		<article class="area">
			<div class="content">
				<el-breadcrumb separator="-" >
					<template v-for="(item, index) in $route.matched">
						<template v-if="item.name">
							<el-breadcrumb-item :to="{ path:item.path }" :key="index">{{item.name}}</el-breadcrumb-item>
						</template>
					</template>
				</el-breadcrumb>
				<transition name="fade">
					<router-view></router-view>
				</transition>
				<footer class="footer">廊坊新奥新能源汽车服务有限公司</footer>
			</div>
		</article>
		<aside class="menu">
			<div class="slide">
				<keep-alive>
					<v-sidebar></v-sidebar>
				</keep-alive>
			</div>
		</aside>
	</section>
</template>
<script>
	import Header from '@/components/header/header'
	import Sidebar from '@/components/sidebar/sidebar'
	export default {
		data() {
			return {
			}
		},
		components: {
			'v-header': Header,
			'v-sidebar': Sidebar
		},
		created(){

		}
	}
</script>
<style scoped>
.area {
	width: 100%;
	padding-top: 90px;
	float: left;
}
.area .content {
	margin: 0 0 0 270px;
	padding: 0 45px;
}

.menu {
	width: 270px;
	float: left;
	margin-left: -100%;
	background: #333742;
	overflow: hidden;
	zoom: 1;
/*	margin-bottom: -1000px;
	padding-bottom: 1000px;*/
}
.menu .slide {
	width: 270px;
	position: fixed;
	left: 0;
	top: 90px;
	z-index: 9;
	bottom: 0;
	background: #333742;
}
.area .content .index-menu, .el-breadcrumb {
	padding-top: 8px;
	line-height: 50px;
	color: #666666;
	font-size: 14px;
}
.footer {
	margin: 20px 0 10px;
	text-align: center;
	line-height: 50px;
	background: #e5e5e5;
	color: #666666;
}
</style>
