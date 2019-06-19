let Index = require('./index')
let Order = require('../../../models/finance/order')
let Vder = require('../../../models/scont/vendor')
let Sfer = require('../../../models/user/sfer')
let _ = require('underscore')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let moment = require('moment')

let randID = '5c63ecf72430bf23f7280ba3';
exports.lgOrdersFilter = function(req, res, next) {
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
	let condStatus = ['2', '3'];
	[condition.condStatus, condition.slipCond] = Filter.status(req.query.status, condStatus, condition.slipCond);

	condition.condStatuslg = ['0', '1', '2'];
	if(req.query.statuslg) condition.condStatuslg = req.query.statuslg;
	if(condition.condStatuslg instanceof Array){
		for(i in condition.condStatuslg){
			condition.slipCond += "&statuslg="+condition.condStatuslg[i];
		}
	} else {
		condition.condStatuslg = [condition.condStatuslg];
		condition.slipCond += "&statuslg="+condition.condStatuslg;
	}
	if(req.query && req.query.keytype == "sfer"){
		// console.log('lger')
		condition.keytype = "order";
		condition.keyword = "";
		condition.symPul = "$eq";
		condition.condPul = req.query.keyword;
		lgOrderFindSfers(req, res, next, condition);
	} else if(req.query && req.query.keytype == "vder"){
		condition.keytype = "order";
		condition.keyword = "";
		condition.symPul = "$eq";
		condition.condPul = req.query.keyword;
		lgOrderFindVders(req, res, next, condition);
	} else {
		condition.symPul = '$ne';
		condition.condPul = randID;
		lgOrderFindOrders(req, res, next, condition);
	}
}
lgOrderFindSfers = function(req, res, next, condition) {
	Sfer.findOne({code: condition.condPul}, function(err, lger) {
		if(err) console.log(err);
		condition.varDB = 'creater';
		condition.symPul = '$eq';
		if(lger) {
			condition.condPul = lger._id;
		} else {
			condition.condPul = randID;
		}
		lgOrderFindOrders(req, res, next, condition);
	})
}
lgOrderFindVders = function(req, res, next, condition) {
	Vder.findOne({code: condition.condPul}, function(err, vder) {
		if(err) console.log(err);
		condition.varDB = 'vder';
		condition.symPul = '$eq';
		if(vder) {
			condition.condPul = vder._id;
		} else {
			condition.condPul = randID;
		}
		lgOrderFindOrders(req, res, next, condition);
	})
}
lgOrderFindOrders = function(req, res, next, condition) {
	Order.count({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		[condition.varDB]: {[condition.symPul]: condition.condPul},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'status': condition.condStatus,  // 'status': {$in: condStatus}
		'stsOrderLg': condition.condStatuslg,
	})
	.exec(function(err, count) {
		if(err) console.log(err);

	Order.find({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		[condition.varDB]: {[condition.symPul]: condition.condPul},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'status': condition.condStatus,  // 'status': {[symStatus]: condStatus}
		'stsOrderLg': condition.condStatuslg,
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
			list.condStatuslg = condition.condStatuslg;

			list.currentPage = (condition.page + 1);
			list.entry = condition.entry;
			list.totalPage = Math.ceil(count / condition.entry);

			list.slipCond = condition.slipCond;

			req.body.list = list;
			next();
		} else {
			info = "Option error, Please Contact Manger";
			Index.lgOptionWrong(req, res, info);
		}
	})

	})
}


exports.lgOrders = function(req, res) {
	let list = req.body.list;
	list.title = 'Order List';
	list.url = "/lgOrders";
	list.crSfer = req.session.crSfer;

	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000);
	list.weekday = moment(weekday).format('YYYYMMDD');

	// console.log(list.objects[0])
	res.render('./sfer/lger/order/list', list)
}


exports.lgOrdersPrint = function(req, res) {
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




exports.lgOrderFilter = function(req, res, next) {
	let id = req.params.id;
	Order.findOne({_id: id})
	.populate('payAc').populate('payMd').populate('paySa')
	.populate('vder')
	.populate('creater').populate('updater')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此订单已经被删除"
			Index.lgOptionWrong(req, res, info)
		} else {
			req.body.object = object
			next()
		}
	})
}
exports.lgOrder = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	let list = req.body.list;
	let now = new Date();
	today = moment(now).format('YYYYMMDD');
	let weekday = new Date(now.getTime() + 7*24*60*60*1000)
	weekday = moment(weekday).format('YYYYMMDD');

	res.render('./sfer/lger/order/detail', {
		title: 'lgOrder Infomation',
		crSfer : req.session.crSfer,
		object: objBody,
		today: today,
		weekday: weekday
	})
}
exports.lgOrderUp = function(req, res) {
	let objBody = req.body.object
	let list = req.body.list;
	let now = new Date();
	today = moment(now).format('YYYYMMDD');
	let weekday = new Date(now.getTime() + 7*24*60*60*1000)
	weekday = moment(weekday).format('YYYYMMDD');

	res.render('./sfer/lger/order/update', {
		title: 'lgOrder Update',
		action: '/lgOrderUpd',
		crSfer : req.session.crSfer,
		object: objBody,
		today: today,
		weekday: weekday
	})
}

exports.lgOrderUpd = function(req, res) {
	let objBody = req.body.object
	Order.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此订单已经被删除"
			Index.lgOptionWrong(req, res, info)
		} else {
			objBody.volumeLg = parseFloat(objBody.volumeLg)
			objBody.gwlg = parseInt(objBody.gwlg)
			objBody.nwlg = parseInt(objBody.nwlg)
			objBody.packlg = parseInt(objBody.packlg)
			if(isNaN(objBody.volumeLg) || isNaN(objBody.gwlg) || isNaN(objBody.nwlg) || isNaN(objBody.packlg)){
				info = "数值设置错误";
				Index.lgOptionWrong(req, res, info);
			} else {
				let _object = _.extend(object, objBody)
				_object.save(function(err, objSave) {
					if(err) {
						console.log(err);
						info = "lgOrderUpd order save error, Please Contact Manager";
						Index.lgOptionWrong(req, res, info);
					} else {
						res.redirect('/lgOrder/'+objSave._id)
					}
				})
				
			}
		}
	})
}


exports.lgOrderStslg = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Order.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.stsOrderLg = parseInt(newStatus)
			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "已经更改"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"})
		}
	})
}


exports.orderNull = function(req, res) {
	
	Order.find({'stsOrderLg': null}, function(err, orders){
		if(err) console.log(err);
		let len = orders.length;
		console.log(len)
		for(i=0 ; i< len; i++) {
			orders[i].stsOrderLg = 0;
			orders[i].save(function(err, orderSave) {
				console.log(err);
			})
		}
		res.redirect('/')
	})
}