<template>
	<section class="statistics">
		<header class="query">
			<el-row>
				<el-col :span="24">
					<div class="form-item">
						<label class="form-item-label">充值日期</label>
						<div class="form-item-inner">
							<el-date-picker type="date" :editable="false" v-model="query.startDate" placeholder="选择开始日期" :picker-options="pickerBeginDate" class="w-260"></el-date-picker>
							<em>至</em>
							<el-date-picker type="date" :editable="false" v-model="query.endDate" placeholder="选择结束日期" :picker-options="pickerBeginDate" class="w-260"></el-date-picker>
						</div>
					</div>
					<div class="form-item">
						<label class="form-item-label">充值编号</label>
						<div class="form-item-inner">
							<el-input v-model="query.number"></el-input>
						</div>
					</div>
					<div class="form-item">
						<label class="form-item-label">卡号</label>
						<div class="form-item-inner">
							<el-input v-model="query.cardNumber"></el-input>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<div class="form-item">
						<label class="form-item-label">充值模式</label>
						<div class="form-item-inner">
							<el-checkbox-group v-model="query.mode">
								<el-checkbox label="1">自动充值</el-checkbox>
								<el-checkbox label="2">手动充值</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
				</el-col>
				<el-col :span="24" class="tr" style="padding-right: 25px;">
					<button type="button" name="button" class="button" @click="searchEvent">查询</button>
				</el-col>
			</el-row>
		</header>
		<article class="content" :style="{minHeight: winHeight + 'px'}">
			<div class="toolbox">
				<ul class="boxs">
					<li class="export" @click="exportExl">导出</li>
					<li class="print" @click="print">打印</li>
				</ul>
			</div>
			<el-table :data="tableData" v-loading="loading" style="width: 100%" :row-style="{color: '#888',fontSize: '13px'}">
				<el-table-column width="170" prop="billNo" label="充值编号"></el-table-column>

				<el-table-column width="170" prop="cardNo" label="交易卡号"></el-table-column>
				<el-table-column width="140" align="center" prop="chargeMoney" label="充值金额"></el-table-column>
				<el-table-column width="110" align="center" prop="returnMoney" label="返现金额"></el-table-column>
				<el-table-column width="110" align="center" prop="giveRate" label="返现比例"></el-table-column>
				<el-table-column width="190" align="center" prop="customerName" label="持卡物流客户"></el-table-column>
				<el-table-column width="150" align="center" prop="brandName" label="卡品牌"></el-table-column>
				<el-table-column width="170" align="center" prop="chargeTime" label="充值成功时间"></el-table-column>
				<el-table-column width="130" align="center" prop="chargeTypeStr" label="充值模式"></el-table-column>
				<el-table-column label="手动充值备注" width="196">
					<template slot-scope="scope">
						<template v-if="scope.row.remark.length>15">
							<el-tooltip effect="light" placement="bottom">
								<div slot="content" class="tip">{{scope.row.remark}}</div>
								<a href="javasript:;">{{scope.row.remark | cutString(30)}}</a>
							</el-tooltip>
						</template>
						<template v-else>
							{{scope.row.remark}}
						</template>
						
					</template>

				</el-table-column>
			</el-table>
			<v-pagination v-if="pages.total" :current-page="pages.current" :page-sizes="[10,20,30,40,50]" :page-size='pages.sizes' :total="pages.total" @sizes-change="watchSizes" @current-change="watchPage"></v-pagination>
			<div class="summary">
				<ul>
					<li>汇总</li>
					<li>充值总金额</li>
					<li>{{totalAmount | formatmonye}}</li>
				</ul>
			</div>
		</article>
	</section>
