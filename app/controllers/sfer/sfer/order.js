let Index = require('./index')
let Order = require('../../../models/finance/order')
let Pay = require('../../../models/finance/pay')
let Vder = require('../../../models/scont/vendor')
let Sfer = require('../../../models/user/sfer')
let _ = require('underscore')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let moment = require('moment')

let randID = '5c63ecf72430bf23f7280ba3';
exports.ordersFilter = function(req, res, next) {
	if(req.query && req.query.keyword) {
		req.query.keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	}

	let condition = new Object();
	condition.slipCond = ""; // 分页时用到的其他条件

	// 分页
	let page = 0, entry = 12;
	[condition.entry, condition.page, condition.slipCond] = Filter.slipPage(req, entry, condition.slipCond)
	condition.index = condition.page * condition.entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "order", keyword = "";
	[condition.keytype, condition.keyword, condition.slipCond] = Filter.key(req, keytype, keyword, condition.slipCond)
	
	condition.varNumb = "price";
	condition.symNumb = "$ne";
	condition.condNumb = 'condNumb';

	if(condition.keytype == condition.varNumb) {
		condition.symNumb = "$eq";
		condition.condNumb = parseFloat(condition.keyword);
		condition.keytype = "order";
		condition.keyword = "";
	}

	// 根据状态筛选
	// let condStatus = Object.keys(Conf.stsOrder);
	let condStatus = ['0', '1', '2'];
	[condition.condStatus, condition.slipCond] = Filter.status(req.query.status, condStatus, condition.slipCond);
	if(req.query && req.query.keytype == "sfer"){
		// console.log('sfer')
		condition.keytype = "order";
		condition.keyword = "";
		condition.symPul = "$eq";
		condition.condPul = req.query.keyword;
		sfOrderFindSfers(req, res, next, condition);
	} else if(req.query && req.query.keytype == "vder"){
		condition.keytype = "order";
		condition.keyword = "";
		condition.symPul = "$eq";
		condition.condPul = req.query.keyword;
		sfOrderFindVders(req, res, next, condition);
	} else {
		condition.symPul = '$ne';
		condition.condPul = randID;
		sfOrderFindOrders(req, res, next, condition);
	}
}
sfOrderFindSfers = function(req, res, next, condition) {
	Sfer.findOne({code: condition.condPul}, function(err, sfer) {
		if(err) console.log(err);
		condition.varDB = 'creater';
		condition.symPul = '$eq';
		if(sfer) {
			condition.condPul = sfer._id;
		} else {
			condition.condPul = randID;
		}
		sfOrderFindOrders(req, res, next, condition);
	})
}
sfOrderFindVders = function(req, res, next, condition) {
	Vder.findOne({code: condition.condPul}, function(err, vder) {
		if(err) console.log(err);
		condition.varDB = 'vder';
		condition.symPul = '$eq';
		if(vder) {
			condition.condPul = vder._id;
		} else {
			condition.condPul = randID;
		}
		sfOrderFindOrders(req, res, next, condition);
	})
}
sfOrderFindOrders = function(req, res, next, condition) {
	Order.count({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		[condition.varDB]: {[condition.symPul]: condition.condPul},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'status': condition.condStatus  // 'status': {$in: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);

	Order.find({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		[condition.varDB]: {[condition.symPul]: condition.condPul},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'status': condition.condStatus  // 'status': {[symStatus]: condStatus}
	})
	.skip(condition.index).limit(condition.entry)
	.populate('payAc').populate('payMd').populate('paySa')
	.populate('vder')
	.populate('creater')
	.sort({'status': 1, "createAt": -1})
	.exec(function(err, objects) {
		if(err) console.log(err);
		if(objects){
			// console.log(objects[0])
			let list = new Object()

			list.count = count;
			list.objects = objects;

			list.keytype = req.query.keytype;
			list.keyword = req.query.keyword;

			list.condStatus = condition.condStatus;

			list.currentPage = (condition.page + 1);
			list.entry = condition.entry;
			list.totalPage = Math.ceil(count / condition.entry);

			list.slipCond = condition.slipCond;

			req.body.list = list;
			next();
		} else {
			info = "Option error, Please Contact Manger";
			Index.sfOptionWrong(req, res, info);
		}
	})

	})
}


