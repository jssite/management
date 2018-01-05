<template>
	<div class="pages">
        <div class="" style="float: left;">
            当前显示{{startTotal}}到{{endTotal}}条，共{{total}}条记录，每页显示
            <el-select @change="pageSizeChage" v-model="currSize" class="page-size">
                <el-option
                v-for="item in pageSizes"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
            
        </div>
		<ul class="page">
            <li>
                <a :class="" @click="homePage()">首页</a>
            </li>
			<li>
				<a :class="" @click="prvePage()">上一页</a>
			</li>
			<li v-for="index in pages" :class="{ active: current == index }">
				<a @click="currentChange(index)">{{ index < 1 ? "..." : index }}</a>
			</li>
			<li>
				<a :class="" @click="nextPage()">下一页</a>
			</li>
            <li>
                <a :class="" @click="lastPage()">末页</a>
            </li>
            <li>
                <span>跳转至</span>
                <input type="text" @input="setval" v-model="to" class="toPage">
                <span>页</span>
                <button type="button" class="button" @click="jumpPage()">跳转</button>
            </li>
		</ul>
	</div>
</template>
<script>
	export default {
		data(){
			return {
                currSize: this.pageSize,
                current: this.currentPage,
                to: ''
			}
		},
		props: {
			total: {
                type: Number,
                default: 0
            },
            currentPage: {
                type: Number,
                default: 1
            },
            pageSize: {
                type: Number,
                default: 10
            },
            pageSizes: {
                type: Array,
                default: [10,20,30,40,50]
            }
            
		},
        watch: {
            pageSize(val){
                this.currSize = val;
            },
            currentPage(val){
                this.current = val;
            }
        },
        computed: {
            startTotal(){
                return  (this.current - 1) * this.currSize + 1;
            },
            endTotal() {
                var number = this.current * this.currSize
                if( number >= this.total ) {
                    number = this.total;
                }
                return number;
            },
            ceilPages(){
                return Math.ceil(this.total/this.currSize);
            },
        	pages() {
                var left = 1
                var right = this.ceilPages
                var pagesArr = []
                if (this.ceilPages >= 11) {
                    if (this.current > 5 && this.current < this.ceilPages - 4) {
                        left = this.current - 5
                        right = this.current + 4
                    } else {
                        if (this.current <= 5) {
                            left = 1
                            right = 10
                        } else {
                            right = this.ceilPages
                            left = this.ceilPages - 9
                        }
                    }
                }
                while (left <= right) {
                    pagesArr.push(left)
                    left++
                }
                if (pagesArr[0] > 1) {
                    pagesArr[0] = 1;
                    pagesArr[1] = -1;
                }
                if (pagesArr[pagesArr.length - 1] < this.ceilPages) {
                    pagesArr[pagesArr.length - 1] = this.ceilPages;
                    pagesArr[pagesArr.length - 2] = 0;
                }
                return pagesArr
            },
        	setButtonClass(isNextButton) {
                if ( isNextButton ) {
                    return this.current >= this.total ? "disabled" : ""
                }
                else {
                    return this.current <= 1 ? "disabled" : ""
                }
            }
        },
        methods: {
            currentChange(data) {
                if (data < 1) return;
                if (data != this.current) {
                    this.current = data
                    this.$emit('current-change', data)
                }
            },
            nextPage() {
                if( this.current >= this.ceilPages ) {
                    return ;
                }
                this.currentChange(this.current + 1);
            },
            prvePage() {
                if ( this.current <= 1 ) {
                    return;
                }
                this.currentChange(this.current - 1);
            },
            homePage() {
                this.currentChange(1);
            },
            lastPage() {
                this.currentChange(this.ceilPages)
                this.to = '';
            },
            jumpPage(){
                if(this.to == ''){
                    return '';
                }
                var init = parseInt(this.to);
                if( init <= 0 ) {
                    init = 1;
                    this.to = '1';
                }
                if( init > this.ceilPages ) {
                    init = this.ceilPages;
                    this.to = this.ceilPages;
                }
                this.to = '';
                this.currentChange(init);
            },
            pageSizeChage(){
                this.current = 1;
                this.$emit('sizes-change', this.currSize);
            },
            setval(){
                var re = /^\d{0,}$/gi;
                if( !re.test(this.to) ){
                    this.to = '';
                }
                
            }
        }
	}
</script>
<style scoped>
.pages {
    height: 45px;
    padding: 0 20px;
    background: #f9fafc;
    line-height: 45px;
    color: #888;
    font-size: 12px;

}
.pages .page {
    float: right;
    color: #888888;
}
.pages .page li {
    display: inline-block;
}

.pages .page a {
    padding: 0 5px;
	text-decoration: none;
	position: relative;
	color: #888;
	cursor: pointer;
    border: #f9fafc 1px solid;
}

.pages .page a:hover {
	color: #337ab7;
}

.pages .page .active a {
	color: #fff;
	cursor: default;
	color: #5b83fa;
    border-radius: 10px;
    border-color: #5b83fa;
}

.pages i {
	font-style: normal;
	color: #d44950;
	margin: 0px 4px;
	font-size: 12px;
}
.pages .toPage {
    width: 30px;
    height: 20px;
    display: inline-block;
    vertical-align: top;
    border: #eaedf6 1px solid;
    margin: 12px 5px 0;
    text-align: center;
    line-height: 20px;
}
.pages .toPage:focus {
    border-color: #5b83fa;
}
.pages .page-size {
    width: 65px;
}
.pages .button {
    width: 45px;
    height: 22px;
    margin: 12px 0 0 10px;
    vertical-align: top;
    border-radius: 30px;
    background: #5b83fa;
    line-height: 22px;
    font-size: 12px;
}
</style>