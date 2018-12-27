let Index = require('../index')
let SctRelate = require('./sctRelate')

let Scont = require('../../../models/scont/scont')
let Brand = require('../../../models/scont/brand')
let Vendor = require('../../../models/scont/vendor')

let Bcateg = require('../../../models/scont/bcateg')
let Nation = require('../../../models/scont/nation')
let _ = require('underscore')


exports.scontListFilter = function(req, res, next) {
	// 分页
	let page = parseInt(req.query.page) || 0
	let count = 20
	let index = page * count
	let slipCond = ""; // 分页时用到的其他条件

	// 条件判断   ----------------
	// 根据状态筛选
	let condStatus;
	// console.log(req.query.status)
	if(!req.query.status) {
		condStatus = ['0', '1', '2', '3', '4', '5'];
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

	Scont.count({
		'createAt': {[symCrtStart]: condCrtStart, [symCrtEnded]: condCrtEnded},
		'updateAt': {[symUpdStart]: condUpdStart, [symUpdEnded]: condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, amount) {
		if(err) console.log(err);
		Scont.find({
			'createAt': {[symCrtStart]: condCrtStart, [symCrtEnded]: condCrtEnded},
			'updateAt': {[symUpdStart]: condUpdStart, [symUpdEnded]: condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index)
		.limit(count)
		.populate({path: 'brand', populate: {path: 'bcateg'} } )
		.populate('vendor')
		.populate('creater').populate('updater')
		.sort({'weight': -1}).sort({'updateAt': -1})
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

				object.amount = amount;
				object.count = count;
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
exports.scontList = function(req, res) {
	let object = req.body.object
	res.render('./sfer/scont/scont/list', {
		title: 'Scont List',
		crSfer: req.session.crSfer,
		
		objects: object.objects,
		amount: object.amount,

		condStatus: object.condStatus,
		condCrtStart: object.condCrtStart,
		condCrtEnded: object.condCrtEnded,
		condUpdStart: object.condUpdStart,
		condUpdEnded: object.condUpdEnded,
		keytype: object.keytype,
		keyword: object.keyword,

		currentPage: (object.page + 1),
		totalPage: Math.ceil(object.amount / object.count),
		slipUrl: '/scontList?',
		slipCond: object.slipCond,

		filterAction: '/scontList',
		printAction: '/scontListPrint'
	})
}


exports.scontAdd = function(req, res) {
	Nation.find(function(err, nations) {
		if(err) console.log(err);
		res.render('./sfer/scont/scont/add', {
			title: 'ScontAdd',
			crSfer: req.session.crSfer,
			nations: nations,
		})
	})
}


exports.addScont = function(req, res) {
	createBrand(req, res);
}
createBrand = function(req, res) {
	// console.log(req.body.object.brand.length)
	if(req.body.object && req.body.object.brand){
		if(req.body.object.brand.length > 15) {
			// console.log('brand已经存在')
			createVendor(req, res)
		} else {
			// console.log('brand不存在')
			let brandBody = req.body.brand
			brandBody.code = brandBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')
			brandBody.code = brandBody.code.toUpperCase()
			// console.log(brandBody.bcateg)
			if(brandBody.nation.length < 15 || brandBody.bcateg.length < 15){
				info = "Your brand nation or category is not complete, Please Reopration";
				Index.sfOptionWrong(req, res, info);
			} else {
				Brand.findOne({code: brandBody.code}, function(err, brand) {
					if(err) console.log(err);
					if(brand) {
						info = "This brand code is existed";
						Index.sfOptionWrong(req, res, info);
					} else {
						// createAt 和 updateAt 取默认值
						let _brand = new Brand(brandBody)

						_brand.save(function(err, brandSave){
							if(err) console.log(err);
							req.body.object.brand = brandSave._id
							createVendor(req, res)
						})
					}
				})
			}
		}
	} else {
		info = "Option is error, Please contact manager";
		Index.sfOptionWrong(req, res, info);
	}
}
createVendor = function(req, res) {
	if(req.body.object && req.body.object.vendor){
		if(req.body.object.vendor.length > 15) {
			createScont(req, res)
		} else {
			let vendorBody = req.body.vendor
			vendorBody.code = vendorBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')
			vendorBody.code = vendorBody.code.toUpperCase()
			Vendor.findOne({code: vendorBody.code}, function(err, vendor) {
				if(err) console.log(err);
				if(vendor) {
					info = "This vendor code is existed";
					Index.sfOptionWrong(req, res, info);
				} else {
					// createAt 和 updateAt 取默认值
					let _vendor = new Vendor(vendorBody)
					_vendor.save(function(err, vendorSave){
						if(err) console.log(err);
						req.body.object.vendor = vendorSave._id
						createScont(req, res)
					})
				}
			})
		}
	} else {
		info = "Option is error, Please contact manager";
		Index.sfOptionWrong(req, res, info);
	}
}
createScont = function(req, res) {
	let objBody = req.body.object

	objBody.updateAt = objBody.createAt = Date.now();

	if(objBody.brand.length < 10 || objBody.vendor.length < 10) {
		info = "brand or vendor is not complete, Please Reopration";
		Index.sfOptionWrong(req, res, info);
	} else {
		Scont.find()
		.where('brand').equals(String(objBody.brand))
		.where('vendor').equals(String(objBody.vendor))
		.exec(function(err, sconts) {
			if(err) console.log(err);
			if(sconts.length > 0) {
				info = "This Brand Is Already Include This Vendor"
				Index.sfOptionWrong(req, res, info)
			} else {
				objBody.status = 0
				let log = new Object();
				log.scont = objBody.scont;
				log.note = objBody.note;
				log.editer = objBody.creater;
				let _object = new Scont(objBody)
				_object.logs.push(log)
				_object.save(function(err, objSave) {
					if(err) console.log(err);
					SctRelate.scontRelBrand('Brand', objSave.brand, objSave._id, 1)
					SctRelate.scontRelVendor('Vendor', objSave.vendor, objSave._id, 1)

					res.redirect('/scontDetail/' + objSave._id)
				})
			}
		})
	}
}






exports.scontDetail = function(req, res){
	let id = req.params.id
	Scont.findOne({_id: id})
	.populate({path: 'brand', populate: {path: 'bcateg'} } )
	.populate('vendor')
	.populate('creater')
	.populate('updater')
	.populate('logs.editer')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			res.render('./sfer/scont/scont/detail', {
				title: 'Scontory Detail',
				crSfer: req.session.crSfer,
				object: object,
			})
		} else {
			info = "This ScontI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.scontUpdate = function(req, res){
	let id = req.params.id
	Scont.findOne({_id: id})
	.populate('brand')
	.populate('vendor')
	.populate('updater')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			let updater = new Object();
			if(object.updater && object.updater._id) {
				updater = object.updater;
			}
			res.render('./sfer/scont/scont/update', {
				title: 'Scontory Update',
				crSfer: req.session.crSfer,
				object: object,
				updater: updater
			})
		} else {
			info = "This ScontI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.updateScont = function(req, res) {
	let objBody = req.body.object
	objBody.updateAt = Date.now();
	
	Scont.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			let log = new Object();
			log.scont = objBody.scont;
			log.note = objBody.note;
			log.editer = objBody.updater;

			let _object = _.extend(object, objBody)
			_object.logs.push(log)
			
			_object.save(function(err, object) {
				if(err) console.log(err);
				res.redirect('/scontList')
			})
		} else {
			info = "This Scont is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.scontDel = function(req, res) {
	let id = req.query.id
	Scont.findOne({_id: id})
	.exec(function(err, object){
		if(err) console.log(err);
		if(object){
			let brandId = object.brand
			let vendorId = object.vendor
			Scont.remove({_id: id}, function(err, objRm) {
				if(err) {
					res.json({success: 0, failDel: "删除失败,原因不明,联系管理员"})
				} else {
					SctRelate.scontRelBrand('Brand', brandId, id, -1)
					SctRelate.scontRelVendor('Vendor', vendorId, id, -1)
					res.json({success: 1})
				}
			})
		} else {
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"})
		}
	})
}
