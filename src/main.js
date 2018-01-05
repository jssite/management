require('babel-polyfill')
Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();

import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import axios from '@/http'
import ElementUI from 'element-ui'

import '@/filters'
import 'nprogress/nprogress.css'
import '../theme/index.css'
import '@/fonts/iconfont.css'

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
	router,
	axios,
	render: createElement => createElement(App)
}).$mount('#app')
