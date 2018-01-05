<template>
	<section class="operate">
		<article class="content" :style="{height: winHeight + 'px'}">
			<div class="dialog">
				<el-form :model="cardQuery" :rules="rules" ref="rule" label-width="86px">
					<el-form-item label="卡号" prop="cardNo">
						<el-input type="text" :disabled="true" v-model="cardQuery.cardNo"></el-input>
					</el-form-item>
					<el-form-item label="卡品牌" prop="brandId">
						<el-select :disabled="true" v-model="cardQuery.brandId" placeholder="请选择卡品牌" style="width: 100%;" >
							<el-option v-for="item in selectList" :key="item.key" :label="item.value" :value="item.key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="车牌号" prop="plateNo">
						<el-input type="text" v-model="cardQuery.plateNo"></el-input>
					</el-form-item>
				</el-form>
				<div class="sumbit-area">
					<button type="button" class="button close" @click="closeDialog('rule')">取消</button>
					<button type="button" class="button" @click="submitDialog('rule')">保存</button>
				</div>
				
			</div>
			
		</article>
	</section>
</template>
<script>
	import { addormodcard, getbrandlist } from '../api';
	export default {
		data(){
			return {
				winHeight: window.innerHeight - 247,
				cardQuery: JSON.parse(sessionStorage.getItem('cardinfo')),
				selectList: null,
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
		created() {
			this.requestBrandList();
		},
		methods: {
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
							_this.flag = true;
							if(resultType == 'SUCCESS'){
								_this.$notify({
									type: 'success',
									title: '成功',
									duration: 1000,
									message: '卡信息修改成功'
								});
								setTimeout(function(){
									_this.$router.go(-1)
								},1000)
							}
						})
					} else {
						return false;
					}
				});
			},
			closeDialog(formName) {
				this.$router.go(-1)
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
	width: 650px;
	margin: auto;
	padding: 50px 0 0;
}
.operate .sumbit-area {
	padding-top: 50px;
	margin: 0 0 0 90px;
}

</style>
