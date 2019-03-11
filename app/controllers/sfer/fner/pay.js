let Index = require('./index')
let Pay = require('../../../models/finance/pay')
let Order = require('../../../models/finance/order')
let Vder = require('../../../models/scont/vendor')
let _ = require('underscore')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let moment = require('moment')

let randID = '5c63ecf72430bf23f7280ba3';
exports.paysFilter = function(req, res, next) {
	if(req.query && req.query.keyword) {
		req.query.keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	}

	let condition = new Object();
	condition.slipCond = ""; // 分页时用到的其他条件

	// 分页
	let page = 0, entry = 10;
	[condition.entry, condition.page, condition.slipCond] = Filter.slipPage(req, entry, condition.slipCond)
	condition.index = condition.page * condition.entry;

	// 条件判断   ----------------
	// 查找关键字
	condition.keytype = "code";
	condition.keyword = "";
	if(req.query.keyword) {
		condition.keytype = req.query.keytype;
		condition.slipCond += "&keytype="+condition.keytype;
		condition.keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '');
		condition.slipCond += "&keyword="+condition.keyword;
	}
	
	condition.varNumb = "price";
	condition.symNumb = "$ne";
	condition.condNumb = 'condNumb';

	if(condition.keytype == condition.varNumb) {
		condition.symNumb = "$eq";
		condition.condNumb = parseFloat(condition.keyword);
		condition.keytype = "code";
		condition.keyword = "";
	}

	// 根据创建时间筛选
	let today = new Date();
	let begin = today.setHours(0, 0, 0, 0);
	condition.symPaidS = "$ne"; condition.condPaidS = begin + 24*60*60*1000;
	condition.symPaidF = "$ne"; condition.condPaidF = begin + 24*60*60*1000;
	if(req.query.paidS) {
		condition.slipCond += "&paidS="+req.query.paidS;

		condition.symPaidS = "$gte";
		condition.condPaidS = new Date(req.query.paidS).setHours(0,0,0,0);
	}
	if(req.query.paidF) {
		condition.slipCond += "&paidF="+req.query.paidF;

		condition.symPaidF = "$lt";
		condition.condPaidF = new Date(req.query.paidF).setHours(0,0,0,0) + 24*60*60*1000;
	}

	condition.symCrtS = "$ne"; condition.condCrtS = begin + 24*60*60*1000;
	condition.symCrtF = "$ne"; condition.condCrtF = begin + 24*60*60*1000;
	if(req.query.crtS) {
		condition.slipCond += "&crtS="+req.query.crtS;

		condition.symCrtS = "$gte";
		condition.condCrtS = new Date(req.query.crtS).setHours(0,0,0,0);
	}
	if(req.query.crtF) {
		condition.slipCond += "&crtF="+req.query.crtF;

		condition.symCrtF = "$lt";
		condition.condCrtF = new Date(req.query.crtF).setHours(0,0,0,0) + 24*60*60*1000;
	}

	// let condMethod = Object.keys(Conf.payMethod);
	let condMethod = -1;
	[condition.symMethod, condition.condMethod, condition.slipCond] = Filter.method(req.query.method, condMethod, condition.slipCond);
	// 根据状态筛选
	let condStatus = 0;
	[condition.condStatus, condition.slipCond] = Filter.status(req.query.status, condStatus, condition.slipCond);



	if(req.query && req.query.keytype == "vder"){			// 如果是查找供应商 则先进入供应商数据库
		condition.keytype = "code";
		condition.symPul = "$eq";
		condition.keyword = "";
		condition.condPul = req.query.keyword;
		fnPayFindVder(req, res, next, condition);
	} 
	else if(req.query && req.query.keytype == "order"){		//如果查找订单号，则先进入供应商 数据库
		condition.keytype = "code";
		condition.keyword = "";
		condition.symPul = "$eq";
		condition.varPul = 'order'
		condition.condPul = req.query.keyword;
		fnPayFindOrders(req, res, next, condition);
	}
	else {
		condition.varPul = 'order'
		condition.symPul = '$ne';
		condition.condPul = randID;
		fnPayFindPays(req, res, next, condition);
	}
}
fnPayFindVder = function(req, res, next, condition) {
	Vder.findOne({code: condition.condPul}, function(err, vder) {
		if(err) console.log(err);
		condition.varPul = 'vder'
		condition.symPul = '$eq';
		if(vder) {
			condition.condPul = vder._id;
		} else {
			condition.condPul = randID;
		}
		fnPayFindOrders(req, res, next, condition);
	})
}
fnPayFindOrders = function(req, res, next, condition) {
	// 因为order.order不是order的唯一标识符 所以不能只查找一个
	Order.find({[condition.varPul]: condition.condPul}, function(err, orders) {
		if(err) console.log(err);
		condition.varPul = 'order'
		if(orders && orders.length > 0) {
			condition.symPul = '$in';
			condition.condPul = orders;
		} else {
			condition.symPul = '$eq';
			condition.condPul = randID;
		}
		fnPayFindPays(req, res, next, condition);
	})
}
fnPayFindPays = function(req, res, next, condition) {
	Pay.count({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		'order': {[condition.symPul]: condition.condPul},
		'paidAt': {[condition.symPaidS]: condition.condPaidS, [condition.symPaidF]: condition.condPaidF},
		'createAt': {[condition.symCrtS]: condition.condCrtS, [condition.symCrtF]: condition.condCrtF},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'method': {[condition.symMethod]: condition.condMethod},
		'status': condition.condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Pay.find({
			[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
			'order': {[condition.symPul]: condition.condPul},
			'paidAt': {[condition.symPaidS]: condition.condPaidS, [condition.symPaidF]: condition.condPaidF},
			'createAt': {[condition.symCrtS]: condition.condCrtS, [condition.symCrtF]: condition.condCrtF},
			[condition.keytype]: new RegExp(condition.keyword + '.*'),
			'method': {[condition.symMethod]: condition.condMethod},
			'status': condition.condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(condition.index).limit(condition.entry)
		.populate('vder')
		.populate({path: 'order', populate: {path: 'vder'} } )
		.sort({"status": 1, "paidAt": 1})
		.exec(function(err, objects) {
			if(err) console.log(err);
			if(objects){
				// console.log(objects[0])
				let list = new Object()

				list.count = count;
				list.objects = objects;

				list.keytype = req.query.keytype;
				list.keyword = req.query.keyword;

				list.paidS = req.query.paidS;
				list.paidF = req.query.paidF;
				list.crtS = req.query.crtS;
				list.crtF = req.query.crtF;

				list.condStatus = condition.condStatus;
				list.condMethod = condition.condMethod;


				list.currentPage = (condition.page + 1);
				list.entry = condition.entry;
				list.totalPage = Math.ceil(count / condition.entry);

				list.slipCond = condition.slipCond;

				req.body.list = list;
				next();
			} else {
				info = "Option error, Please Contact Manger"
				Index.fnOptionWrong(req, res, info)
			}
		})
	})
}

exports.pays = function(req, res) {
	let list = req.body.list;
	list.title = 'Pay List';
	list.url = "/fnPays";
	list.crSfer = req.session.crSfer;

	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000)
	list.weekday = moment(weekday).format('YYYYMMDD');

	res.render('./sfer/fner/pay/list', list)
}


exports.paysPrint = function(req, res) {
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

	wb.write('Pay_'+req.session.crSfer.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}








exports.payFilter = function(req, res, next) {
	let id = req.params.id;
	Pay.findOne({_id: id})
	.populate({path: 'order', populate: {path: 'vder'} } )
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.fnOptionWrong(req, res, info)
		} else {
			let list = new Object();

			list.object = object;
			list.order = new Object();
			if(object.order) list.order = object.order;
			list.vder = new Object();
			if(list.order.vder) list.vder = list.order.vder;
			list.crSfer = req.session.crSfer;

			let now = new Date();
			list.today = moment(now).format('YYYYMMDD');
			let weekday = new Date(now.getTime() + 7*24*60*60*1000)
			list.weekday = moment(weekday).format('YYYYMMDD');

			req.body.list = list
			next()
		}
	})
}
exports.pay = function(req, res) {
	let list = req.body.list

	list.title = "fnPay Infomation";

	res.render('./sfer/fner/pay/detail', list)
}
exports.payUp = function(req, res) {
	let list = req.body.list;
	list.title = "fnPay Update";
	list.action = "/fnPayUpd";
	res.render('./sfer/fner/pay/update', list)
}



