let Index = require('../index')
let Bcateg = require('../../../models/scont/bcateg')
let Brand = require('../../../models/scont/brand')
let _ = require('underscore')


exports.bcategList = function(req, res) {
	Bcateg.find()
	.sort({"code": -1})
	.exec(function(err, objects){
		if(err) console.log(err);
		res.render('./sfer/scont/bcateg/list', {
			title: 'Bcateg List',
			crSfer: req.session.crSfer,
			objects: objects
		})
	})
}

exports.bcategAdd = function(req, res) {
	res.render('./sfer/scont/bcateg/add', {
		title: 'BcategAdd',
		crSfer: req.session.crSfer,
	})
}


exports.addBcateg = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')
	Bcateg.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "This Bcateg Code is Exist"
			Index.sfOptionWrong(req, res, info)
		} else {
			let _object = new Bcateg(objBody)
			_object.creater = req.session.crSfer._id
			_object.save(function(err, objSave) {
				if(err) console.log(err);

				res.redirect('/bcategList')
			})
		}
	})
}




exports.bcategDetail = function(req, res){
	let id = req.params.id
	Bcateg.findOne({_id: id})
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
	.populate('creater')
	.populate('updater')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			Brand.find({bcateg: object._id}, function(err, brands) {
				if(err) console.log(err);
				if(object.numbrand != brands.length) {
					object.numbrand = brands.length;
					object.save(function(err, objSave) {
						if(err) console.log(err);
					})
				}
				res.render('./sfer/scont/bcateg/detail', {
					title: 'Bcategory Detail',
					crSfer: req.session.crSfer,
					object: object,
					brands: brands
				})
			})
		} else {
			info = "This BcategI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.bcategUpdate = function(req, res){
	let id = req.params.id
	Bcateg.findOne({_id: id})
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			res.render('./sfer/scont/bcateg/update', {
				title: 'Bcategory Update',
				crSfer: req.session.crSfer,
				object: object,
			})
		} else {
			info = "This BcategI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.updateBcateg = function(req, res) {
	let objBody = req.body.object
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')

	Bcateg.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			Bcateg.find({code: objBody.code})
			.where('_id').ne(objBody._id)
			.exec(function(err, objects) {
				if(err) console.log(err);
				if(objects.length > 0){
					info = "This Bcateg Code is Exist"
					Index.sfOptionWrong(req, res, info)
				} else {
					let _object = _.extend(object, objBody)
					_object.updateUser = req.session.crSfer._id
					_object.save(function(err, objSave) {
						if(err) console.log(err);

						res.redirect('/bcategList')
					})
				}
			})
		} else {
			info = "This Bcateg is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.bcategDel = function(req, res) {
	let id = req.query.id
	Bcateg.findOne({_id: id})
	.exec(function(err, bcateg){
		if(err) console.log(err);
		if(bcateg){
			if(bcateg.numbrand > 0){
				res.json({success: 0, failDel: "Attention! You can't delete this bcateg"})
			}else{
				Bcateg.remove({_id: id}, function(err, brander) {
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