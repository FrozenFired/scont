let Index = require('../index')
let Order = require('../../../models/finance/order')
let Pay = require('../../../models/finance/pay')
let Vder = require('../../../models/scont/vendor')
let _ = require('underscore')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let moment = require('moment')

exports.odOrdersFilter = function(req, res, next) {
	let title = 'Order List';
	let url = "/odOrderList";
	
	// 分页
	let slipCond = ""; // 分页时用到的其他条件

	let page = 0, entry = 10;
	[entry, page, slipCond] = Filter.slipPage(req, entry, slipCond)
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "order", keyword = "";
	[keytype, keyword, slipCond] = Filter.key(req, keytype, keyword, slipCond)
	// 根据状态筛选
	// let condStatus = Object.keys(Conf.stsOrder);
	let condStatus = ['0', '1', '2'];
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);


	Order.count({
		[keytype]: new RegExp(keyword + '.*'),
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Order.find({
			[keytype]: new RegExp(keyword + '.*'),
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index).limit(entry)
		.populate('payAc').populate('payMd').populate('paySa')
		.populate('vder')
		.sort({"createAt": -1})
		.exec(function(err, objects) {
			if(err) console.log(err);
			if(objects){
				// console.log(objects[0])
				let list = new Object()
				list.title = title;
				list.url = url;
				list.crOder = req.session.crOder;

				list.count = count;
				list.objects = objects;

				list.keytype = req.query.keytype;
				list.keyword = req.query.keyword;

				list.condStatus = condStatus;

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

exports.odOrderList = function(req, res) {
	let list = req.body.list;
	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000);
	list.weekday = moment(weekday).format('YYYYMMDD');

	// console.log(list.objects[0])
	res.render('./sfer/oder/order/list', list)
}


exports.odOrderListPrint = function(req, res) {
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




exports.odOrderAdd =function(req, res) {
	res.render('./sfer/oder/order/add', {
		title: 'Add Order',
		crOder : req.session.crOder,
		// code: code,
		action: "/odAddOrder",
	})
}




exports.odAddOrder = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	objBody.status = 0
	objBody.price = parseFloat(objBody.price)
	if(isNaN(objBody.price)){
		info = "订单价格设置错误";
		Index.sfOptionWrong(req, res, info);
	} else {
		objBody.updateAt = objBody.createAt = Date.now();
		objBody.updater = objBody.creater = req.session.crSfer._id;

		let _object = new Order(objBody)
		odAddPayFunc(objBody, _object)
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
				res.redirect('/odOrderDetail/'+objSave._id)
			}
		})
	}
}

odAddPayFunc = function(objBody, _object) {
	let objAc = new Object();
	objAc.price = parseFloat(objBody.acPrice);
	objAc.code = "ac";
	objAc.status = 0;

	let objSa = new Object();
	objSa.price = parseFloat(objBody.saPrice);
	objSa.code = "sa";
	objSa.status = 0;

	objAc.order = objSa.order = _object._id;
	let _payAc = new Pay(objAc);
	_payAc.save(function(err, acSave) {});
	let _paySa = new Pay(objSa);
	_paySa.save(function(err, saSave) {});

	_object.payAc = _payAc._id;
	_object.paySa = _paySa._id;
}



exports.odOrderFilter = function(req, res, next) {
	let id = req.params.id;
	Order.findOne({_id: id})
	.populate('payAc').populate('payMd').populate('paySa')
	.populate('vder')
	.populate('creater').populate('updater')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			req.body.object = object
			next()
		}
	})
}
exports.odOrderDetail = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	let list = req.body.list;
	let now = new Date();
	today = moment(now).format('YYYYMMDD');
	let weekday = new Date(now.getTime() + 7*24*60*60*1000)
	weekday = moment(weekday).format('YYYYMMDD');

	res.render('./sfer/oder/order/detail', {
		title: 'odOrder Infomation',
		crOder : req.session.crOder,
		object: objBody,
		today: today,
		weekday: weekday
	})
}


exports.odOrderUpMd = function(req, res) {
	let title = "odOrder splite Md"
	let fontUrl = './sfer/oder/order/update/slipMd';

	odOrderUpdate(req, res, fontUrl, title)
}
exports.odOrderUpPrice = function(req, res) {
	let title = "odOrder update Price"
	let fontUrl = './sfer/oder/order/update/upPrice';

	odOrderUpdate(req, res, fontUrl, title)
}
odOrderUpdate = function(req, res, fontUrl, title) {
	let objBody = req.body.object

	res.render(fontUrl, {
		title: title,
		crOder : req.session.crOder,
		object: objBody,

		action: '/odUpOrder',
	})
}



exports.odUpOrder = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	objBody.updateAt = Date.now();
	objBody.updater = req.session.crOder._id;
	if(objBody.price) objBody.price = parseFloat(objBody.price);
	Order.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody);

			if(objBody.mdPrice) odMdFunc(objBody, _object);
			
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/odOrderList');
			});	
		}
	})
}
odMdFunc = function(objBody, _object) {
	if(_object.payMd) {
		Pay.findOne({_id: _object.payMd}, function(err, payMd) {
			if(err) console.log(err);
			payMd.price = parseFloat(objBody.mdPrice);
			payMd.save(function(err, mdSave) {});
		})
	} else {
		let objMd = new Object();
		objMd.price = parseFloat(objBody.mdPrice);
		objMd.code = "md";
		objMd.status = 0;
		objMd.order = _object._id;
		let _payMd = new Pay(objMd);
		_payMd.save(function(err, mdSave) {});
		_object.payMd = _payMd._id;
	}

	Pay.findOne({_id: _object.paySa}, function(err, paySa) {
		if(err) console.log(err);
		paySa.price = parseFloat(objBody.saPrice);
		paySa.save(function(err, saSave) {});
	})


}



exports.odOrderDel = function(req, res) {
	let objBody = req.body.object;
	payAc = objBody.payAc
	payMd = objBody.payMd
	paySa = objBody.paySa
	if(payAc) Pay.remove({_id: payAc}, function(err, rmPayAc) {});
	if(payMd) Pay.remove({_id: payMd}, function(err, rmPayMd) {});
	if(paySa) Pay.remove({_id: paySa}, function(err, rmPaySa) {});
	Order.remove({_id: objBody._id}, function(err, odOrderRm) {
		if(err) console.log(err);
		res.redirect('/odOrderList')
	})
}







exports.odOrderStatus = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Order.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.status = parseInt(newStatus)
			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "已经更改"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"});
		}
	})
}