let Conf = {
	photoPath: {
		sferAvatar: '/avatar/sfer/',
	},

	weight: {0: 'general', 1: 'usual', 2: 'often', 3: 'always', 4: 'important'},

	//员工角色
	sfRole: { 
		1: 'Order', 2: 'Contabilita', 3: 'Logistic',
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
	payMialed: {0: 'Not', 1: 'Mailed'},

	/* ------------------ task staus ------------------ */
	stsTask:{ 0: 'progress', 1: 'finish'},

	/* --------------------- scont ---------------------*/
	// 品牌分类
	bcate: { 0: 'PROFESSIONISTI', 1: 'ACCESSORI', 2: 'COSTRUZIONE', 3: 'MOBILI', 4: 'ALTRO'},
	bcateCn: { 0: '高端定制', 1: '饰品', 2: '建材', 3: '家具', 4: '其他'},
	// 厂家类型
	vtype: { 0: 'RIVENDITORE', 1: 'AGENTE', 2: 'PRO.+AGE.', 3: 'PRODUTTORE', 5: 'OTHER'},
	vtypeCn: { 0: '经销商', 1: '代理商', 2: '厂商+代理.', 3: '厂家直销', 5: '其他'},
	// 品牌状态
	stsBrand: { 0: 'refer', 1: 'common', 2: 'gray'},
	// 厂家状态
	stsVendor: { 0: 'refer', 1: 'common', 2: 'gray'},
	// 折扣状态
	stsScont: { 0: 'refer', 1: 'common', 2: 'green', 3: 'yellow', 4: 'gray', 5: 'deleted'},
	// 折扣原因
	sctCause: { 1:'NEW BRAND', 2: 'NEW DEALER', 3: 'RESELLER', 4: "AGENT", 5: "PRODUCER", 6: 'MULTY', 7: 'UPDATE DISCOUNT'},
}

module.exports = Conf