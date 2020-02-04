let Conf = {
	photoPath: {
		sferAvatar: '/avatar/sfer/',
		carPhoto: '/car/',
		payPhoto: '/pay/'
	},

	weight: {0: 'general', 1: 'usual', 2: 'often', 3: 'always', 4: 'important'},

	fattura: {0: 'AC INVOICE', 1: 'EXPORT INVOICE', 9: 'OTHER'},

	//员工角色
	sfPart: { 0: '职员', 1: '主管'},
	// 员工部门
	sfRole: { 
		1: 'Order', 2: 'Contabilita', 3: 'Logistic', 4: 'Reception',
		5: 'Brand',  6: 'HR', 10: 'Quotation', 11: 'Market',
		15: '中国报价', 16: '中国品牌', 20: 'leave',
	},
	vdRole: {0: 'register', 1: 'unregister', 2: 'logout'},
	/* --------------------- ord --------------------- */
	stsOrd: {
		10: 'qtRfOrder',	// 报价部 填写数据提交		报价部可修改
		15: 'odCkOrder',	// 订单部 检查通过			订单部，可点击确认，可修改价格， 供应商可见
		20: 'vdUpFattura',	// 供应商确认并上传发票		从此价格不可修改
		25: 'fnCkFattura', 	// 财务确认发票的正确性		确认后发票不可更改		根据供应商规定的天数生成付款日期
		30: 'fnPay',		// 财务付款				并打电话通知供应商
		35: 'vdPacklist', 	// 供应商确认收款，请发packinglist		并通知物流
		40: 'lgObt', 		// 物流取货
		45: 'vdFinish'		// 供应商点击完成，进入历史数据
	},
	stsOrdBg: {
		10: 'bg-success', 
		15: 'bg-default', 20: 'bg-default', 25: 'bg-default', 
		30: 'bg-default', 35: 'bg-default', 40: 'bg-default', 
		45: 'bg-secondary'
	},
	/* --------------------- order --------------------- */
	stsOrder: {0: 'refer', 1: 'checked', 2: 'partPaid', 3: 'allPaid', 4: 'History'},
	stsOrderLg: {0: 'daPagare', 1: 'daRitirare', 2: 'daSpedire', 3: 'spedito'},
	stsOrderVder: {1: 'noPaid', 2: 'partPaid', 3: 'all paid', 4: 'History'},
	stsOrderBg: {0: 'bg-success', 1: 'bg-default', 2: 'bg-default', 3: 'bg-default', 4: 'bg-secondary'},
	taxType: {0: 'D.I.', 1: 'Tre', 2: 'Undefine'},
	payMethod: {0: 'Certification', 1: 'Assegno', 2: 'Bonifico', 3: 'Credit Card'},
	stsPay: {0: 'unpaid', 1: 'writed', 2: 'paid'},
	stsPayBg: {0: 'bg-default', 1: 'bg-info', 2: 'bg-warning'},
	payMialed: {0: 'Not', 1: 'Mailed'},

	/* ------------------ task staus ------------------ */
	stsTask:{ 0: 'progress', 1: 'finish'},
	stsAbsence:{ 1: 'Apply', 1: 'suport', 3: 'allow', 4: 'back', 5: 'confirm'},

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