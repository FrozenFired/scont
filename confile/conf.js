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
	/* --------------------- order ---------------------*/
	stsOrder: {0: 'refer', 1: 'checked', 2: 'partPaid', 3: 'allPaid', 4: 'History'},
	stsOrderVder: {1: 'noPaid', 2: 'partPaid', 3: 'all paid', 4: 'History'},
	stsOrderBg: {0: 'bg-success', 1: 'bg-default', 2: 'bg-default', 3: 'bg-default', 4: 'bg-secondary'},
	taxType: {0: 'D.I.', 1: 'Tre', 2: 'Undefine'},
	payMethod: {0: 'Certification', 1: 'Assegno', 2: 'Bonifico', 3: 'Credit Card'},
	stsPay: {0: 'unpaid', 1: 'writed', 2: 'paid'},
	stsPayBg: {0: 'bg-default', 1: 'bg-info', 2: 'bg-warning'},

	/* ------------------ task staus ------------------ */
	stsTask:{ 0: 'progress', 1: 'finish'},

	/* --------------------- scont ---------------------*/
	// 品牌分类
	bcate: { 0: 'PROFESSIONISTI', 1: 'ACCESSORI', 2: 'COSTRUZIONE', 3: 'MOBILI'},
	// 厂家类型
	vtype: { 0: 'RESELLER', 1: 'AGENT', 2: 'PRO.+AGE.', 3: 'PRODUCER', 5: 'OTHER'},
	// 品牌状态
	stsBrand: { 0: 'refer', 1: 'common', 2: 'gray'},
	// 厂家状态
	stsVendor: { 0: 'refer', 1: 'common', 2: 'gray'},
	// 折扣状态
	stsScont: { 0: 'refer', 1: 'common', 2: 'green', 3: 'yellow', 4: 'gray', 5: 'deleted'},
	// 折扣原因
	sctCause: { 0: 'NEW', 1:'NEW BRAND', 2: 'NEW SUPPLIER', 3: 'addDealer', 4: 'toAgent', 5: 'toProductor', 6: 'MULTY', 7: 'fixScont'},
}

module.exports = Conf