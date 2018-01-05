<template>
	<section class="operate">
		<transition name="fade">
			<router-view></router-view>
		</transition>
		<header class="query">
			<el-row>
				<el-col :span="24">
					<div class="form-item" style="margin-right: 50px;">
						<label class="form-item-label">　卡号</label>
						<div class="form-item-inner">
							<el-input v-model="listQuery.number"></el-input>
						</div>
					</div>
					<div class="form-item">
						<label class="form-item-label">　车牌号</label>
						<div class="form-item-inner">
							<el-input v-model="listQuery.autoNumber"></el-input>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<div class="form-item" style="margin-right: 50px;">
						<label class="form-item-label">卡状态</label>
						<div class="form-item-inner">
							<el-checkbox-group v-model="listQuery.cardType">
								<el-checkbox label="1">正常</el-checkbox>
								<el-checkbox label="2">挂失</el-checkbox>
								<el-checkbox label="3">已补卡</el-checkbox>
								<el-checkbox label="4">已注销</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
					<div class="form-item">
						<label class="form-item-label">使用状态</label>
						<div class="form-item-inner">
							<el-checkbox-group v-model="listQuery.usingType">
								<el-checkbox label="0">正常</el-checkbox>
								<el-checkbox label="1">禁用</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
				</el-col>
				<el-col :span="24" class="tr" style="padding-right: 25px;">
					<button type="button" name="button" class="button" @click="searchEvent">查询</button>
				</el-col>
			</el-row>
		</header>
		<article class="content">
			<div class="toolbox">
				<ul class="boxs">
					<li class="add" @click="addCard">新建</li>
					<li class="export" @click="exportEvent">导出</li>
					<li class="print" @click="printEvent">打印</li>
				</ul>
			</div>
			<el-table :data="tableData" v-loading="loading" :row-style="{color: '#888',fontSize: '13px'}">
				<el-table-column prop="cardNo" width="180" label="卡号"></el-table-column>
				<el-table-column prop="brandName" label="卡品牌"></el-table-column>
				<el-table-column prop="plateNo" label="车牌号"></el-table-column>
				<el-table-column prop="bizTypeStr" label="业务模式"></el-table-column>
				<el-table-column prop="cardStateStr" label="卡状态"></el-table-column>
				<el-table-column prop="accountBalance" label="待圈存金额"></el-table-column>
				<el-table-column prop="cardBalance" label="卡余额"></el-table-column>
				<el-table-column prop="setStateStr" label="使用状态"></el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="info" size="mini" @click="editEvent(scope.row)">编辑</el-button>
						<el-button v-if="scope.row.setState == '1'" type="info" size="mini" @click="operation(scope.row.cardId,scope.row.setState)">启用</el-button>
						<el-button v-if="scope.row.setState == '0'" type="danger" size="mini" @click="operation(scope.row.cardId,scope.row.setState)">禁用</el-button>
					</template>
				</el-table-column>
			</el-table>
			<v-pagination v-if="pages.total" :current-page="pages.current" :page-sizes="[10,20,30,40,50]" :page-size='pages.sizes' :total="pages.total" @sizes-change="watchSizes" @current-change="watchPage"></v-pagination>
		</article>
		<el-dialog :title="dialogTxt" :close-on-click-modal="false" :visible.sync="dialogVisible" @close="closeDialog('rule')">
			<div class="dialog">
				<el-form :model="cardQuery" :rules="rules" ref="rule" label-width="86px">
					<el-form-item label="卡号" prop="cardNo">
						<el-input type="text" :disabled="isDisable" v-model="cardQuery.cardNo"></el-input>
					</el-form-item>
					<el-form-item label="卡品牌" prop="brandId">
						<el-select :disabled="isDisable" v-model="cardQuery.brandId" placeholder="请选择卡品牌" style="width: 100%;" >
							<el-option v-for="item in selectList" :key="item.key" :label="item.value" :value="item.key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="车牌号" prop="plateNo">
						<el-input type="text" v-model="cardQuery.plateNo"></el-input>
					</el-form-item>
				</el-form>
				<div class="api-message"></div>
			</div>
			<template slot="footer">
				<button type="button" class="button close" @click="closeDialog('rule')">取消</button>
				<button type="button" class="button" @click="submitDialog('rule')">保存</button>
			</template>
		</el-dialog>
	</section>
