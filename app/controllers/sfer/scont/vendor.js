let Index = require('../index')
let Vendor = require('../../../models/scont/vendor')

var Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let _ = require('underscore')

exports.vendorListFilter = function(req, res, next) {
	let title = 'vendor List';
	let url = "/vendorList";

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
	let condStatus = Object.keys(Conf.stsVendor);
	// let condStatus = 0;
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);
	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	Vendor.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Vendor.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index)
		.limit(entry)
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
exports.vendorList = function(req, res) {
	res.render('./sfer/scont/vendor/list', req.body.list)
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