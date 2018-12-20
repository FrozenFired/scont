let Index = require('../index')
let SctRelate = require('./sctRelate')

let Scont = require('../../../models/scont/scont')
let Brand = require('../../../models/scont/brand')
let Vendor = require('../../../models/scont/vendor')

let Bcateg = require('../../../models/scont/bcateg')
let Nation = require('../../../models/scont/nation')
let _ = require('underscore')


exports.scontList = function(req, res) {
	Scont.find()
	.populate({path: 'brand', populate: {path: 'bcateg'} } )
	.populate('vendor')
	.sort({'weight': -1}).sort({'updateAt': -1})
	.exec(function(err, objects){
		if(err) console.log(err);
		res.render('./sfer/scont/scont/list', {
			title: 'Scont List',
			crSfer: req.session.crSfer,
			objects: objects
		})
	})
}

exports.scontAdd = function(req, res) {
	Nation.find(function(err, nations) {
		if(err) console.log(err);
		Bcateg.find(function(err, bcategs) {
			if(err) console.log(err);
			res.render('./sfer/scont/scont/add', {
				title: 'ScontAdd',
				crSfer: req.session.crSfer,
				nations: nations,
				bcategs: bcategs
			})
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
				info = "This Brand Is Include This Vendor Already"
				Index.sfOptionWrong(req, res, info)
			} else {
				objBody.status = 0
				let _object = new Scont(objBody)
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
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			res.render('./sfer/scont/scont/update', {
				title: 'Scontory Update',
				crSfer: req.session.crSfer,
				object: object,
			})
		} else {
			info = "This ScontI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.updateScont = function(req, res) {
	let objBody = req.body.object

	Scont.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			let _object = _.extend(object, objBody)
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
