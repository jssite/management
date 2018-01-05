<template>
	<section class="statistics">
		<article class="content" :style="{height: winHeight + 'px'}">
			<el-table :data="tableData" v-loading="loading" :row-style="{color: '#888',fontSize: '13px'}">
				<el-table-column prop="customerName" label="客户名称"></el-table-column>
				<el-table-column prop="chargeLimit" label="充值下限"></el-table-column>
				<el-table-column prop="autoChargeMoney" label="自动充值金额"></el-table-column>
				<el-table-column prop="setStateStr" label="状态"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="info" size="mini" @click="editEvent(scope.row)">编辑</el-button>
						<el-button v-if="scope.row.setState == '1'" type="info" size="mini" @click="operation(scope.row)">启用</el-button>
						<el-button v-if="scope.row.setState == '0'" type="danger" size="mini" @click="operation(scope.row)">禁用</el-button>
					</template>
				</el-table-column>
			</el-table>
		</article>
		<el-dialog title="设置" :close-on-click-modal="false" :visible.sync="dialogVisible" @close="closeDialog('rule')">
			<div class="dialog">
				<el-form :model="edit" :rules="rules" ref="rule" label-width="120px">
					<el-form-item label="客户名称" prop="name">
						<el-input type="text" disabled v-model="edit.name"></el-input>
					</el-form-item>
					<el-form-item label="充值下限" prop="limit">
						<el-input type="text" v-model="edit.limit"></el-input>
					</el-form-item>
					<el-form-item label="自动充值金额" prop="money">
						<el-input type="text" v-model="edit.money"></el-input>
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
import { rechargesettingslist, rechargesettingsedit, rechargelisthandle } from '../api'
export default {
	data(){
		var limit = (rule, value, callback) => {
			let reg = /^(\-)?\d+(\.\d+)?$/;
			let val = value.toString();
			if(val == ''){
				callback(new Error('必填项'));
			} else if( !reg.test(val)) {
				callback(new Error('只能数字格式'));
			} else if( val < 0 ) {
				callback(new Error('充值下限不能为负数'));
			} else if(val.indexOf('.') >= 0){
				callback(new Error('请输入0或正整数'));
			} if(val > 99999999) {
				callback(new Error('超过最高充值限额：99999999'));
			} else {
				callback();
			}
		}
		var money = (rule, value, callback) => {
			//let reg = /^(0|[1-9][0-9]*)$/gi;
			let reg = /^(\-)?\d+(\.\d+)?$/;
			let val = value.toString();
			if(val == ''){
				callback(new Error('必填项'));
			} else if( !reg.test(val)) {
				callback(new Error('只能数字格式'));
			} else if( val < 100 ) {
				callback(new Error('请输入不低于100元的正整数'));
			} else if(val.indexOf('.') >= 0) {
				callback(new Error('请输入不低于100元的正整数'));
			} else if(val > 99999999) {
				callback(new Error('超过最高充值限额：99999999'));
			} else {
				callback();
			}
		}
		return {
			loading: false,
			dialogVisible: false,
			winHeight: window.innerHeight - 247,
			query: {
				startDate: '',
				endDate: '',
				number: '',
				cardNumber: '',
				cardType: [],
				mode: []
			},
			edit: {
				id: '',
				name: '',
				limit: '',
				money: ''
			},
			rules: {
				limit: [{ required: true, validator: limit, trigger: 'blur' }],
				money: [{ required: true, validator: money, trigger: 'blur' }]
			},
			tableData: null
		}
	},
	created(){
		this.requestRechargeList();
	},
	methods: {
		requestRechargeList(){
			let _this = this;
			_this.loading = true;
			rechargesettingslist().then(res => {
				let { result, resultType } = res;
				_this.loading = false;
				if( resultType == 'SUCCESS' ){
					_this.tableData = result;
				}
			})
		},
		operation(item){
			let _this = this;
			let params = {
				manageId: item.manageId,
				setState: item.setState == '1'?'0':'1'
			}
			let text = item.setState == '1'?'启用后将给本企业下的卡自动充值，确认启用吗？':'禁用后将不能给本企业下的卡自动充值，确认禁用吗？';
			
			if( item.setState == '1' ){
				if( item.autoChargeMoney <= 0 ) {
					this.$notify({
						type: 'error',
						title: '错误',
						duration: 2000,
						message: '请设置自动充值金额后才能启用'
					});
					return ;
				}
			}
			this.$confirm(text, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				rechargelisthandle(params).then(res => {
					let { result, resultType, resultMessage } = res;
					if(resultType == 'SUCCESS'){
						_this.requestRechargeList();
					}
				});
			}).catch(() => {

			});
		},
		editEvent(item){
			this.dialogVisible = true;
			this.edit = {
				id: item.manageId,
				name: item.customerName,
				limit: item.chargeLimit,
				money: item.autoChargeMoney
			}
		},
		closeDialog(formName){
			this.dialogVisible = false;
			this.edit = {
				id: '',
				name: '',
				limit: '',
				money: ''
			}
			this.$refs[formName].resetFields();
		},
		submitDialog(formName){
			let _this = this;
			let reg = /^(0|[1-9][0-9]*)$/gi;
			let params = {
				manageId: _this.edit.id,
				chargeLimit: _this.edit.limit,
				autoChargeMoney: _this.edit.money
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					rechargelisthandle(params).then(res => {
						let { resultType } = res;
						if( resultType == 'SUCCESS' ){
							_this.requestRechargeList();
							_this.dialogVisible = false;

						}
					})
				} else {
					return false;
				}
			});
		}
	}
}
</script>
<style scoped>

.statistics .dialog {
	padding: 30px 70px 30px 50px;
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

</style>
