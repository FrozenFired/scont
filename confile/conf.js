let Conf = {
	photoPath: {
		sferAvatar: '/avatar/sfer/',
	},
	home: { homePage: '', option: 'option', brand: 'brandList', scont: 'scontList', vendor: 'vendorList', task: 'taskList' },

	weight: {0: 'general', 1: 'usual', 2: 'often', 3: 'always', 4: 'important'},

	//员工角色
	sfRole: { 
		1: 'Order', 2: 'Contabilita',
		5: 'brand', 10: 'quotation', 15: '中国报价', 20: 'leave',
	},
	vdRole: {0: 'register', 1: 'unregister', 2: 'logout'},
	/* --------------------- payment ---------------------*/
	stsPayment: {0: 'nopaid', 1: 'ac paid', 2 : 'all paid'},

	/* ------------------ task staus ------------------ */
	stsTask:{ 0: 'progress', 1: 'finish'},

	/* --------------------- scont ---------------------*/
	// 品牌分类
	bcate: { 0: 'PROFESSIONISTI', 1: 'ACCESSORI', 2: 'COSTRUZIONE', 3: 'MOBILI'},
	// 厂家类型
	vtype: { 0: 'RIVENDITORE', 1: 'AGENTE', 2: 'PRO.+AGE.', 3: 'PRODUTTORE', 5: 'OTHER'},
	// 品牌状态
	stsBrand: { 0: 'refer', 1: 'common', 2: 'gray'},
	// 厂家状态
	stsVendor: { 0: 'refer', 1: 'common', 2: 'gray'},
	// 折扣状态
	stsScont: { 0: 'refer', 1: 'common', 2: 'green', 3: 'yellow', 4: 'gray', 5: 'deleted'},
	// 折扣原因
	sctCause: { 0: 'NEW', 1:'NEW BRAND', 2: 'addDealer', 3: 'toAgent', 4: 'toProductor', 5: 'fixScont', 6: 'MULTY'},
}

module.exports = Conf