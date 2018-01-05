import axios from 'axios'
import NProgress from 'nprogress'
import router from '@/router'
import { Notification } from 'element-ui'
import qs from 'qs'

NProgress.configure({ showSpinner: false });

axios.interceptors.request.use(config => {
	NProgress.start()
	if(config.method  === 'post'){
        config.data = qs.stringify(config.data);
    }
	return config;
}, error => {
	NProgress.done()
	return Promise.reject(error)
})

axios.interceptors.response.use(result => {
	NProgress.done()
	let { resultType, resultMessage, token } = result.data;
	if (token) {
		sessionStorage.setItem('token', token);
	}
	if (resultType == 'FAILED') {
		Notification({
			title: '错误',
			message: resultMessage,
			duration: 2000,
			type: 'error'
		})
	}
	if (resultType == 'EXCEPTION') {
		router.replace({
			path: '/exception',
			query: {
				redirect: router.currentRoute.fullPath
			}
		})
	}
	if (resultType == 'INVALID_TOKEN') {
		Notification({
			title: '警告',
			message: resultMessage,
			type: 'warning'
		});
	}
	if (resultType == 'MULTILOGIN' || resultType == 'UNAUTHENTICATED' || resultType == 'UNAUTHORIZED') {

		sessionStorage.removeItem('token');
		sessionStorage.removeItem('login');
		sessionStorage.removeItem('menu');
		router.replace({
			path: '/login',
			query: {
				redirect: router.currentRoute.fullPath
			}
		})
	}
	return result.data;
}, error => {
	NProgress.done()
	// if (error.response) {
	//        switch (error.response.status) {
	//            case 401:
	//                // store.commit(types.LOGOUT);
	//                // router.replace({
	//                //     path: 'login',
	//                //     query: {redirect: router.currentRoute.fullPath}
	//                // })
	//        }
	//    }
	// Notification.error({
	// 	title:'错误',
	// 	message: '加载失败',
	// 	duration: 2000
	// })
	return Promise.reject(error)
})

export default axios
