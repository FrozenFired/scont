let Index = require('./index')
let Order = require('../../models/finance/order')
let Pay = require('../../models/finance/pay')
let _ = require('underscore')

let Filter = require('../../middle/filter');

let Conf = require('../../../confile/conf.js')
let moment = require('moment')

// 因前面没有做，pay与vder链接。 所以批量赋值为该付款订单的vder
exports.payRoop = function(req, res, next) {
	let crVder = req.session.crVder;

	Pay.find()
	.populate('order')
	.exec(function(err, pays) {
		if(err) console.log(err);
		let len = pays.length;
		for(i=0; i<len; i++){
			pays[i].vder = pays[i].order.vder;
			pays[i].save(function(err, paySave) {
				if(err) console.log(err);
			})
		}
		res.redirect('/')
	})
}


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
	condition.symPaidS = "$ne"; condition.condPaidS = 1061672800000;
	condition.symPaidF = "$ne"; condition.condPaidF = 1061672800000;
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

	condition.symCrtS = "$ne"; condition.condCrtS = 1061672800000;
	condition.symCrtF = "$ne"; condition.condCrtF = 1061672800000;
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
	let condStatus = ['1', '2'];
	[condition.condStatus, condition.slipCond] = Filter.status(req.query.status, condStatus, condition.slipCond);

	if(req.query && req.query.keytype == "order"){
		condition.keytype = "code"; // PAY FIND QUERRY
		condition.keyword = "";		// PAY FIND WORD
		condition.symPul = "$eq";
		condition.varPul = 'order'
		condition.condPul = req.query.keyword;
		vdPayFindOrders(req, res, next, condition);
	}
	else {
		condition.varPul = 'order'
		condition.symPul = '$ne';
		condition.condPul = randID;
		vdPayFindPays(req, res, next, condition);
	}
}
vdPayFindOrders = function(req, res, next, condition) {
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
		vdPayFindPays(req, res, next, condition);
	})
}
vdPayFindPays = function(req, res, next, condition) {
	let crVder = req.session.crVder;
	Pay.count({
		'vder': crVder._id,
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		'order': {[condition.symPul]: condition.condPul},
		'paidAt': {[condition.symPaidS]: condition.condPaidS, [condition.symPaidF]: condition.condPaidF},
		'createAt': {[condition.symCrtS]: condition.condCrtS, [condition.symCrtF]: condition.condCrtF},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'method': {[condition.symMethod]: condition.condMethod},
		'status': condition.condStatus,  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Pay.find({
			'vder': crVder._id,
			[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
			'order': {[condition.symPul]: condition.condPul},
			'paidAt': {[condition.symPaidS]: condition.condPaidS, [condition.symPaidF]: condition.condPaidF},
			'createAt': {[condition.symCrtS]: condition.condCrtS, [condition.symCrtF]: condition.condCrtF},
			[condition.keytype]: new RegExp(condition.keyword + '.*'),
			'method': {[condition.symMethod]: condition.condMethod},
			'status': condition.condStatus,  // 'status': {[symStatus]: condStatus}
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
				info = "Option error, Please Contact Manger";
				Index.vdOptionWrong(req, res, info);
			}
		})
	})
}

exports.payList = function(req, res) {
	let list = req.body.list;
	list.title = 'Pay List';
	list.url = "/payList";
	list.crSfer = req.session.crSfer;

	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000)
	list.weekday = moment(weekday).format('YYYYMMDD');

	res.render('./vder/pay/list', list)
}