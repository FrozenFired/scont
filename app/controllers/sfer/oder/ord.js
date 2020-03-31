let Index = require('./index')
let Ord = require('../../../models/finance/ord')
let Vder = require('../../../models/scont/vendor')
let _ = require('underscore')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let moment = require('moment')

let randID = '5c63ecf72430bf23f7280ba3';
exports.ordsFilter = function(req, res, next) {
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
	let keytype = "ordCode", keyword = "";
	[condition.keytype, condition.keyword, condition.slipCond] = Filter.key(req, keytype, keyword, condition.slipCond)
	
	condition.varNumb = "price";
	condition.symNumb = "$ne";
	condition.condNumb = 'condNumb';

	if(condition.keytype == condition.varNumb) {
		condition.symNumb = "$eq";
		condition.condNumb = parseFloat(condition.keyword);
		condition.keytype = "ord";
		condition.keyword = "";
	}

	// 根据状态筛选
	// let condStatus = Object.keys(Conf.stsOrd);
	let condStatus = ['10', '15', '20', '25', '30', '35', '40'];
	[condition.condStatus, condition.slipCond] = Filter.status(req.query.status, condStatus, condition.slipCond);
	if(req.query && req.query.keytype == "vder"){
		condition.keytype = "ord";
		condition.keyword = "";
		condition.symPul = "$eq";
		condition.condPul = req.query.keyword;
		odOrdFindVders(req, res, next, condition);
	} else {
		condition.symPul = '$ne';
		condition.condPul = randID;
		odOrdFindOrds(req, res, next, condition);
	}
}
odOrdFindVders = function(req, res, next, condition) {
	Vder.findOne({code: condition.condPul}, function(err, vder) {
		if(err) console.log(err);
		condition.symPul = '$eq';
		if(vder) {
			condition.condPul = vder._id;
		} else {
			condition.condPul = randID;
		}
		odOrdFindOrds(req, res, next, condition);
	})
}
odOrdFindOrds = function(req, res, next, condition) {
	Ord.count({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		'vder': {[condition.symPul]: condition.condPul},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'status': condition.condStatus  // 'status': {$in: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);

	Ord.find({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		'vder': {[condition.symPul]: condition.condPul},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'status': condition.condStatus  // 'status': {[symStatus]: condStatus}
	})
	.skip(condition.index).limit(condition.entry)
	.populate('vder')
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
			Index.odOptionWrong(req, res, info);
		}
	})
	})
}


exports.ords = function(req, res) {
	let list = req.body.list;
	list.title = 'Ord List';
	list.url = "/odOrds";
	list.crSfer = req.session.crSfer;

	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000);
	list.weekday = moment(weekday).format('YYYYMMDD');

	// console.log(list.objects[0])
	res.render('./sfer/oder/ord/list', list)
}


exports.ordsPrint = function(req, res) {
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
		if(item.ord) ws.cell((i+2), 3).string(String(item.ord));
		if(item.description) ws.cell((i+2), 4).string(String(item.description));
		if(item.note) ws.cell((i+2), 5).string(String(item.note));
		if(item.createAt) ws.cell((i+2), 6).string(moment(item.createAt).format('MM/DD/YYYY HH:mm'));
		if(item.finishAt) ws.cell((i+2), 7).string(String(item.finishAt));
	}

	wb.write('Ord_'+req.session.crSfer.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}




exports.ordAdd =function(req, res) {
	res.render('./sfer/oder/ord/add', {
		title: 'Add Ord',
		crSfer : req.session.crSfer,
		// code: code,
		action: "/odOrdNew",
	})
}



exports.odOrdNew = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	objBody.status = 0
	objBody.ord = objBody.ord.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.brand = objBody.brand.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.price = parseFloat(objBody.price)
	if(isNaN(objBody.price)){
		info = "订单价格设置错误";
		Index.odOptionWrong(req, res, info);
	} else {
		objBody.updateAt = objBody.createAt = Date.now();
		objBody.updater = objBody.creater = req.session.crSfer._id;

		let _object = new Ord(objBody)
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
				res.redirect('/odOrd/'+objSave._id)
			}
		})
	}
}



exports.ordFilter = function(req, res, next) {
	let id = req.params.id;
	Ord.findOne({_id: id})
	.populate('vder')
	.populate('creater').populate('updater')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.odOptionWrong(req, res, info)
		} else {
			req.body.object = object
			next()
		}
	})
}
exports.ord = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	let list = req.body.list;
	let now = new Date();
	today = moment(now).format('YYYYMMDD');
	let weekday = new Date(now.getTime() + 7*24*60*60*1000)
	weekday = moment(weekday).format('YYYYMMDD');

	res.render('./sfer/oder/ord/detail', {
		title: 'odOrd Infomation',
		crSfer : req.session.crSfer,
		object: objBody,
		today: today,
		weekday: weekday
	})
}

exports.ordUp = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	let list = req.body.list;
	let now = new Date();
	today = moment(now).format('YYYYMMDD');
	let weekday = new Date(now.getTime() + 7*24*60*60*1000)
	weekday = moment(weekday).format('YYYYMMDD');

	res.render('./sfer/oder/ord/update', {
		title: 'odOrd Update',
		action: '/odOrdUpd',
		crSfer : req.session.crSfer,
		object: objBody,
		today: today,
		weekday: weekday
	})
}
exports.ordUpMd = function(req, res) {
	let title = "odOrd splite Md"
	let fontUrl = './sfer/oder/ord/update/slipMd';

	odOrdFix(req, res, fontUrl, title)
}
exports.ordUpPrice = function(req, res) {
	let title = "odOrd update Price"
	let fontUrl = './sfer/oder/ord/update/upPrice';

	odOrdFix(req, res, fontUrl, title)
}
odOrdFix = function(req, res, fontUrl, title) {
	let objBody = req.body.object

	res.render(fontUrl, {
		title: title,
		crSfer : req.session.crSfer,
		object: objBody,

		action: '/odOrdFixed',
	})
}



exports.ordUpd = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	objBody.updateAt = Date.now();
	// objBody.updater = req.session.crSfer._id;
	if(objBody.price) objBody.price = parseFloat(objBody.price);
	Ord.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.odOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody);			
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/odOrd/'+objSave._id);
			});	
		}
	})
}




exports.ordDel = function(req, res) {
	let objBody = req.body.object;
	Ord.remove({_id: objBody._id}, function(err, odOrdRm) {
		if(err) console.log(err);
		res.redirect('/odOrds')
	})
}



exports.ordStatus = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Ord.findOne({_id: id}, function(err, object){
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