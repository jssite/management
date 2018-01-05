import axios from 'axios'
import config from './config'
import base from './api'


/**
 * 登陆
 */
export const login = params => {
	return axios.post(`${base}/login/validate`, params, config).then(
		res => res);
};
export const logout = params => {
	return axios.post(`${base}/login/logout`, params, config).then(
		res => res);
};

/**
 * 首页
 */
export const indexinfo = params => {
	return axios.post(`${base}/cardchargehistory/gethomepageinfo`, params, config).then(
		res => res);
}

/**
 * 运营管理 - 卡信息管理 - 列表
 */
export const cardmanage = params => {
	return axios.post(`${base}/customercardmanage/getlist`, params, config).then(
		res => res);
}

/**
 * 运营管理 - 卡信息管理 - 新建卡信息
 */
export const addormodcard = params => {
	return axios.post(`${base}/customercardmanage/addormodcard?Submit_token=` + sessionStorage.getItem('token'), params, config).then(
		res => res)
}

/**
 * 运营管理 - 卡信息管理 - 卡品牌
 */
export const getbrandlist = params => {
	return axios.post(`${base}/customercardmanage/getbrandlist`, params, config).then(
		res => res)
}

/**
 * 运营管理 - 卡信息管理 - 禁用/启用
 */
export const setcardsetstate = params => {
	return axios.post(`${base}/customercardmanage/setcardsetstate?Submit_token=` + sessionStorage.getItem('token'), params, config).then(
		res => res)
}

/**
 * 运营管理 - 卡信息管理 - 导出
 */
export const cardexport = `${base}/customercardmanage/getexport`;

/**
 * 运营管理 - 卡信息管理 - 打印
 */
export const cardprint = params => {
	return axios.post(`${base}/customercardmanage/getprintlist`, params, config).then(
		res => res)
}

/**
 * 运营管理 - 客户账户充值 - 列表
 */
export const accountrecharge = params => {
	return axios.post(`${base}/customeraccountcharge/getpagelist`, params, config).then(
		res => res)
}

/**
 * 运营管理 - 客户账户充值 - 统计金额
 */
export const accountrechargemoney = params => {
	return axios.post(`${base}/customeraccountcharge/getsumchargemoney`, params, config).then(
		res => res)
}

/**
 * 运营管理 - 客户账户充值 - 导出
 */
export const accountrechargeexport = `${base}/customeraccountcharge/getexport`;

/**
 * 运营管理 - 客户账户充值 - 打印
 */
export const userrechargeprint = params => {
	return axios.post(`${base}/customeraccountcharge/getprint`, params, config).then(
		res => res)
}

/**
 * 统计查询 - 自动充值设置 - 列表
 */
export const rechargesettingslist = params => {
	return axios.post(`${base}/autochargemanage/getautochargemanageinfo`, params, config).then(
		res => res)
}

/**
 * 统计查询 - 自动充值设置 - 编辑
 */
export const rechargesettingsedit = params => {
	return axios.post(`${base}/autochargemanage/modautochargemanage?Submit_token=` + sessionStorage.getItem('token'), params, config).then(
		res => res)
}

/**
 * 统计查询 - 自动充值设置 - 禁用/启用
 */
export const rechargelisthandle = params => {
	return axios.post(`${base}/autochargemanage/setautochargesetstate?Submit_token=` + sessionStorage.getItem('token'), params, config).then(
		res => res)
}

/**
 * 统计查询 - 自动充值查询 - 列表
 */
export const rechargelist = params => {
	return axios.post(`${base}/cardchargehistory/getlist`, params, config).then(
		res => res)
}

/**
 * 统计查询 - 自动充值查询 - 导出
 */
export const rechargeexport = `${base}/cardchargehistory/getexport`;

/**
 * 统计查询 - 自动充值查询 - 打印
 */
export const rechargeprint = params => {
	return axios.post(`${base}/cardchargehistory/getprintlist`, params, config).then(
		res => res)
}

/**
 * 统计查询 - 消费数据查询 - 列表
 */
export const cardconsumecountList = params => {
	return axios.post(`${base}/cardconsumecount/getlist`, params, config).then(
		res => res)
}

/**
 * 统计查询 - 消费数据查询 - 导出
 */
export const cardconsumecountExport = `${base}/cardconsumecount/getexport`;

export const rechargegetsum = params => {
	return axios.post(`${base}/cardchargehistory/getsum`, params, config).then(
		res => res)
}

/**
 * 系统设置 - 修改密码
 */
export const modpwd = params => {
	return axios.post(`${base}/operatorcustomer/modpwd?Submit_token=` + sessionStorage.getItem('token'), params, config).then(
		res => res)
}