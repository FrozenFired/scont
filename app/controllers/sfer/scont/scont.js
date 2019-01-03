let Index = require('../index')
let SctRelate = require('./sctRelate')

let Scont = require('../../../models/scont/scont')
let Brand = require('../../../models/scont/brand')
let Vendor = require('../../../models/scont/vendor')

let Bcateg = require('../../../models/scont/bcateg')
let Nation = require('../../../models/scont/nation')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let _ = require('underscore')


exports.scontListFilter = function(req, res, next) {
	let title = 'scont List';
	let url = "/scontList";

	// 分页
	let slipCond = ""; // 分页时用到的其他条件

	let page = 0, entry = 10;
	[entry, page, slipCond] = Filter.slipPage(req, entry, slipCond)
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "scont", keyword = "";
	[keytype, keyword, slipCond] = Filter.key(req, keytype, keyword, slipCond)

	// 根据状态筛选
	let condStatus = Object.keys(Conf.stsScont);
	// let condStatus = 0;
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);

	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	Scont.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Scont.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index)
		.limit(entry)
		.populate({path: 'brand', populate: {path: 'bcateg'} } )
		.populate('vendor')
		.populate('creater').populate('updater')
		.sort({'status': 1, 'updateAt': -1})
		.exec(function(err, objects){
			if(err) console.log(err);
			if(objects){
				let list = new Object()
				list.title = title;
				list.url = url;
				list.crSfer = req.session.crSfer;

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
				Index.sfOptionWrong(req, res, info)
			}
		})
	})
}
exports.scontList = function(req, res) {
	res.render('./sfer/scont/scont/list', req.body.list)
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



exports.ajaxScontSts = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Scont.findOne({_id: id}, function(err, object){
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