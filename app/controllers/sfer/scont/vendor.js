let Index = require('../index')
let Vendor = require('../../../models/scont/vendor')

let Conf = require('../../../../confile/conf.js')
let _ = require('underscore')

exports.vendorListFilter = function(req, res, next) {
	// 分页
	let slipCond = ""; // 分页时用到的其他条件
	
	let defEntry = 10;
	let entry = parseInt(req.query.entry) || defEntry;
	if(isNaN(entry)) {
		entry = defEntry;
	} else if(entry != defEntry) {
		if(entry < 0) entry = -entry;
		slipCond += "&entry="+entry;
	}
	let page = parseInt(req.query.page) || 0;
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "code"
	if(req.query.keytype) { 
		keytype = req.query.keytype;
		slipCond += "&keytype="+keytype;
	}

	let keyword = "";
	if(req.query.keyword) {
		keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		slipCond += "&keyword="+keyword;
	}
	
	// 根据状态筛选
	let condStatus;
	// console.log(req.query.status)
	if(!req.query.status) {
		condStatus = Object.keys(Conf.stsVendor);
	} else {
		condStatus = req.query.status;
		if(condStatus instanceof Array){
			for(status in condStatus){
				slipCond += "&status="+status;
			}
		} else {
			slipCond += "&status="+condStatus;
		}
	}
	// console.log(condStatus)
	// 选择创建的开始时间
	let condCrtStart, symCrtStart;
	if(req.query.crtStart && req.query.crtStart.length == 10){
		symCrtStart = "$gt";   // $ ne eq gte gt lte lt
		condCrtStart = new Date(req.query.crtStart).setHours(0,0,0,0);
		slipCond += "&crtStart="+req.query.crtStart;
	} else {
		symCrtStart = "$ne";
		condCrtStart = null;
	}

	// console.log(req.query.crtStart)
	// console.log(symCrtStart)
	// console.log(condCrtStart)
	// 选择创建的结束时间
	let condCrtEnded, symCrtEnded;
	if(req.query.crtEnded && req.query.crtEnded.length == 10){
		symCrtEnded = "$lt";
		condCrtEnded = new Date(req.query.crtEnded).setHours(23,59,59,0)
		slipCond += "&crtEnded="+req.query.crtEnded;
	} else {
		symCrtEnded = "$ne";
		condCrtEnded = null;
	}
	// 选择更新的开始时间
	let condUpdStart, symUpdStart;
	if(req.query.updStart && req.query.updStart.length == 10){
		symUpdStart = "$gt";
		condUpdStart = new Date(req.query.updStart).setHours(0,0,0,0);
		slipCond += "&updStart="+req.query.updStart;
	} else {
		symUpdStart = "$ne";
		condUpdStart = null;
	}
	// 选择更新的结束时间
	let condUpdEnded, symUpdEnded;
	if(req.query.updEnded && req.query.updEnded.length == 10){
		symUpdEnded = "$lt";
		condUpdEnded = new Date(req.query.updEnded).setHours(23,59,59,0)
		slipCond += "&updEnded="+req.query.updEnded;
	} else {
		symUpdEnded = "$ne";
		condUpdEnded = null;
	}
	// console.log(symCrtEnded)
	// console.log(condCrtEnded)

	Vendor.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[symCrtStart]: condCrtStart, [symCrtEnded]: condCrtEnded},
		'updateAt': {[symUpdStart]: condUpdStart, [symUpdEnded]: condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Vendor.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[symCrtStart]: condCrtStart, [symCrtEnded]: condCrtEnded},
			'updateAt': {[symUpdStart]: condUpdStart, [symUpdEnded]: condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index)
		.limit(entry)
		.sort({'status': 1, 'updateAt': -1})
		.exec(function(err, objects){
			if(err) console.log(err);
			if(objects){
				let object = new Object()
				object.objects = objects;

				object.keytype = req.query.keytype;
				object.keyword = req.query.keyword;

				object.condStatus = condStatus;
				object.condCrtStart = req.query.crtStart;
				object.condCrtEnded = req.query.crtEnded;
				object.condUpdStart = req.query.updStart;
				object.condUpdEnded = req.query.updEnded;

				object.count = count;
				object.entry = entry;
				object.page = page;

				object.slipCond = slipCond;

				req.body.object = object;
				next();
			} else {
				info = "Option error, Please Contact Manger"
				Index.sfOptionWrong(req, res, info)
			}
		})
	})
}
exports.vendorList = function(req, res) {
	let object = req.body.object
	res.render('./sfer/scont/vendor/list', {
		title: 'Vendor List',
		crSfer: req.session.crSfer,
		
		objects: object.objects,
		count: object.count,

		condStatus: object.condStatus,
		condCrtStart: object.condCrtStart,
		condCrtEnded: object.condCrtEnded,
		condUpdStart: object.condUpdStart,
		condUpdEnded: object.condUpdEnded,
		keytype: object.keytype,
		keyword: object.keyword,

		currentPage: (object.page + 1),
		entry: object.entry,
		totalPage: Math.ceil(object.count / object.entry),
		slipUrl: '/vendorList?',
		slipCond: object.slipCond,

		filterAction: '/vendorList',
		printAction: '/vendorListPrint'
	})
}