</template>
<script>
	import { cardmanage, addormodcard, getbrandlist, setcardsetstate, cardexport, cardprint } from '../api';
	import pagination from '../components/page/pagetion'
	import exportExl from '../comm/exportExl'
	import print from '../comm/print'
	import * as utils from '../utils'
	export default {
		data(){
			return {
				loading: true,
				dialogVisible: false,
				listQuery: {
					number: '',
					autoNumber: '',
					cardType: [],
					usingType: []
				},
				cardQuery: {
					cardNo: '',
					plateNo: '',
					brandId: '',
					cardId: ''
				},
				pages: {
					total: 0,
					current: 1,
					sizes: 10
				},
				selectList: null,
				tableData: null,
				isDisable: false,
				rules: {
					cardNo: [
					{ required: true, message: '必填项', trigger: 'blur' },
					{ max: 19, message: '超过字数限制,至多输入19个字符', trigger: 'blur' }
					],
					plateNo: [{ required: true, message: '必填项', trigger: 'change' }],
					brandId: [{ required: true, message: '必填项', trigger: 'blur' }]
				}
				
			}
		},
		components: {
            'v-pagination': pagination
        },
		created() {
			this.requestCardList();
			this.requestBrandList();
		},
		computed: {
			dialogTxt(){
				if( this.isDisable ){
					return '编辑卡信息'
				}else {
					return '新建卡信息'
				}
			}
		},
		methods: {
			requestCardList() {
				let _this = this;
				let params = {
					"cardNo": _this.listQuery.number,
					"plateNo": _this.listQuery.autoNumber,
					"cardStateStr": utils.join(_this.listQuery.cardType),
					"setStateStr": utils.join(_this.listQuery.usingType),
					"pageNo": _this.pages.current,
					"pageSize": _this.pages.sizes
				}
				_this.loading = true;
				cardmanage(params).then((res) => {
					_this.loading = false;
					let { result, resultType} = res;
					if(resultType == 'SUCCESS') {
						_this.tableData = result.list;
						_this.pages.total = parseInt(result.iTotalDisplayRecords);
						if(!result.list.length && _this.pages.total > 0){
							_this.pages.current = 1;
							_this.requestCardList();
						}
					}
				})
			},
			requestBrandList(){
				let _this = this;
				getbrandlist().then(res => {
					let { result, resultType } = res;
					if(resultType == 'SUCCESS') {
						_this.selectList = result;
					}
				})
			},
			submitDialog(formName) {
				let _this = this;
				let params = {
					cardNo: _this.cardQuery.cardNo,
					plateNo: _this.cardQuery.plateNo,
					brandId: _this.cardQuery.brandId,
					cardId: _this.cardQuery.cardId
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						addormodcard(params).then(res => {
							let { result, resultType, resultMessage } = res;
							let txt = this.isDisable?'卡信息修改成功':'卡信息创建成功';
							_this.flag = true;
							if(resultType == 'SUCCESS'){
								_this.$notify({
									type: 'success',
									title: '成功',
									duration: 5000,
									message: txt
								});
								_this.dialogVisible = false;
								_this.requestCardList();
								_this.cardQuery = {
									cardNo: '',
									plateNo: '',
									brandId: '',
									cardId: ''
								}
							}
						})
					} else {
						return false;
					}
				});
			},
			operation(id, state){
				let _this = this;
				let params = {
					cardId: id,
					setState: state == '1'?'0':'1'
				}
				let text = state == '1'?'启用后将自动给该卡充值，确认启用吗？':'禁用后将不能给该卡自动和手动充值，确认禁用吗？'
				this.$confirm(text, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					setcardsetstate(params).then(res => {
						let { result, resultType, resultMessage } = res;
						if(resultType == 'SUCCESS'){
							_this.requestCardList();
						}
					});
				}).catch(() => {

				});
			},
			editEvent(item){
				this.dialogVisible = true;
				this.isDisable = true;
				this.cardQuery = {
					cardNo: item.cardNo,
					plateNo: item.plateNo,
					brandId: item.brandId,
					cardId: item.cardId
				}
			},
			searchEvent(){
				this.pages.current = 1;
				this.requestCardList();
			},
			closeDialog(formName) {
				this.dialogVisible = false;
				this.cardQuery = {
					cardNo: '',
					plateNo: '',
					brandId: '',
					cardId: ''
				}
				this.$refs[formName].resetFields();
			},
			addCard(){
				this.$emit('newcart', newcartinfo)
			},
			watchPage(index) {
				this.pages.current = index;
				this.requestCardList();
			},
			watchSizes(size){
				this.pages.current = 1;
				this.pages.sizes = size;
				this.requestCardList();
			},
			printEvent(){
				let _this = this;
				let params = {
					cardNo: _this.listQuery.number,
					plateNo: _this.listQuery.autoNumber,
					cardStateStr: utils.join(_this.listQuery.cardType),
					setStateStr: utils.join(_this.listQuery.usingType)
				}
				cardprint(params).then(res => {
					let { result, resultType } = res;
					if( resultType == 'SUCCESS' ){
						print({
							header: '',
							headerStyle: '',
							properties: [
								{
									title: '品牌',
									query: 'cardNo'
								},
								{
									title: '卡品牌',
									query: 'brandName'
								},
								{
									title: '车牌号',
									query: 'plateNo'
								},
								{
									title: '业务模式',
									query: 'bizTypeStr'
								},
								{
									title: '卡状态',
									query: 'cardStateStr'
								},
								{
									title: '待圈存金额',
									query: 'accountBalance'
								},
								{
									title: '卡余额',
									query: 'cardBalance'
								},
								{
									title: '使用状态',
									query: 'setStateStr'
								}
							],
							printdata: result
						})
					}
				});

			},
			exportEvent(){
				let query = {
					"cardNo": this.listQuery.number,
					"plateNo": this.listQuery.autoNumber,
					"cardStateStr": utils.join(this.listQuery.cardType),
					"setStateStr": utils.join(this.listQuery.usingType)
				}
				exportExl(query, cardexport)
			}		
		}
	}
</script>
<style scoped>
.operate .content {
	padding-bottom: 5px;
}
.operate .query {
	padding: 25px 0 25px 40px;
	margin-bottom: 25px;
}
.operate .form-item-inner {
	min-width: 300px;
}
.el-checkbox-group {
	padding-top: 8px;
}
.operate .dialog {
	padding: 30px 55px 30px 50px;
	background: #f9fafc;
}

</style>
