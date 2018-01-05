<template>
	<section class="index">
		<header class="header">
			<div class="name" @click="goPage">
				<h1>Remaining sum</h1>
				<h2>账户余额</h2>
			</div>
			<span class="money">
				<i>￥</i>{{ total | formatmonye }}
			</span>
		</header>
		<article class="echarts" :style="{minHeight: winHeight + 'px'}">
			<div class="date" :class="[isClass?'week':'month']">
				<em @click="weekEchart">周</em>
				<em @click="monthEchart">月</em>
			</div>
			<div v-show="isData" id="main" style="height: 500px;"></div>
			<div class="no-data" v-show="!isData" >暂无数据！</div>
		</article>
	</section>
</template>
<script>
import { indexinfo } from '../api'
export default {
	data(){
		return {
			echartsData: [],
			total: 0,
			isData: true,
			isClass: true,
			winHeight: window.innerHeight - 487
		}
	},
	created(){
		this.requestInfo();
	},
	mounted(){
		//this.setEcharts(this.echartsData['weekList']);
	},
	methods: {
		requestInfo(){
			let _this = this;
			indexinfo().then(res => {
				let { result, resultType } = res;
				if( resultType == 'SUCCESS') {
					_this.total = result.accountBalance;
					_this.echartsData = result;
					_this.setEcharts(_this.echartsData['weekList'])
				}
			})
		},
		goPage(){
			this.$router.push({
				path:'/customeraccountcharge'
			})
		},
		weekEchart(){
			let _this = this;
			_this.isClass = true;
			this.setEcharts(_this.echartsData['weekList']);
		},
		monthEchart(){
			let _this = this;
			_this.isClass = false;
			this.setEcharts(_this.echartsData['monthList'])
		},
		setEcharts(json){
			json.length?this.isData = true:this.isData = false;
			let xData = [];
			let yData = [];
			let ele = document.getElementById('main');
			let chart = echarts.init(ele);
			for(var x in json){
				xData.push(json[x].chargeTime);
				yData.push(json[x].chargeMoney);
			}
			let option = {
			    tooltip : {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'cross',
			            label: {
			                backgroundColor: '#523652'
			            }
			        }
			    },
			    tooltip: {
			    	trigger: 'axis',
			    	backgroundColor: 'rgba(50,50,50,0.4)',
			    	formatter: '日期：{b0}<br>成交金额：{c0}',
			    	padding: [5,15]

			    },
			    grid: {
			        left: '2%',
			        right: '6%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : false,
			            data : xData,
			            splitLine: {
							show: true, 
							lineStyle: {
								color: ['#cbdefe']
							}                            
						},
			            axisLine:{
			            	lineStyle:{
			            		color: '#79abfe'
			            	}
			            }
			        }
			    ],
			    yAxis : [{
			            type : 'value',
			            splitLine: {
							show: true, 
							lineStyle: {
								color: ['#cbdefe']
							}                            
						},
			            axisLine:{
			            	lineStyle:{
			            		color: '#79abfe'
			            	}
			            }
			    }],
			    series : [
			        {
			            name:'金额',
			            type:'line',
			            stack: '总量',
			            areaStyle: {
			            	normal: {}
			            },
			            data: yData,
			            smooth: true,
			            areaStyle: {
			                normal: {
			                    color: "#90c6ff"
			                }
			            },
			            itemStyle : {  
                            normal : {
                                lineStyle:{  
                                    color:'#3185db'  
                                }
                            }  
                        },
                        markPoint : {
						    data : [
						        {type : 'max', name: '最大值'},
						        {type : 'min', name: '最小值'}
						    ]
						}
						//,
			            // markLine: {
			            //     data: [
			            //         {type: 'average', name: '平均值'},
			            //         [{
			            //             symbol: 'none',
			            //             x: '90%',
			            //             yAxis: 'max'
			            //         }, {
			            //             symbol: 'circle',
			            //             label: {
			            //                 normal: {
			            //                     position: 'start',
			            //                     formatter: '最大值'
			            //                 }
			            //             },
			            //             type: 'max',
			            //             name: '最高点'
			            //         }]
			            //     ]
			            // }
			            
			        }
			    ]
			};
			chart.setOption(option);
		}
	}
}
</script>
<style scoped>

.index .header {
	height: 162px;
	margin-bottom: 25px;
	padding: 0 50px;

}
.index .name {
	float: left;
	margin-top: 50px;
	cursor: pointer;
}
.index .name h1 {
	color: #3185da;
	font: 28px/34px "arial";
}
.index .name h2 {
	color: #333;
	font: 14px/22px "microsoft yahei";
}
.index .name:hover h1 {
	color: #c23531;
}
.index .name:hover h2 {
	color: #c23531;
}
.index .money{
	float: right;
	margin-top: 50px;
	font-size: 52px;
	line-height: 60px;
	color: #399aff;
}
.index .money i {
	font-size: 40px;
}
.index .echarts {
	position: relative;
	padding-right: 25px;
	padding-top: 55px; 
}
.index .no-data {
	padding: 50px 0 120px;
	text-align: center;
	font-size: 18px;
}
.index .date {
	display: block;
	width: 91px;
	height: 51px;
	padding: 7px 0 0 9px;
	position: absolute;
	right: 45px;
	top: 20px;
}
.index .date em{
	float: left;
	width: 40px;
	line-height: 39px;
	color: #fff;
	cursor: pointer;
	text-align: center;
}
.index .week {
	background: url(/static/image/echars_week.png);
	background-size: cover;
}
.index .month {
	background: url(/static/image/echars_month.png);
	background-size: cover;
}


</style>