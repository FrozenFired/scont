var Index = require('../index')
var Vendor = require('../../../models/scont/vendor')
var _ = require('underscore')


exports.vendorList = function(req, res) {
	Vendor.find()
	.sort({'weight': -1}).sort({'updateAt': -1})
	.exec(function(err, objects){
		if(err) console.log(err);
		res.render('./sfer/scont/vendor/list', {
			title: 'Vendor List',
			crSfer: req.session.crSfer,
			objects: objects
		})
	})
}

exports.vendorAdd = function(req, res) {
	res.render('./sfer/scont/vendor/add', {
		title: 'VendorAdd',
		crSfer: req.session.crSfer,
	})
}


exports.addVendor = function(req, res) {
	var objBody = req.body.object

	var code = objBody.code.replace(/(\s*$)/g, "")
	objBody.code = code.replace( /^\s*/, '')
	Vendor.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "This Vendor Code is Exist"
			Index.sfOptionWrong(req, res, info)
		} else {
			var _object = new Vendor(objBody)
			_object.creater = req.session.crSfer._id
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/vendorList')
			})
		}
	})
}




exports.vendorDetail = function(req, res){
	var id = req.params.id
	Vendor.findOne({_id: id})
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
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
	var id = req.params.id
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
	var objBody = req.body.object
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')

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
					var _object = _.extend(object, objBody)
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
	var id = req.query.id
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
	let keyword = req.query.keyword
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