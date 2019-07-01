let Index = require('./index')
let Order = require('../../models/finance/order')
let Pay = require('../../models/finance/pay')
let _ = require('underscore')

let Filter = require('../../middle/filter');

let Conf = require('../../../confile/conf.js')
let moment = require('moment')


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


exports.ordersFilter = function(req, res, next) {
	let title = 'Pay List';
	let url = "/payList";

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
	let condStatus = ['2', '3'];
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);

	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	// 根据首位款筛选
	let cs = Filter.cs(req);
	slipCond+=cs.slipCond;

	Order.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'acAt': {[cs.symAcStart]: cs.condAcStart, [cs.symAcEnded]: cs.condAcEnded},
		'saAt': {[cs.symSaStart]: cs.condSaStart, [cs.symSaEnded]: cs.condSaEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.where('vder').equals(req.session.crVder._id)
	.exec(function(err, count) {
		if(err) console.log(err);
		Order.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'acAt': {[cs.symAcStart]: cs.condAcStart, [cs.symAcEnded]: cs.condAcEnded},
			'saAt': {[cs.symSaStart]: cs.condSaStart, [cs.symSaEnded]: cs.condSaEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.where('vder').equals(req.session.crVder._id)
		.skip(index).limit(entry)
		.populate('payAc').populate('payMd').populate('paySa')
		.populate('vder')
		.sort({'status': 1, "createAt": -1})
		.exec(function(err, objects) {
			if(err) console.log(err);
			if(objects){
				// console.log(objects)
				let list = new Object()
				list.title = title;
				list.url = url;
				list.crVder = req.session.crVder;

				list.count = count;
				list.objects = objects;

				list.keytype = req.query.keytype;
				list.keyword = req.query.keyword;

				list.condStatus = condStatus;

				list.condCrtStart = req.query.crtStart;
				list.condCrtEnded = req.query.crtEnded;
				list.condUpdStart = req.query.updStart;
				list.condUpdEnded = req.query.updEnded;

				list.condAcStart = req.query.acStart;
				list.condAcEnded = req.query.acEnded;
				list.condSaStart = req.query.saStart;
				list.condSaEnded = req.query.saEnded;

				list.currentPage = (page + 1);
				list.entry = entry;
				list.totalPage = Math.ceil(count / entry);

				list.slipCond = slipCond;

				req.body.list = list;
				next();
			} else {
				info = "Option error, Please Contact Manger"
				Index.vdOptionWrong(req, res, info)
			}
		})
	})
}

exports.orderList = function(req, res) {
	let list = req.body.list;
	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000)
	list.weekday = moment(weekday).format('YYYYMMDD');

	// console.log(list.objects[0])
	res.render('./vder/order/list', req.body.list)
}


exports.orderListPrint = function(req, res) {
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

	wb.write('Order_'+req.session.crVder.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}











exports.orderFilter = function(req, res, next) {
	let id = req.params.id
	Order.findOne({_id: id})
	.populate('staff')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.vdOptionWrong(req, res, info)
		} else {
			if(object.staff._id != req.session.crVder._id) {
				info = "您无权查看别人的信息"
				Index.vdOptionWrong(req, res, info)
			} else {
				req.body.object = object
				next()
			}
		}
	})
}
exports.orderDetail = function(req, res) {
	let objBody = req.body.object

	res.render('./vder/order/detail', {
		title: 'order Infomation',
		crVder : req.session.crVder,
		object: objBody
	})
}


exports.updateOrder = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	objBody.updateAt = Date.now();
	Order.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody);
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/orderList');
			});	
		}
	})
}

exports.vdOrderStatus = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	console.log(id)
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