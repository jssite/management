import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Login = r => require.ensure([], () => r(require('@/pages/login.vue')), 'login')
const Home = r => require.ensure([], () => r(require('@/pages/home.vue')), 'home')
const Index = r => require.ensure([], () => r(require('@/pages/index.vue')), 'home')
const customercardmanage = r => require.ensure([], () => r(require('@/pages/customercardmanage.vue')), 'operate')
const customercardmanagelist = r => require.ensure([], () => r(require('@/pages/customercardmanagelist.vue')), 'operate')
const customernewcard = r => require.ensure([], () => r(require('@/pages/customernewcard.vue')), 'operate')
const customereditcard = r => require.ensure([], () => r(require('@/pages/customereditcard.vue')), 'operate')
const customeraccountcharge = r => require.ensure([], () => r(require('@/pages/customeraccountcharge.vue')), 'operate')
const autochargemanage = r => require.ensure([], () => r(require('@/pages/autochargemanage.vue')), 'operate')
const cardchargehistory = r => require.ensure([], () => r(require('@/pages/cardchargehistory.vue')), 'statistics')
const cardconsumecount = r => require.ensure([], () => r(require('@/pages/cardconsumecount.vue')), 'statistics')
const operatorcustomer = r => require.ensure([], () => r(require('@/pages/operatorcustomer.vue')), 'user')

const noFount = r => require.ensure([], () => r(require('@/pages/404.vue')), 'system')
const exception = r => require.ensure([], () => r(require('@/pages/exception.vue')), 'system')

const routes = [
	{
		path: '/login',
		name: 'login',
		component: Login
	}, 
	{
		path: '/',
		name: '',
		redirect: '/index',
		component: Home,
		children: [{
			path: '/index',
			component: Index,
			name: '首页'
		}]
	}, 
	{
		path: '/',
		name: '运营管理',
		redirect: '/index',
		component: Home,
		children: [{
			path: '/customercardmanage',
			name: '卡信息管理',
			component: customercardmanage,
			children: [{
				path: '/customercardmanage',
				name: '',
				component: customercardmanagelist
			},
			{
				path: '/customernewcard',
				name: '新建卡信息',
				component: customernewcard
			},
			{
				path: '/customereditcard',
				name: '编辑卡信息',
				component: customereditcard
			}]
		}, 
		{
			path: '/customeraccountcharge',
			name: '客户账户充值',
			component: customeraccountcharge
		}, 
		{
			path: '/autochargemanage',
			name: '自动充值设置',
			component: autochargemanage
		}]
	}, 
	{
		path: '/',
		redirect: '/index',
		name: '统计查询',
		component: Home,
		children: [{
			path: '/cardchargehistory',
			name: '自动充值查询',
			component: cardchargehistory
		},
		{
			path: '/cardconsumecount',
			name: '消费数据查询',
			component: cardconsumecount
		}]
	}, 
	{
		path: '/',
		redirect: '/index',
		name: '系统设置',
		component: Home,
		children: [{
			path: '/operatorcustomer',
			name: '客户账户管理',
			component: operatorcustomer
		}]
	},
	{
		path: '/exception',
		name: '',
		component: exception
	},
	{
		path: '/*',
		name: '',
		component: noFount
	}]

const router = new Router({
	mode: 'history',
	routes
})

router.beforeEach((to, from, next) => {
	let state = JSON.parse(sessionStorage.getItem('login'));
	if (to.path != '/login') {
		if (sessionStorage.getItem('token') && state.loginResult == 'SUCCESS') {
			next()
		} else {
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('login');
			sessionStorage.removeItem('menu');
			next({
				path: '/login'
			})
		}
	} else {
		next()
	}
});

export default router;
