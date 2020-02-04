let Index = require('./index')
let Ord = require('../../../models/finance/ord')
let Vder = require('../../../models/scont/vendor')
let Sfer = require('../../../models/user/sfer')
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
	let keytype = "ord", keyword = "";
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
	let condStatus = ['10', '15', '20', '25', '30', '35'];
	[condition.condStatus, condition.slipCond] = Filter.status(req.query.status, condStatus, condition.slipCond);
	if(req.query && req.query.keytype == "sfer"){
		// console.log('sfer')
		condition.keytype = "ordCode";
		condition.keyword = "";
		condition.symPul = "$eq";
		condition.condPul = req.query.keyword;
		sfOrdFindSfers(req, res, next, condition);
	} else if(req.query && req.query.keytype == "vder"){
		condition.keytype = "ordCode";
		condition.keyword = "";
		condition.symPul = "$eq";
		condition.condPul = req.query.keyword;
		sfOrdFindVders(req, res, next, condition);
	} else {
		condition.symPul = '$ne';
		condition.condPul = randID;
		sfOrdFindOrds(req, res, next, condition);
	}
}
sfOrdFindSfers = function(req, res, next, condition) {
	Sfer.findOne({code: condition.condPul}, function(err, sfer) {
		if(err) console.log(err);
		condition.varDB = 'creater';
		condition.symPul = '$eq';
		if(sfer) {
			condition.condPul = sfer._id;
		} else {
			condition.condPul = randID;
		}
		sfOrdFindOrds(req, res, next, condition);
	})
}
sfOrdFindVders = function(req, res, next, condition) {
	Vder.findOne({code: condition.condPul}, function(err, vder) {
		if(err) console.log(err);
		condition.varDB = 'vder';
		condition.symPul = '$eq';
		if(vder) {
			condition.condPul = vder._id;
		} else {
			condition.condPul = randID;
		}
		sfOrdFindOrds(req, res, next, condition);
	})
}
sfOrdFindOrds = function(req, res, next, condition) {
	Ord.count({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		[condition.varDB]: {[condition.symPul]: condition.condPul},
		[condition.keytype]: new RegExp(condition.keyword + '.*'),
		'status': condition.condStatus  // 'status': {$in: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);

	Ord.find({
		[condition.varNumb]: {[condition.symNumb]: condition.condNumb},
		[condition.varDB]: {[condition.symPul]: condition.condPul},
		// [condition.keytype]: new RegExp(condition.keyword + '.*'),
		'status': condition.condStatus  // 'status': {[symStatus]: condStatus}
	})
	.skip(condition.index).limit(condition.entry)
	.populate('payAc').populate('payMd').populate('paySa')
	.populate('vder')
	.populate('creater')
	.sort({'status': 1, "createAt": -1})
	.exec(function(err, objects) {
		if(err) console.log(err);
		if(objects){
			// console.log(objects)
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
			Index.sfOptionWrong(req, res, info);
		}
	})

	})
}


exports.ords = function(req, res) {
	let list = req.body.list;
	list.title = 'Ord List';
	list.url = "/sfOrds";
	list.crSfer = req.session.crSfer;

	let today = new Date();
	list.today = moment(today).format('YYYYMMDD');
	let weekday = new Date(today.getTime() + 7*24*60*60*1000);
	list.weekday = moment(weekday).format('YYYYMMDD');

	// console.log(list.objects[0])
	res.render('./sfer/sfer/ord/list', list)
}




exports.ordAdd =function(req, res) {
	res.render('./sfer/sfer/ord/add', {
		title: 'Add Ord',
		crSfer : req.session.crSfer,
		// code: code,
		action: "/sfOrdNew",
	})
}




exports.sfOrdNew = function(req, res) {
	let crSfer = req.session.crSfer;

	let objBody = req.body.object
	// console.log(objBody)
	objBody.stsOrdLg = 0
	objBody.ordCode = objBody.ordCode.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.brand = objBody.brand.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.price = parseFloat(objBody.price)
	if(isNaN(objBody.price)){
		info = "订单价格设置错误";
		Index.sfOptionWrong(req, res, info);
	} else {
		objBody.updateAt = objBody.createAt = Date.now();
		objBody.updater = objBody.creater = crSfer._id;

		let _object = new Ord(objBody)
		_object.save(function(err, objSave) {
			if(err) {
				console.log(err);
			} else {
				res.redirect('/sfOrd/'+objSave._id)
			}
		})
	}
}


exports.ordFilter = function(req, res, next) {
	let id = req.params.id;
	Ord.findOne({_id: id})
	.populate('payAc').populate('payMd').populate('paySa')
	.populate('vder')
	.populate('creater').populate('updater')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此订单已经被删除"
			Index.sfOptionWrong(req, res, info)
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

	res.render('./sfer/sfer/ord/detail', {
		title: 'sfOrd Infomation',
		crSfer : req.session.crSfer,
		object: objBody,
		today: today,
		weekday: weekday
	})
}
exports.ordUp = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	if(objBody.status == 0) {
		let list = req.body.list;
		let now = new Date();
		today = moment(now).format('YYYYMMDD');
		let weekday = new Date(now.getTime() + 7*24*60*60*1000)
		weekday = moment(weekday).format('YYYYMMDD');

		res.render('./sfer/sfer/ord/update', {
			title: 'sfOrd Update',
			action: '/sfOrdUpd',
			crSfer : req.session.crSfer,
			object: objBody,
			today: today,
			weekday: weekday
		})
	} else {
		info = "订单信息已经确认，请联系财务部"
		Index.sfOptionWrong(req, res, info)
	}
}

exports.ordUpd = function(req, res) {
	let objBody = req.body.object
	Ord.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此订单已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			if(objBody.price) objBody.price = parseFloat(objBody.price)
			if(objBody.ordCode) objBody.ordCode = objBody.ordCode.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			if(objBody.price) objBody.brand = objBody.brand.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			objBody.updateAt = Date.now();
			objBody.updater = req.session.crSfer._id;

			let _object = _.extend(object, objBody)
			object.save(function(err, objSave) {
				if(err) {
					console.log(err);
					info = "sfOrdUpd ord save error, Please Contact Manager";
					Index.sfOptionWrong(req, res, info);
				} else {
					res.redirect('/sfOrd/'+objSave._id)
				}
			})
				
		}
	})
}


exports.ordDel = function(req, res) {
	let objBody = req.body.object;
	if(objBody.status == 0) {
		payAc = objBody.payAc
		payMd = objBody.payMd
		paySa = objBody.paySa
		Ord.remove({_id: objBody._id}, function(err, sfOrdRm) {
			if(err) console.log(err);
			res.redirect('/sfOrds')
		})
	} else {
		info = "订单信息已经确认，不能删除，请联系财务部"
		Index.sfOptionWrong(req, res, info)
	}
}