exports.payUpd = function(req, res) {
	let objBody = req.body.object
	if(objBody.price) objBody.price = parseFloat(objBody.price)
	// console.log(objBody.createAt)
	Pay.findOne({_id: objBody._id})
	.populate('order')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "更新付款信息时，没有找到这个付款信息: Please contact Manager";
			Index.fnOptionWrong(req, res, info);
		} else {

			// 付款后，订单状态相应改变
			if(object.status != objBody.status && objBody.status == 2) {
				let order = object.order;
				if(object.code == 'ac') order.status = 2;
				else if(object.code == 'sa') order.status = 3;
				order.save(function(err, ordSave) {
					if(err) console.log(err);
				})
			}

			let _object = _.extend(object, objBody);
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/fnPay/'+object._id);
			});	
		}
	})
}





exports.payDel = function(req, res) {
	let objBody = req.body.object;
	Pay.remove({_id: objBody._id}, function(err, fnPayRm) {
		if(err) console.log(err);
		res.redirect('/fnPays')
	})
}







exports.payStatus = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Pay.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object && object.order){
			fnPayChangeOrderStatus(object.order);
			object.status = parseInt(newStatus)
			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "已经更改"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看, 再次操作不成功，可能因为此付款的订单信息被删除。请联系管理员"});
		}
	})
}

fnPayChangeOrderStatus = function(orderId) {
	Order.findOne({_id: orderId})
	.populate('payAc')
	.populate('payMd')
	.populate('paySa')
	.exec(function(err, order) {
		if(err) console.log(err);
		if(order) {
			let flag = 0;
			if(order.payAc && order.payAc.status != 0) {
				flag += 1
			}
			if(order.payMd) {
				if(order.payMd.status != 0) {
					flag += 2	
				}
			} else {
				flag += 2
			}
			if(order.paySa && order.paySa.status != 0) {
				flag += 4
			}

			let status = order.status
			if(flag == 0) {
				status = 1;
			}
			else if(flag == 7) {
				status = 3
			}
			else{
				status = 2;
			}
			if(order.status != status) {
				order.status = status;
				order.save(function(err, orderSave) {
					if(err) console.log(err);
				})
			}
		}
	})
}