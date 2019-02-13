let Index = require('../index')
let Pay = require('../../../models/finance/pay')
let Order = require('../../../models/finance/order')
let Vder = require('../../../models/scont/vendor')
let _ = require('underscore')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let moment = require('moment')

exports.fnPaysFilter = function(req, res, next) {
	let title = 'Pay List';
	let url = "/fnPayList";
	
	// 分页
	let slipCond = ""; // 分页时用到的其他条件

	let page = 0, entry = 10;
	[entry, page, slipCond] = Filter.slipPage(req, entry, slipCond)
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "code", keyword = "";
	[keytype, keyword, slipCond] = Filter.key(req, keytype, keyword, slipCond)
	// 根据状态筛选
	// let condStatus = Object.keys(Conf.stsPay);
	let condStatus = 0;
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);

	// let condMethod = Object.keys(Conf.payMethod);
	let condMethod = -1;
	[symMethod, condMethod, slipCond] = Filter.method(req.query.method, condMethod, slipCond);
	// console.log(condMethod)
	Pay.count({
		[keytype]: new RegExp(keyword + '.*'),
		'method': {[symMethod]: condMethod},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Pay.find({
			[keytype]: new RegExp(keyword + '.*'),
			'method': {[symMethod]: condMethod},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index).limit(entry)
		.populate('vder')
		.populate({path: 'order', populate: {path: 'vder'} } )
		.sort({"status": 1, "paidAt": 1})
		.exec(function(err, objects) {
			if(err) console.log(err);
			if(objects){
				// console.log(objects[0])
				let list = new Object()
				list.title = title;
				list.url = url;
				list.crFner = req.session.crFner;

				list.count = count;
				list.objects = objects;

				list.keytype = req.query.keytype;
				list.keyword = req.query.keyword;

				list.condStatus = condStatus;
				list.condMethod = condMethod;


				list.currentPage = (page + 1);
				list.entry = entry;
				list.totalPage = Math.ceil(count / entry);

				list.slipCond = slipCond;

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