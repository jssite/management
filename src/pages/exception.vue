<template>
	<section class="not-found">
		<article class="area">
			<div><img src="/static/image/system_error.png"></div>
			<p class="text">系统异常！<em @click="goHome">返回首页</em></p>
		</article>
	</section>
</template>
<script>
	export default {
		methods: {
			goHome(){
				this.$router.go(-1);
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
	font-size: 14px;
	line-height: 30px;
}
.not-found .text em {
	cursor: pointer;
	padding: 0 20px 0 30px;
	background: url(../../static/image/arrow.png) no-repeat right center;
	background-size: 15px 13px;
	color: #3479f7;
}
</style>