exports.vendorAdd = function(req, res) {
	res.render('./sfer/scont/vendor/add', {
		title: 'Vendor Add',
		crSfer: req.session.crSfer,
	})
}


exports.addVendor = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.updateAt = objBody.createAt = Date.now();

	Vendor.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "This Vendor Code is Exist"
			Index.sfOptionWrong(req, res, info)
		} else {
			let _object = new Vendor(objBody)
			_object.creater = req.session.crSfer._id
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/vendorList')
			})
		}
	})
}




exports.vendorDetail = function(req, res){
	let id = req.params.id
	Vendor.findOne({_id: id})
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
	.populate({
		path: 'sconts',
		options: {sort: {'status': 1} }, 
		populate: {path: 'brand', populate: {path: 'bcateg'} } 
	})
	.populate('creater')
	.populate('updater')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			res.render('./sfer/scont/vendor/detail', {
				title: 'Vendorory Detail',
				crSfer: req.session.crSfer,
				object: object,
			})
		} else {
			info = "This VendorI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.vendorUpdate = function(req, res){
	let id = req.params.id
	Vendor.findOne({_id: id})
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			res.render('./sfer/scont/vendor/update', {
				title: 'Vendorory Update',
				crSfer: req.session.crSfer,
				object: object,
			})
		} else {
			info = "This VendorI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.updateVendor = function(req, res) {
	let objBody = req.body.object
	
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.updateAt = Date.now();

	Vendor.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			Vendor.find({code: objBody.code})
			.where('_id').ne(objBody._id)
			.exec(function(err, objects) {
				if(err) console.log(err);
				if(objects.length > 0){
					info = "This Vendor Code is Exist"
					Index.sfOptionWrong(req, res, info)
				} else {
					let _object = _.extend(object, objBody)
					_object.updateUser = req.session.crSfer._id
					_object.save(function(err, object) {
						if(err) console.log(err);
						res.redirect('/vendorList')
					})
				}
			})
		} else {
			info = "This Vendor is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.vendorDel = function(req, res) {
	let id = req.query.id
	Vendor.findOne({_id: id})
	.exec(function(err, vendor){
		if(err) console.log(err);
		if(vendor){
			if(vendor.sconts.length > 0){
				res.json({success: 0, failDel: "Attention! You can't delete this vendor"})
			}else{
				Vendor.remove({_id: id}, function(err, brander) {
					if(err) {
						res.json({success: 0, failDel: "删除失败,原因不明,联系管理员"})
					} else {
						res.json({success: 1})
					}
				})
			}
		} else {
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"})
		}
	})
}




// Ajax
exports.ajaxCodeVendor = function(req, res) {
	let keytpye = req.query.keytype
	let keyword = req.query.keyword.toUpperCase();
	// console.log(keytpye)
	// console.log(keyword)
	Vendor.findOne({[keytpye]: keyword}, function(err, vendor) {
		if(err) console.log(err);
		if(vendor){
			res.json({success: 1, vendor: vendor})
		} else {
			Vendor.find({[keytpye]: new RegExp(keyword + '.*')}, function(err, vendors) {
				if(err) console.log(err);
				if(vendors && vendors.length > 0) {
					res.json({success: 2, vendors: vendors});
				} else {
					res.json({success: 0})
				}
			})
		}
	})
}


exports.ajaxVendorSts = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Vendor.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.status = parseInt(newStatus)

			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "标记已经完成"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"})
		}
	})
}