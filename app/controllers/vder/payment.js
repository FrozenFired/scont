let Index = require('./index')
let Payment = require('../../models/finance/payment')
let _ = require('underscore')

let Filter = require('../../middle/filter');

let Conf = require('../../../confile/conf.js')
let moment = require('moment')



exports.paymentsFilter = function(req, res, next) {
	let title = 'payment List';
	let url = "/paymentList";
	
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
	// let condStatus = Object.keys(Conf.stsPayment);
	let condStatus = ['0', '1'];
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);

	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	Payment.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.where('vder').equals(req.session.crVder._id)
	.exec(function(err, count) {
		if(err) console.log(err);
		Payment.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.where('vder').equals(req.session.crVder._id)
		.skip(index)
		.limit(entry)
		.populate('staff')
		.sort({"createAt": -1})
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

exports.paymentList = function(req, res) {
	let list = req.body.list;
	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000)
	list.weekday = moment(weekday).format('YYYYMMDD');
	res.render('./vder/payment/list', req.body.list)
}


exports.paymentListPrint = function(req, res) {
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

	wb.write('Payment_'+req.session.crVder.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}











exports.paymentFilter = function(req, res, next) {
	let id = req.params.id
	Payment.findOne({_id: id})
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
exports.paymentDetail = function(req, res) {
	let objBody = req.body.object

	res.render('./vder/payment/detail', {
		title: 'payment Infomation',
		crVder : req.session.crVder,
		object: objBody
	})
}


exports.updatePayment = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	objBody.updateAt = Date.now();
	Payment.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody);
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/paymentList');
			});	
		}
	})
}