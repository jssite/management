<template>
	<section class="statistics">
		<header class="query">
			<el-row>
				<el-col :span="24">
					<div class="form-item">
						<label class="form-item-label">消费时间</label>
						<div class="form-item-inner">
							<el-date-picker type="date" :editable="false" placeholder="选择开始日期" v-model="query.startTime" :picker-options="pickerBeginDate" class="w-260"></el-date-picker>
							<em>至</em>
							<el-date-picker type="date" :editable="false" placeholder="选择结束日期" v-model="query.endTime" :picker-options="pickerBeginDate" class="w-260"></el-date-picker>
						</div>
					</div>
					<div class="form-item">
						<label class="form-item-label">订单编号</label>
						<div class="form-item-inner">
							<el-input v-model="query.billNo"></el-input>
						</div>
					</div>
					<div class="form-item">
						<label class="form-item-label">卡号</label>
						<div class="form-item-inner">
							<el-input v-model="query.gasCard"></el-input>
						</div>
					</div>
					<div class="form-item">
						<label class="form-item-label">消费站点</label>
						<div class="form-item-inner">
							<el-input v-model="query.stationName"></el-input>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24" class="tr" style="padding-right: 25px;">
					<button type="button" name="button" class="button" @click="searchEvent">查询</button>
				</el-col>
			</el-row>
		</header>
		<article class="content" :style="{minHeight: winHeight + 'px'}">
			<div class="toolbox">
				<ul class="boxs">
					<li class="export" @click="exportExl">导出</li>
				</ul>
			</div>
			<el-table :data="tableData" v-loading="loading" style="width: 100%" :row-style="{color: '#888',fontSize: '13px'}">
				<el-table-column width="180" prop="billNo" label="订单编号"></el-table-column>
				<el-table-column width="180" prop="gasCardNo" label="卡号"></el-table-column>
				<el-table-column width="80" prop="cardType" label="卡种类"></el-table-column>
				<el-table-column width="80" prop="cardBrandName" label="卡品牌"></el-table-column>
				<el-table-column align="center" width="100" prop="carNo" label="车牌号"></el-table-column>
				<el-table-column align="center" width="130" prop="balance" label="卡余额"></el-table-column>
				<el-table-column align="center" prop="stationName" label="消费站点"></el-table-column>
				<el-table-column align="center" width="100" prop="quantity" label="油气量"></el-table-column>
				<el-table-column align="center" width="80" prop="unitPrice" label="单价"></el-table-column>
				<el-table-column align="center" width="100" prop="consumeMoney" label="交易金额"></el-table-column>
				<el-table-column align="center" width="200" label="消费时间" prop="tradeTime">
				</el-table-column>
			</el-table>
			<v-pagination v-if="pages.total" :current-page="pages.current" :page-sizes="[10,20,30,40,50]" :page-size='pages.sizes' :total="pages.total" @sizes-change="watchSizes" @current-change="watchPage"></v-pagination>
		</article>
	</section>
</template>
<script>
import { cardconsumecountList, cardconsumecountExport } from '../api'
import pagination from '../components/page/pagetion'
import exportExl from '../comm/exportExl'
import * as utils from '../utils'
export default {
	data(){
		return {
			loading: false,
			totalAmount: 0,
			query: {
				gasCard: '',
				billNo: '',
				stationName: '',
				startTime: utils.formatDate(-3),
				endTime: utils.formatDate(0)
			},
			pages: {
				total: 0,
				current: 1,
				sizes: 10
			},
			tableData: null,
			pickerBeginDate:{
				disabledDate: (time) => {
				    return time.getTime() > new Date().getTime();
				}
			},
			winHeight: window.innerHeight - 400
		}
	},
	components: {
		'v-pagination': pagination
	},
	created(){
		this.getConsumptionList();
	},
	methods: {
		getConsumptionList(){
			let _this = this;
			let query = {
				gasCardNoSch: _this.query.gasCard,
				billNoSch: _this.query.billNo,
				stationNameSch: _this.query.stationName,
				consumeStartDate: utils.timeFormat( _this.query.startTime, 'yyyy-MM-dd'),
				consumeEndDate: utils.timeFormat( _this.query.endTime, 'yyyy-MM-dd'),
				pageNo: _this.pages.current,
				pageSize: _this.pages.sizes
			}
			cardconsumecountList(query).then(res => {
				let { resultType, result} = res;
				if(resultType == 'SUCCESS') {
					_this.tableData = result.list;
					_this.pages.total = parseInt(result.iTotalDisplayRecords);
					if(!result.list.length && _this.pages.total > 0){
						_this.pages.current = 1;
						_this.requresRechargeList();
					}
				}
			});
		},
		exportExl(){
			let _this = this;
			let params = {
				gasCardNoSch: _this.query.gasCard,
				billNoSch: _this.query.billNo,
				stationNameSch: _this.query.stationName,
				consumeStartDate: utils.timeFormat( _this.query.startTime, 'yyyy-MM-dd'),
				consumeEndDate: utils.timeFormat( _this.query.endTime, 'yyyy-MM-dd')
			}
			exportExl(params, cardconsumecountExport);
		},
		watchPage(index) {
			this.pages.current = index;
			this.getConsumptionList();
		},
		watchSizes(size){
			this.pages.current = 1;
			this.pages.sizes = size;
			this.getConsumptionList();
		},
		searchEvent(){
			if(this.query.startTime != '' && this.query.endTime != '') {
				if( this.query.startTime > this.query.endTime ){
					this.$notify({
						type: 'error',
						title: '错误',
						message: '查询开始时间不能大于结束时间'
					});
					return ;
				}
			}
			this.pages.current = 1;
			this.getConsumptionList();
		}
	}
}
</script>
<style scoped>
.el-checkbox-group {
	padding-top: 8px;
}
.statistics a{
	color: #888;
}
.statistics .query {
	padding: 25px 0 25px 40px;
	margin-bottom: 25px;
}
.statistics .w-260 {
	width: 170px;
}
.tip {
	width: 200px;
	line-height: 22px;
	text-align: justify;
}
.tip a{
	color: #888;
}

</style>
