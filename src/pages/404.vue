<template>
	<section class="not-found">
		<article class="area">
			<div><img src="/static/image/404.png" height="223" width="626"></div>
			<p class="text">您访问的资源不存在！！！</p>
			<button class="home" @click="goHome">返回首页</button>
		</article>
	</section>
</template>
<script>
	export default {
		methods: {
			goHome(){
				this.$router.push({
					path: '/index'
				})
			}
		}
	}
</script>
<style scoped>
.not-found {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	background: #f9f9f9;
}
.not-found .area {
	width: 626px;
	height: 308px;
	margin: -200px 0 0 -313px;
	text-align: center;
	position: absolute;
	left: 50%;
	top: 50%;
}
.not-found .text {
	padding: 10px 0;
	font-size: 16px;
	line-height: 30px;
}
.not-found .home {
	background: #247ba0;
	margin: 0;
	padding: 5px 10px;
	border: 0px;
	border-radius: 3px;
	color: #fff;
	line-height: 25px;
}
</style>