let Index = require('./index')
let Sfer = require('../../models/user/sfer')
let _ = require('underscore')
MiddlePicture = require('../../middle/middlePicture')
Conf = require('../../../confile/conf')


exports.mgSferAdd =function(req, res) {
	res.render('./mger/sfer/add', {
		title: 'Add Sfer',
		crMger : req.session.crMger,
		action: "/mgAddSfer",
	})
}


exports.mgExistSferN = function(req, res, next) {
	let objBody = req.body.object;
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

	Sfer.findOne({code: objBody.code}, function(err, object) {
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
exports.mgAddSfer = function(req, res) {
	let objBody = req.body.object
	
	let _object = new Sfer(objBody)
	_object.save(function(err, objSave){
		if(err) console.log(err);
		res.redirect('/mgSferList')
	})
		
}

exports.mgSferList = function(req, res) {
	Sfer.find()
	.sort({'role': 1, 'part': -1, 'code': 1})
	.exec(function(err, objects) {
		if(err) console.log(err)
		res.render('./mger/sfer/list', {
			title: '用户列表',
			crMger : req.session.crMger,
			objects: objects
		})
	})
}


exports.mgExistSferY = function(req, res, next) {
	let id = req.params.id;
	Sfer.findOne({_id: id}, function(err, object) {
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
exports.mgSferDetail = function(req, res) {
	let object = req.body.object
	res.render('./mger/sfer/detail', {
		title: 'Sfer Infomation',
		crMger : req.session.crMger,
		object: object
	})
}


exports.mgCheckSferUp = function(req, res, next) {
	let objBody = req.body.object
	Sfer.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This sfer is deleted"
			Index.mgOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody)
			_object.loginTime = Date.now(); // 控制已经登录的用户
			req.body.object = _object
			next()
		}
	})
}
exports.mgUpdateSferInfo = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/mgSferDetail/"+objSave._id)
	})
}

exports.mgUpdateSferPw = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/mgSferDetail/"+objSave._id)
	})
}

exports.mgSferDel = function(req, res) {
	let id = req.query.id;
	Sfer.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(!object){
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"});
		} else {
			if(object.photo) MiddlePicture.deleteOldPhoto(object.photo, Conf.photoPath.sferAvatar)
			Sfer.remove({_id: id}, function(err, objDel) {
				if(err) console.log(err);
				res.json({success: 1});
			})
		}
	})
}