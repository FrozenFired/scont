let Index = require('../index')
let Pay = require('../../../models/finance/pay')
let Order = require('../../../models/finance/order')
let Vder = require('../../../models/scont/vendor')
let _ = require('underscore')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let moment = require('moment')

let randID = '5c63ecf72430bf23f7280ba3';
exports.fnPaysFilter = function(req, res, next) {
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
	let keytype = "code", keyword = "";
	[condition.keytype, condition.keyword, condition.slipCond] = Filter.key(req, keytype, keyword, condition.slipCond)
	
	condition.varNumb = "price";
	condition.symNumb = "$ne";
	condition.condNumb = 'condNumb';

	if(condition.keytype == condition.varNumb) {
		condition.symNumb = "$eq";
		condition.condNumb = parseFloat(condition.keyword);
		condition.keytype = "code";
		condition.keyword = "";
	}

	// let condMethod = Object.keys(Conf.payMethod);
	let condMethod = -1;
	[condition.symMethod, condition.condMethod, condition.slipCond] = Filter.method(req.query.method, condMethod, condition.slipCond);
	// 根据状态筛选
	let condStatus = 0;
	[condition.condStatus, condition.slipCond] = Filter.status(req.query.status, condStatus, condition.slipCond);

	if(req.query && req.query.keytype == "vder"){
		condition.keytype = "code";
		condition.keyword = "";
		condition.symPul = "$eq";
		condition.condPul = req.query.keyword;
		fnPayFindVder(req, res, next, condition);
	} 
	else if(req.query && req.query.keytype == "order"){
		condition.keytype = "code";
		condition.keyword = "";
		condition.varPul = 'order'
		condition.symPul = "$eq";
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
		[condition.varPul]: {[condition.symPul]: condition.condPul},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'method': {[condition.symMethod]: condition.condMethod},
		'status': condition.condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Pay.find({
			[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
			'order': {[condition.symPul]: condition.condPul},
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
				Index.sfOptionWrong(req, res, info)
			}
		})
	})
}

exports.fnPayList = function(req, res) {
	let list = req.body.list;
	list.title = 'Pay List';
	list.url = "/fnPayList";
	list.crFner = req.session.crFner;

	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000)
	list.weekday = moment(weekday).format('YYYYMMDD');

	res.render('./sfer/fner/pay/list', list)
}


exports.fnPayListPrint = function(req, res) {
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




exports.fnPayAdd =function(req, res) {
	res.render('./sfer/fner/pay/add', {
		title: 'Add Pay',
		crFner : req.session.crFner,
		// code: code,
		action: "/fnAddPay",
	})
}




exports.fnAddPay = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	objBody.status = 0
	objBody.price = parseFloat(objBody.price)
	objBody.ac = parseFloat(objBody.ac)
	objBody.sa = parseFloat(objBody.sa)
	objBody.updateAt = objBody.createAt = Date.now();
	objBody.updater = objBody.creater = req.session.crFner._id;

	let _object = new Pay(objBody)
	_object.save(function(err, objSave) {
		if(err) console.log(err)
		// res.redirect('/fnPayDetail/'+objSave._id)
		res.redirect('/fnPayList')
	})
}





exports.fnPayFilter = function(req, res, next) {
	let id = req.params.id;
	Pay.findOne({_id: id})
	.populate({path: 'order', populate: {path: 'vder'} } )
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			let list = new Object();

			list.object = object;
			list.order = new Object();
			if(object.order) list.order = object.order;
			list.vder = new Object();
			if(list.order.vder) list.vder = list.order.vder;
			list.crFner = req.session.crFner;

			let now = new Date();
			list.today = moment(now).format('YYYYMMDD');
			let weekday = new Date(now.getTime() + 7*24*60*60*1000)
			list.weekday = moment(weekday).format('YYYYMMDD');

			req.body.list = list
			next()
		}
	})
}
exports.fnPayDetail = function(req, res) {
	let list = req.body.list

	list.title = "fnPay Infomation";

	res.render('./sfer/fner/pay/detail', list)
}
exports.fnPayUpdate = function(req, res) {
	let list = req.body.list;
	list.title = "fnPay Update";
	list.action = "/fnUpdatePay";
	res.render('./sfer/fner/pay/update', list)
}



exports.fnUpdatePay = function(req, res) {
	let objBody = req.body.object
	if(objBody.price) objBody.price = parseFloat(objBody.price)
	// console.log(objBody.createAt)
	Pay.findOne({_id: objBody._id})
	.populate('order')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "更新付款信息时，没有找到这个付款信息: Please contact Manager";
			Index.sfOptionWrong(req, res, info);
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
				res.redirect('/fnOrderDetail/'+object.order._id);
			});	
		}
	})
}





exports.fnPayDel = function(req, res) {
	let objBody = req.body.object;
	Pay.remove({_id: objBody._id}, function(err, fnPayRm) {
		if(err) console.log(err);
		res.redirect('/fnPayList')
	})
}







exports.fnPayStatus = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Pay.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.status = parseInt(newStatus)
			// 更新付款状态时，自动更新订单状态。 方案：
			// 当ac状态变为已付状态时 订单自动变为部分付款，
			// 当sa状态变更为已付状态时 订单自动变为全部付款。
			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "已经更改"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"});
		}
	})
}