exports.orders = function(req, res) {
	let list = req.body.list;
	list.title = 'Order List';
	list.url = "/sfOrders";
	list.crSfer = req.session.crSfer;

	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000);
	list.weekday = moment(weekday).format('YYYYMMDD');

	// console.log(list.objects[0])
	res.render('./sfer/sfer/order/list', list)
}


exports.ordersPrint = function(req, res) {
	let objects = req.body.list.objects
	
	let xl = require('excel4node');
	let wb = new xl.Workbook({
		defaultFont: {
			size: 12,
			color: '333333'
		},
		dateFormat: 'yyyy-mm-dd hh:mm:ss'
	});
	
	let ws = wb.addWorksheet('Sheet 1');
	ws.column(1).setWidth(20);
	ws.column(2).setWidth(20);
	ws.column(3).setWidth(20);
	ws.column(4).setWidth(50);
	ws.column(5).setWidth(40);
	ws.column(6).setWidth(20);
	ws.column(7).setWidth(20);
	
	// header
	ws.cell(1,1).string('Code');
	ws.cell(1,2).string('Title');
	ws.cell(1,3).string('Serial');
	ws.cell(1,4).string('Description');
	ws.cell(1,5).string('Note');
	ws.cell(1,6).string('CreateAt');
	ws.cell(1,7).string('FinishAt');

	for(let i=0; i<objects.length; i++){
		let item = objects[i];
		if(item.code) ws.cell((i+2), 1).string(String(item.code));
		if(item.title) ws.cell((i+2), 2).string(String(item.title));
		if(item.order) ws.cell((i+2), 3).string(String(item.order));
		if(item.description) ws.cell((i+2), 4).string(String(item.description));
		if(item.note) ws.cell((i+2), 5).string(String(item.note));
		if(item.createAt) ws.cell((i+2), 6).string(moment(item.createAt).format('MM/DD/YYYY HH:mm'));
		if(item.finishAt) ws.cell((i+2), 7).string(String(item.finishAt));
	}

	wb.write('Order_'+req.session.crSfer.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}




exports.orderAdd =function(req, res) {
	res.render('./sfer/sfer/order/add', {
		title: 'Add Order',
		crSfer : req.session.crSfer,
		// code: code,
		action: "/sfOrderNew",
	})
}




exports.sfOrderNew = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	objBody.status = 0
	objBody.stsOrderLg = 0
	objBody.order = objBody.order.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.brand = objBody.brand.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.price = parseFloat(objBody.price)
	if(isNaN(objBody.price)){
		info = "订单价格设置错误";
		Index.sfOptionWrong(req, res, info);
	} else {
		objBody.updateAt = objBody.createAt = Date.now();
		objBody.updater = objBody.creater = req.session.crSfer._id;

		let _object = new Order(objBody)
		sfAddPayFunc(objBody, _object)
		if(objBody.taxType == 0) {
			Vder.findOne({_id: objBody.vder}, function(err, vder) {
				if(err) console.log(err);
				if(vder) {
					vder.taxFree -= objBody.price;
					vder.save(function(err, vderSave) {
						if(err) console.log(err);
					})
				}
			})
		}
		_object.save(function(err, objSave) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/sfOrder/'+objSave._id)
			}
		})
	}
}

sfAddPayFunc = function(objBody, object) {
	let objAc = new Object();
	objAc.price = parseFloat(objBody.acPrice);
	objAc.code = "ac";
	objAc.status = 0;
	objAc.order =  object._id;
	objAc.vder =  object.vder;
	let _payAc = new Pay(objAc);
	_payAc.save(function(err, acSave) {});
	object.payAc = _payAc._id;

	let saPrice = parseFloat(objBody.saPrice)
	if(!isNaN(saPrice) && saPrice > 0) {
		let objSa = new Object();
		objSa.price = saPrice;
		objSa.code = "sa";
		objSa.status = 0;

		objSa.order = object._id
		objSa.vder = object.vder
		let _paySa = new Pay(objSa);
		_paySa.save(function(err, saSave) {});

		object.paySa = _paySa._id;
	}
}



