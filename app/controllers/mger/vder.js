let Index = require('./index')
let Vder = require('../../models/user/vder')
let _ = require('underscore')
MiddlePicture = require('../../middle/middlePicture')
Conf = require('../../../confile/conf')


exports.mgVderAdd =function(req, res) {
	res.render('./mger/vder/add', {
		title: '添加 供应商',
		crMger : req.session.crMger,
		action: "/mgAddVder",
	})
}


exports.mgExistVderN = function(req, res, next) {
	let objBody = req.body.object;
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

	Vder.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "此帐号已经被注册，请重新注册";
			Index.mgOptionWrong(req, res, info);
		}
		else {
			req.body.object = objBody;
			next();
		}
	})
}
exports.mgAddVder = function(req, res) {
	let objBody = req.body.object
	
	let _object = new Vder(objBody)
	_object.save(function(err, objSave){
		if(err) console.log(err);
		res.redirect('/mgVderList')
	})
		
}

exports.mgVderList = function(req, res) {
	Vder.find()
	.sort({'role': 1})
	.exec(function(err, objects) {
		if(err) console.log(err);
		// console.log(objects)
		res.render('./mger/vder/list', {
			title: '供应商列表',
			crMger : req.session.crMger,
			objects: objects
		})
	})
}


exports.mgExistVderY = function(req, res, next) {
	let id = req.params.id;
	Vder.findOne({_id: id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此帐号已经被删除";
			Index.mgOptionWrong(req, res, info);
		}
		else {
			req.body.object = object;
			next();
		}
	})
}
exports.mgVderDetail = function(req, res) {
	let object = req.body.object
	res.render('./mger/vder/detail', {
		title: '供应商信息',
		crMger : req.session.crMger,
		object: object
	})
}


exports.mgCheckVderUp = function(req, res, next) {
	let objBody = req.body.object
	Vder.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This vder is deleted"
			Index.mgOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody)
			_object.loginTime = Date.now(); // 控制已经登录的用户
			req.body.object = _object
			next()
		}
	})
}
exports.mgUpdateVderInfo = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/mgVderDetail/"+objSave._id)
	})
}

exports.mgUpdateVderPw = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/mgVderDetail/"+objSave._id)
	})
}

exports.mgVderDel = function(req, res) {
	let id = req.query.id;
	Vder.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(!object){
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"});
		} else {
			if(object.photo) MiddlePicture.deleteOldPhoto(object.photo, Conf.photoPath.vderAvatar)
			Vder.remove({_id: id}, function(err, objDel) {
				if(err) console.log(err);
				res.json({success: 1});
			})
		}
	})
}