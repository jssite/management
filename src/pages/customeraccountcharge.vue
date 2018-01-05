<template>
	<section class="statistics">
		<header class="query">
			<el-row>
				<el-col :span="24">
					<div class="form-item" style="margin-right: 50px;">
						<label class="form-item-label">创建时间</label>
						<div class="form-item-inner">
							<el-date-picker type="date" :editable="false" v-model="query.startDate" placeholder="选择开始日期" :picker-options="pickerBeginDate" class="w-260"></el-date-picker>
							<em>至</em>
							<el-date-picker type="date" :editable="false" v-model="query.endDate" placeholder="选择结束日期" :picker-options="pickerBeginDate" class="w-260"></el-date-picker>
						</div>
					</div>
					<div class="form-item">
						<label class="form-item-label">充值成功日期</label>
						<div class="form-item-inner">
							<el-date-picker type="date" :editable="false" v-model="query.successStartDate" placeholder="选择开始日期" :picker-options="pickerBeginDate" class="w-260"></el-date-picker>
							<em>至</em>
							<el-date-picker type="date" :editable="false" v-model="query.successEndDate" :picker-options="pickerBeginDate" placeholder="选择结束日期" class="w-260"></el-date-picker>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<div class="form-item">
						<label class="form-item-label">充值编号</label>
						<div class="form-item-inner">
							<el-input v-model="query.number"></el-input>
						</div>
					</div>
					<!-- 
					<div class="form-item" style="margin-left: 20px;">
						<label class="form-item-label">充值类型</label>
						<div class="form-item-inner">
							<el-checkbox-group v-model="query.cardType">
								<el-checkbox label="1">客户充值</el-checkbox>
								<el-checkbox label="2">平台充值</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
					<div class="form-item">
						<label class="form-item-label">充值状态</label>
						<div class="form-item-inner">
							<el-checkbox-group v-model="query.mode">
								<el-checkbox label="1">待支付</el-checkbox>
								<el-checkbox label="2">已支付</el-checkbox>
							</el-checkbox-group>
						</div>
					</div> -->
				</el-col>
				<el-col :span="24" class="tr" style="padding-right: 25px;">
					<button type="button" name="button" class="button" @click="searchEvent">查询</button>
				</el-col>
			</el-row>
		</header>
		<article class="content" :style="{minHeight: winHeight + 'px'}">
			<div class="toolbox">
				<ul class="boxs">
					<!-- <li class="recharge" @click="rechargeMonye">充值</li> -->
					<li class="export" @click="exportEvent">导出</li>
					<li class="print" @click="printEvent">打印</li>
				</ul>
			</div>
			<el-table :data="tableData" v-loading="loading" :row-style="{color: '#888',fontSize: '13px'}">
				<el-table-column prop="billNo" label="充值编号"></el-table-column>
				<el-table-column prop="customerName" width="200" label="充值账户"></el-table-column>
				<el-table-column prop="chargeMoney" label="充值金额"></el-table-column>
				<!-- <el-table-column prop="chargeTypeName" label="充值类型"></el-table-column> -->
				<!-- <el-table-column prop="chargeStatusName" label="充值状态"></el-table-column> -->
				<el-table-column prop="createTime" label="创建时间"></el-table-column>
				<el-table-column prop="chargeTime" label="充值成功时间"></el-table-column>
				<el-table-column label="备注">
					<template slot-scope="scope">
						<template v-if="scope.row.remark.length>30">
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
					<li>{{totalAmount | formatmonye }}</li>
				</ul>
			</div>
		</article>
		<el-dialog title="账户充值" :visible.sync="dialogVisible" @close="closeDialog('rule')">
			<div class="dialog">
				<el-form :model="recharge" :rules="rules" ref="rule" label-width="110px">
					<el-form-item label="客户充值账户" prop="name">
						<el-input type="text" disabled="disabled" v-model="recharge.name"></el-input>
					</el-form-item>
					<el-form-item label="充值金额" prop="money">
						<el-input type="text" v-model="recharge.money"></el-input>
					</el-form-item>
					<el-form-item label="支付方式" prop="type">
						<el-radio class="radio" v-model="recharge.type" label="1">银联对私</el-radio>
						<el-radio class="radio" v-model="recharge.type" label="2">银联对公</el-radio>
					</el-form-item>
				</el-form>
			</div>
			<template slot="footer">
				<button type="button" class="button close" @click="closeDialog('rule')">取消</button>
				<button type="button" class="button" @click="submitDialog('rule')">保存</button>
			</template>
		</el-dialog>
	</section>