</template>
<script>
import { rechargelist, rechargeexport, rechargeprint, rechargegetsum } from '../api'
import pagination from '../components/page/pagetion'
import exportExl from '../comm/exportExl'
import print from '../comm/print'
import * as utils from '../utils'
export default {
	data(){
		return {
			loading: false,
			totalAmount: 0,
			query: {
				startDate: utils.formatDate(-3),
				endDate: utils.formatDate(0),
				number: '',
				cardNumber: '',
				cardType: [],
				mode: []
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
			winHeight: window.innerHeight - 447
		}
	},
	components: {
		'v-pagination': pagination
	},
	created(){
		this.requresRechargeList();
		this.rechargeGetSum();
	},
	methods: {
		requresRechargeList(){
			let _this = this;
			let params = {
				startDateStr: utils.timeFormat(_this.query.startDate, 'yyyy-MM-dd'),
				endDateStr: utils.timeFormat(_this.query.endDate, 'yyyy-MM-dd'),
				billNo: _this.query.number,
				cardNo: _this.query.cardNumber,
				cardRange: utils.join(_this.query.cardType),
				chargeTypeStr: utils.join(_this.query.mode),
				pageNo: _this.pages.current,
				pageSize: _this.pages.sizes
			}
			_this.loading = true;
			rechargelist(params).then(res => {
				let { result, resultType } = res;
				_this.loading = false;
				if( resultType == 'SUCCESS' ) {
					_this.tableData = result.list;
					_this.pages.total = parseInt(result.iTotalDisplayRecords);
					if(!result.list.length && _this.pages.total > 0){
						_this.pages.current = 1;
						_this.requresRechargeList();
					}
				}
			})
		},
		rechargeGetSum(){
			let _this = this;
			let params = {
				billNo: _this.query.number,
				cardNo: _this.query.cardNumber,
				cardRange: utils.join(_this.query.cardType),
				chargeTypeStr: utils.join(_this.query.mode),
				startDateStr: utils.timeFormat(_this.query.startDate, 'yyyy-MM-dd'),
				endDateStr: utils.timeFormat(_this.query.endDate, 'yyyy-MM-dd'),
			}
			rechargegetsum(params).then(res => {
				let { result, resultType } = res;
				if(resultType == 'SUCCESS'){
					_this.totalAmount = result.cardChargeMoney
				}
			});
		},
		exportExl(){
			let _this = this;
			let params = {
				startDateStr: utils.timeFormat(_this.query.startDate, 'yyyy-MM-dd'),
				endDateStr: utils.timeFormat(_this.query.endDate, 'yyyy-MM-dd'),
				billNo: _this.query.number,
				cardNo: _this.query.cardNumber,
				cardRange: utils.join(_this.query.cardType),
				chargeTypeStr: utils.join(_this.query.mode),
			}
			exportExl(params, rechargeexport);
		},
		print(){
			let _this = this;
			let params = {
				startDateStr: utils.timeFormat(_this.query.startDate, 'yyyy-MM-dd'),
				endDateStr: utils.timeFormat(_this.query.endDate, 'yyyy-MM-dd'),
				billNo: _this.query.number,
				cardNo: _this.query.cardNumber,
				cardRange: utils.join(_this.query.cardType),
				chargeTypeStr: utils.join(_this.query.mode),
			}
			rechargeprint(params).then(res => {
				console.log(res)
				let { result, resultType } = res;
				if( resultType == 'SUCCESS' ){
					print({
						header: '',
						headerStyle: '',
						properties: [
							{
								title: '充值编号',
								query: 'billNo'
							},
							{
								title: '交易卡号',
								query: 'cardNo'
							},
							{
								title: '充值金额',
								query: 'chargeMoney'
							},
							{
								title: '返现金额',
								query: 'returnMoney'
							},
							{
								title: '返现比例',
								query: 'giveRate'
							},
							{
								title: '持卡物流客户',
								query: 'customerName'
							},
							{
								title: '卡品牌',
								query: 'brandName'
							},
							{
								title: '充值成功时间',
								query: 'chargeTime'
							},
							{
								title: '充值模式',
								query: 'chargeTypeStr'
							},
							{
								title: '手动充值备注',
								query: 'remark',
								width: 100
							}
						],
						printdata: result
					})
				}
			});
		},
		watchPage(index) {
			this.pages.current = index;
			this.requresRechargeList();
		},
		watchSizes(size){
			this.pages.current = 1;
			this.pages.sizes = size;
			this.requresRechargeList();
		},
		searchEvent(){
			if(this.query.startDate != '' && this.query.endDate != '') {
				if( this.query.startDate > this.query.endDate ){
					this.$notify({
						type: 'error',
						title: '错误',
						message: '充值开始时间不能大于充值结束时间'
					});
					return ;
				}
			}
			this.pages.current = 1;
			this.requresRechargeList();
			this.rechargeGetSum();
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