exports.orderFilter = function(req, res, next) {
	let id = req.params.id;
	Order.findOne({_id: id})
	.populate('payAc').populate('payMd').populate('paySa')
	.populate('vder')
	.populate('creater').populate('updater')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此订单已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			req.body.object = object
			next()
		}
	})
}
exports.order = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	let list = req.body.list;
	let now = new Date();
	today = moment(now).format('YYYYMMDD');
	let weekday = new Date(now.getTime() + 7*24*60*60*1000)
	weekday = moment(weekday).format('YYYYMMDD');

	res.render('./sfer/sfer/order/detail', {
		title: 'sfOrder Infomation',
		crSfer : req.session.crSfer,
		object: objBody,
		today: today,
		weekday: weekday
	})
}
exports.orderUp = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	if(objBody.status == 0) {
		let list = req.body.list;
		let now = new Date();
		today = moment(now).format('YYYYMMDD');
		let weekday = new Date(now.getTime() + 7*24*60*60*1000)
		weekday = moment(weekday).format('YYYYMMDD');

		res.render('./sfer/sfer/order/update', {
			title: 'sfOrder Update',
			action: '/sfOrderUpd',
			crSfer : req.session.crSfer,
			object: objBody,
			today: today,
			weekday: weekday
		})
	} else {
		info = "订单信息已经确认，请联系财务部"
		Index.sfOptionWrong(req, res, info)
	}
}

exports.orderFixed = function(req, res) {
	let objBody = req.body.object
	Order.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此订单已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			if(objBody.price) objBody.price = parseFloat(objBody.price)
			if(objBody.order) objBody.order = objBody.order.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

			let _object = _.extend(object, objBody)
			_object.save(function(err, objSave) {
				if(err) {
					console.log(err);
					info = "sfOrderUpd order save error, Please Contact Manager";
					Index.sfOptionWrong(req, res, info);
				} else {
					res.redirect('/sfOrder/'+objSave._id)
				}
			})	
		}
	})
}
exports.orderUpd = function(req, res) {
	let objBody = req.body.object
	Order.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此订单已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			objBody.price = parseFloat(objBody.price)
			if(isNaN(parseFloat(objBody.price)) || isNaN(parseFloat(objBody.acPrice)) || isNaN(parseFloat(objBody.saPrice))){
				info = "订单价格设置错误";
				Index.sfOptionWrong(req, res, info);
			} else {
				objBody.order = objBody.order.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
				objBody.brand = objBody.brand.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
				objBody.updateAt = Date.now();
				objBody.updater = req.session.crSfer._id;

				let _object = _.extend(object, objBody)
				sfUpdPayFunc(req, res, objBody, _object)
				
			}
		}
	})
}

sfUpdPayFunc = function(req, res, objBody, object) {
	Pay.findOne({_id: object.payAc}, function(err, payAc) {
		if(err) {
			console.log(err);
			info = "sfOrderUpd payAc find id error, Please Contact Manager";
			Index.sfOptionWrong(req, res, info);
		} else if(!payAc) {
			info = "sfOrderUpd payAc find error, Please Contact Manager";
			Index.sfOptionWrong(req, res, info);
		} else {
			payAc.price = parseFloat(objBody.acPrice);
			payAc.save(function(err, payAcSave) {
				if(err) console.log(err);
				Pay.findOne({_id: object.paySa}, function(err, paySa) {
					if(err) {
						console.log(err);
						info = "sfOrderUpd paySa find id error, Please Contact Manager";
						Index.sfOptionWrong(req, res, info);
					} else if(!paySa) {
						info = "sfOrderUpd paySa find error, Please Contact Manager";
						Index.sfOptionWrong(req, res, info);
					} else {
						paySa.price = parseFloat(objBody.saPrice);
						paySa.save(function(err, paySaSave) {
							if(err) console.log(err);
							object.save(function(err, objSave) {
								if(err) {
									console.log(err);
									info = "sfOrderUpd order save error, Please Contact Manager";
									Index.sfOptionWrong(req, res, info);
								} else {
									res.redirect('/sfOrder/'+objSave._id)
								}
							})
						})
					}
				})
			})
		}
	})
}

exports.orderDel = function(req, res) {
	let objBody = req.body.object;
	if(objBody.status == 0) {
		payAc = objBody.payAc
		payMd = objBody.payMd
		paySa = objBody.paySa
		if(payAc) Pay.remove({_id: payAc}, function(err, rmPayAc) {});
		if(payMd) Pay.remove({_id: payMd}, function(err, rmPayMd) {});
		if(paySa) Pay.remove({_id: paySa}, function(err, rmPaySa) {});
		Order.remove({_id: objBody._id}, function(err, sfOrderRm) {
			if(err) console.log(err);
			res.redirect('/sfOrders')
		})
	} else {
		info = "订单信息已经确认，不能删除，请联系财务部"
		Index.sfOptionWrong(req, res, info)
	}
}