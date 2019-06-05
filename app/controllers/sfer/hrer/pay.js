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

	let condition = new Object();
	condition.slipCond = ""; // 分页时用到的其他条件

	// 分页
	let page = 0, entry = 12;
	[condition.entry, condition.page, condition.slipCond] = Filter.slipPage(req, entry, condition.slipCond)
	condition.index = condition.page * condition.entry;

	// 条件判断   ----------------
	// 查找关键字
	condition.keytype = "code";
	condition.keyword = "";
	if(req.query.keyword) {
		req.query.keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '');
		if(req.query.keytype == "code") {
			req.query.keyword = req.query.keyword.toLowerCase();
		} else {
			req.query.keyword = req.query.keyword.toUpperCase();
		}
		condition.keytype = req.query.keytype;
		condition.slipCond += "&keytype="+condition.keytype;
		condition.keyword = req.query.keyword;
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

	// 根据状态筛选
	let condStatus = ['1', '2'];
	[condition.condStatus, condition.slipCond] = Filter.status(req.query.status, condStatus, condition.slipCond);

	// 根据状态筛选
	condition.condMailed = 0;
	condition.symMailed = '$eq';
	if(req.query.mailed || req.query.mailed == 0) {
		condition.condMailed = req.query.mailed;
		condition.condMailed2 = req.query.mailed;
		condition.slipCond += "&mailed="+req.query.mailed;
	}
	if(condition.condMailed == 0) {
		condition.condMailed2 = null
	}
	if(condition.condMailed == 2) {
		condition.symMailed = '$ne';
	}

	if(req.query && req.query.keytype == "vder"){			// 如果是查找供应商 则先进入供应商数据库
		condition.keytype = "code"; // PAY FIND QUERRY
		condition.symPul = "$eq";	// PAY FIND WORD
		condition.keyword = "";
		condition.condPul = req.query.keyword;
		hrPayFindVder(req, res, next, condition);
	} 
	else if(req.query && req.query.keytype == "order"){		//如果查找订单号，则先进入供应商 数据库
		condition.keytype = "code"; // PAY FIND QUERRY
		condition.keyword = "";		// PAY FIND WORD
		condition.symPul = "$eq";
		condition.varPul = 'order'
		condition.condPul = req.query.keyword;
		hrPayFindOrders(req, res, next, condition);
	}
	else if(req.query && req.query.keytype == "staff"){		//如果查找员工，则先进入供应商 数据库
		condition.keytype = "code"; // PAY FIND QUERRY
		condition.keyword = "";		// PAY FIND WORD
		condition.symPul = "$eq";
		condition.varPul = 'staff'
		condition.condPul = req.query.keyword;
		hrPayFindOrders(req, res, next, condition);
	}
	else {
		condition.varPul = 'order'
		condition.symPul = '$ne';
		condition.condPul = randID;
		hrPayFindPays(req, res, next, condition);
	}
}
hrPayFindVder = function(req, res, next, condition) {
	Vder.findOne({code: condition.condPul}, function(err, vder) {
		if(err) console.log(err);
		condition.varPul = 'vder'
		condition.symPul = '$eq';
		if(vder) {
			condition.condPul = vder._id;
		} else {
			condition.condPul = randID;
		}
		hrPayFindOrders(req, res, next, condition);
	})
}
hrPayFindOrders = function(req, res, next, condition) {
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
		hrPayFindPays(req, res, next, condition);
	})
}
hrPayFindPays = function(req, res, next, condition) {
	Pay.count({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		'order': {[condition.symPul]: condition.condPul},
		'paidAt': {[condition.symPaidS]: condition.condPaidS, [condition.symPaidF]: condition.condPaidF},
		'createAt': {[condition.symCrtS]: condition.condCrtS, [condition.symCrtF]: condition.condCrtF},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'status': condition.condStatus,  // 'status': {[symStatus]: condStatus}
		$or: [ {'mailed': condition.condMailed}, {'mailed':condition.condMailed2} ]
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Pay.find({
			[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
			'order': {[condition.symPul]: condition.condPul},
			'paidAt': {[condition.symPaidS]: condition.condPaidS, [condition.symPaidF]: condition.condPaidF},
			'createAt': {[condition.symCrtS]: condition.condCrtS, [condition.symCrtF]: condition.condCrtF},
			[condition.keytype]: new RegExp(condition.keyword + '.*'),
			'status': condition.condStatus,  // 'status': {[symStatus]: condStatus}
			$or: [ 
				{ 'mailed': {[condition.symMailed]: condition.condMailed}},
				{'mailed':  {[condition.symMailed]: condition.condMailed2}} 
			]
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
				list.condMailed = condition.condMailed;

				list.currentPage = (condition.page + 1);
				list.entry = condition.entry;
				list.totalPage = Math.ceil(count / condition.entry);

				list.slipCond = condition.slipCond;

				req.body.list = list;
				next();
			} else {
				info = "Option error, Please Contact Manger";
				Index.hrOptionWrong(req, res, info);
			}
		})
	})
}

exports.pays = function(req, res) {
	let list = req.body.list;
	list.title = 'Pay List';
	list.url = "/hrPays";
	list.crSfer = req.session.crSfer;

	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000)
	list.weekday = moment(weekday).format('YYYYMMDD');

	res.render('./sfer/hrer/pay/list', list)
}




exports.payFilter = function(req, res, next) {
	let id = req.params.id;
	Pay.findOne({_id: id})
	.populate({path: 'order', populate: {path: 'vder'} } )
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.hrOptionWrong(req, res, info)
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

	list.title = "hrPay Infomation";

	res.render('./sfer/hrer/pay/detail', list)
}


exports.payMailed = function(req, res) {
	let id = req.query.id
	let newMailed = req.query.newStatus
	Pay.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.mailed = parseInt(newMailed)
			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "已经更改"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"});
		}
	})
}