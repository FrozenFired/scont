var Index = require('../index')
var Nation = require('../../../models/scont/nation')
var Brand = require('../../../models/scont/brand')
var _ = require('underscore')

exports.nationsFilter = function(req, res, next) {
	Nation.find()
	.sort({'weight': -1}).sort({'numbrand': -1})
	.exec(function(err, objects){
		if(err) console.log(err);
		if(objects) {
			req.body.objects = objects;
			next();
		} else {
			info = "Can't Find The Nation"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.nationList = function(req, res) {
	let objects = req.body.objects;
	res.render('./sfer/scont/nation/list', {
		title: 'Nation List',
		crSfer: req.session.crSfer,
		objects: objects
	})
}


exports.nationAdd = function(req, res) {
	res.render('./sfer/scont/nation/add', {
		title: 'NationAdd',
		crSfer: req.session.crSfer,
	})
}


exports.addNation = function(req, res) {
	var objBody = req.body.object

	var code = objBody.code.replace(/(\s*$)/g, "")
	objBody.code = code.replace( /^\s*/, '')
	Nation.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "This Nation Code is Exist"
			Index.sfOptionWrong(req, res, info)
		} else {
			var _object = new Nation(objBody)
			_object.creater = req.session.crSfer._id
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/nationList')
			})
		}
	})
}




exports.nationDetail = function(req, res){
	var id = req.params.id
	Nation.findOne({_id: id})
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
	.populate('creater')
	.populate('updater')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			Brand.find({nation: object._id}, function(err, brands) {
				if(err) console.log(err);
				if(object.numbrand != brands.length) {
					object.numbrand = brands.length;
					object.save(function(err, objSave) {
						if(err) console.log(err);
					})
				}
				res.render('./sfer/scont/nation/detail', {
					title: 'Nationory Detail',
					crSfer: req.session.crSfer,
					object: object,
					brands: brands
				})
			})
		} else {
			info = "This NationI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.nationUpdate = function(req, res){
	var id = req.params.id
	Nation.findOne({_id: id})
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			res.render('./sfer/scont/nation/update', {
				title: 'Nationory Update',
				crSfer: req.session.crSfer,
				object: object,
			})
		} else {
			info = "This NationI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.updateNation = function(req, res) {
	var objBody = req.body.object
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')

	Nation.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			Nation.find({code: objBody.code})
			.where('_id').ne(objBody._id)
			.exec(function(err, objects) {
				if(err) console.log(err);
				if(objects.length > 0){
					info = "This Nation Code is Exist"
					Index.sfOptionWrong(req, res, info)
				} else {
					var _object = _.extend(object, objBody)
					_object.updateUser = req.session.crSfer._id
					_object.save(function(err, object) {
						if(err) console.log(err);
						res.redirect('/nationList')
					})
				}
			})
		} else {
			info = "This Nation is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.nationDel = function(req, res) {
	var id = req.query.id
	Nation.findOne({_id: id})
	.exec(function(err, nation){
		if(err) console.log(err);
		if(nation){
			if(nation.numbrand > 0){
				res.json({success: 0, failDel: "Attention! You can't delete this nation"})
			}else{
				Nation.remove({_id: id}, function(err, brander) {
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