</template>
<script>
import { accountrecharge, accountrechargemoney, accountrechargeexport, userrechargeprint } from '../api'
import pagination from '../components/page/pagetion'
import exportExl from '../comm/exportExl'
import print from '../comm/print'
import * as utils from '../utils'
export default {
	data(){
		var limit = (rule, value, callback) => {
			let reg = /^(\-)?\d+(\.\d+)?$/;
			let val = value.toString();
			if(val == ''){
				callback(new Error('必填项'));
			} else if( !reg.test(val)) {
				callback(new Error('只能数字格式'));
			} else if(val.indexOf('.') > -1 && val.split('.')[1].length > 2){
				callback(new Error('至多保留2位小数'));
			} else if( val < 100 && this.recharge.type == '1' ) {
				callback(new Error('单笔充值金额不低于100元'));
			} else if( val < 5000 && this.recharge.type == '2' ) {
				callback(new Error('银联对公单笔充值金额不低于5000元'));
			} else {
				callback();
			}
		}
		return {
			loading: true,
			dialogVisible: false,
			totalAmount: 0,
			query: {
				startDate: utils.formatDate(-3),
				endDate: utils.formatDate(0),
				successStartDate: utils.formatDate(-3),
				successEndDate: utils.formatDate(0),
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
			recharge: {
				name: '',
				money: '',
				type: ''
			},
			tableData: null,
			rules: {
				name: [{ required: true, message: '必填项', trigger: 'blur' }],
				money: [{ required: true, validator: limit, trigger: 'change' }],
				type: [{ required: true, message: '必填项', trigger: 'blur' }]
			},
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
		this.requestAccountRecharge();
		this.getRechargeMonye();
	},
	methods: {
		requestAccountRecharge(){
			let _this = this;
			let params = {
				billNo: _this.query.number,
				chargeStartDate: utils.timeFormat(_this.query.startDate, 'yyyy-MM-dd'),
				chargeEndDate: utils.timeFormat(_this.query.endDate, 'yyyy-MM-dd'),
				chargeSuccessStartDate: utils.timeFormat(_this.query.successStartDate, 'yyyy-MM-dd'),
				chargeSuccessEndDate: utils.timeFormat(_this.query.successEndDate, 'yyyy-MM-dd'),
				chargeType: _this.query.cardType,
				chargeStatus: _this.query.mode,
				pageNo: _this.pages.current,
				pageSize: _this.pages.sizes
			}
			_this.loading = true;
			accountrecharge(params).then(res => {
				let { result, resultType } = res;
				_this.loading = false;
				if( resultType == 'SUCCESS' ){
					_this.tableData = result.list;
					_this.pages.total = parseInt(result.iTotalDisplayRecords);
					if(!result.list.length && _this.pages.total > 0){
						_this.pages.current = 1;
						_this.requestAccountRecharge();
					}
				}
			});
		},
		getRechargeMonye(){
			let _this = this;
			let params = {
				billNo: _this.query.number,
				chargeStartDate: utils.timeFormat(_this.query.startDate, 'yyyy-MM-dd'),
				chargeEndDate: utils.timeFormat(_this.query.endDate, 'yyyy-MM-dd'),
				chargeSuccessStartDate: utils.timeFormat(_this.query.successStartDate, 'yyyy-MM-dd'),
				chargeSuccessEndDate: utils.timeFormat(_this.query.successEndDate, 'yyyy-MM-dd'),
				chargeType: _this.query.cardType,
				chargeStatus: _this.query.mode,
				pageNo: _this.pages.current,
				pageSize: _this.pages.sizes
			}
			accountrechargemoney(params).then(res => {
				let { result, resultType } = res;
				if( resultType == 'SUCCESS' ){
					_this.totalAmount = result;
				}
			})
		},
		searchEvent(){
			if(this.query.startDate != '' && this.query.endDate != '') {
				if( this.query.startDate > this.query.endDate ){
					this.$notify({
						type: 'error',
						title: '错误',
						message: '创建开始时间不能大于创建结束时间'
					});
					return ;
				}
			}
			if(this.query.successStartDate !='' && this.query.successEndDate != '') {
				if( this.query.successStartDate > this.query.successEndDate ){
					this.$notify({
						type: 'error',
						title: '错误',
						message: '充值成功开始时间不能大于充值成功结束时间'
					});
					return ;
				}
				}
			this.pages.current = 1;
			this.requestAccountRecharge();
			this.getRechargeMonye();
		},
		watchPage(index) {
			this.pages.current = index;
			this.requestAccountRecharge();
		},
		watchSizes(size){
			this.pages.current = 1;
			this.pages.sizes = size;
			this.requestAccountRecharge();
		},
		rechargeMonye(){
			this.dialogVisible = true;
		},
		closeDialog(formName){
			this.dialogVisible = false;
			this.recharge = {
				name: '',
				money: '',
				type: ''
			}
			this.$refs[formName].resetFields();
		},
		printEvent(){
			let _this = this;
			let params = {
				billNo: _this.query.number,
				chargeStartDate: utils.timeFormat(_this.query.startDate, 'yyyy-MM-dd'),
				chargeEndDate: utils.timeFormat(_this.query.endDate, 'yyyy-MM-dd'),
				chargeSuccessStartDate: utils.timeFormat(_this.query.successStartDate, 'yyyy-MM-dd'),
				chargeSuccessEndDate: utils.timeFormat(_this.query.successEndDate, 'yyyy-MM-dd'),
				chargeType: _this.query.cardType,
				chargeStatus: _this.query.mode,
				pageNo: _this.pages.current,
				pageSize: _this.pages.sizes
			}
			userrechargeprint(params).then(res => {
				let { result, resultType } = res;
				if( resultType == 'SUCCESS' ){
					print({
						header: '',
						headerStyle: '',
						properties: [
							{
								title: '充值编号',
								query: 'billNo',
								width: 110
							},
							{
								title: '充值账户',
								query: 'customerName',
								width: 150
							},
							{
								title: '充值金额',
								query: 'chargeMoney',
								width: 80
							},
							{
								title: '创建时间',
								query: 'createTime',
								width: 100
							},
							{
								title: '充值成功时间',
								query: 'chargeTime',
								width: 100
							},
							{
								title: '备注',
								query: 'remark',
							}
						],
						printdata: result
					})
				}
			});
		},
		exportEvent(){
			let _this = this;
			let params = {
				billNo: _this.query.number,
				chargeStartDate: utils.timeFormat(_this.query.startDate, 'yyyy-MM-dd'),
				chargeEndDate: utils.timeFormat(_this.query.endDate, 'yyyy-MM-dd'),
				chargeSuccessStartDate: utils.timeFormat(_this.query.successStartDate, 'yyyy-MM-dd'),
				chargeSuccessEndDate: utils.timeFormat(_this.query.successEndDate, 'yyyy-MM-dd'),
				pageNo: _this.pages.current,
				pageSize: _this.pages.sizes
			}
			exportExl(params, accountrechargeexport, {
				chargeType: _this.query.cardType,
				chargeStatus: _this.query.mode,
			});
		},
		submitDialog(formName){
			let _this = this;
			let reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/gi;
			let query = {
				name: _this.recharge.name,
				money: _this.recharge.money,
				type: _this.recharge.type
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$confirm('确认给'+_this.recharge.name+'，充值金额：' + _this.recharge.money + '元？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						
					}).catch(() => {

					});
				} else {
					return false;
				}
			});
			
		}
	}
}
</script>
<style scoped>
.el-checkbox-group {
	padding-top: 8px;
}
.statistics .query {
	padding: 25px 0 25px 40px;
	margin-bottom: 25px;
}
.statistics .w-260 {
	width: 170px;
}

.statistics .dialog {
	padding: 30px 55px 30px 50px;
	background: #f9fafc;
}
.statistics .dialog .form-item-inner {
	width: 440px;
}
.statistics .dialog .form-item-label {
	color: #333;
}
.statistics .dialog i {
	color: red;
}
.statistics a{
	color: #888;
}
.tip {
	width: 200px;
	line-height: 22px;
	text-align: justify;
}

</style>
