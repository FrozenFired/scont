var Conf = {
	photoPath: {
		sferAvatar: '/avatar/sfer/',
	},
	home: { homePage: '', option: 'option', brand: 'brandList', scont: 'scontList', vendor: 'vendorList', task: 'taskList' },
	//员工角色
	sfRole: { 5: 'brand', 10: 'quotation', 15: '中国报价', 20: 'leave'},

	/* ------------------ task staus ------------------ */
	stsTask:{ 0: 'progress', 1: 'finish'},

	/* --------------------- scont ---------------------*/
	// 品牌分类
	bcate: { 0: 'PROFESSIONISTI', 1: 'ACCESSORI', 2: 'COSTRUZIONE', 3: 'MOBILI'},
	// 厂家类型
	vtype: { 0: 'RIVENDITORE', 1: 'AGENTE', 2: 'PRO.+AGE.', 3: 'PRODUTTORE', 4: 'OTHER'},
	// 品牌状态
	stsBrand: { 0: 'refer', 1: 'common', 2: 'gray'},
	// 厂家状态
	stsVendor: { 0: 'refer', 1: 'common', 2: 'gray'},
	// 折扣状态
	stsScont: { 0: 'refer', 1: 'common', 2: 'green', 3: 'yellow', 4: 'gray', 5: 'deleted'},
	// 折扣原因
	sctCause: { 0: 'NEW', 1:'NEW BRAND', 2: 'addDealer', 3: 'toAgent', 4: 'toProductor', 5: 'fixScont', 6: 'fixOther'},
}

module.exports = Conf